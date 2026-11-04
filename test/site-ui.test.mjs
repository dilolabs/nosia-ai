import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openBrowser } from './support/browser.mjs';

let browser;
before(async () => { browser = await openBrowser(); });
after(async () => { if (browser) await browser.close(); });

const engagementTitle = 'Pour une intelligence artificielle dont nous gardons la maîtrise';
const engagementParagraphs = [
  'Une entreprise possède des années de savoir-faire. Une association conserve la mémoire de ses actions. Une collectivité connaît son territoire. Derrière leurs documents, leurs échanges et leurs procédures, il y a un patrimoine construit par des personnes.',
  'L’intelligence artificielle peut rendre ce patrimoine plus accessible. Elle peut aider à retrouver une information, comprendre un dossier, transmettre une compétence ou alléger une tâche répétitive. Mais son adoption pose une question essentielle : qui garde la maîtrise de ce que nous lui confions ?',
  'Nous défendons le droit de choisir où nos données sont traitées, quels modèles nous utilisons et comment nos outils évoluent. Le droit de comprendre un système, de l’adapter et de pouvoir en changer.',
  'C’est cette conviction qui anime Nosia.',
  'Nosia permet de déployer une plateforme d’intelligence artificielle sur sa propre infrastructure, de l’appuyer sur ses documents et de la connecter à ses outils. Son code est ouvert : chacun peut l’étudier, l’utiliser, le modifier et contribuer à son évolution.',
  'Ces choix techniques portent une ambition très concrète : donner aux organisations les moyens de construire une IA adaptée à leurs besoins, avec une maîtrise réelle de son fonctionnement.',
  'Pour une petite entreprise, cela peut signifier retrouver une procédure sans interrompre toute une équipe. Pour une association, transmettre ses connaissances malgré le départ de bénévoles. Pour une organisation qui manipule des informations sensibles, choisir une architecture dans laquelle les documents et leur traitement restent dans un environnement maîtrisé.',
  'Cette autonomie demande du travail. Héberger un logiciel implique de le maintenir, de le sécuriser et d’accompagner ses utilisateurs. Un modèle peut se tromper. Une réponse doit pouvoir être vérifiée. L’ouverture du code et l’hébergement local donnent des moyens d’agir ; la confiance se construit ensuite par la qualité du déploiement et des usages.',
  'Nous défendons aussi une démarche de sobriété : partir d’un besoin précis, choisir un modèle et un matériel adaptés, mesurer l’utilité du service rendu. Chaque tâche ne nécessite pas le modèle le plus volumineux. Chaque nouvel usage mérite que l’on examine ses bénéfices et ses coûts.',
  'Soutenir Nosia, c’est contribuer à rendre cette autonomie accessible. C’est financer du développement, de la documentation, des essais sur le terrain et de l’accompagnement. C’est permettre à davantage d’organisations de s’approprier ces technologies et de développer leurs compétences.',
  'Nous invitons les entreprises, les associations, les collectivités, les développeurs et les partenaires à participer : tester Nosia sur un besoin réel, partager leurs retours, contribuer au code ou soutenir sa maintenance.',
  'L’avenir de l’intelligence artificielle se joue aussi dans notre capacité collective à la comprendre, à l’adapter et à décider de la place que nous voulons lui donner.',
  'Avec Nosia, nous voulons rendre cette liberté concrète.'
];

