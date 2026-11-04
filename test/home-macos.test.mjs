import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openBrowser } from './support/browser.mjs';

let browser;
before(async () => { browser = await openBrowser(); });
after(async () => { if (browser) await browser.close(); });

const download = 'https://github.com/dilolabs/nosia/releases/download/v0.6.1/Nosia-Native-arm64.dmg';
const release = 'https://github.com/dilolabs/nosia/releases/tag/v0.6.1';
const film = '/assets/films/nosia-macos-installation-fr-v0.6.1.mp4';
const homes = [
  { path: '/', lang: 'fr', title: 'Une IA utile. Et la liberté de choisir.', install: 'Installer Nosia', setup: 'Préparer Nosia', local: 'Sur ce Mac' },
  { path: '/en/', lang: 'en', title: 'Useful AI. And the freedom to choose.', install: 'Install Nosia', setup: 'Set Up Nosia', local: 'On this Mac' }
];

for (const home of homes) {
  test(`hero ${home.lang} explains Nosia without developer jargon`, async () => {
    await browser.visit(home.path);
    assert.equal(await browser.evaluate('document.querySelector("h1").textContent.replace(/\\s+/g, " ").trim()'), home.title);
    assert.equal(await browser.evaluate('document.querySelectorAll("h1").length'), 1);
    const copy = await browser.evaluate('document.querySelector(".home-hero").textContent');
    assert.match(copy, home.lang === 'fr' ? /intelligence artificielle/ : /artificial intelligence/);
    assert.match(copy, new RegExp(home.local));
    assert.doesNotMatch(copy, /RAG|MCP|Docker|OpenAI|API|SSE|curl|PowerShell/);
    assert.equal(await browser.evaluate('document.querySelectorAll(".home-hero pre, .home-hero code, #hero-install").length'), 0);
    assert.equal(await browser.evaluate('document.querySelector(".home-download").href'), download);
    assert.equal(await browser.evaluate('document.querySelector(".home-install-link").getAttribute("href")'), '#quickstart');
    assert.equal(await browser.evaluate('document.querySelector(".home-other-link").getAttribute("href")'), '#other-installations');
    assert.equal(await browser.evaluate('document.querySelector(".header-deploy").textContent'), home.install);
    const requirements = await browser.evaluate('document.querySelector("#hero-requirements").textContent');
    assert.match(requirements, /Apple M1/);
    assert.match(requirements, /macOS 26\.5/);
    assert.match(requirements, home.lang === 'fr' ? /16 Go/ : /16 GB/);
  });
}

