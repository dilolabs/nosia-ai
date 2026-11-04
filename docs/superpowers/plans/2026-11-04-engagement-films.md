# Engagement Films Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Continue inline, without subagents, following the user's earlier execution choice for this ongoing integration.

**Goal:** Afficher le film français et le film anglais sous le titre des pages du plaidoyer, avec lecture volontaire et sans modifier les textes.

**Architecture:** Un include Liquid partagé reçoit l’URL vidéo depuis le front matter et ses libellés depuis les traductions. Le lecteur HTML natif et sa légende utilisent des styles limités à `.engagement-film`. Un fichier de tests dédié vérifie le balisage, l’absence de préchargement, la mise en page et la lecture réelle des MP4.

**Tech Stack:** Jekyll/Liquid, HTML vidéo natif, CSS existant, Node.js test runner et Chromium/CDP.

---

## Contexte et fichiers

Spécification approuvée : `docs/superpowers/specs/2026-11-04-engagement-films-design.md`.

Continuer sur la branche existante `plaidoyer`, dans le répertoire courant. Ne pas réencoder les vidéos, créer un worktree, modifier les accueils, changer le JavaScript public ou ajouter une dépendance. Le choix d’exécution en session est déjà établi.

| Fichier | Responsabilité |
| --- | --- |
| `_includes/engagement-film.html` (nouveau) | Figure vidéo et lien direct de repli |
| `engagement.md`, `en/commitment.md` | URL du film dans le front matter et inclusion après le titre |
| `_data/translations.yml` | Nom accessible et lien de repli FR/EN |
| `assets/css/developer.css` | Présentation adaptative du lecteur et de sa légende |
| `test/engagement-films.test.mjs` (nouveau) | Tests dédiés de balisage, affichage et lecture |
| `test/support/browser.mjs` | Type MIME MP4 sur le serveur de tests |
| `assets/films/nosia-film-fr-1280x720.mp4`, `assets/films/nosia-film-en-1280x720.mp4` | Médias utilisateur à intégrer tels quels |

Les médias font respectivement 22 132 723 et 21 497 782 octets. Chaque film dure 84 secondes, en H.264, 1280×720. Empreintes initiales :

```text
a9594fe0210b43b4c37ec2c72f4b9aadbf8cccaa3376810bc23f65aab2221284  assets/films/nosia-film-fr-1280x720.mp4
555119709423bde13efab6b27009c21952b35d0acbc07f82ec77e6290f61dab5  assets/films/nosia-film-en-1280x720.mp4
```

## Task 1: Lecteur partagé et intégration bilingue

- [x] **Step 1: Créer `test/engagement-films.test.mjs` avec les tests suivants.**

```js
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
```

- [x] **Step 2: Construire le site et observer les échecs avant l’implémentation.**

Run `bundle exec jekyll build --baseurl ""`, puis `node --test test/engagement-films.test.mjs`.

Expected: quatre tests en échec car les pages ne comportent pas encore de vidéo. Résoudre un éventuel problème de démarrage Chromium avant de considérer ce résultat comme le rouge attendu.

- [x] **Step 3: Créer `_includes/engagement-film.html` avec ce balisage.**

```liquid
{%- assign film_text = site.data.translations[page.lang] -%}
<figure class="engagement-film">
  <video controls playsinline preload="none" width="1280" height="720" aria-label="{{ film_text.engagement_film_label }}">
    <source src="{{ page.film | relative_url }}" type="video/mp4">
  </video>
  <figcaption><a href="{{ page.film | relative_url }}">{{ film_text.engagement_film_open }}</a></figcaption>
</figure>
```

- [x] **Step 4: Ajouter les libellés dans `_data/translations.yml`.** À proximité des clés d’engagement françaises :

```yaml
  engagement_film_label: "Le film de notre engagement"
  engagement_film_open: "Ouvrir la vidéo"
```

À proximité des clés anglaises :

```yaml
  engagement_film_label: "Our commitment film"
  engagement_film_open: "Open the video"
```

- [x] **Step 5: Ajouter le champ `film` au front matter de chaque page et inclure la figure juste après son h1.** Dans `engagement.md` :

```yaml
film: /assets/films/nosia-film-fr-1280x720.mp4
```

Dans `en/commitment.md` :

```yaml
film: /assets/films/nosia-film-en-1280x720.mp4
```

