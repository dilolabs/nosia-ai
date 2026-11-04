# Engagement Nosia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Inline execution is sufficient for this small, sequential change; do not dispatch agents without an execution choice.

**Goal:** Publier le plaidoyer français intégral à `/engagement/`, avec un lien dans la navigation française et un extrait après « Notre histoire ».

**Architecture:** Ajouter une page statique Jekyll utilisant le layout et les métadonnées existants. Compléter les traductions françaises et conditionner le nouveau lien de navigation à la présence de son URL. Ajouter uniquement des styles de lecture ciblés ; les pages anglaises restent inchangées.

**Tech Stack:** Jekyll 4, Liquid, HTML, CSS à variables existantes, tests Node.js avec Chromium via `test/support/browser.mjs`, html-proofer.

---

## Référence et fichiers

Spécification approuvée : `docs/superpowers/specs/2026-11-04-engagement-design.md`.

Le dépôt est propre sur la branche `plaidoyer`. Continuer sur cette branche, sans créer une autre branche ni déplacer la session pour ce changement ciblé. Ruby/Bundler sont disponibles (`bundle check` réussi), et Node.js est en version 24. Les tests navigateur utilisent `/usr/bin/chromium` par défaut et servent eux-mêmes `_site/` ; aucun serveur Jekyll permanent n’est nécessaire.

| Fichier | Responsabilité |
| --- | --- |
| `engagement.md` (nouveau) | Métadonnées et texte intégral français, article sémantique |
| `assets/css/developer.css` | Largeur et rythme de lecture de l’article |
| `_data/translations.yml` | Libellé et URL de navigation en français uniquement |
| `_includes/header.html` | Lien conditionnel commun aux menus ordinateur et mobile |
| `index.md` | Extrait entre les sections `story` et `community` |
| `test/site-ui.test.mjs` | Texte exact, métadonnées, lecture, navigation et non-régression anglaise |

Ne pas modifier `_site/`, `_layouts/default.html`, les includes SEO, `index-en.md` ni les pages `en/`. `docs/` et `test/` sont déjà exclus de la publication par `_config.yml`.

## Task 1: Page dédiée et fidélité du texte

**Files:** Create `engagement.md`; Modify `test/site-ui.test.mjs`.

- [ ] **Step 1: Ajouter les assertions de contenu et de métadonnées après les hooks du fichier de tests.** Les paragraphes attendus sont des constantes indépendantes du fichier public ; ne pas les lire depuis `engagement.md`, car cela masquerait une modification involontaire du texte.

```js
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
  assert.equal(await browser.evaluate('document.querySelector(".lang-toggle")?.getAttribute("href")'), '/en/');
  assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("link[rel=alternate][hreflang]")].map(link => link.hreflang).sort()'), ['fr', 'x-default']);
  const schemas = await browser.evaluate('[...document.querySelectorAll(\'script[type="application/ld+json"]\')].map(script => JSON.parse(script.textContent))');
  const breadcrumbs = schemas.find(schema => schema['@type'] === 'BreadcrumbList');
  assert.equal(breadcrumbs.itemListElement.at(-1).item, 'https://nosia.ai/engagement/');
});
```

- [ ] **Step 2: Construire et exécuter le nouveau test avant l’implémentation.**

Run `bundle exec jekyll build --baseurl ""`, puis `node --test --test-name-pattern='engagement preserves' test/site-ui.test.mjs`.

Expected: FAIL, car `/engagement/` n’existe pas et les métadonnées/paragraphes attendus sont absents. Une erreur de démarrage Chromium n’est pas un échec fonctionnel : résoudre ce prérequis avant de continuer.

- [ ] **Step 3: Créer `engagement.md` avec ce contenu exact.** Utiliser l’outil patch, comme pour les autres modifications de fichiers. Le HTML explicite évite toute transformation typographique du plaidoyer par Markdown.