for (const home of homes) {
  test(`installation ${home.lang} puts the native Mac flow before exact CLI alternatives`, async () => {
    await browser.visit(home.path, { javascript: false });
    const setup = await browser.evaluate('document.querySelector("#quickstart")?.textContent || ""');
    assert.match(setup, new RegExp(home.setup));
    assert.match(setup, /Applications/);
    assert.match(setup, /Nosia-Native-arm64\.dmg/);
    assert.match(setup, home.lang === 'fr' ? /plusieurs gigaoctets/ : /several gigabytes/);
    assert.match(setup, home.lang === 'fr' ? /Trousseau/ : /Keychain/);
    assert.equal(await browser.evaluate('document.querySelector(".mac-download").href'), download);
    assert.equal(await browser.evaluate('document.querySelector(".release-link").href'), release);
    assert.equal(await browser.evaluate('document.querySelectorAll(".mac-steps li").length'), 5);
    assert.equal(await browser.evaluate('document.querySelector("#other-installations").open'), false);
    assert.equal(await browser.evaluate('Boolean(document.querySelector(".mac-installation").compareDocumentPosition(document.querySelector("#other-installations")) & Node.DOCUMENT_POSITION_FOLLOWING)'), true);
    await browser.evaluate('document.querySelector("#other-installations > summary").click()');
    assert.equal(await browser.evaluate('document.querySelector("#other-installations").open'), true);
    assert.equal(await browser.evaluate('document.querySelector("#install-unix").checkVisibility()'), true);
    assert.equal(await browser.evaluate('document.querySelector("#install-unix").textContent'), 'curl -fsSL https://get.nosia.ai | sh');
    assert.equal(await browser.evaluate('document.querySelector("#install-windows").textContent'), 'irm https://get.nosia.ai/install.ps1 | iex');
    assert.equal(await browser.evaluate('document.querySelector("#install-unix").closest("[data-command]").querySelector(".command-heading span").textContent'), 'Linux');
    assert.equal(await browser.evaluate('document.querySelectorAll("[data-copy-target]:not([hidden])").length'), 0);
  });

  test(`tutorial ${home.lang} is optional, localized and keeps a visible file fallback`, async () => {
    for (const javascript of [true, false]) {
      await browser.visit(home.path, { javascript });
      const state = await browser.evaluate(`(() => {
        const video = document.querySelector('.mac-video video');
        return {
          source: video.querySelector('source').getAttribute('src'), type: video.querySelector('source').type,
          controls: video.controls, inline: video.playsInline, preload: video.preload,
          autoplay: video.autoplay, loop: video.loop, ready: video.readyState,
          loading: video.networkState === HTMLMediaElement.NETWORK_LOADING,
          label: video.getAttribute('aria-label'), caption: video.closest('figure').querySelector('figcaption').textContent,
          link: document.querySelector('.mac-video figcaption a').getAttribute('href'),
          linkVisible: document.querySelector('.mac-video figcaption a').checkVisibility()
        };
      })()`);
      assert.equal(state.source, film); assert.equal(state.type, 'video/mp4');
      assert.equal(state.controls, true); assert.equal(state.inline, true); assert.equal(state.preload, 'none');
      assert.equal(state.autoplay, false); assert.equal(state.loop, false); assert.equal(state.ready, 0); assert.equal(state.loading, false);
      assert.match(state.label, home.lang === 'fr' ? /français/ : /French/);
      assert.match(state.caption, home.lang === 'fr' ? /français/ : /French/);
      assert.equal(state.link, film); assert.equal(state.linkVisible, true);
    }
  });

  test(`tutorial ${home.lang} decodes, plays and seeks after a user gesture`, async () => {
    const response = await fetch(browser.origin + film, { headers: { Range: 'bytes=0-31' } });
    assert.equal(response.status, 206); assert.equal(response.headers.get('content-type'), 'video/mp4');
    assert.equal((await response.arrayBuffer()).byteLength, 32);
    await browser.visit(home.path);
    const playback = await browser.cdp('Runtime.evaluate', {
      userGesture: true, awaitPromise: true, returnByValue: true,
      expression: `new Promise((resolve, reject) => {
        const video = document.querySelector('.mac-video video');
        const timeout = setTimeout(() => { cleanup(); reject(new Error('Tutorial playback timed out')); }, 8000);
        function cleanup() { clearTimeout(timeout); video.removeEventListener('timeupdate', progressed); video.removeEventListener('error', failed); }
        function failed(error) { cleanup(); reject(new Error(video.error?.message || error?.message || 'Tutorial playback failed')); }
        function progressed() {
          if (video.currentTime < .1) return;
          video.removeEventListener('timeupdate', progressed);
          const state = { time: video.currentTime, duration: video.duration, width: video.videoWidth, height: video.videoHeight, frames: video.getVideoPlaybackQuality().totalVideoFrames };
          video.pause();
          video.addEventListener('seeked', () => { state.seekTime = video.currentTime; cleanup(); resolve(state); }, { once: true });
          video.currentTime = 2;
        }
        video.addEventListener('timeupdate', progressed); video.addEventListener('error', failed); video.play().catch(failed);
      })`
    });
    assert.equal(playback.exceptionDetails, undefined, JSON.stringify(playback.exceptionDetails));
    const state = playback.result.value;
    assert.equal(state.width, 1048); assert.equal(state.height, 720); assert.ok(Math.abs(state.duration - 108.4) < .2);
    assert.ok(state.time >= .1); assert.ok(state.frames > 0); assert.ok(Math.abs(state.seekTime - 2) < .1);
  });
}

