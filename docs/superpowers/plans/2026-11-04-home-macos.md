# macOS-First Public Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Do not dispatch agents until the user chooses that execution mode.

**Goal:** Refaire les accueils français et anglais autour de la liberté de choix et d’usages compréhensibles, avec l’application native macOS v0.6.1 avant Linux et Windows.

**Architecture:** Conserver Jekyll, les traductions et les contrôles existants. Des includes ciblés partagent le bandeau, les prérequis, le guide et les sections des deux accueils ; les faits de téléchargement et les textes traduits restent séparés. La vidéo française est un MP4 local, avec lecteur natif volontaire et guide écrit indépendant.

**Tech Stack:** Jekyll 4.3/Liquid, YAML, HTML natif, CSS à variables existantes, Node.js 24, tests `node:test` et Chromium/CDP existants.

---

## Référence, état initial et limites

- Spécification approuvée et commitée : `docs/superpowers/specs/2026-11-04-home-macos-design.md`, commit `7658dd0`.
- Direction C approuvée : conviction → usages → installation Mac → Linux/Windows → FAQ → histoire/communauté → ressources techniques.
- Branche actuelle : `native-macos`. Aucun worktree supplémentaire n’a été créé pendant le cadrage. Ne pas déplacer la session ni changer de branche sans nécessité pour l’exécution choisie.
- Vérification effectuée avant rédaction du plan : `bin/verify` réussit ; `node --test test/*.test.mjs` réussit avec **58 tests**. Ne pas confondre ce résultat initial avec celui de la future implémentation.
- Aucun code du site n’a été changé pendant la rédaction du plan. Le téléchargement de recherche ci-dessous est hors dépôt.
- Ne pas modifier `engagement.md`, `en/commitment.md`, les deux films du plaidoyer, les scripts d’installation, le déploiement, les comparaisons et les pages de cas d’usage.
- Les seuls changements hors accueils sont le libellé partagé « Installer Nosia », le JSON-LD des accueils et deux réponses par FAQ dédiée (installation et matériel).
- Pas de dépendance supplémentaire, de nouvelle logique JavaScript publique, de détection du système, de réencodage ou de sous-titres inventés.

### Média vérifié pendant le cadrage

Source durable : `https://github.com/user-attachments/assets/1f41e171-75e7-4cf8-bacb-889312e4e8cb`.

Le MP4 récupéré pour inspection dans `/tmp/opencode/nosia-macos-installation-fr-v0.6.1.mp4` fait **6 669 573 octets**, dure **108,4 secondes** et sa piste vidéo mesure **1048 × 720**. Son SHA-256 est `8dce9f8f0df93566062cd72b3f60028e2f28bba6073097d6d82113c67a2bc9e5`. Ces mesures proviennent du conteneur MP4, pas d’une vérification de lecture ni d’une transcription. Ne pas imposer un ratio 16:9 au tutoriel.

Le lien public sert les GET, y compris les requêtes partielles. Une HEAD sur sa redirection S3 peut recevoir un 403 : utiliser GET pour récupérer le fichier, sans recopier les signatures temporaires.

## Carte des fichiers

| Fichier | Responsabilité |
| --- | --- |
| `_data/downloads.yml` (nouveau) | Faits communs macOS : version, URLs, compatibilité, vidéo et dimensions |
| `_data/home.yml` | Textes localisés du parcours public, FAQ d’accueil et ressources |
| `_data/translations.yml` | Nouveau libellé de l’action d’installation dans l’en-tête existant |
| `_includes/home-hero.html` | Promesse éditoriale, explication de Nosia et téléchargement direct |
| `_includes/mac-requirements.html` (nouveau) | Prérequis partagés entre bandeau et guide |
| `_includes/home-installation.html` (nouveau) | Étapes Mac, vidéo et commandes secondaires Linux/Windows |
| `_includes/home-content.html` (nouveau) | Extrait du plaidoyer, usages, guide et FAQ ; compose les ressources |
| `_includes/home-resources.html` (nouveau) | Histoire, engagement, aide, documentation, comparaisons, démo et pied de page |
| `index.md`, `index-en.md` | Métadonnées et composition des accueils, sans copie du balisage partagé |
| `_includes/structured-data.html` | FAQ identique au visible et catégorie productivité des accueils |
| `assets/css/developer.css` | Styles ciblés du nouveau parcours ; conserver les règles partagées existantes |
| `assets/films/nosia-macos-installation-fr-v0.6.1.mp4` (nouveau) | Tutoriel français original, octets inchangés |
| `faq.md`, `en/faq.md` | Corrections factuelles limitées à deux réponses |
| `test/home-macos.test.mjs` (nouveau) | Contrat éditorial, installation, média, métadonnées et adaptation |
| `test/site-ui.test.mjs` | Adapter seulement les attentes devenues obsolètes : Terminal du bandeau, ordre, démo, commandes repliées |

`_includes/header.html`, `_includes/install-command.html`, `assets/js/site.js`, `assets/css/style.css`, `_config.yml` et `test/support/browser.mjs` ne nécessitent pas de modification : leurs interfaces existantes suffisent.

## Exécution des vérifications

Reconstruire `_site` avant chaque commande de tests quand des sources Jekyll ont changé. Exécuter séparément :

```bash
bundle exec jekyll build --baseurl ""
node --test test/home-macos.test.mjs
```

La suite historique contient volontairement des exigences développeur devenues fausses. Les adapter avec le contrat du nouveau parcours en tâche 4, sans supprimer les vérifications indépendantes de langue, d’accessibilité ou du plaidoyer. Jusqu’à cette tâche, annoncer uniquement les résultats des tests ciblés exécutés, pas un succès de toute la suite.

## Task 1: Données, bandeau éditorial et téléchargement Mac

**Files:** Create `_data/downloads.yml`, `_includes/mac-requirements.html`, `test/home-macos.test.mjs`; modify `_data/home.yml`, `_includes/home-hero.html`, `_data/translations.yml`, `assets/css/developer.css`.

- [ ] **Step 1: Créer le contrat du bandeau dans `test/home-macos.test.mjs`.**

```js
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
```

- [ ] **Step 2: Construire puis lancer le test pour observer le rouge.**

```bash
bundle exec jekyll build --baseurl ""
node --test test/home-macos.test.mjs
```

Attendu : deux échecs métier (ancien titre et absence du nouveau bandeau), pas une erreur de lancement de Chromium.

- [ ] **Step 3: Créer `_data/downloads.yml`.**

```yaml
macos:
  version: "0.6.1"
  chip: "Apple M1"
  minimum_macos: "26.5"
  memory_gb: 16
  download_url: "https://github.com/dilolabs/nosia/releases/download/v0.6.1/Nosia-Native-arm64.dmg"
  release_url: "https://github.com/dilolabs/nosia/releases/tag/v0.6.1"
  video: "/assets/films/nosia-macos-installation-fr-v0.6.1.mp4"
  video_width: 1048
  video_height: 720
```

- [ ] **Step 4: Remplacer `_data/home.yml` par ces textes du bandeau.** Les clés du guide sont ajoutées en tâche 2 et celles des autres sections en tâche 3, sous les mêmes entrées `fr` et `en`.