```html
---
layout: default
lang: fr
ref: engagement
permalink: /engagement/
title: Notre engagement
seo_title: "Pour une intelligence artificielle dont nous gardons la maîtrise"
seo_description: "Notre engagement pour une intelligence artificielle ouverte, maîtrisée et adaptée aux besoins des organisations, dans une démarche de sobriété."
schema: [BreadcrumbList]
---

<article class="container engagement" aria-labelledby="engagement-title">
  <h1 id="engagement-title">Pour une intelligence artificielle dont nous gardons la maîtrise</h1>

  <p>Une entreprise possède des années de savoir-faire. Une association conserve la mémoire de ses actions. Une collectivité connaît son territoire. Derrière leurs documents, leurs échanges et leurs procédures, il y a un patrimoine construit par des personnes.</p>

  <p>L’intelligence artificielle peut rendre ce patrimoine plus accessible. Elle peut aider à retrouver une information, comprendre un dossier, transmettre une compétence ou alléger une tâche répétitive. Mais son adoption pose une question essentielle : qui garde la maîtrise de ce que nous lui confions ?</p>

  <p>Nous défendons le droit de choisir où nos données sont traitées, quels modèles nous utilisons et comment nos outils évoluent. Le droit de comprendre un système, de l’adapter et de pouvoir en changer.</p>

  <p>C’est cette conviction qui anime Nosia.</p>

  <p>Nosia permet de déployer une plateforme d’intelligence artificielle sur sa propre infrastructure, de l’appuyer sur ses documents et de la connecter à ses outils. Son code est ouvert : chacun peut l’étudier, l’utiliser, le modifier et contribuer à son évolution.</p>

  <p>Ces choix techniques portent une ambition très concrète : donner aux organisations les moyens de construire une IA adaptée à leurs besoins, avec une maîtrise réelle de son fonctionnement.</p>

  <p>Pour une petite entreprise, cela peut signifier retrouver une procédure sans interrompre toute une équipe. Pour une association, transmettre ses connaissances malgré le départ de bénévoles. Pour une organisation qui manipule des informations sensibles, choisir une architecture dans laquelle les documents et leur traitement restent dans un environnement maîtrisé.</p>

  <p>Cette autonomie demande du travail. Héberger un logiciel implique de le maintenir, de le sécuriser et d’accompagner ses utilisateurs. Un modèle peut se tromper. Une réponse doit pouvoir être vérifiée. L’ouverture du code et l’hébergement local donnent des moyens d’agir ; la confiance se construit ensuite par la qualité du déploiement et des usages.</p>

  <p>Nous défendons aussi une démarche de sobriété : partir d’un besoin précis, choisir un modèle et un matériel adaptés, mesurer l’utilité du service rendu. Chaque tâche ne nécessite pas le modèle le plus volumineux. Chaque nouvel usage mérite que l’on examine ses bénéfices et ses coûts.</p>

  <p>Soutenir Nosia, c’est contribuer à rendre cette autonomie accessible. C’est financer du développement, de la documentation, des essais sur le terrain et de l’accompagnement. C’est permettre à davantage d’organisations de s’approprier ces technologies et de développer leurs compétences.</p>

  <p>Nous invitons les entreprises, les associations, les collectivités, les développeurs et les partenaires à participer : tester Nosia sur un besoin réel, partager leurs retours, contribuer au code ou soutenir sa maintenance.</p>

  <p>L’avenir de l’intelligence artificielle se joue aussi dans notre capacité collective à la comprendre, à l’adapter et à décider de la place que nous voulons lui donner.</p>

  <p><strong>Avec Nosia, nous voulons rendre cette liberté concrète.</strong></p>
</article>
```

- [ ] **Step 4: Reconstruire et relancer le test ciblé.**

Run `bundle exec jekyll build --baseurl ""`, puis `node --test --test-name-pattern='engagement preserves' test/site-ui.test.mjs`.

Expected: PASS, treize paragraphes strictement identiques, un seul h1, canonical et fil d’Ariane corrects, aucun alternate anglais fictif.

- [ ] **Step 5: Créer un commit ciblé.**

Run `git add -- engagement.md test/site-ui.test.mjs`, puis `git commit -m "feat: publish French Nosia engagement"`.

## Task 2: Mise en page de lecture et thèmes

**Files:** Modify `assets/css/developer.css`; Modify `test/site-ui.test.mjs`.

- [ ] **Step 1: Ajouter un test navigateur de lecture, sans dépendance supplémentaire.**