Après le h1 et avant le premier paragraphe, dans les deux fichiers :

```liquid
  {% include engagement-film.html %}
```

- [x] **Step 6: Ajouter ces styles à la fin de `assets/css/developer.css`.**

```css
.engagement-film { margin-bottom: var(--space-8); }

.engagement-film video {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-xl);
  background: var(--neutral-950);
}

.engagement-film figcaption {
  margin-top: var(--space-3);
  font-size: var(--text-sm);
}
```

- [x] **Step 7: Reconstruire et relancer les quatre tests.**

Run `bundle exec jekyll build --baseurl ""`, puis `node --test test/engagement-films.test.mjs`.

Expected: tous passent, sans modification des paragraphes existants ni chargement du MP4 avant lecture. Les états réseau EMPTY et IDLE sont acceptés ; seul un chargement effectif avant activation est interdit.

- [x] **Step 8: Vérifier le diff puis créer un commit ciblé incluant explicitement les deux médias fournis.**

Run `git diff --check`, puis `git add -- _includes/engagement-film.html _data/translations.yml engagement.md en/commitment.md assets/css/developer.css test/engagement-films.test.mjs assets/films/nosia-film-fr-1280x720.mp4 assets/films/nosia-film-en-1280x720.mp4`, puis `git commit -m "feat: embed bilingual commitment films"`.

## Task 2: Lecture réelle et serveur de tests

- [x] **Step 1: Ajouter les deux tests suivants dans la boucle `for (const film of films)` du fichier dédié.**

```js
  test(`film ${film.language} is served as MP4 and plays after a user gesture`, async () => {
    const response = await fetch(browser.origin + film.source, { method: 'HEAD' });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'video/mp4');
    await browser.visit(film.path);
    const playback = await browser.cdp('Runtime.evaluate', {
      expression: `new Promise((resolve, reject) => {
        const video = document.querySelector('.engagement-film video');
        function cleanup() {
          video.removeEventListener('timeupdate', progressed);
          video.removeEventListener('error', failed);
        }
        function progressed() {
          if (video.currentTime >= .1) {
            const state = {
              time: video.currentTime, duration: video.duration,
              width: video.videoWidth, height: video.videoHeight,
              frames: video.getVideoPlaybackQuality().totalVideoFrames,
              paused: video.paused
            };
            video.pause();
            cleanup();
            resolve(state);
          }
        }
        function failed(error) {
          cleanup();
          reject(new Error(video.error?.message || error?.message || 'Video playback failed'));
        }
        video.addEventListener('timeupdate', progressed);
        video.addEventListener('error', failed);
        video.play().catch(failed);
      })`,
      userGesture: true, awaitPromise: true, returnByValue: true
    });
    assert.equal(playback.exceptionDetails, undefined, JSON.stringify(playback.exceptionDetails));
    const state = playback.result.value;
    assert.equal(state.width, 1280);
    assert.equal(state.height, 720);
    assert.ok(state.duration > 0);
    assert.ok(state.time >= .1);
    assert.ok(state.frames > 0);
    assert.equal(state.paused, false);
  });
```

- [x] **Step 2: Observer le rouge attendu sur le MIME.**

Run `node --test --test-name-pattern='served as MP4' test/engagement-films.test.mjs`.

Expected: FAIL, `application/octet-stream` au lieu de `video/mp4`, car le serveur de test ne connaît pas encore l’extension.

- [x] **Step 3: Ajouter `.mp4` dans le tableau `types` de `test/support/browser.mjs`.**

```js
    '.mp4': 'video/mp4',
```

Le serveur de tests sait servir un fichier complet. Ne pas ajouter de traitement Range sans constater un besoin réel : la production reste l’hébergement statique existant. Si le décodage échoue, analyser l’erreur et signaler une incompatibilité au lieu de contourner le test avec une réussite fictive.

- [x] **Step 4: Relancer la lecture réelle et toute la suite.**

Run `node --test test/engagement-films.test.mjs test/site-ui.test.mjs`.

Expected: les six tests média et les 50 tests existants passent. Chaque film charge ses métadonnées puis produit des images décodées et une progression temporelle après activation utilisateur simulée ; la lecture est ensuite mise en pause.

- [x] **Step 5: Créer le commit de tests vérifiés.**

Run `git diff --check`, puis `git add -- test/engagement-films.test.mjs test/support/browser.mjs`, puis `git commit -m "test: verify real commitment film playback"`.

