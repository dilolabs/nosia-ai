import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openBrowser } from './support/browser.mjs';

let browser;
before(async () => { browser = await openBrowser(); });
after(async () => { if (browser) await browser.close(); });

test('existing FR and EN pages retain language and canonical URLs', async () => {
  for (const [path, language] of [['/', 'fr'], ['/en/', 'en']]) {
    await browser.visit(path);
    assert.equal(await browser.evaluate('document.documentElement.lang'), language);
    assert.equal(await browser.evaluate('document.querySelectorAll("h1").length'), 1);
    assert.equal(await browser.evaluate('document.querySelector("link[rel=canonical]").href'), 'https://nosia.ai' + path);
  }
});

test('mobile menu opens, closes on Escape, and returns focus', async () => {
  await browser.visit('/', { width: 375 });
  assert.equal(await browser.evaluate('Boolean(document.querySelector("[data-menu-toggle]"))'), true);
  await browser.evaluate('document.querySelector("[data-menu-toggle]").click()');
  assert.equal(await browser.evaluate('document.querySelector("[data-menu-toggle]").getAttribute("aria-expanded")'), 'true');
  assert.equal(await browser.evaluate('getComputedStyle(document.querySelector("#primary-nav")).display !== "none"'), true);
  assert.equal(await browser.evaluate('document.querySelector("#primary-nav").contains(document.activeElement)'), true);
  await browser.evaluate('document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))');
  assert.equal(await browser.evaluate('document.querySelector("[data-menu-toggle]").getAttribute("aria-expanded")'), 'false');
  assert.equal(await browser.evaluate('document.activeElement.hasAttribute("data-menu-toggle")'), true);
});

test('mobile destinations close the menu and remain available without JavaScript', async () => {
  await browser.visit('/', { width: 375 });
  assert.equal(await browser.evaluate('Boolean(document.querySelector("[data-menu-toggle]"))'), true);
  await browser.evaluate(`
    document.querySelector('[data-menu-toggle]').click();
    document.querySelector('#primary-nav a[href$="#documentation"]').click();
  `);
  assert.equal(await browser.evaluate('document.querySelector("[data-menu-toggle]").getAttribute("aria-expanded")'), 'false');
  await browser.visit('/', { width: 375, javascript: false });
  assert.equal(await browser.evaluate('getComputedStyle(document.querySelector("#primary-nav")).display !== "none"'), true);
  assert.equal(await browser.evaluate('document.querySelector(".lang-toggle").getAttribute("href")'), '/en/');
});

test('scrollable mobile navigation leaves room for complete focus outlines', async () => {
  for (const [width, height] of [[375, 812], [812, 375]]) {
    await browser.visit('/', { width, height, reduced: true });
    await browser.evaluate('document.querySelector("[data-menu-toggle]").click()');
    const visible = await browser.evaluate(`(() => {
      const nav = document.querySelector('#primary-nav');
      return [nav.firstElementChild, nav.lastElementChild].map(link => {
        link.focus();
        const style = getComputedStyle(link);
        const gutter = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
        const item = link.getBoundingClientRect();
        const panel = nav.getBoundingClientRect();
        return item.left - gutter >= panel.left - .01 && item.right + gutter <= panel.right + .01 && item.top - gutter >= panel.top - .01 && item.bottom + gutter <= panel.bottom + .01;
      });
    })()`);
    assert.deepEqual(visible, [true, true]);
  }
});

test('system theme updates its accessible state until the user chooses', async () => {
  await browser.visit('/');
  await browser.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  await browser.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  assert.equal(await browser.evaluate('document.querySelector("[data-theme-toggle]").getAttribute("aria-pressed")'), 'true');
  await browser.evaluate('document.querySelector("[data-theme-toggle]").click()');
  await browser.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
  await browser.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  await browser.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  assert.equal(await browser.evaluate('document.documentElement.classList.contains("dark")'), false);
  assert.equal(await browser.evaluate('document.querySelector("[data-theme-toggle]").getAttribute("aria-pressed")'), 'false');
});