```js
test('engagement reading layout fits mobile and desktop in both themes', async () => {
  for (const theme of ['light', 'dark']) {
    for (const width of [320, 375, 768, 1280]) {
      await browser.visit('/engagement/', { width, theme, reduced: true });
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
      assert.equal(reading.overflow, false, `${theme} ${width}`);
      assert.ok(reading.width <= 900, `bounded reading width: ${reading.width}`);
      assert.ok(reading.font >= 18);
      assert.ok(reading.leading >= 1.6);
      assert.ok(reading.spacing >= 20);
      assert.ok(reading.contrast >= 4.5, `${theme}: ${reading.contrast}:1`);
      assert.equal(reading.dark, theme === 'dark');
      if (process.env.NOSIA_SCREENSHOTS) {
        await browser.screenshot(`${process.env.NOSIA_SCREENSHOTS}/engagement-${theme}-${width}.png`);
      }
    }
  }
});
```

- [ ] **Step 2: Exécuter le test avant le CSS.**

Run `node --test --test-name-pattern='engagement reading' test/site-ui.test.mjs`.

Expected: FAIL sur la taille de police (16px), l’espacement (0) ou la largeur sur ordinateur. Le site généré contient déjà la page de Task 1.

- [ ] **Step 3: Ajouter ces règles ciblées à la fin de `assets/css/developer.css`.** Les couleurs héritées utilisent les tokens des thèmes existants ; ne pas ajouter de fond de section ni de palette spécifique.

```css
/* Long-form advocacy uses the shared theme and a bounded reading measure. */
.engagement {
  max-width: calc(70ch + 3rem);
  padding-block: clamp(var(--space-10), 6vw, var(--space-20));
  font-size: var(--text-lg);
}

.engagement h1 {
  margin-bottom: var(--space-8);
  font-size: clamp(2rem, 4vw, 3rem);
  text-wrap: balance;
}

.engagement p { margin-bottom: var(--space-6); }
.engagement p:last-child { margin-bottom: 0; }
```

- [ ] **Step 4: Reconstruire et vérifier les deux tests de page.**

Run `bundle exec jekyll build --baseurl ""`, puis `node --test --test-name-pattern='engagement (preserves|reading)' test/site-ui.test.mjs`.

Expected: PASS dans les deux thèmes, sur toutes les largeurs.

- [ ] **Step 5: Créer un commit ciblé.**

Run `git add -- assets/css/developer.css test/site-ui.test.mjs`, puis `git commit -m "style: add accessible engagement reading layout"`.

## Task 3: Navigation française et extrait d’accueil

**Files:** Modify `_data/translations.yml`, `_includes/header.html`, `index.md`, `test/site-ui.test.mjs`.

- [ ] **Step 1: Ajouter les tests de découverte et de non-régression anglaise.**

```js
test('engagement is discoverable in French without changing the English home', async () => {
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
  for (const path of ['/en/', '/en/faq/', '/en/use-cases/']) {
    await browser.visit(path);
    assert.equal(await browser.evaluate('document.querySelector(\'#primary-nav a[href="/engagement/"]\')'), null);
    assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser")'), null);
  }
});

test('engagement remains available in mobile navigation and without JavaScript', async () => {
  await browser.visit('/', { width: 375 });
  await browser.evaluate('document.querySelector("[data-menu-toggle]").click()');
  assert.equal(await browser.evaluate('document.querySelector(\'#primary-nav a[href="/engagement/"]\')?.checkVisibility()'), true);
  await browser.visit('/', { width: 375, javascript: false });
  assert.equal(await browser.evaluate('document.querySelector(\'#primary-nav a[href="/engagement/"]\')?.checkVisibility()'), true);
  assert.equal(await browser.evaluate('document.querySelector("#commitment-teaser a")?.checkVisibility()'), true);
  await browser.visit('/engagement/', { width: 375, javascript: false });
  assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("article.engagement p")].map(p => p.textContent)'), engagementParagraphs);
});
```

- [ ] **Step 2: Exécuter les tests avant de modifier la navigation et l’accueil.**

Run `node --test --test-name-pattern='engagement (is discoverable|remains available)' test/site-ui.test.mjs`.

Expected: FAIL, lien de navigation et extrait absents.

- [ ] **Step 3: Ajouter ces deux clés à la section `fr:` de `_data/translations.yml`, à proximité de `nav_usecases`.** Ne rien ajouter dans `en:`.

```yaml
  nav_engagement: "Notre engagement"
  engagement_url: "/engagement/"
```