const commitmentTitle = 'For artificial intelligence that remains under our control';
const commitmentParagraphs = [
  'A company has years of expertise. An association preserves the memory of its work. A local authority knows its area. Behind their documents, conversations, and procedures lies a body of knowledge built by people.',
  'Artificial intelligence can make this knowledge more accessible. It can help people find information, make sense of a case, pass on a skill, or ease a repetitive task. But adopting it raises an essential question: who stays in control of what we entrust to it?',
  'We defend the right to choose where our data is processed, which models we use, and how our tools evolve. The right to understand a system, adapt it, and be able to switch to another.',
  'This conviction is what drives Nosia.',
  'Nosia lets you deploy an artificial intelligence platform on your own infrastructure, ground it in your documents, and connect it to your tools. Its code is open: anyone can study it, use it, modify it, and contribute to its development.',
  'These technical choices serve a very practical ambition: to give organizations the means to build AI suited to their needs, with real control over how it works.',
  'For a small business, this can mean finding a procedure without interrupting an entire team. For an association, passing on knowledge despite volunteers moving on. For an organization handling sensitive information, choosing an architecture in which documents and their processing remain within a controlled environment.',
  'This autonomy takes work. Hosting software means maintaining it, securing it, and supporting its users. A model can make mistakes. An answer must be verifiable. Open-source code and local hosting give us the means to act; trust is then built through the quality of deployment and use.',
  'We also advocate a resource-conscious approach: start with a specific need, choose a suitable model and hardware, and measure the usefulness of the service provided. Not every task needs the largest model. Every new use deserves an examination of its benefits and costs.',
  'Supporting Nosia means helping make this autonomy accessible. It means funding development, documentation, field testing, and support. It means enabling more organizations to take ownership of these technologies and develop their skills.',
  'We invite companies, associations, local authorities, developers, and partners to take part: test Nosia on a real use case, share feedback, contribute to the code, or support its maintenance.',
  'The future of artificial intelligence also depends on our collective ability to understand it, adapt it, and decide the role we want it to play.',
  'With Nosia, we want to make this freedom a reality.'
];

test('engagement preserves the complete French advocacy and its metadata', async () => {
  await browser.visit('/engagement/');
  assert.equal(await browser.evaluate('document.documentElement.lang'), 'fr');
  assert.equal(await browser.evaluate('document.querySelectorAll("h1").length'), 1);
  assert.equal(await browser.evaluate('document.querySelector("h1")?.textContent'), engagementTitle);
  assert.equal(await browser.evaluate('document.title'), engagementTitle + ' | Nosia');
  assert.equal(await browser.evaluate('document.querySelector("link[rel=canonical]")?.href'), 'https://nosia.ai/engagement/');
  assert.equal(await browser.evaluate('document.querySelector("meta[name=description]")?.content'), 'Notre engagement pour une intelligence artificielle ouverte, maîtrisée et adaptée aux besoins des organisations, dans une démarche de sobriété.');
  assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("article.engagement p")].map(p => p.textContent)'), engagementParagraphs);
  assert.equal(await browser.evaluate('document.querySelector("article.engagement p:last-child strong")?.textContent'), engagementParagraphs.at(-1));
  assert.equal(await browser.evaluate('document.querySelector("article.engagement")?.getAttribute("aria-labelledby")'), 'engagement-title');
  assert.equal(await browser.evaluate('document.querySelector(".lang-toggle")?.getAttribute("href")'), '/en/commitment/');
  assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("link[rel=alternate][hreflang]")].map(link => [link.hreflang, link.href]).sort()'), [
    ['en', 'https://nosia.ai/en/commitment/'],
    ['fr', 'https://nosia.ai/engagement/'],
    ['x-default', 'https://nosia.ai/engagement/']
  ]);
  const schemas = await browser.evaluate('[...document.querySelectorAll(\'script[type="application/ld+json"]\')].map(script => JSON.parse(script.textContent))');
  const breadcrumbs = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
  assert.equal(breadcrumbs.itemListElement.at(-1).item, 'https://nosia.ai/engagement/');
});

test('engagement includes the complete English translation and its metadata', async () => {
  await browser.visit('/en/commitment/');
  assert.equal(await browser.evaluate('document.documentElement.lang'), 'en');
  assert.equal(await browser.evaluate('document.querySelectorAll("h1").length'), 1);
  assert.equal(await browser.evaluate('document.querySelector("h1")?.textContent'), commitmentTitle);
  assert.equal(await browser.evaluate('document.title'), commitmentTitle + ' | Nosia');
  assert.equal(await browser.evaluate('document.querySelector("link[rel=canonical]")?.href'), 'https://nosia.ai/en/commitment/');
  assert.equal(await browser.evaluate('document.querySelector("meta[name=description]")?.content'), 'Our commitment to open, adaptable artificial intelligence that organizations can control, with a resource-conscious approach.');
  assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("article.engagement p")].map(p => p.textContent)'), commitmentParagraphs);
  assert.equal(await browser.evaluate('document.querySelector("article.engagement p:last-child strong")?.textContent'), commitmentParagraphs.at(-1));
  assert.equal(await browser.evaluate('document.querySelector(".lang-toggle")?.getAttribute("href")'), '/engagement/');
  assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("link[rel=alternate][hreflang]")].map(link => [link.hreflang, link.href]).sort()'), [
    ['en', 'https://nosia.ai/en/commitment/'],
    ['fr', 'https://nosia.ai/engagement/'],
    ['x-default', 'https://nosia.ai/engagement/']
  ]);
  const schemas = await browser.evaluate('[...document.querySelectorAll(\'script[type="application/ld+json"]\')].map(script => JSON.parse(script.textContent))');
  const breadcrumbs = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
  assert.equal(breadcrumbs.itemListElement.at(-1).name, 'Our commitment');
  assert.equal(breadcrumbs.itemListElement.at(-1).item, 'https://nosia.ai/en/commitment/');
});

