import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openBrowser } from './support/browser.mjs';

let browser;
before(async () => { browser = await openBrowser(); });
after(async () => { if (browser) await browser.close(); });

for (const path of ['/', '/en/']) {
  test(`${path} shows the actual product and identifies its developer`, async () => {
    await browser.visit(path);
    assert.equal(await browser.evaluate('Boolean(document.querySelector(".home-hero picture img[data-product-capture]"))'), true);
    assert.equal(await browser.evaluate(`document.querySelector('.home-hero a[href="https://dilolabs.fr/"]')?.checkVisibility()`), true);
    await browser.evaluate('document.querySelector("#product img").scrollIntoView(); document.querySelector("#product img").decode()');
    assert.equal(await browser.evaluate('document.querySelector("#product img").naturalWidth > 800'), true);
    assert.equal(await browser.evaluate('document.querySelectorAll("#product .product-annotations li").length'), 3);
    assert.equal(await browser.evaluate('document.querySelectorAll("#fonctionnement ol > li").length'), 4);
    assert.equal(await browser.evaluate(`Boolean(document.querySelector('a[href="https://dilolabs.fr/contact"]'))`), true);
    assert.equal(await browser.evaluate(`document.querySelectorAll('video[autoplay], img[src$=".gif"]').length`), 0);
  });
}

test('the public shell shares Dilolabs typography and generous nested radii', async () => {
  for (const path of ['/', '/en/', '/cas-usage/', '/en/use-cases/', '/engagement/', '/en/commitment/', '/faq/', '/en/faq/', '/nosia-vs-openai/', '/en/nosia-vs-openai/', '/nosia-vs-ollama/', '/en/nosia-vs-ollama/', '/404.html']) {
    await browser.visit(path, { width: 320, reduced: true });
    const shell = await browser.evaluate(`({
      font: getComputedStyle(document.body).fontFamily,
      radius: parseFloat(getComputedStyle(document.querySelector('.btn')).borderRadius),
      overflow: document.documentElement.scrollWidth > innerWidth,
      footer: document.querySelectorAll('body > .footer').length,
      mainFooters: document.querySelectorAll('main footer').length,
      heading: document.querySelectorAll('h1').length
    })`);
    assert.match(shell.font, /Raleway/, path);
    assert.ok(shell.radius >= 12 && shell.radius <= 16, path);
    assert.equal(shell.overflow, false, path);
    assert.equal(shell.footer, 1, path);
    assert.equal(shell.mainFooters, 0, path);
    assert.equal(shell.heading, 1, path);
  }
});

test('comparison tables can be reached and scrolled with a keyboard', async () => {
  await browser.visit('/nosia-vs-openai/', { width: 320 });
  const table = await browser.evaluate(`(() => {
    const region = document.querySelector('.comparison-table-wrap'); region.focus();
    return { named: Boolean(region.getAttribute('aria-label')), focus: document.activeElement === region,
      scrolls: region.scrollWidth > region.clientWidth, scoped: [...region.querySelectorAll('thead th')].every(th => th.scope === 'col') };
  })()`);
  assert.deepEqual(table, { named: true, focus: true, scrolls: true, scoped: true });
});

test('privacy and cost copy is conditional in both languages', async () => {
  for (const path of ['/faq/', '/en/faq/', '/nosia-vs-openai/', '/en/nosia-vs-openai/', '/cas-usage/', '/en/use-cases/']) {
    await browser.visit(path);
    const copy = await browser.evaluate('document.querySelector("main").textContent');
    assert.doesNotMatch(copy, /souveraineté totale|full sovereignty|ne quittent jamais|never leaves|sans que ces données ne quittent jamais|without that data ever leaving|you pay only|vous ne payez que/i, path);
    assert.match(copy, /configur|externe|external/i, path);
  }
});