for (const home of homes) {
  test(`public journey ${home.lang} follows direction C and publishes matching metadata`, async () => {
    await browser.visit(home.path);
    assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("main > section[id]")].map(section => section.id)'), ['description', 'features', 'use-cases-teaser', 'quickstart', 'faq', 'story', 'commitment-teaser', 'community', 'documentation', 'comparisons-teaser', 'demo']);
    assert.equal(await browser.evaluate('document.querySelectorAll("#features .card").length'), 3);
    const quote = await browser.evaluate('document.querySelector("#description blockquote").textContent.trim()');
    assert.equal(quote, home.lang === 'fr' ? 'Le droit de comprendre un système, de l’adapter et de pouvoir en changer.' : 'The right to understand a system, adapt it, and be able to switch to another.');
    assert.equal(await browser.evaluate('document.querySelector("#description figcaption a").getAttribute("href")'), home.lang === 'fr' ? '/engagement/' : '/en/commitment/');
    assert.match(await browser.evaluate('document.querySelector(".ai-caution").textContent'), home.lang === 'fr' ? /peut se tromper/ : /can make mistakes/);
    const schemas = await browser.evaluate('[...document.querySelectorAll(\'script[type="application/ld+json"]\')].map(script => JSON.parse(script.textContent))');
    const app = schemas.find(schema => schema['@type'] === 'SoftwareApplication');
    assert.equal(app.applicationCategory, 'ProductivityApplication');
    assert.equal(app.operatingSystem, 'macOS, Linux, Windows');
    assert.equal(app.description, await browser.evaluate('document.querySelector(\'meta[name="description"]\').content'));
    assert.match(await browser.evaluate('document.title'), /Mac/);
    assert.equal(await browser.evaluate('document.querySelector(\'link[rel="canonical"]\').href'), 'https://nosia.ai' + home.path);
    const faq = schemas.find(schema => schema['@type'] === 'FAQPage');
    assert.equal(faq.mainEntity.length, 6);
    assert.equal(await browser.evaluate('document.querySelectorAll("#faq .faq-item").length'), 6);
    assert.deepEqual(faq.mainEntity.map(item => [item.name, item.acceptedAnswer.text]), await browser.evaluate('[...document.querySelectorAll("#faq .faq-item")].map(item => [item.querySelector("h3").textContent, item.querySelector("p").textContent])'));
    assert.equal(await browser.evaluate('document.querySelectorAll("#demo iframe, #demo img").length'), 0);
    assert.equal(await browser.evaluate('document.querySelector("#demo a").getAttribute("href")'), home.lang === 'fr' ? 'https://www.youtube.com/watch?v=HD5k-LjGvGw' : '/assets/images/nosia-demo.gif');
    assert.equal(await browser.evaluate('document.querySelectorAll("main video").length'), 1);
  });

  test(`dedicated FAQ ${home.lang} describes the native Mac path without rewriting other topics`, async () => {
    await browser.visit(home.lang === 'fr' ? '/faq/' : '/en/faq/');
    const copy = await browser.evaluate('document.querySelector("#faq").textContent');
    assert.match(copy, /Applications/);
    assert.match(copy, new RegExp(home.setup));
    assert.match(copy, /M1/);
    assert.match(copy, /26\.5/);
    assert.match(copy, home.lang === 'fr' ? /16 Go/ : /16 GB/);
    assert.match(copy, /MCP/);
    assert.match(copy, /OpenAI/);
  });
}