- [ ] **Step 4: Insérer ce bloc immédiatement après le lien `t.nav_usecases` dans `_includes/header.html`.** Le menu existant est partagé entre ordinateur et mobile ; ne pas créer une seconde navigation.

```liquid
      {% if t.engagement_url %}
      <a href="{{ t.engagement_url | relative_url }}">{{ t.nav_engagement }}</a>
      {% endif %}
```

- [ ] **Step 5: Ajouter cette section dans `index.md`, juste après la fermeture de `story` et avant l’ouverture de `community`.**

```html
<section id="commitment-teaser" class="description">
  <div class="container">
    <h2>Notre engagement</h2>
    <p>Nous défendons le droit de choisir où nos données sont traitées, quels modèles nous utilisons et comment nos outils évoluent. Le droit de comprendre un système, de l’adapter et de pouvoir en changer.</p>
    <a href="{{ '/engagement/' | relative_url }}" class="btn">Lire notre engagement</a>
  </div>
</section>
```

- [ ] **Step 6: Adapter le test existant `developer-first home preserves anchors...`.** Conserver la constante `ids` existante pour l’anglais et remplacer uniquement son assertion de liste par :

```js
    const expectedIds = path === '/'
      ? [...ids.slice(0, 8), 'commitment-teaser', ...ids.slice(8)]
      : ids;
    assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("main > section[id]")].map(section => section.id)'), expectedIds);
```

- [ ] **Step 7: Ajouter `/engagement/` aux tableaux des tests existants `page backgrounds stay uniform...` et `secondary pages retain...`.** Ajouter `#commitment-teaser p` et `#commitment-teaser .btn` au tableau `selectors` du test existant de contraste de l’accueil. Les tests dédiés de Task 2 couvrent déjà le contraste de l’article.

Le fragment ajouté aux deux tableaux d’URL est :

```js
'/engagement/'
```

Le fragment ajouté au tableau de sélecteurs de contraste est :

```js
'#commitment-teaser p', '#commitment-teaser .btn'
```

- [ ] **Step 8: Reconstruire et exécuter toute la suite navigateur.**

Run `bundle exec jekyll build --baseurl ""`, puis `node --test test/site-ui.test.mjs`.

Expected: tous les tests passent, y compris l’absence de débordement de la navigation française à 1280px, les menus mobiles et l’ordre des sections FR/EN.

- [ ] **Step 9: Créer un commit ciblé.**

Run `git add -- _data/translations.yml _includes/header.html index.md test/site-ui.test.mjs`, puis `git commit -m "feat: link engagement from French navigation and home"`.

## Task 4: Vérification finale et compte rendu

**Files:** Relire les six fichiers de la table initiale et cocher ce plan au fur et à mesure.

- [ ] **Step 1: Charger `verification-before-completion` et effectuer une revue de fidélité au cadrage.** Comparer le texte publié avec les treize paragraphes du document approuvé. Vérifier que la dernière phrase est en gras, qu’aucun nouveau CTA financier n’a été ajouté et que les textes anglais n’ont pas changé.
- [ ] **Step 2: Exécuter `bin/verify`.** Expected: construction Jekyll réussie, html-proofer sans erreur de lien interne, présence de `https://nosia.ai/engagement/` dans `_site/sitemap.xml`.
- [ ] **Step 3: Exécuter `NOSIA_SCREENSHOTS=/tmp/opencode/nosia-engagement node --test test/site-ui.test.mjs`.** Expected: aucun test en échec. Ouvrir avec l’outil read les captures `engagement-light-375.png`, `engagement-dark-375.png` et `engagement-light-1280.png` dans ce répertoire ; contrôler titre, mesure de lecture, marges et conclusion.
- [ ] **Step 4: Exécuter `git diff --check` et `git status --short`.** Expected: aucun problème d’espacement, aucun fichier généré versionné ni modification hors périmètre. Consigner les commandes effectivement exécutées et leurs résultats, sans annoncer une mise en ligne : cette tâche modifie le dépôt, pas le déploiement.
- [ ] **Step 5: Répondre en français avec l’URL de la nouvelle page, les deux points d’accès et le résultat des vérifications.** Ne proposer ni traduction ni fonctionnalité supplémentaire comme si elle était incluse.