for (const [path, language] of [['/engagement/', 'fr'], ['/en/commitment/', 'en']]) {
  test(`engagement ${language} reading layout fits mobile and desktop in both themes`, async () => {
    for (const theme of ['light', 'dark']) {
      for (const width of [320, 375, 768, 1280]) {
        await browser.visit(path, { width, theme, reduced: true });
        const reading = await browser.evaluate(`(() => {
          const article = document.querySelector('article.engagement');
          const p = article.querySelector('p');
          const style = getComputedStyle(p);
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1;
          const context = canvas.getContext('2d', { willReadFrequently: true });
          const ancestors = [];
          for (let node = p; node; node = node.parentElement) ancestors.unshift(node);
          function paint(color) { context.fillStyle = color; context.fillRect(0, 0, 1, 1); }
          function luminance() {
            return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map(value => {
              value /= 255;
              return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
            }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
          }
          paint('#fff');
          ancestors.forEach(node => paint(getComputedStyle(node).backgroundColor));
          const background = luminance();
          paint(style.color);
          const foreground = luminance();
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            width: article.getBoundingClientRect().width,
            font: parseFloat(style.fontSize),
            leading: parseFloat(style.lineHeight) / parseFloat(style.fontSize),
            spacing: parseFloat(style.marginBottom),
            contrast: (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05),
            dark: document.documentElement.classList.contains('dark')
          };
        })()`);
        assert.equal(reading.overflow, false, `${language} ${theme} ${width}`);
        assert.ok(reading.width <= 900, `bounded reading width: ${reading.width}`);
        assert.ok(reading.font >= 18);
        assert.ok(reading.leading >= 1.6);
        assert.ok(reading.spacing >= 20);
        assert.ok(reading.contrast >= 4.5, `${theme}: ${reading.contrast}:1`);
        assert.equal(reading.dark, theme === 'dark');
        if (process.env.NOSIA_SCREENSHOTS) {
          await browser.screenshot(`${process.env.NOSIA_SCREENSHOTS}/engagement-${language}-${theme}-${width}.png`);
        }
      }
    }
  });

  test(`engagement ${language} conclusion stays clear of the back-to-top control`, async () => {
    for (const theme of ['light', 'dark']) {
      await browser.visit(path, { width: 375, height: 812, theme, reduced: true });
      await browser.evaluate('window.scrollTo(0, document.documentElement.scrollHeight); new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
      const conclusion = await browser.evaluate(`(() => {
        const paragraph = document.querySelector('article.engagement p:last-child').getBoundingClientRect();
        const button = document.querySelector('.back-to-top').getBoundingClientRect();
        return { bottom: paragraph.bottom, buttonTop: button.top };
      })()`);
      assert.ok(conclusion.bottom + 8 <= conclusion.buttonTop, `${language} ${theme}: conclusion must stay above the floating control`);
    }
  });
}

test('engagement is discoverable from French navigation and home', async () => {
  for (const path of ['/', '/faq/', '/cas-usage/', '/engagement/']) {
    await browser.visit(path);
    assert.equal(await browser.evaluate('document.querySelector(\'#primary-nav a[href="/engagement/"]\')?.textContent'), 'Notre engagement');
    assert.equal(await browser.evaluate('document.querySelector(\'#primary-nav a[href="/cas-usage/"]\')?.nextElementSibling?.getAttribute("href")'), '/engagement/');
  }
  await browser.visit('/');
  assert.equal(await browser.evaluate('document.querySelector("#story")?.nextElementSibling?.id'), 'commitment-teaser');
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser")?.nextElementSibling?.id'), 'community');
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser h2")?.textContent'), 'Notre engagement');
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser p")?.textContent'), engagementParagraphs[2]);
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser a")?.getAttribute("href")'), '/engagement/');
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser a")?.textContent'), 'Lire notre engagement');
});

test('engagement is discoverable from English navigation and home', async () => {
  for (const path of ['/en/', '/en/faq/', '/en/use-cases/', '/en/commitment/']) {
    await browser.visit(path);
    assert.equal(await browser.evaluate('document.querySelector(\'#primary-nav a[href="/en/commitment/"]\')?.textContent'), 'Our commitment');
    assert.equal(await browser.evaluate('document.querySelector(\'#primary-nav a[href="/en/use-cases/"]\')?.nextElementSibling?.getAttribute("href")'), '/en/commitment/');
    assert.equal(await browser.evaluate('document.querySelector(\'#primary-nav a[href="/engagement/"]\')'), null);
  }
  await browser.visit('/en/');
  assert.equal(await browser.evaluate('document.querySelector("#story")?.nextElementSibling?.id'), 'commitment-teaser');
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser")?.nextElementSibling?.id'), 'community');
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser h2")?.textContent'), 'Our commitment');
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser p")?.textContent'), commitmentParagraphs[2]);
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser a")?.getAttribute("href")'), '/en/commitment/');
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser a")?.textContent'), 'Read our commitment');
});

for (const [home, path, paragraphs] of [['/', '/engagement/', engagementParagraphs], ['/en/', '/en/commitment/', commitmentParagraphs]]) {
  test(`engagement ${path} remains available in mobile navigation and without JavaScript`, async () => {
    await browser.visit(home, { width: 375 });
    await browser.evaluate('document.querySelector("[data-menu-toggle]").click()');
    assert.equal(await browser.evaluate(`document.querySelector('#primary-nav a[href="${path}"]')?.checkVisibility()`), true);
    await browser.visit(home, { width: 375, javascript: false });
    assert.equal(await browser.evaluate(`document.querySelector('#primary-nav a[href="${path}"]')?.checkVisibility()`), true);
    assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser a")?.checkVisibility()'), true);
    await browser.visit(path, { width: 375, javascript: false });
    assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("article.engagement p")].map(p => p.textContent)'), paragraphs);
  });
}

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
  const ids = ['description', 'features', 'quickstart', 'demo', 'use-cases-teaser', 'comparisons-teaser', 'documentation', 'story', 'commitment-teaser', 'community', 'faq'];
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
      const selectors = ['.developer-eyebrow', '.developer-summary', '.developer-ownership', '.developer-actions .btn', '.developer-terminal .copy-button', '.developer-terminal code', '.terminal-platforms', '#features > .container > p', '#features .card p', '#quickstart p', '#quickstart .copy-button', '#commitment-teaser p', '#commitment-teaser .btn', '.footer p', '.footer .links a', '.header-controls .lang-toggle', '.header .mobile-deploy'];
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
    for (const path of ['/', '/en/', '/engagement/', '/en/commitment/', '/faq/', '/en/faq/', '/cas-usage/', '/en/use-cases/', '/nosia-vs-openai/', '/en/nosia-vs-openai/', '/nosia-vs-ollama/', '/en/nosia-vs-ollama/', '/404.html']) {
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
  for (const path of ['/engagement/', '/en/commitment/', '/faq/', '/en/faq/', '/cas-usage/', '/en/use-cases/', '/nosia-vs-openai/', '/en/nosia-vs-openai/', '/nosia-vs-ollama/', '/en/nosia-vs-ollama/', '/404.html']) {
    await browser.visit(path, { width: 375 });
    assert.equal(await browser.evaluate('document.querySelectorAll("h1").length'), 1, path);
    assert.equal(await browser.evaluate('document.documentElement.scrollWidth <= innerWidth'), true, path);
    assert.equal(await browser.evaluate(`[...document.querySelectorAll('script[type="application/ld+json"]')].every(script => Boolean(JSON.parse(script.textContent)))`), true, path);
    assert.equal(await browser.evaluate('document.querySelector(".developer-terminal") === null'), true, path);
  }
});