for (const home of homes) {
  test(`layout ${home.lang} fits small screens and preserves the real tutorial ratio`, async () => {
    for (const theme of ['light', 'dark']) {
      for (const width of [320, 375, 768, 1280]) {
        await browser.visit(home.path, { width, height: 900, theme, reduced: true });
        await browser.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
        const layout = await browser.evaluate(`(() => {
          const video = document.querySelector('.mac-video video').getBoundingClientRect();
          const steps = document.querySelector('.mac-steps').getBoundingClientRect();
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            ratio: video.width / video.height,
            stacked: video.top >= steps.bottom,
            columns: video.left > steps.right,
            requests: performance.getEntriesByType('resource').filter(entry => entry.name.includes('nosia-macos-installation-fr-v0.6.1.mp4')).length
          };
        })()`);
        assert.equal(layout.overflow, false, `${home.lang} ${theme} ${width}`);
        assert.ok(Math.abs(layout.ratio - 1048 / 720) < .03);
        assert.equal(layout.requests, 0);
        if (width <= 768) assert.equal(layout.stacked, true);
        if (width === 1280) assert.equal(layout.columns, true);
        if (process.env.NOSIA_SCREENSHOTS) {
          await browser.screenshot(`${process.env.NOSIA_SCREENSHOTS}/home-${home.lang}-${theme}-${width}.png`);
          await browser.evaluate('document.querySelector("#quickstart").scrollIntoView({block:"start",behavior:"instant"})');
          await browser.screenshot(`${process.env.NOSIA_SCREENSHOTS}/mac-guide-${home.lang}-${theme}-${width}.png`);
        }
      }
    }
  });

  test(`secondary installation ${home.lang} stays clear of the header and works by keyboard`, async () => {
    await browser.visit(home.path, { width: 375, height: 812, reduced: true });
    await browser.evaluate('document.querySelector(".home-other-link").click(); new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    const clear = await browser.evaluate('document.querySelector("#other-installations > summary").getBoundingClientRect().top >= document.querySelector(".header").getBoundingClientRect().bottom');
    assert.equal(clear, true);
    await browser.evaluate('document.querySelector("#other-installations > summary").focus()');
    for (const type of ['keyDown', 'keyUp']) {
      await browser.cdp('Input.dispatchKeyEvent', {
        type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13,
        text: type === 'keyDown' ? '\r' : undefined
      });
    }
    assert.equal(await browser.evaluate('document.querySelector("#other-installations").open'), true);
    assert.equal(await browser.evaluate('document.activeElement.matches("#other-installations > summary")'), true);
    assert.ok(await browser.evaluate('parseFloat(getComputedStyle(document.activeElement).outlineWidth)') >= 2);
    assert.equal(await browser.evaluate('document.querySelector("#install-unix").checkVisibility()'), true);
  });

  test(`tutorial failure ${home.lang} leaves the written guide and direct file link available`, async () => {
    await browser.cdp('Network.setBlockedURLs', { urls: ['https://*', '*nosia-macos-installation-fr-v0.6.1.mp4*'] });
    try {
      await browser.visit(home.path);
      const failed = await browser.cdp('Runtime.evaluate', {
        userGesture: true, awaitPromise: true, returnByValue: true,
        expression: `new Promise(resolve => {
          const video = document.querySelector('.mac-video video');
          const timeout = setTimeout(() => resolve(false), 5000);
          // A failed nested source emits a non-bubbling error in Chromium.
          video.addEventListener('error', () => { clearTimeout(timeout); resolve(true); }, { once: true, capture: true });
          video.play().catch(() => { clearTimeout(timeout); resolve(true); });
        })`
      });
      assert.equal(failed.exceptionDetails, undefined);
      assert.equal(failed.result.value, true);
      assert.equal(await browser.evaluate('document.querySelector(".mac-steps").checkVisibility()'), true);
      assert.equal(await browser.evaluate('document.querySelector(".mac-video figcaption a").checkVisibility()'), true);
      assert.equal(await browser.evaluate('document.querySelector(".mac-video figcaption a").getAttribute("href")'), film);
    } finally {
      await browser.cdp('Network.setBlockedURLs', { urls: ['https://*'] });
    }
  });
}