test('theme still follows the OS and accepts an explicit choice when storage is blocked', async () => {
  const { identifier } = await browser.cdp('Page.addScriptToEvaluateOnNewDocument', {
    source: 'Storage.prototype.getItem = function () { throw new Error("blocked"); }; Storage.prototype.setItem = function () { throw new Error("blocked"); };'
  });
  try {
    await browser.visit('/', { theme: 'dark' });
    assert.equal(await browser.evaluate('document.documentElement.classList.contains("dark")'), true);
    await browser.evaluate('document.querySelector("[data-theme-toggle]").click()');
    await browser.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
    await browser.cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
    await browser.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    assert.equal(await browser.evaluate('document.documentElement.classList.contains("dark")'), false);
  } finally {
    await browser.cdp('Page.removeScriptToEvaluateOnNewDocument', { identifier });
  }
});

test('command copying reports success only after the write succeeds', async () => {
  await browser.visit('/');
  assert.equal(await browser.evaluate('Boolean(document.querySelector("[data-copy-target]"))'), true);
  await browser.evaluate(`
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: text => new Promise(resolve => {
        window.copiedCommand = text;
        window.finishCopy = resolve;
      })
    } });
    document.querySelector('[data-copy-target]').click();
  `);
  assert.equal(await browser.evaluate('window.copiedCommand'), 'curl -fsSL https://get.nosia.ai | sh');
  assert.equal(await browser.evaluate('document.querySelector("[data-command] [data-copy-status]").textContent'), '');
  assert.equal(await browser.evaluate('document.querySelector("[data-copy-target]").disabled'), true);
  await browser.evaluate('window.finishCopy(); Promise.resolve()');
  assert.equal(await browser.evaluate('document.querySelector("[data-command] [data-copy-status]").textContent'), 'Copié');
});

test('clipboard rejection and unavailable API preserve selectable code and explain failure', async () => {
  for (const clipboard of ['{ writeText: async () => { throw new Error("denied"); } }', 'undefined']) {
    await browser.visit('/en/');
    assert.equal(await browser.evaluate('Boolean(document.querySelector("[data-copy-target]"))'), true);
    await browser.evaluate(`Object.defineProperty(navigator, 'clipboard', { configurable: true, value: ${clipboard} }); document.querySelector('[data-copy-target]').click()`);
    assert.match(await browser.evaluate('document.querySelector("[data-copy-status]").textContent'), /Unable to copy/);
    assert.equal(await browser.evaluate('document.querySelector("[data-command] code").textContent'), 'curl -fsSL https://get.nosia.ai | sh');
    assert.equal(await browser.evaluate('document.querySelector("[data-copy-target]").disabled'), false);
  }
});

test('all platform commands remain visible without JavaScript', async () => {
  await browser.visit('/', { javascript: false });
  assert.equal(await browser.evaluate('document.querySelectorAll("#quickstart [data-command]").length'), 2);
  assert.equal(await browser.evaluate('document.querySelector("#install-windows").textContent'), 'irm https://get.nosia.ai/install.ps1 | iex');
  assert.equal(await browser.evaluate('[...document.querySelectorAll("[data-copy-target]")].every(button => getComputedStyle(button).display === "none")'), true);
});

test('developer-first home preserves anchors, moves installation forward, and keeps Windows exact', async () => {
  const ids = ['description', 'features', 'quickstart', 'demo', 'use-cases-teaser', 'comparisons-teaser', 'documentation', 'story', 'community', 'faq'];
  for (const path of ['/', '/en/']) {
    await browser.visit(path);
    assert.equal(await browser.evaluate('Boolean(document.querySelector(".developer-hero #hero-install"))'), true);
    assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("main > section[id]")].map(section => section.id)'), ids);
    assert.equal(await browser.evaluate('document.querySelector("#install-windows").textContent'), 'irm https://get.nosia.ai/install.ps1 | iex');
    assert.equal(await browser.evaluate('document.querySelectorAll("#hero-install").length'), 1);
    assert.equal(await browser.evaluate('document.querySelector(".developer-hero .btn-primary").getAttribute("href")'), '#quickstart');
  }
});

test('installation command is visible in the first small-phone viewport', async () => {
  for (const path of ['/', '/en/']) {
    await browser.visit(path, { width: 375, height: 812 });
    assert.equal(await browser.evaluate('document.querySelector("#hero-install").getBoundingClientRect().bottom <= innerHeight'), true);
  }
});

test('home cards use decorative SVGs and language sibling links remain native', async () => {
  for (const [path, sibling] of [['/', '/en/'], ['/en/', '/'], ['/cas-usage/', '/en/use-cases/'], ['/en/use-cases/', '/cas-usage/']]) {
    await browser.visit(path);
    assert.equal(await browser.evaluate('document.querySelector(".lang-toggle").getAttribute("href")'), sibling);
    if (path === '/' || path === '/en/') {
      assert.equal(await browser.evaluate('[...document.querySelectorAll(".card .icon")].every(icon => Boolean(icon.querySelector("svg[aria-hidden=true] :is(path, rect, circle)")))'), true);
    }
  }
});