```yaml
fr:
  eyebrow: "L’intelligence artificielle, autrement"
  title: "Une IA utile."
  title_accent: "Et la liberté de choisir."
  intro: "Vos documents racontent votre travail, vos projets et votre histoire. Vous devriez pouvoir vous faire aider par une IA sans en perdre la maîtrise."
  summary: "Nosia est un assistant d’intelligence artificielle pour écrire, réfléchir et retrouver des informations dans vos documents."
  privacy: "Dans l’espace « Sur ce Mac », l’IA fonctionne sur votre ordinateur, où vos échanges et vos fichiers sont conservés."
  download: "Télécharger pour Mac"
  installation: "Voir les étapes d’installation"
  other_platforms: "Vous utilisez Linux ou Windows ?"
  mac_chip_label: "Mac avec puce"
  mac_chip_suffix: "ou ultérieure"
  macos_suffix: "minimum"
  memory_before: "Prévoyez"
  memory_unit: "Go"
  memory_after: "de mémoire ou plus pour l’IA fournie."
en:
  eyebrow: "A different approach to artificial intelligence"
  title: "Useful AI."
  title_accent: "And the freedom to choose."
  intro: "Your documents tell the story of your work, your projects and your ideas. You should be able to get help from AI without losing control of them."
  summary: "Nosia is an artificial intelligence assistant for writing, thinking through ideas and finding information in your documents."
  privacy: "In the “On this Mac” workspace, AI runs on your computer, where your conversations and files are stored."
  download: "Download for Mac"
  installation: "See the installation steps"
  other_platforms: "Using Linux or Windows?"
  mac_chip_label: "Mac with"
  mac_chip_suffix: "or later"
  macos_suffix: "or later"
  memory_before: "Plan for"
  memory_unit: "GB"
  memory_after: "of memory or more for the included AI configuration."
```

- [ ] **Step 5: Créer `_includes/mac-requirements.html` et remplacer `_includes/home-hero.html`.**

`_includes/mac-requirements.html` :

```liquid
{%- assign macos = site.data.downloads.macos -%}
{%- assign home = site.data.home[page.lang] -%}
<p class="mac-requirements" id="{{ include.id | escape }}">
  <span>{{ home.mac_chip_label }} {{ macos.chip }} {{ home.mac_chip_suffix }} · macOS {{ macos.minimum_macos }} {{ home.macos_suffix }}</span>
  <span>{{ home.memory_before }} {{ macos.memory_gb }} {{ home.memory_unit }} {{ home.memory_after }}</span>
</p>
```

`_includes/home-hero.html` :

```liquid
{%- assign home = site.data.home[page.lang] -%}
{%- assign macos = site.data.downloads.macos -%}
<section class="home-hero" aria-labelledby="home-title">
  <div class="container">
    <p class="home-eyebrow">{{ home.eyebrow }}</p>
    <h1 id="home-title">{{ home.title }} <span>{{ home.title_accent }}</span></h1>
    <p class="home-intro">{{ home.intro }}</p>
    <p class="home-summary">{{ home.summary }}</p>
    <div class="home-actions">
      <a class="btn btn-primary home-download" href="{{ macos.download_url }}" aria-describedby="hero-requirements">{{ home.download }}</a>
      <a class="home-install-link" href="#quickstart">{{ home.installation }}</a>
    </div>
    {% include mac-requirements.html id="hero-requirements" %}
    <p class="home-privacy">{{ home.privacy }}</p>
    <a class="home-other-link" href="#other-installations">{{ home.other_platforms }}</a>
  </div>
</section>
```

- [ ] **Step 6: Modifier uniquement la valeur de `deploy` dans chaque langue de `_data/translations.yml`.**

```diff
-  deploy: "Déployer Nosia"
+  deploy: "Installer Nosia"
```

```diff
-  deploy: "Deploy Nosia"
+  deploy: "Install Nosia"
```

- [ ] **Step 7: Ajouter les styles du bandeau à la fin de `assets/css/developer.css`.** Ne pas renommer la feuille ni retirer les règles partagées de navigation et du plaidoyer. Les anciennes règles `.developer-*` deviennent inutilisées, sans imposer une réorganisation de la feuille dans ce chantier.

```css
/* Public-facing editorial home: existing theme tokens remain authoritative. */
.home-hero { background: var(--bg-app); padding-block: clamp(2rem, 6vw, 5rem); }
.home-hero .container { max-width: 64rem; }
.home-eyebrow { color: var(--accent-strong); font-size: var(--text-sm); font-weight: 600; margin-bottom: var(--space-4); }
.dark .home-eyebrow { color: var(--accent-soft-text); }
.home-hero h1 { max-width: 22ch; font-size: clamp(2rem, 5vw, 3.75rem); line-height: 1.12; text-wrap: balance; }
.home-hero h1 span { display: block; color: var(--accent-strong); }
.dark .home-hero h1 span { color: var(--accent-soft-text); }
.home-intro, .home-summary, .home-privacy { max-width: 65ch; }
.home-intro { margin-top: var(--space-6); font-size: var(--text-lg); }
.home-summary { margin-top: var(--space-4); }
.home-actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-4); margin-top: var(--space-6); }
.home-actions a { min-height: 44px; display: inline-flex; align-items: center; }
.mac-requirements { margin-top: var(--space-4); color: var(--text-muted); font-size: var(--text-sm); }
.mac-requirements span { display: block; }
.home-privacy { margin-top: var(--space-4); font-size: var(--text-sm); }
.home-other-link { display: inline-flex; align-items: center; min-height: 44px; margin-top: var(--space-2); }
.home-hero a:not(.btn), .home-content a:not(.btn) { text-underline-offset: 3px; }
@media (max-width: 600px) {
  .home-hero { padding-block: var(--space-8); }
  .home-eyebrow { font-size: var(--text-xs); margin-bottom: var(--space-3); }
  .home-intro { margin-top: var(--space-4); font-size: var(--text-base); }
  .home-summary { font-size: var(--text-15); }
  .home-actions { margin-top: var(--space-4); gap: var(--space-2) var(--space-4); }
  .home-actions .btn { padding-inline: var(--space-4); }
}
```

- [ ] **Step 8: Reconstruire, vérifier les deux tests ciblés, puis committer les fichiers de cette tâche.**

```bash
bundle exec jekyll build --baseurl ""
node --test test/home-macos.test.mjs
git diff --check
git add _data/downloads.yml _data/home.yml _data/translations.yml _includes/mac-requirements.html _includes/home-hero.html assets/css/developer.css test/home-macos.test.mjs
git commit -m "feat: introduce a public-friendly Mac-first hero"
```

Attendu : les deux tests de bandeau passent. Les anciens tests « developer-first » ne constituent plus le contrat et seront remplacés explicitement en tâche 4.

## Task 2: Guide macOS, tutoriel local et installations secondaires

**Files:** Modify `_data/home.yml`, `index.md`, `index-en.md`, `assets/css/developer.css`, `test/home-macos.test.mjs`; create `_includes/home-installation.html`, `assets/films/nosia-macos-installation-fr-v0.6.1.mp4`.

- [ ] **Step 1: Ajouter ces tests au fichier `test/home-macos.test.mjs`.**

```js
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
      assert.equal(state.source, film);
      assert.equal(state.type, 'video/mp4');
      assert.equal(state.controls, true);
      assert.equal(state.inline, true);
      assert.equal(state.preload, 'none');
      assert.equal(state.autoplay, false);
      assert.equal(state.loop, false);
      assert.equal(state.ready, 0);
      assert.equal(state.loading, false);
      assert.match(state.label, home.lang === 'fr' ? /français/ : /French/);
      assert.match(state.caption, home.lang === 'fr' ? /français/ : /French/);
      assert.equal(state.link, film);
      assert.equal(state.linkVisible, true);
    }
  });

  test(`tutorial ${home.lang} decodes, plays and seeks after a user gesture`, async () => {
    const response = await fetch(browser.origin + film, { headers: { Range: 'bytes=0-31' } });
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('content-type'), 'video/mp4');
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
        video.addEventListener('timeupdate', progressed);
        video.addEventListener('error', failed);
        video.play().catch(failed);
      })`
    });
    assert.equal(playback.exceptionDetails, undefined, JSON.stringify(playback.exceptionDetails));
    const state = playback.result.value;
    assert.equal(state.width, 1048);
    assert.equal(state.height, 720);
    assert.ok(Math.abs(state.duration - 108.4) < .2);
    assert.ok(state.time >= .1);
    assert.ok(state.frames > 0);
    assert.ok(Math.abs(state.seekTime - 2) < .1);
  });
}
```

- [ ] **Step 2: Reconstruire et observer les échecs d’installation et de vidéo.**

```bash
bundle exec jekyll build --baseurl ""
node --test test/home-macos.test.mjs
```

Attendu : les deux tests du bandeau restent verts ; les six nouveaux tests échouent sur les éléments ou le média absents.

- [ ] **Step 3: Ajouter ces clés à `fr` et `en` de `_data/home.yml`.**

```yaml
# Sous fr:
  install_title: "Commencez sur votre Mac"
  install_intro: "Une application, des étapes guidées, aucune commande à saisir."
  steps:
    - "Téléchargez le fichier Nosia-Native-arm64.dmg."
    - "Ouvrez-le, puis glissez Nosia dans Applications."
    - "Ouvrez Nosia depuis Applications."
    - "Cliquez sur Préparer Nosia et suivez les indications à l’écran."
    - "Posez votre première question ou importez vos premiers documents."
  before_install: "Avant de commencer"
  setup_downloads: "La préparation initiale nécessite une connexion internet et télécharge plusieurs gigaoctets. Prévoyez aussi de l’espace pour vos documents."
  permissions: "macOS peut demander votre mot de passe administrateur pour installer un composant Apple, ainsi que l’accès au réseau local et au Trousseau, qui conserve les identifiants. Nosia vous guide dans ces étapes."
  signed: "L’application est signée par Dilolabs et notarisée par Apple : Apple a effectué ses vérifications de sécurité."
  release: "Voir les détails de la version 0.6.1"
  video_label: "Installer Nosia sur Mac — vidéo en français"
  video_caption: "Installation pas à pas, en français (1 min 48 s)."
  video_open: "Ouvrir la vidéo"
  video_written: "Vous pouvez suivre toutes les étapes écrites sans regarder la vidéo."
  other_title: "Autres installations : Linux et Windows"
  other_intro: "Ces méthodes utilisent des commandes à saisir. Elles ne sont pas nécessaires pour installer l’application Mac."
  linux: "Linux"
  windows: "Windows · PowerShell"
