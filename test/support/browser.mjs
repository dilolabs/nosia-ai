import { createServer } from 'node:http';
import { readFile, stat, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, join, dirname, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { EventEmitter, once } from 'node:events';

export async function openBrowser() {
  const root = resolve('_site');
  const types = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.png': 'image/png', '.gif': 'image/gif', '.svg': 'image/svg+xml'
  };
  const server = createServer(async (request, response) => {
    try {
      let path = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
      if (path !== root && !path.startsWith(root + sep)) {
        response.writeHead(403).end();
        return;
      }
      if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
      const body = await readFile(path);
      response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  const profile = await mkdtemp('/tmp/opencode/nosia-browser-');
  const chrome = spawn(process.env.CHROMIUM_BIN || '/usr/bin/chromium', [
    '--headless', '--no-sandbox', '--disable-dev-shm-usage',
    '--no-first-run', '--disable-background-networking',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let socket;
  try {
    const endpoint = await new Promise((resolveEndpoint, reject) => {
      let output = '';
      const timer = setTimeout(() => reject(new Error('Chromium startup timed out')), 10000);
      chrome.once('error', error => { clearTimeout(timer); reject(error); });
      chrome.once('exit', code => { clearTimeout(timer); reject(new Error(`Chromium exited: ${code}\n${output}`)); });
      chrome.stderr.on('data', chunk => {
        output += chunk;
        const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
        if (match) { clearTimeout(timer); resolveEndpoint(match[1]); }
      });
    });
    socket = new WebSocket(endpoint);
    await once(socket, 'open', { signal: AbortSignal.timeout(10000) });
    let id = 0;
    const pending = new Map();
    const events = new EventEmitter();
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const entry = pending.get(message.id);
        if (!entry) return;
        clearTimeout(entry.timer);
        pending.delete(message.id);
        if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
        else entry.resolve(message.result);
      } else if (message.method) events.emit(message.method, message.params);
    });
    function send(method, params = {}, sessionId) {
      return new Promise((resolveResult, reject) => {
        const requestId = ++id;
        const timer = setTimeout(() => {
          pending.delete(requestId);
          reject(new Error(`CDP timeout: ${method}`));
        }, 10000);
        pending.set(requestId, { resolve: resolveResult, reject, timer });
        socket.send(JSON.stringify({ id: requestId, method, params, sessionId }));
      });
    }
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const cdp = (method, params) => send(method, params, sessionId);
    await cdp('Page.enable');
    await cdp('Runtime.enable');
    await cdp('Network.enable');
    await cdp('Network.setBlockedURLs', { urls: ['https://*'] });
    return {
      origin,
      cdp,
      async evaluate(expression) {
        const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
        return result.result.value;
      },
      async visit(path = '/', options = {}) {
        await cdp('Emulation.setScriptExecutionDisabled', { value: options.javascript === false });
        await cdp('Emulation.setDeviceMetricsOverride', {
          width: options.width || 1280, height: options.height || 900,
          deviceScaleFactor: 1, mobile: false
        });
        await cdp('Emulation.setEmulatedMedia', { features: [
          { name: 'prefers-color-scheme', value: options.theme || 'light' },
          { name: 'prefers-reduced-motion', value: options.reduced ? 'reduce' : 'no-preference' }
        ] });
        await cdp('Storage.clearDataForOrigin', { origin, storageTypes: 'local_storage' });
        // Local UI initialization must not wait for third-party media or analytics.
        const loaded = once(events, 'Page.domContentEventFired', { signal: AbortSignal.timeout(10000) });
        await cdp('Page.navigate', { url: origin + path });
        await loaded;
      },
      async screenshot(path) {
        const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, Buffer.from(data, 'base64'));
      },
      async close() {
        if (chrome.exitCode === null) {
          const exited = once(chrome, 'exit');
          await send('Browser.close');
          await exited;
        }
        socket.close();
        await new Promise(resolveClose => server.close(resolveClose));
        await rm(profile, { recursive: true, force: true });
      }
    };
  } catch (error) {
    socket?.close();
    chrome.kill();
    server.close();
    throw error;
  }
}