test('back to top is not focusable when invisible and respects reduced motion', async () => {
  await browser.visit('/', { reduced: true });
  assert.equal(await browser.evaluate('document.querySelector(".back-to-top").hidden'), true);
  await browser.evaluate('window.scrollTo(0, 600); new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  assert.equal(await browser.evaluate('document.querySelector(".back-to-top").hidden'), false);
  await browser.evaluate('window.scrollTo = options => { window.lastScroll = options; }; document.querySelector(".back-to-top").click()');
  assert.equal(await browser.evaluate('window.lastScroll.behavior'), 'instant');
  assert.equal(await browser.evaluate('document.activeElement.id'), 'main-content');
});

async function pressKey(key) {
  const keyCode = { Tab: 9, Enter: 13, Escape: 27 }[key];
  for (const type of ['keyDown', 'keyUp']) {
    await browser.cdp('Input.dispatchKeyEvent', {
      type, key, code: key, windowsVirtualKeyCode: keyCode,
      text: type === 'keyDown' && key === 'Enter' ? '\r' : undefined
    });
  }
}

test('keyboard skip link, menu and command copying retain meaningful focus', async () => {
  await browser.visit('/', { width: 375, reduced: true });
  await pressKey('Tab');
  assert.equal(await browser.evaluate('document.activeElement.classList.contains("skip-link")'), true);
  await pressKey('Enter');
  assert.equal(await browser.evaluate('document.activeElement.id'), 'main-content');
  await browser.evaluate('document.querySelector("[data-menu-toggle]").focus()');
  await pressKey('Enter');
  assert.equal(await browser.evaluate('document.querySelector("#primary-nav").contains(document.activeElement)'), true);
  await pressKey('Escape');
  assert.equal(await browser.evaluate('document.activeElement.hasAttribute("data-menu-toggle")'), true);
  await browser.evaluate(`
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } });
    document.querySelector('[data-copy-target]').focus();
  `);
  await pressKey('Enter');
  assert.equal(await browser.evaluate('document.activeElement.hasAttribute("data-copy-target")'), true);
});

test('responsive navigation transfers focus instead of hiding the active control', async () => {
  await browser.visit('/', { width: 1280 });
  await browser.evaluate('document.querySelector("#primary-nav a").focus()');
  await browser.cdp('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: false });
  await browser.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  assert.equal(await browser.evaluate('document.activeElement.hasAttribute("data-menu-toggle")'), true);
  await browser.cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await browser.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  assert.equal(await browser.evaluate('document.querySelector("#primary-nav").contains(document.activeElement)'), true);
  await browser.evaluate('document.querySelector("[data-copy-target]").focus()');
  await browser.cdp('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: false });
  await browser.evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  assert.equal(await browser.evaluate('document.activeElement.hasAttribute("data-copy-target")'), true);
});

test('normal interface text meets 4.5 to 1 contrast in both themes', async () => {
  for (const theme of ['light', 'dark']) {
    await browser.visit('/', { theme, reduced: true });
    const pairs = await browser.evaluate(`(() => {
      const selectors = ['.developer-eyebrow', '.developer-summary', '.developer-ownership', '.developer-actions .btn', '.developer-terminal .copy-button', '.developer-terminal code', '.terminal-platforms', '#features > .container > p', '#features .card p', '#quickstart p', '#quickstart .copy-button', '.footer p', '.footer .links a', '.header-controls .lang-toggle', '.header .mobile-deploy'];
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      function paint(color) { context.fillStyle = color; context.fillRect(0, 0, 1, 1); }
      function luminance(channels) {
        return channels.slice(0, 3).map(value => {
          value /= 255;
          return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
        }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
      }
      return selectors.flatMap(selector => [...document.querySelectorAll(selector)].filter(node => node.textContent.trim()).map(node => {
        const ancestors = [];
        for (let parent = node; parent; parent = parent.parentElement) ancestors.unshift(parent);
        context.clearRect(0, 0, 1, 1);
        paint('#fff');
        ancestors.forEach(parent => paint(getComputedStyle(parent).backgroundColor));
        const background = luminance([...context.getImageData(0, 0, 1, 1).data]);
        paint(getComputedStyle(node).color);
        const foreground = luminance([...context.getImageData(0, 0, 1, 1).data]);
        return { selector, ratio: (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05) };
      }));
    })()`);
    for (const pair of pairs) assert.ok(pair.ratio >= 4.5, `${theme}: ${pair.selector} = ${pair.ratio.toFixed(2)}:1`);
  }
});

test('below-fold demos defer loading in both languages', async () => {
  for (const path of ['/', '/en/']) {
    await browser.visit(path);
    assert.equal(await browser.evaluate('document.querySelector("#demo :is(iframe, img)").getAttribute("loading")'), 'lazy');
  }
});

for (const theme of ['light', 'dark']) {
  test(`page backgrounds stay uniform with the ${theme} theme`, async () => {
    for (const path of ['/', '/en/', '/faq/', '/en/faq/', '/cas-usage/', '/en/use-cases/', '/nosia-vs-openai/', '/en/nosia-vs-openai/', '/nosia-vs-ollama/', '/en/nosia-vs-ollama/', '/404.html']) {
      await browser.visit(path, { theme, reduced: true });
      const surfaces = await browser.evaluate(`(() => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        function background(element) {
          const ancestors = [];
          for (let node = element; node; node = node.parentElement) ancestors.unshift(node);
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = '#fff';
          context.fillRect(0, 0, 1, 1);
          for (const node of ancestors) {
            context.fillStyle = getComputedStyle(node).backgroundColor;
            context.fillRect(0, 0, 1, 1);
          }
          return [...context.getImageData(0, 0, 1, 1).data].join(',');
        }
        const sections = document.documentElement.classList.contains('dark')
          ? 'main > section' : 'main > section:not(.developer-hero)';
        return {
          page: background(document.body),
          regions: [...document.querySelectorAll('.header, ' + sections + ', .footer')].map(node => ({ name: node.id || node.className, color: background(node) })),
          cards: [...document.querySelectorAll('.card, .faq-item, .story-content')].map(background)
        };
      })()`);
      assert.deepEqual(surfaces.regions.filter(region => region.color !== surfaces.page), [], `${path}: page regions must share one background`);
      assert.ok(surfaces.cards.every(color => color !== surfaces.page), `${path}: cards must stay visually distinct`);
    }
  });
}

for (const path of ['/', '/en/']) {
  for (const theme of ['light', 'dark']) {
    for (const [width, height] of [[375, 812], [768, 1024], [1024, 900], [1440, 1000], [812, 375]]) {
      test(`responsive ${path} ${theme} ${width}x${height}`, async () => {
        await browser.visit(path, { width, height, theme });
        assert.equal(await browser.evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
        const heroBackground = await browser.evaluate('getComputedStyle(document.querySelector(".developer-hero")).backgroundColor');
        const expectedBackground = theme === 'dark'
          ? await browser.evaluate('getComputedStyle(document.body).backgroundColor')
          : 'rgb(16, 26, 20)';
        assert.equal(heroBackground, expectedBackground);
        assert.equal(await browser.evaluate('document.documentElement.classList.contains("dark")'), theme === 'dark');
        assert.equal(await browser.evaluate('document.querySelector("#hero-install").textContent'), 'curl -fsSL https://get.nosia.ai | sh');
        if (process.env.NOSIA_SCREENSHOTS) {
          const language = path === '/' ? 'fr' : 'en';
          await browser.screenshot(`${process.env.NOSIA_SCREENSHOTS}/${language}-${theme}-${width}x${height}.png`);
        }
      });
    }
  }
}

test('secondary pages retain readable headings, valid schema and no horizontal page overflow', async () => {
  for (const path of ['/faq/', '/en/faq/', '/cas-usage/', '/en/use-cases/', '/nosia-vs-openai/', '/en/nosia-vs-openai/', '/nosia-vs-ollama/', '/en/nosia-vs-ollama/', '/404.html']) {
    await browser.visit(path, { width: 375 });
    assert.equal(await browser.evaluate('document.querySelectorAll("h1").length'), 1, path);
    assert.equal(await browser.evaluate('document.documentElement.scrollWidth <= innerWidth'), true, path);
    assert.equal(await browser.evaluate(`[...document.querySelectorAll('script[type="application/ld+json"]')].every(script => Boolean(JSON.parse(script.textContent)))`), true, path);
    assert.equal(await browser.evaluate('document.querySelector(".developer-terminal") === null'), true, path);
  }
});