# Sous en:
  install_title: "Get started on your Mac"
  install_intro: "One app, guided steps, no Terminal commands to enter."
  steps:
    - "Download Nosia-Native-arm64.dmg."
    - "Open the file and drag Nosia into Applications."
    - "Open Nosia from Applications."
    - "Click Set Up Nosia and follow the on-screen instructions."
    - "Ask your first question or import your first documents."
  before_install: "Before you begin"
  setup_downloads: "Initial setup needs an internet connection and downloads several gigabytes. Allow additional storage space for your documents."
  permissions: "macOS may ask for your administrator password to install an Apple component, as well as access to the local network and Keychain, which stores credentials. Nosia guides you through these steps."
  signed: "The app is signed by Dilolabs and notarized by Apple, which has performed its security checks."
  release: "See version 0.6.1 details"
  video_label: "Install Nosia on Mac — video in French"
  video_caption: "Step-by-step installation in French (1 min 48 s)."
  video_open: "Open the video"
  video_written: "You can follow all the written steps without watching the video."
  other_title: "Other installations: Linux and Windows"
  other_intro: "These methods use commands you enter yourself. They are not needed to install the Mac app."
  linux: "Linux"
  windows: "Windows · PowerShell"
```

Les commentaires `Sous fr` / `Sous en` délimitent les ajouts : ne pas coller ces deux blocs sous une même langue ni créer une deuxième clé racine `fr` ou `en`.

- [ ] **Step 4: Créer `_includes/home-installation.html`.**

```liquid
{%- assign home = site.data.home[page.lang] -%}
{%- assign macos = site.data.downloads.macos -%}
<section id="quickstart" class="quickstart home-installation">
  <div class="container">
    <h2>{{ home.install_title }}</h2>
    <p>{{ home.install_intro }}</p>
    <div class="mac-installation">
      <div>
        <ol class="mac-steps">{% for step in home.steps %}<li>{{ step }}</li>{% endfor %}</ol>
        <a class="btn btn-primary mac-download" href="{{ macos.download_url }}" aria-describedby="install-requirements">{{ home.download }}</a>
      </div>
      <figure class="mac-video">
        <video controls playsinline preload="none" width="{{ macos.video_width }}" height="{{ macos.video_height }}" aria-label="{{ home.video_label | escape }}">
          <source src="{{ macos.video | relative_url }}" type="video/mp4">
        </video>
        <figcaption>{{ home.video_caption }} <a href="{{ macos.video | relative_url }}">{{ home.video_open }}</a></figcaption>
        <p class="video-written">{{ home.video_written }}</p>
      </figure>
    </div>
    <aside class="mac-preflight" aria-labelledby="mac-preflight-title">
      <h3 id="mac-preflight-title">{{ home.before_install }}</h3>
      {% include mac-requirements.html id="install-requirements" %}
      <p>{{ home.setup_downloads }}</p>
      <p>{{ home.permissions }}</p>
      <p>{{ home.signed }} <a class="release-link" href="{{ macos.release_url }}">{{ home.release }}</a></p>
    </aside>
    <details id="other-installations" class="other-installations">
      <summary>{{ home.other_title }}</summary>
      <p>{{ home.other_intro }}</p>
      {% include install-command.html id="install-unix" label=home.linux command="curl -fsSL https://get.nosia.ai | sh" %}
      {% include install-command.html id="install-windows" label=home.windows command="irm https://get.nosia.ai/install.ps1 | iex" %}
    </details>
  </div>
</section>
```

- [ ] **Step 5: Dans `index.md` et `index-en.md`, remplacer uniquement la section `#quickstart` par l’inclusion.**

```liquid
{% include home-installation.html %}
```

Le bloc remplacé commence à `<section id="quickstart" class="quickstart">` et se termine à son `</section>`, avant `#demo`. En tâche 3, la composition commune reprendra cette inclusion ; ne pas conserver deux guides.

- [ ] **Step 6: Récupérer le MP4 dans son chemin final et contrôler son empreinte.**

```bash
curl --location --fail --show-error --output assets/films/nosia-macos-installation-fr-v0.6.1.mp4 https://github.com/user-attachments/assets/1f41e171-75e7-4cf8-bacb-889312e4e8cb
sha256sum assets/films/nosia-macos-installation-fr-v0.6.1.mp4
```

Attendu : empreinte `8dce9f8f0df93566062cd72b3f60028e2f28bba6073097d6d82113c67a2bc9e5`. En cas de différence, contrôler le fichier et la source plutôt que modifier l’empreinte attendue ou publier un fichier incomplet. Aucun réencodage.

- [ ] **Step 7: Ajouter ces styles à la fin de `assets/css/developer.css`.**

```css
.home-installation > .container { display: block; }
.home-installation > .container > h2 { text-align: left; }
.home-installation p { max-width: 70ch; }
.mac-installation { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--space-8); align-items: start; }
.mac-installation > * { min-width: 0; }
.mac-steps { padding-left: var(--space-6); margin-bottom: var(--space-6); }
.mac-steps li { padding-left: var(--space-2); margin-bottom: var(--space-4); line-height: 1.7; }
.mac-video { margin: 0; min-width: 0; }
.mac-video video { display: block; width: 100%; height: auto; aspect-ratio: 1048 / 720; background: var(--neutral-950); border: 1px solid var(--border-strong); border-radius: var(--radius-xl); }
.mac-video figcaption { margin-top: var(--space-3); font-size: var(--text-sm); line-height: 1.7; }
.mac-video .video-written { margin-top: var(--space-3); font-size: var(--text-sm); }
.mac-preflight { margin-top: var(--space-8); padding: var(--space-5); border: 1px solid var(--border-strong); border-radius: var(--radius-xl); background: var(--surface-card); }
.mac-preflight h3 { margin-bottom: var(--space-3); }
.mac-preflight .mac-requirements { max-width: none; }
.other-installations { margin-top: var(--space-8); padding: var(--space-5); border: 1px solid var(--border-strong); border-radius: var(--radius-xl); }
.other-installations > summary { cursor: pointer; min-height: 44px; font-weight: 600; line-height: 1.6; }
.other-installations > p { margin-top: var(--space-4); }
.other-installations .command-block { max-width: none; }
@media (max-width: 800px) { .mac-installation { grid-template-columns: minmax(0, 1fr); } }
```

