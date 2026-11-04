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