for (const theme of ['light', 'dark']) {
  test(`all pages reflow at 320px and a 200% equivalent viewport in ${theme}`, async () => {
    const paths = ['/', '/en/', '/cas-usage/', '/en/use-cases/', '/engagement/', '/en/commitment/', '/faq/', '/en/faq/', '/nosia-vs-openai/', '/en/nosia-vs-openai/', '/nosia-vs-ollama/', '/en/nosia-vs-ollama/', '/404.html'];
    for (const path of paths) {
      // 720 CSS px is the reflow viewport of a 1440px desktop zoomed to 200%.
      for (const width of [320, 720]) {
        await browser.visit(path, { width, height: 900, theme, reduced: true });
        await browser.evaluate('document.fonts.ready');
        const state = await browser.evaluate(`({
          overflow: document.documentElement.scrollWidth > innerWidth,
          font: document.fonts.check('600 18px Raleway'),
          images: [...document.querySelectorAll('main img')].every(img => Boolean(img.alt && img.width && img.height)),
          reduced: getComputedStyle(document.documentElement).scrollBehavior === 'auto'
        })`);
        assert.deepEqual(state, { overflow: false, font: true, images: true, reduced: true }, `${path} ${width}`);
      }
    }
  });

  test(`new product surfaces and all visible text meet contrast targets in ${theme}`, async () => {
    for (const path of ['/', '/en/', '/nosia-vs-openai/', '/en/use-cases/']) {
      await browser.visit(path, { width: 375, theme, reduced: true });
      await browser.evaluate('document.querySelectorAll("main details").forEach(details => { details.open = true; })');
      const failures = await browser.evaluate(`(() => {
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const paint = color => { context.fillStyle = color; context.fillRect(0, 0, 1, 1); };
        const luminance = () => [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map(v => {
          v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
        }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const failures = []; let text;
        while ((text = walker.nextNode())) {
          const node = text.parentElement;
          if (!text.textContent.trim() || node.closest('script, style, svg')) continue;
          const range = document.createRange(); range.selectNodeContents(text);
          if (![...range.getClientRects()].some(rect => rect.width && rect.height)) continue;
          const ancestors = []; for (let p = node; p; p = p.parentElement) ancestors.unshift(p);
          paint('#fff'); ancestors.forEach(p => paint(getComputedStyle(p).backgroundColor));
          const background = luminance(); const style = getComputedStyle(node); paint(style.color);
          const foreground = luminance(); const ratio = (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05);
          const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.667 && Number(style.fontWeight) >= 700);
          if (ratio < (large ? 3 : 4.5)) failures.push({ text: text.textContent.trim().slice(0, 70), ratio });
        }
        return failures;
      })()`);
      assert.deepEqual(failures, [], path);
    }
  });
}

test('navigation exposes the active page and the product uses one decorative icon family', async () => {
  await browser.visit('/cas-usage/');
  assert.equal(await browser.evaluate('document.querySelector("nav [aria-current=page]").getAttribute("href")'), '/cas-usage/');
  await browser.visit('/');
  assert.equal(await browser.evaluate(`Array.from(document.querySelectorAll('.card .icon svg, .how-icon svg, .text-link svg')).every(svg => svg.getAttribute('aria-hidden') === 'true' && svg.getAttribute('stroke-width') === '1.5')`), true);
  assert.equal(await browser.evaluate('document.querySelector(".hero-product").contains(document.querySelector(".home-privacy"))'), true);
});

test('Ollama comparisons acknowledge its current desktop app and link to official sources', async () => {
  for (const path of ['/nosia-vs-ollama/', '/en/nosia-vs-ollama/']) {
    await browser.visit(path);
    const copy = await browser.evaluate('document.querySelector("main").textContent');
    assert.doesNotMatch(copy, /pas d.interface intégrée|no built-in UI|ni interface utilisateur|nor a user interface|coming soon|\(soon\)/i);
    assert.equal(await browser.evaluate(`Boolean(document.querySelector('main a[href="https://ollama.com/blog/new-app"]'))`), true);
    assert.match(copy, /macOS.*Windows/);
  }
});

test('script execution warnings precede the copyable installation commands', async () => {
  for (const path of ['/', '/en/']) {
    await browser.visit(path);
    assert.equal(await browser.evaluate(`(() => {
      const panel = document.querySelector('#other-installations');
      const warning = [...panel.querySelectorAll('p')].find(p => /^(Ces commandes|These commands)/.test(p.textContent));
      return Boolean(warning.compareDocumentPosition(panel.querySelector('[data-command]')) & Node.DOCUMENT_POSITION_FOLLOWING);
    })()`), true, path);
  }
});

test('the English footer translates the developer location', async () => {
  await browser.visit('/en/');
  assert.match(await browser.evaluate('document.querySelector(".footer-brand").textContent'), /Normandy/);
});