- [ ] **Step 8: Reconstruire, exécuter les huit tests ciblés, puis committer.**

```bash
bundle exec jekyll build --baseurl ""
node --test test/home-macos.test.mjs
git diff --check
git add _data/home.yml _includes/home-installation.html index.md index-en.md assets/css/developer.css assets/films/nosia-macos-installation-fr-v0.6.1.mp4 test/home-macos.test.mjs
git commit -m "feat: guide native Mac installation with an optional tutorial"
```

Attendu : huit tests passent, dont la lecture réelle et le déplacement dans le MP4. Les étapes écrites ne dépendent ni du lecteur ni de JavaScript.

## Task 3: Parcours éditorial bilingue, FAQ et ressources techniques secondaires

**Files:** Modify `_data/home.yml`, `index.md`, `index-en.md`, `_includes/structured-data.html`, `faq.md`, `en/faq.md`, `assets/css/developer.css`, `test/home-macos.test.mjs`; create `_includes/home-content.html`, `_includes/home-resources.html`.

- [ ] **Step 1: Ajouter ces tests de parcours et de cohérence à `test/home-macos.test.mjs`.**

```js
for (const home of homes) {
  test(`public journey ${home.lang} follows direction C and publishes matching metadata`, async () => {
    await browser.visit(home.path);
    assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("main > section[id]")].map(section => section.id)'), [
      'description', 'features', 'use-cases-teaser', 'quickstart', 'faq', 'story',
      'commitment-teaser', 'community', 'documentation', 'comparisons-teaser', 'demo'
    ]);
    assert.equal(await browser.evaluate('document.querySelectorAll("#features .card").length'), 3);
    const quote = await browser.evaluate('document.querySelector("#description blockquote").textContent.trim()');
    assert.equal(quote, home.lang === 'fr'
      ? 'Le droit de comprendre un système, de l’adapter et de pouvoir en changer.'
      : 'The right to understand a system, adapt it, and be able to switch to another.');
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
```

- [ ] **Step 2: Reconstruire et lancer les tests ciblés avant les nouveaux contenus.**

```bash
bundle exec jekyll build --baseurl ""
node --test test/home-macos.test.mjs
```

Attendu : les tests de bandeau et de tutoriel passent ; les nouveaux tests échouent sur l’ancien ordre, la catégorie développeur et les FAQ restées sur Docker.

- [ ] **Step 3: Ajouter ces clés de contenu aux entrées existantes de `_data/home.yml`.**

Bloc à ajouter sous `fr` :

```yaml
  quote: "Le droit de comprendre un système, de l’adapter et de pouvoir en changer."
  commitment_link: "Lire notre engagement"
  features_title: "Votre savoir, plus accessible"
  features_intro: "Au travail, dans une association ou pour vos projets : partez d’un besoin concret."
  features:
    - { icon: "document", title: "Préparer un texte", text: "Trouver une première formulation pour un courrier, développer une idée ou clarifier un texte." }
    - { icon: "book", title: "Comprendre un dossier", text: "Importer vos documents et poser des questions sur leur contenu, avec vos propres mots." }
    - { icon: "chat", title: "Retrouver une information", text: "Explorer les connaissances de votre équipe sans devoir relire tous les documents." }
  caution: "Une IA peut se tromper. Vérifiez les réponses importantes dans les documents d’origine."
  usecases_title: "Un besoin concret en tête ?"
  usecases_intro: "Découvrez comment Nosia peut aider une petite entreprise, une association ou une équipe à retrouver et transmettre ses connaissances."
  usecases_link: "Découvrir les cas d’usage"
  faq_title: "Vous vous posez peut-être ces questions"
  faq:
    - q: "Nosia est-il gratuit ?"
      a: "Le logiciel Nosia est gratuit à installer et son code est ouvert sous licence MIT : chacun peut le consulter, l’utiliser et contribuer. Cela ne signifie pas que tous les services hébergés ou prestations d’accompagnement sont gratuits."
    - q: "Mon Mac est-il compatible ?"
      a: "Les prérequis du guide ci-dessus indiquent la puce, la version de macOS et la mémoire à prévoir. Vous pouvez vérifier votre configuration dans le menu Pomme, puis À propos de ce Mac. Cette application n’est pas destinée aux Mac Intel."
    - q: "Où sont conservées mes données ?"
      a: "Dans l’espace Sur ce Mac, l’IA fonctionne sur votre ordinateur et vos conversations et documents y sont conservés. Si vous choisissez Nosia Cloud, un autre serveur ou des connexions externes, le lieu de traitement dépend de cet espace et de sa configuration."
    - q: "Pourquoi télécharger des fichiers au premier lancement ?"
      a: "La préparation télécharge les ressources nécessaires pour faire fonctionner l’IA sur votre Mac. Elle nécessite internet et peut prendre du temps selon votre connexion. Nosia affiche l’avancement et vous permet d’annuler."
    - q: "Puis-je faire confiance à toutes les réponses ?"
      a: "Non. Comme toute IA, Nosia peut se tromper ou mal interpréter un document. Vérifiez les informations importantes et ne remplacez pas un avis professionnel par une réponse automatique."
    - q: "Que se passe-t-il quand je ferme Nosia ?"
      a: "Fermer la fenêtre laisse Nosia actif. Quitter l’application arrête ses services locaux et conserve vos données pour la prochaine ouverture."
  story_title: "Une aventure humaine"
  story:
    - "Nosia est né d’une conviction partagée par Cyril, Olivier, Aude et Melvin : la technologie doit servir l’humain, pas l’inverse."
    - "En 2024, Olivier fait découvrir à Cyril une manière d’appuyer les réponses d’une IA sur des documents. Cyril trouve le nom Nosia. Leur objectif : rendre ces outils accessibles tout en gardant la maîtrise des données."
    - "En juin 2026, François, de la chaîne YouTube Kokori Kodo, réalise une première vidéo de présentation. Retrouvez-la parmi les ressources ci-dessous."
  commitment_title: "Notre engagement"
  commitment: "Nous défendons le droit de choisir où nos données sont traitées, quels modèles nous utilisons et comment nos outils évoluent. Le droit de comprendre un système, de l’adapter et de pouvoir en changer."
  community_title: "Besoin d’aide ou envie de participer ?"
  community_intro: "Posez vos questions, partagez votre expérience ou contribuez au projet. Ces échanges ont lieu sur GitHub."
  community:
    - { icon: "chat", title: "Poser une question", text: "Échanger avec la communauté", url: "https://github.com/dilolabs/nosia/discussions" }
    - { icon: "bug", title: "Signaler un problème", text: "Décrire ce qui ne fonctionne pas", url: "https://github.com/dilolabs/nosia/issues" }
    - { icon: "document", title: "Contribuer à Nosia", text: "Découvrir comment participer", url: "https://github.com/dilolabs/nosia/blob/main/CONTRIBUTING.md" }
    - { icon: "people", title: "Nos règles d’échange", text: "Consulter le code de conduite", url: "https://github.com/dilolabs/nosia/blob/main/CODE_OF_CONDUCT.md" }
  documentation_title: "Pour aller plus loin"
  documentation_intro: "Vous souhaitez installer Nosia pour une équipe ou le connecter à vos outils ? Ces ressources techniques s’adressent aux personnes qui configurent et maintiennent le logiciel."
  documentation:
    - { icon: "deploy", title: "Installer pour une équipe", text: "Guide de déploiement", url: "https://github.com/dilolabs/nosia/blob/main/docs/DEPLOYMENT.md" }
    - { icon: "architecture", title: "Comprendre le fonctionnement", text: "Architecture du logiciel", url: "https://github.com/dilolabs/nosia/blob/main/docs/ARCHITECTURE.md" }
    - { icon: "activity", title: "Suivre le fonctionnement", text: "Documentation d’observabilité", url: "https://github.com/dilolabs/nosia/blob/main/docs/OBSERVABILITY.md" }
    - { icon: "architecture", title: "Voir les schémas techniques", text: "Diagrammes du système", url: "https://github.com/dilolabs/nosia/blob/main/docs/DIAGRAMS.md" }
    - { icon: "list", title: "Toutes les ressources", text: "Index de la documentation", url: "https://github.com/dilolabs/nosia/tree/main/docs" }
  comparisons_title: "Comparer les solutions"
  comparisons_intro: "Pour approfondir les différences avec d’autres outils d’intelligence artificielle."
  comparisons:
    - { label: "Nosia et ChatGPT / OpenAI", url: "/nosia-vs-openai/" }
    - { label: "Nosia et Ollama", url: "/nosia-vs-ollama/" }
  demo_title: "La démonstration technique"
  demo_intro: "Une présentation antérieure de Nosia, pour aller plus loin. Pour installer la nouvelle application Mac, suivez le guide et la vidéo ci-dessus."
  demo_link: "Voir la démonstration sur YouTube"
  license: "Sous licence"
  website: "Site web"
```