## Task 3: Vérification finale et restitution

Observation d’environnement : un `jekyll serve --host 0.0.0.0 --port 4000` préexistant régénère également `_site/`. Une exécution intermédiaire a donc lu des canonicals de prévisualisation (`http://0.0.0.0:4000/`) au lieu des URLs de production. Le diagnostic a confirmé que `_config.yml` conserve `https://nosia.ai`. Reconstruire juste avant les tests a rétabli les 56 réussites initiales sans modification de la configuration ni arrêt du serveur utilisateur.

Complément issu de la revue média : le démarrage fonctionnait, mais un essai de déplacement à deux secondes revenait à zéro. Le serveur de tests ignorait `Range` : une demande de 32 octets recevait le fichier complet (HTTP 200) et Chromium annonçait une plage déplaçable `[0, 0]`. Deux tests de requêtes partielles et une assertion de déplacement ont d’abord reproduit les échecs. Le support des plages simples, ouvertes et suffixes pour les MP4, avec réponses 206/416 et longueur de contenu, corrige le serveur de tests sans modifier l’hébergement de production. Les deux films ont ensuite été déplacés à deux secondes et leurs images FR/EN examinées. La suite finale comporte désormais 58 tests.

- [x] **Step 1: Charger `verification-before-completion`, relire la spec et vérifier que le diff est limité aux fichiers prévus.**
- [x] **Step 2: Exécuter `bin/verify`, puis `NOSIA_SCREENSHOTS=/tmp/opencode/nosia-films node --test test/engagement-films.test.mjs test/site-ui.test.mjs`.** Attendre une construction et des liens valides, ainsi que 58 tests réussis.
- [x] **Step 3: Examiner avec read les captures `/tmp/opencode/nosia-films/film-fr-light-375.png`, `film-en-dark-375.png` et `film-fr-light-1280.png`.** Vérifier le lecteur sous le titre, son cadre, le lien visible et la séparation du texte. L’écran noir avant lecture est attendu avec `preload="none"` et sans affiche fournie ; ne pas générer d’image sans demande.
- [x] **Step 4: Exécuter `sha256sum assets/films/nosia-film-fr-1280x720.mp4 assets/films/nosia-film-en-1280x720.mp4` et comparer aux empreintes initiales ci-dessus.** Les octets doivent être inchangés. Vérifier également que les deux fichiers existent dans `_site/assets/films/` après construction.
- [x] **Step 5: Exécuter `git diff --check` et `git status --short`, cocher ce plan et consigner les résultats.** Garder la branche `plaidoyer`, sans push, fusion ni déploiement.
- [x] **Step 6: Répondre en français avec les deux pages mises à jour, le comportement de lecture volontaire et les résultats effectivement vérifiés.**

## Résultats vérifiés

- Films intégrés sous le titre de `/engagement/` et `/en/commitment/`, chacun dans sa langue, via un include partagé ; aucun paragraphe du plaidoyer modifié.
- Contrôles natifs, lecture en ligne mobile, `preload="none"`, absence d’autoplay et de boucle, lien direct traduit disponible même sans JavaScript.
- `bin/verify` réussi : 14 fichiers HTML et 29 liens internes contrôlés. Avertissement connu et non bloquant : `IO::Buffer` expérimental dans html-proofer.
- `NOSIA_SCREENSHOTS=/tmp/opencode/nosia-films node --test test/engagement-films.test.mjs test/site-ui.test.mjs` : 58 tests réussis, aucun échec ni test ignoré.
- Lecture volontaire réellement décodée dans Chromium, progression temporelle et déplacement à deux secondes vérifiés pour les deux films. Métadonnées confirmées : 84 secondes, 1280×720.
- Captures examinées sur mobile clair/sombre, sur ordinateur et sur une image des deux films à deux secondes. Le lecteur reste dans la mesure de lecture sans déborder ni recouvrir le texte.
- Empreintes SHA-256 inchangées pour les deux sources et les deux fichiers générés dans `_site/assets/films/`.
- `git diff --check` réussi. Aucun ajout de JavaScript public, dépendance, affiche ou sous-titres générés, ni modification des accueils ou de la démonstration existante.
- Travail conservé sur `plaidoyer`, sans sous-agents, push, fusion, déploiement ou arrêt du serveur de développement utilisateur.
