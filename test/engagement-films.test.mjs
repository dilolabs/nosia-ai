import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openBrowser } from './support/browser.mjs';

let browser;
before(async () => { browser = await openBrowser(); });
after(async () => { if (browser) await browser.close(); });

const films = [
  { path: '/engagement/', language: 'fr', source: '/assets/films/nosia-film-fr-1280x720.mp4', label: 'Le film de notre engagement', open: 'Ouvrir la vidéo' },
  { path: '/en/commitment/', language: 'en', source: '/assets/films/nosia-film-en-1280x720.mp4', label: 'Our commitment film', open: 'Open the video' }
];

for (const film of films) {
  test(`film ${film.language} is localized, optional and available without JavaScript`, async () => {
    for (const javascript of [true, false]) {
      await browser.visit(film.path, { javascript });
      assert.equal(await browser.evaluate('document.querySelectorAll("article.engagement video").length'), 1);
      const player = await browser.evaluate(`(() => {
        const figure = document.querySelector('.engagement-film');
        const video = figure.querySelector('video');
        const source = video.querySelector('source');
        const link = figure.querySelector('figcaption a');
        return {
          previous: figure.previousElementSibling.id,
          next: figure.nextElementSibling.tagName,
          source: source.getAttribute('src'), type: source.type,
          label: video.getAttribute('aria-label'), controls: video.controls,
          inline: video.playsInline, preload: video.preload,
          autoplay: video.autoplay, loop: video.loop, paused: video.paused,
          ready: video.readyState, loading: video.networkState === HTMLMediaElement.NETWORK_LOADING,
          link: link.getAttribute('href'), linkText: link.textContent,
          linkVisible: link.checkVisibility()
        };
      })()`);
      assert.deepEqual(player, {
        previous: 'engagement-title', next: 'P', source: film.source, type: 'video/mp4',
        label: film.label, controls: true, inline: true, preload: 'none',
        autoplay: false, loop: false, paused: true, ready: 0, loading: false,
        link: film.source, linkText: film.open, linkVisible: true
      });
    }
  });

  test(`film ${film.language} preserves a responsive 16:9 frame in both themes`, async () => {
    for (const theme of ['light', 'dark']) {
      for (const width of [320, 375, 768, 1280]) {
        await browser.visit(film.path, { width, theme, reduced: true });
        assert.equal(await browser.evaluate('Boolean(document.querySelector(".engagement-film video"))'), true);
        const frame = await browser.evaluate(`(() => {
          const video = document.querySelector('.engagement-film video');
          const rect = video.getBoundingClientRect();
          const article = document.querySelector('article.engagement').getBoundingClientRect();
          const figure = video.closest('figure').getBoundingClientRect();
          const paragraph = document.querySelector('article.engagement p').getBoundingClientRect();
          return {
            width: rect.width, ratio: rect.width / rect.height,
            within: rect.left >= article.left && rect.right <= article.right,
            separated: paragraph.top >= figure.bottom + 20,
            overflow: document.documentElement.scrollWidth > innerWidth
          };
        })()`);
        assert.ok(frame.width > 200);
        assert.ok(Math.abs(frame.ratio - 16 / 9) < .02);
        assert.equal(frame.within, true);
        assert.equal(frame.separated, true);
        assert.equal(frame.overflow, false);
        if (process.env.NOSIA_SCREENSHOTS) {
          await browser.screenshot(`${process.env.NOSIA_SCREENSHOTS}/film-${film.language}-${theme}-${width}.png`);
        }
      }
    }
  });
}