Bloc à ajouter sous `en` :

```yaml
  quote: "The right to understand a system, adapt it, and be able to switch to another."
  commitment_link: "Read our commitment"
  features_title: "Make your knowledge easier to use"
  features_intro: "At work, in an association or for your own projects: start with a practical need."
  features:
    - { icon: "document", title: "Prepare a piece of writing", text: "Find a starting point for a letter, develop an idea or make a text clearer." }
    - { icon: "book", title: "Understand a document", text: "Import your documents and ask about their content in your own words." }
    - { icon: "chat", title: "Find information", text: "Explore your team’s knowledge without rereading every document." }
  caution: "AI can make mistakes. Check important answers against the original documents."
  usecases_title: "Have a practical need in mind?"
  usecases_intro: "See how Nosia can help a small business, an association or a team find information and pass on knowledge."
  usecases_link: "Explore use cases"
  faq_title: "You might be wondering"
  faq:
    - q: "Is Nosia free?"
      a: "Nosia is free to install and its code is open under the MIT license: anyone can read it, use it and contribute. This does not mean that every hosted service or support offering is free."
    - q: "Is my Mac compatible?"
      a: "The requirements in the guide above list the chip, macOS version and memory to plan for. Check your configuration in the Apple menu, then About This Mac. This app is not intended for Intel Macs."
    - q: "Where is my data stored?"
      a: "In the On this Mac workspace, AI runs on your computer and your conversations and documents are stored there. If you choose Nosia Cloud, another server or external connections, where data is processed depends on that workspace and its configuration."
    - q: "Why does the first launch download files?"
      a: "Setup downloads the resources needed to run AI on your Mac. It needs internet and may take time depending on your connection. Nosia shows progress and lets you cancel."
    - q: "Can I trust every answer?"
      a: "No. Like any AI, Nosia can make mistakes or misinterpret a document. Check important information and do not replace professional advice with an automatic answer."
    - q: "What happens when I close Nosia?"
      a: "Closing the window keeps Nosia running. Quitting the app stops its local services and saves your data for the next launch."
  story_title: "A human story"
  story:
    - "Nosia grew from a conviction shared by Cyril, Olivier, Aude and Melvin: technology should serve people, not the other way around."
    - "In 2024, Olivier introduced Cyril to a way of grounding AI answers in documents. Cyril came up with the name Nosia. Their aim: make these tools accessible while keeping control of the data."
    - "In June 2026, François, who runs the Kokori Kodo YouTube channel, created an early presentation video. Find it in the resources below on the French homepage."
  commitment_title: "Our commitment"
  commitment: "We defend the right to choose where our data is processed, which models we use, and how our tools evolve. The right to understand a system, adapt it, and be able to switch to another."
  community_title: "Need help or want to take part?"
  community_intro: "Ask questions, share your experience or contribute to the project. These conversations take place on GitHub."
  community:
    - { icon: "chat", title: "Ask a question", text: "Talk with the community", url: "https://github.com/dilolabs/nosia/discussions" }
    - { icon: "bug", title: "Report a problem", text: "Describe what is not working", url: "https://github.com/dilolabs/nosia/issues" }
    - { icon: "document", title: "Contribute to Nosia", text: "Find out how to take part", url: "https://github.com/dilolabs/nosia/blob/main/CONTRIBUTING.md" }
    - { icon: "people", title: "Our community guidelines", text: "Read the code of conduct", url: "https://github.com/dilolabs/nosia/blob/main/CODE_OF_CONDUCT.md" }
  documentation_title: "Going further"
  documentation_intro: "Want to install Nosia for a team or connect it to your tools? These technical resources are for people who configure and maintain the software."
  documentation:
    - { icon: "deploy", title: "Install for a team", text: "Deployment guide", url: "https://github.com/dilolabs/nosia/blob/main/docs/DEPLOYMENT.md" }
    - { icon: "architecture", title: "Understand how it works", text: "Software architecture", url: "https://github.com/dilolabs/nosia/blob/main/docs/ARCHITECTURE.md" }
    - { icon: "activity", title: "Monitor the software", text: "Observability documentation", url: "https://github.com/dilolabs/nosia/blob/main/docs/OBSERVABILITY.md" }
    - { icon: "architecture", title: "View technical diagrams", text: "System diagrams", url: "https://github.com/dilolabs/nosia/blob/main/docs/DIAGRAMS.md" }
    - { icon: "list", title: "All resources", text: "Documentation index", url: "https://github.com/dilolabs/nosia/tree/main/docs" }
  comparisons_title: "Compare the options"
  comparisons_intro: "Take a closer look at how Nosia differs from other artificial intelligence tools."
  comparisons:
    - { label: "Nosia and ChatGPT / OpenAI", url: "/en/nosia-vs-openai/" }
    - { label: "Nosia and Ollama", url: "/en/nosia-vs-ollama/" }
  demo_title: "The technical demonstration"
  demo_intro: "An earlier look at Nosia, for further exploration. To install the new Mac app, use the guide and video above."
  demo_link: "Open the existing demonstration"
  license: "Licensed under"
  website: "Website"
```

- [ ] **Step 4: Créer `_includes/home-content.html`.** Les noms d’icônes `document`, `book`, `chat`, `bug`, `people`, `deploy`, `architecture`, `activity`, `list` ont été vérifiés dans `_includes/icon.html` ; réutiliser cet include sans ajouter de bibliothèque.

```liquid
{%- assign home = site.data.home[page.lang] -%}
{%- assign t = site.data.translations[page.lang] -%}
<section id="description" class="description home-content">
  <div class="container">
    <figure class="home-quote">
      <blockquote><p>{{ home.quote }}</p></blockquote>
      <figcaption><a href="{{ t.engagement_url | relative_url }}">{{ home.commitment_link }}</a></figcaption>
    </figure>
  </div>
</section>
<section id="features" class="features home-content">
  <div class="container">
    <h2>{{ home.features_title }}</h2>
    <p>{{ home.features_intro }}</p>
    <div class="grid">
      {% for feature in home.features %}
      <div class="card">
        <span class="icon">{% include icon.html name=feature.icon %}</span>
        <h3>{{ feature.title }}</h3><p>{{ feature.text }}</p>
      </div>
      {% endfor %}
    </div>
    <p class="ai-caution">{{ home.caution }}</p>
  </div>
</section>
<section id="use-cases-teaser" class="description home-content">
  <div class="container">
    <h2>{{ home.usecases_title }}</h2><p>{{ home.usecases_intro }}</p>
    <a href="{{ t.usecases_url | relative_url }}" class="btn">{{ home.usecases_link }}</a>
  </div>
</section>
{% include home-installation.html %}
<section id="faq" class="features home-content">
  <div class="container">
    <h2>{{ home.faq_title }}</h2>
    <div class="faq-list">
      {% for item in home.faq %}
      <details class="faq-item"><summary><h3>{{ item.q }}</h3></summary><p>{{ item.a }}</p></details>
      {% endfor %}
    </div>
  </div>
</section>
{% include home-resources.html %}
```

- [ ] **Step 5: Créer `_includes/home-resources.html`.**

```liquid
{%- assign home = site.data.home[page.lang] -%}
{%- assign t = site.data.translations[page.lang] -%}
<section id="story" class="story highlighted home-content">
  <div class="container">
    <h2>{{ home.story_title }}</h2>
    <div class="story-content">{% for paragraph in home.story %}<p>{{ paragraph }}</p>{% endfor %}</div>
  </div>
</section>
<section id="commitment-teaser" class="description home-content">
  <div class="container">
    <h2>{{ home.commitment_title }}</h2><p>{{ home.commitment }}</p>
    <a href="{{ t.engagement_url | relative_url }}" class="btn">{{ home.commitment_link }}</a>
  </div>
</section>
<section id="community" class="community home-content">
  <div class="container">
    <h2>{{ home.community_title }}</h2><p>{{ home.community_intro }}</p>
    <div class="grid">
      {% for resource in home.community %}
      <a href="{{ resource.url }}" class="card" target="_blank" rel="noopener noreferrer">
        <span class="icon">{% include icon.html name=resource.icon %}</span>
        <h3>{{ resource.title }}</h3><p>{{ resource.text }}</p>
      </a>
      {% endfor %}
    </div>
  </div>
</section>
<section id="documentation" class="documentation home-content">
  <div class="container">
    <h2>{{ home.documentation_title }}</h2><p>{{ home.documentation_intro }}</p>
    <div class="grid">
      {% for resource in home.documentation %}
      <a href="{{ resource.url }}" class="card" target="_blank" rel="noopener noreferrer">
        <span class="icon">{% include icon.html name=resource.icon %}</span>
        <h3>{{ resource.title }}</h3><p>{{ resource.text }}</p>
      </a>
      {% endfor %}
    </div>
  </div>
</section>
<section id="comparisons-teaser" class="features home-content">
  <div class="container">
    <h2>{{ home.comparisons_title }}</h2><p>{{ home.comparisons_intro }}</p>
    <div class="cta-group">
      {% for comparison in home.comparisons %}<a href="{{ comparison.url | relative_url }}" class="btn">{{ comparison.label }}</a>{% endfor %}
    </div>
  </div>
</section>
<section id="demo" class="demo home-content">
  <div class="container">
    <h2>{{ home.demo_title }}</h2><p>{{ home.demo_intro }}</p>
    {% if page.lang == 'fr' %}
    <a class="btn" href="https://www.youtube.com/watch?v=HD5k-LjGvGw" target="_blank" rel="noopener noreferrer">{{ home.demo_link }}</a>
    {% else %}
    <a class="btn" href="{{ '/assets/images/nosia-demo.gif' | relative_url }}">{{ home.demo_link }}</a>
    {% endif %}
  </div>
</section>
<footer class="footer">
  <div class="container">
    <p>Copyright © 2024-2026 Dilolabs</p>
    <p class="links">{{ home.license }} <a href="https://github.com/dilolabs/nosia/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT</a></p>
    <div class="links">
      <a href="https://nosia.ai">{{ home.website }}</a>
      <a href="https://blog.nosia.ai/" target="_blank" rel="noopener noreferrer">Blog</a>
      <a href="https://github.com/dilolabs/nosia" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://hub.docker.com/r/dilolabs/nosia" target="_blank" rel="noopener noreferrer">Docker Hub</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 6: Remplacer les deux fichiers d’accueil par leur composition finale.**

`index.md` :

```liquid
---
layout: default
lang: fr
ref: home
permalink: /
title: Accueil
seo_title: "Nosia — Votre assistant IA sur Mac, vos données sous votre contrôle"
seo_description: "Écrivez, explorez vos documents et gardez la main sur vos données avec Nosia. Installez l’application Mac en suivant des étapes guidées, sans commande Terminal."
schema: [SoftwareApplication, FAQPage]
---

{% include home-hero.html %}
{% include home-content.html %}
```

`index-en.md` :

```liquid
---
layout: default
lang: en
ref: home
permalink: /en/
redirect_from:
  - /index-en.html
title: Home
seo_title: "Nosia — Your AI assistant on Mac, your data under your control"
seo_description: "Write, explore your documents and stay in control of your data with Nosia. Install the Mac app with guided steps and no Terminal commands."
schema: [SoftwareApplication, FAQPage]
---

{% include home-hero.html %}
{% include home-content.html %}
```

- [ ] **Step 7: Adapter le JSON-LD dans `_includes/structured-data.html`.**

Remplacer uniquement ces valeurs du bloc `SoftwareApplication` :

```diff
-  "applicationCategory": "DeveloperApplication",
-  "operatingSystem": "Linux, macOS, Windows",
+  "applicationCategory": "ProductivityApplication",
+  "operatingSystem": "macOS, Linux, Windows",
```

Remplacer le bloc `FAQPage` complet par :

```liquid
{%- assign faq_items = page.faq -%}
{%- if page.ref == 'home' -%}
  {%- assign home = site.data.home[page.lang] -%}
  {%- assign faq_items = home.faq -%}
{%- endif -%}
{%- if page.schema contains "FAQPage" and faq_items -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {%- for item in faq_items -%}
    {
      "@type": "Question",
      "name": {{ item.q | jsonify }},
      "acceptedAnswer": { "@type": "Answer", "text": {{ item.a | jsonify }} }
    }{%- unless forloop.last -%},{%- endunless -%}
    {%- endfor -%}
  ]
}
</script>
{%- endif -%}
```

Conserver le JSON-LD Organization et BreadcrumbList à l’identique. Les FAQ dédiées continuent à utiliser `page.faq`.

- [ ] **Step 8: Remplacer seulement les deux réponses concernées dans chacune des FAQ dédiées.**

Dans `faq.md`, conserver les intitulés et les autres entrées, et remplacer ces couples :

```yaml
  - q: "Comment installer Nosia ?"
    a: "Sur un Mac avec puce Apple M1 ou ultérieure, utilisez l’application native : téléchargez le fichier DMG depuis la version 0.6.1, glissez Nosia dans Applications, ouvrez l’app puis cliquez sur Préparer Nosia. Le guide de l’accueil détaille les étapes. Linux et Windows disposent aussi d’installations en ligne de commande."
  - q: "Quelle est la configuration matérielle requise ?"
    a: "L’application Mac v0.6.1 nécessite une puce Apple M1 ou ultérieure et macOS 26.5 ou ultérieur. Prévoyez 16 Go de mémoire ou plus pour l’IA fournie, internet pour télécharger plusieurs gigaoctets lors de la préparation et de l’espace pour vos documents. Pour les autres installations, les besoins dépendent du modèle choisi."
```

Dans `en/faq.md` :

```yaml
  - q: "How do I install Nosia?"
    a: "On a Mac with Apple M1 or later, use the native app: download the DMG from version 0.6.1, drag Nosia into Applications, open the app and click Set Up Nosia. The homepage guide explains each step. Linux and Windows also have command-line installation methods."
  - q: "What are the hardware requirements?"
    a: "The Mac app v0.6.1 requires Apple M1 or later and macOS 26.5 or later. Plan for 16 GB of memory or more for the included AI configuration, internet to download several gigabytes during setup, and space for your documents. Requirements for other installations depend on the model you choose."
```

Les intitulés reproduits ci-dessus correspondent aux fichiers vérifiés. Remplacer les deux valeurs `a` en place, sans déplacer les questions ni créer de nouvelle entrée.

- [ ] **Step 9: Ajouter les styles éditoriaux ciblés.**

```css
.home-quote { margin: 0; padding: var(--space-6); border-left: 3px solid var(--accent-strong); border-radius: var(--radius-lg); background: var(--surface-card); }
#description .home-quote p { font-size: var(--text-xl); max-width: 65ch; }
.home-quote figcaption { margin-top: var(--space-4); }
.home-content .ai-caution { margin-top: var(--space-6); color: var(--text-muted); font-size: var(--text-sm); }
.home-content :is(blockquote, .card, .story-content) { overflow-wrap: anywhere; }
.home-content :is(h2, h3) { text-wrap: balance; }
.home-content#demo h2 { text-align: left; }
.home-content#demo .btn { min-height: 44px; }
```

- [ ] **Step 10: Reconstruire, exécuter les tests ciblés et vérifier les liens avant commit.**

```bash
bin/verify
node --test test/home-macos.test.mjs
git diff --check
git add _data/home.yml _includes/home-content.html _includes/home-resources.html _includes/structured-data.html index.md index-en.md faq.md en/faq.md assets/css/developer.css test/home-macos.test.mjs
git commit -m "feat: make the bilingual homepage understandable to everyone"
```

Attendu : tests ciblés et liens internes verts ; FAQ JSON-LD strictement identique à la FAQ d’accueil affichée ; tous les anciens IDs publics conservés, mais dans le nouvel ordre approuvé.

## Task 4: Accessibilité, adaptation et migration des tests historiques

**Files:** Modify `test/home-macos.test.mjs`, `test/site-ui.test.mjs`, `assets/css/developer.css`.

- [ ] **Step 1: Ajouter les vérifications d’adaptation et de navigation à `test/home-macos.test.mjs`.**

```js
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
          await browser.evaluate('document.querySelector("#quickstart").scrollIntoView({ block: "start", behavior: "instant" })');
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
      await browser.cdp('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: type === 'keyDown' ? '\r' : undefined });
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
          video.addEventListener('error', () => { clearTimeout(timeout); resolve(true); }, { once: true });
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
```

- [ ] **Step 2: Reconstruire et observer le résultat avant le correctif de défilement.**

```bash
bundle exec jekyll build --baseurl ""
node --test test/home-macos.test.mjs
node --test test/site-ui.test.mjs
```

Attendu : la navigation vers les installations secondaires expose l’absence de marge sous l’en-tête fixe ; les anciens tests d’accueil échouent encore sur le Terminal, l’ordre, les couleurs du bandeau et la démo intégrée. Les tests du plaidoyer et du lecteur réel doivent rester verts. Ne pas corriger une attente obsolète en réintroduisant une commande ou un iframe.

- [ ] **Step 3: Migrer les trois tests historiques de parcours dans `test/site-ui.test.mjs`.** Remplacer les tests nommés `all platform commands remain visible without JavaScript`, `developer-first home preserves anchors, moves installation forward, and keeps Windows exact` et `installation command is visible in the first small-phone viewport` par les blocs suivants.

```js
test('secondary platform commands remain available without JavaScript', async () => {
  await browser.visit('/', { javascript: false });
  assert.equal(await browser.evaluate('document.querySelector("#other-installations").open'), false);
  await browser.evaluate('document.querySelector("#other-installations > summary").click()');
  assert.equal(await browser.evaluate('document.querySelectorAll("#quickstart [data-command]").length'), 2);
  assert.equal(await browser.evaluate('document.querySelector("#install-unix").checkVisibility()'), true);
  assert.equal(await browser.evaluate('document.querySelector("#install-windows").textContent'), 'irm https://get.nosia.ai/install.ps1 | iex');
  assert.equal(await browser.evaluate('[...document.querySelectorAll("[data-copy-target]")].every(button => getComputedStyle(button).display === "none")'), true);
});

test('public home preserves anchors and prioritizes native Mac installation', async () => {
  const ids = ['description', 'features', 'use-cases-teaser', 'quickstart', 'faq', 'story', 'commitment-teaser', 'community', 'documentation', 'comparisons-teaser', 'demo'];
  for (const path of ['/', '/en/']) {
    await browser.visit(path);
    assert.deepEqual(await browser.evaluate('[...document.querySelectorAll("main > section[id]")].map(section => section.id)'), ids);
    assert.equal(await browser.evaluate('document.querySelectorAll(".home-hero [data-command], #hero-install").length'), 0);
    assert.equal(await browser.evaluate('document.querySelector("#install-windows").textContent'), 'irm https://get.nosia.ai/install.ps1 | iex');
    assert.equal(await browser.evaluate('document.querySelector(".home-download").href'), 'https://github.com/dilolabs/nosia/releases/download/v0.6.1/Nosia-Native-arm64.dmg');
  }
});

test('Mac download and requirements are visible in the first small-phone viewport', async () => {
  for (const path of ['/', '/en/']) {
    await browser.visit(path, { width: 375, height: 812 });
    assert.equal(await browser.evaluate('document.querySelector(".home-download").getBoundingClientRect().bottom <= innerHeight'), true);
    assert.equal(await browser.evaluate('document.querySelector("#hero-requirements").getBoundingClientRect().bottom <= innerHeight'), true);
  }
});
```

- [ ] **Step 4: Ouvrir le bloc secondaire avant les tests de copie et de focus existants.** Ajouter cette fonction après les hooks `before`/`after` de `test/site-ui.test.mjs` :

```js
async function revealOtherInstallations() {
  await browser.evaluate('document.querySelector("#other-installations").open = true');
}
```

Faire ces quatre insertions, sans modifier les autres assertions des tests :

```diff
 test('command copying reports success only after the write succeeds', async () => {
   await browser.visit('/');
+  await revealOtherInstallations();
```

```diff
 test('clipboard rejection and unavailable API preserve selectable code and explain failure', async () => {
   for (const clipboard of ['{ writeText: async () => { throw new Error("denied"); } }', 'undefined']) {
     await browser.visit('/en/');
+    await revealOtherInstallations();
```

Dans `keyboard skip link, menu and command copying retain meaningful focus`, juste après l’assertion du retour de focus au menu avec Escape :

```diff
   await pressKey('Escape');
   assert.equal(await browser.evaluate('document.activeElement.hasAttribute("data-menu-toggle")'), true);
+  await revealOtherInstallations();
   await browser.evaluate(`
     Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } });
     document.querySelector('[data-copy-target]').focus();
```

Dans `responsive navigation transfers focus instead of hiding the active control`, juste avant la focalisation de la commande :

```diff
   assert.equal(await browser.evaluate('document.querySelector("#primary-nav").contains(document.activeElement)'), true);
+  await revealOtherInstallations();
   await browser.evaluate('document.querySelector("[data-copy-target]").focus()');
```

- [ ] **Step 5: Remplacer les attentes de contraste, de démo et de couleur du bandeau.**

Dans le test de contraste existant, remplacer uniquement la déclaration `const selectors = ...` à l’intérieur de `browser.evaluate` par :

```js
const selectors = ['.home-eyebrow', '.home-intro', '.home-summary', '.home-privacy', '.home-actions .btn', '.home-install-link', '.home-other-link', '.mac-requirements', '.mac-video figcaption', '.mac-preflight p', '.other-installations > summary', '#features > .container > p', '#features .card p', '#quickstart p', '#quickstart .copy-button', '#commitment-teaser p', '#commitment-teaser .btn', '.footer p', '.footer .links a', '.header-controls .lang-toggle', '.header .mobile-deploy'];
```

Conserver le calcul de composition des couleurs et le seuil **4,5:1**, sans filtre qui exclut une nouvelle zone.

Remplacer le test `below-fold demos defer loading in both languages` par :

```js
test('technical demos remain linked without loading a second player', async () => {
  for (const path of ['/', '/en/']) {
    await browser.visit(path);
    assert.equal(await browser.evaluate('document.querySelectorAll("#demo iframe, #demo img").length'), 0);
    assert.equal(await browser.evaluate('document.querySelector("#demo a").checkVisibility()'), true);
    assert.equal(await browser.evaluate('document.querySelector(".mac-video video").preload'), 'none');
  }
});
```

Dans la boucle des tests `responsive ${path} ${theme} ${width}x${height}`, remplacer le groupe d’assertions du bandeau par :

```js
const heroBackground = await browser.evaluate('getComputedStyle(document.querySelector(".home-hero")).backgroundColor');
const expectedBackground = await browser.evaluate('getComputedStyle(document.body).backgroundColor');
assert.equal(heroBackground, expectedBackground);
assert.equal(await browser.evaluate('document.documentElement.classList.contains("dark")'), theme === 'dark');
assert.equal(await browser.evaluate('document.querySelectorAll("#hero-install").length'), 0);
assert.equal(await browser.evaluate('document.querySelector(".home-download").href'), 'https://github.com/dilolabs/nosia/releases/download/v0.6.1/Nosia-Native-arm64.dmg');
```

Conserver l’assertion de non-débordement, les captures, la matrice de tailles et les autres tests. Conserver également les tests de fonds uniformes : les sections restent sur `--bg-app`, les encarts sur `--surface-card`.

- [ ] **Step 6: Ajouter le correctif de défilement et les couleurs des liens du bandeau.**

```css
.home-hero, .home-content[id], .home-installation, #other-installations { scroll-margin-top: 7rem; }
.home-install-link, .home-other-link { color: var(--accent-strong); }
.dark :is(.home-install-link, .home-other-link) { color: var(--accent-soft-text); }
```

Ne pas supprimer la règle globale `:focus-visible`, les points d’entrée clavier ou les styles `prefers-reduced-motion`. Ne pas réduire le texte à une taille illisible pour faire passer un test de viewport : examiner les espacements et retours à la ligne si ce test révèle une régression réelle.

- [ ] **Step 7: Reconstruire, relancer toute la suite et committer seulement après lecture des résultats.**

```bash
bin/verify
node --test test/*.test.mjs
git diff --check
git add test/home-macos.test.mjs test/site-ui.test.mjs assets/css/developer.css
git commit -m "test: verify the accessible Mac-first homepage journey"
```

Attendu : aucune erreur Jekyll ou de lien interne ; tous les tests passent, y compris la copie différée, l’échec du presse-papiers, le clavier, les thèmes, les vidéos réelles et le texte intégral des deux plaidoyers.

## Task 5: Revue finale et livraison vérifiée

**Files:** Review all files changed by tasks 1–4; update only the completion checkboxes and evidence notes in `docs/superpowers/plans/2026-11-04-home-macos.md`.

- [ ] **Step 1: Réexécuter la construction et les vérifications finales avec captures locales.**

```bash
bin/verify
NOSIA_SCREENSHOTS=/tmp/opencode/nosia-home-macos-review node --test test/*.test.mjs
git diff --check
```

Attendu : toutes les commandes réussissent. Les captures des nouveaux tests distinguent bandeau et guide pour FR/EN, 320/375/768/1280 px, clair/sombre. Ouvrir des captures réelles avec l’outil de lecture d’images ; ne pas conclure sur leur seule existence.

- [ ] **Step 2: Examiner les captures et les textes français/anglais.** Vérifier concrètement : titre et sens du produit lisibles, pas de sigles développeur au premier écran, CTA et prérequis proches, mots « français » / « French » sur la vidéo, vidéo non étirée, commandes repliées mais retrouvables, contenu non masqué par l’en-tête ou le retour en haut. Si un défaut est détecté, ajouter une assertion ciblée avant son correctif et relancer les commandes de l’étape 1.

- [ ] **Step 3: Contrôler les médias et l’absence de modifications hors périmètre.**

```bash
sha256sum assets/films/nosia-macos-installation-fr-v0.6.1.mp4 assets/films/nosia-film-fr-1280x720.mp4 assets/films/nosia-film-en-1280x720.mp4
git diff 7658dd0 -- engagement.md en/commitment.md assets/films/nosia-film-fr-1280x720.mp4 assets/films/nosia-film-en-1280x720.mp4 assets/js/site.js _config.yml
git diff --stat 7658dd0
git status --short
```

Empreintes attendues :

```text
8dce9f8f0df93566062cd72b3f60028e2f28bba6073097d6d82113c67a2bc9e5  assets/films/nosia-macos-installation-fr-v0.6.1.mp4
a9594fe0210b43b4c37ec2c72f4b9aadbf8cccaa3376810bc23f65aab2221284  assets/films/nosia-film-fr-1280x720.mp4
555119709423bde13efab6b27009c21952b35d0acbc07f82ec77e6290f61dab5  assets/films/nosia-film-en-1280x720.mp4
```

Le diff ciblé doit être vide. Si de nouveaux changements utilisateur sont présents, les identifier et les préserver ; ne pas rétablir ces fichiers automatiquement.

- [ ] **Step 4: Relire le diff d’implémentation contre la spécification.** Cette revue peut être faite en session ; une revue par agent nécessite le mode d’exécution choisi par l’utilisateur. Vérifier les points de la matrice ci-dessous et corriger les défauts constatés sans refonte supplémentaire.

- [ ] **Step 5: Cocher les tâches réellement terminées et consigner les commandes finales, leur résultat et les limites constatées dans le journal d’exécution.** Ne pas préremplir une réussite. Ajouter chaque entrée sous la forme : date, commande exacte, nombre de tests réussis/échoués, emplacement des captures et éventuel blocage de lecture vidéo.

- [ ] **Step 6: Présenter le résultat sans publier ni pousser automatiquement.** Donner le changement visible, les tests réellement exécutés, l’emplacement des captures et tout défaut restant. Ne pas annoncer un déploiement en production, une compatibilité matérielle testée sur Mac ou une lecture sous Safari si seuls les tests Chromium locaux ont été exécutés.

## Matrice de couverture de la spécification

| Exigence | Réalisation et preuve |
| --- | --- |
| Direction C et deux langues | Tâches 1/3 ; titre, citation exacte, ordre des sections et liens FR/EN testés |
| Explication sans jargon, bénéfices concrets | Bandeau et trois cartes en tâches 1/3 ; test d’absence de RAG/MCP/API de développeur au bandeau et revue des textes |
| macOS avant Linux/Windows | Guide et `<details>` de tâche 2 ; ordre du DOM et commandes exactes testés |
| v0.6.1 et compatibilité exacte | Données communes et prérequis de tâche 1, testés près du téléchargement |
| Installation sans Terminal sur Mac | Cinq étapes localisées, libellés officiels et prérequis de tâche 2 |
| Internet, téléchargements, autorisations | Textes de tâche 2 et FAQ de tâche 3 ; contrôle du guide et du Trousseau/Keychain |
| Vidéo française intégrée sans chargement automatique | Tâche 2 ; tâches 2/4 testent attributs, absence de requête, lecture réelle, déplacement et repli |
| Bonne proportion vidéo | Métadonnées 1048×720 ; CSS de tâche 2 et matrice de tailles de tâche 4 |
| Guide indépendant de la vidéo et de JavaScript | Tests sans JS et test de média bloqué en tâches 2/4 |
| Confidentialité qualifiée par espace | Bandeau/FAQ des tâches 1/3 ; relecture explicite en tâche 5 |
| Limites de l’IA et fermeture de l’app | Avertissement, FAQ et textes des tâches 1/3 |
| Ressources techniques et démo en second plan | Composition de tâche 3, absence de second lecteur testée |
| Métadonnées et FAQ structurée cohérentes | Tâche 3 ; égalité JSON-LD/FAQ visible, canonicals et catégorie productivité |
| Corrections limitées des FAQ dédiées | Deux réponses par langue en tâche 3 ; autres sujets conservés |
| Ancres, copies, navigation, thèmes, clavier, mobile | Migration ciblée et suite complète de tâche 4 |
| Plaidoyer et films inchangés | Suite historique conservée et empreintes/diff de tâche 5 |

## Auto-revue du plan

- Couverture confrontée à la spécification : chaque exigence est reliée à une tâche dans la matrice ci-dessus.
- Les neuf blocs JavaScript du plan passent `node --check --input-type=module` ; les quatre blocs constituant le nouveau fichier de tests passent aussi après concaténation.
- Les huit fragments YAML effectifs sont syntaxiquement valides ; les clés FR/EN correspondent, les références Liquid `home.*` et `macos.*` sont définies et les noms d’icônes existent.
- Aucune section incomplète ni incohérence de nom identifiée. Ces contrôles valident le document et sa syntaxe, pas le fonctionnement d’une implémentation qui n’a pas encore été réalisée.

## Journal d’exécution

Aucune tâche d’implémentation n’a été exécutée lors de la rédaction du plan. Les seules vérifications déjà réalisées sont la baseline de 58 tests et l’inspection du MP4 décrites dans le contexte initial.
