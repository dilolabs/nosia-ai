# Nosia.ai SEO & GEO Content Improvement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Nosia.ai for organic search (SEO) and generative-engine optimization (GEO) by adding a reusable technical SEO foundation, rewriting the landing page, and adding a small set of high-value bilingual content pages.

**Architecture:** Foundation-first. Phase 1 builds reusable plumbing in Jekyll includes (per-page title/description/canonical, hreflang, JSON-LD), crawler files (`robots.txt`, `llms.txt`), a clean `/en/` URL structure with redirects, and rewrites the landing page + FAQ. Phase 2 adds use-cases and two comparison pages that inherit the foundation. French is the default at `/`; English lives under `/en/`. FR/EN pages are paired by a `ref` front-matter key that drives hreflang and the language toggle.

**Tech Stack:** Jekyll 4.3, GitHub Pages (custom build action), Liquid templating, `jekyll-sitemap`, `jekyll-feed`, `jekyll-redirect-from` (new), `html-proofer` (new, verification), Schema.org JSON-LD.

**Spec:** `docs/superpowers/specs/2026-06-18-nosia-seo-geo-design.md`

---

## How "testing" works in this plan

This is a static content site, so each task's "test" is a **verification command**, not a unit test. Three tools serve as the harness, established in Task 1:

1. **Build** — `bundle exec jekyll build --baseurl ""` must succeed (no Liquid/YAML errors).
2. **`html-proofer`** — validates generated HTML: broken internal links, malformed tags. Run against `_site/`.
3. **`grep` assertions** — confirm specific tags/strings appear in the generated `_site/` output (e.g. a canonical tag, an hreflang set, a JSON-LD block).

For each task: run the verification first to see it fail/absent, make the change, re-run to see it pass, then commit. Always build before grepping `_site/` (the build regenerates `_site/`).

---

## File structure

**New includes (focused, one responsibility each):**
- `_includes/seo-meta.html` — title, description, canonical, Open Graph, Twitter (per-page, front-matter-driven). Extracted out of `head.html`.
- `_includes/hreflang.html` — emits `alternate` hreflang tags by pairing pages via `ref`.
- `_includes/structured-data.html` — emits JSON-LD blocks selected by `page.schema` front matter.

**Modified:**
- `_includes/head.html` — slimmed to include the three new partials; theme/style/favicons stay.
- `_includes/header.html` — fix GitHub link; add nav entries for new pages (translated).
- `assets/js/language-toggle.js` — map between paired FR/EN URLs.
- `index.md` / `index-en.md` — SEO front matter, rewritten content, FAQ section, fixed links, `ref`/permalink.
- `_data/translations.yml` — new nav strings + SEO defaults.
- `Gemfile` — add `jekyll-redirect-from` and `html-proofer`.
- `_config.yml` — register `jekyll-redirect-from`.
- `.github/workflows/deploy.yml` — add an html-proofer step.

**New content/crawler files:**
- `robots.txt`, `llms.txt` (site root).
- `faq.md`, `en/faq.md`
- `cas-usage.md`, `en/use-cases.md`
- `nosia-vs-openai.md`, `en/nosia-vs-openai.md`
- `nosia-vs-ollama.md`, `en/nosia-vs-ollama.md`
- `_includes/comparison-table.html` — shared comparison-table partial (Phase 2).
- `bin/verify` — convenience script running build + html-proofer.

**Conventions for every page's front matter:**
```yaml
---
layout: default
lang: en              # or fr
ref: faq              # shared key pairing FR/EN versions
permalink: /en/faq/   # explicit clean URL
title: FAQ            # short, used in <title> suffix / nav
seo_title: "..."      # full keyword-led <title>; falls back to title
seo_description: "..."# ~150-160 chars meta description
schema: [FAQPage]     # which JSON-LD blocks to emit (optional)
---
```

---

# Phase 0 — Verification tooling

## Task 1: Add build/proofer tooling and a verify script

**Files:**
- Modify: `Gemfile`
- Create: `bin/verify`
- Modify: `_config.yml`

- [ ] **Step 1: Add gems to `Gemfile`**

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "jekyll-sitemap"
gem "jekyll-feed"
gem "jekyll-redirect-from"

group :test do
  gem "html-proofer", "~> 5.0"
end
```

- [ ] **Step 2: Register the redirect plugin in `_config.yml`**

Add `jekyll-redirect-from` to the `plugins:` list:

```yaml
plugins:
  - jekyll-sitemap
  - jekyll-feed
  - jekyll-redirect-from
```

- [ ] **Step 3: Install gems**

Run: `bundle install`
Expected: bundle completes; `Gemfile.lock` updated with `jekyll-redirect-from` and `html-proofer`.

- [ ] **Step 4: Create `bin/verify`**

```bash
#!/usr/bin/env bash
# Build the site and run html-proofer against the output.
set -euo pipefail

echo "==> Building site"
bundle exec jekyll build --baseurl ""

echo "==> Running html-proofer"
bundle exec htmlproofer ./_site \
  --disable-external \
  --allow-missing-href \
  --ignore-empty-alt \
  --no-enforce-https

echo "==> OK"
```

External link checking is disabled (`--disable-external`) to keep verification fast and offline; external links are spot-checked manually.

- [ ] **Step 5: Make it executable and run it**

Run: `chmod +x bin/verify && ./bin/verify`
Expected: build succeeds and html-proofer passes against the current site (establishes a clean baseline). If html-proofer reports pre-existing broken internal links, note them — Task 9 fixes the known `nosia-ai/nosia` links (those are external, so won't be flagged here; internal failures should be none).

- [ ] **Step 6: Commit**

```bash
git add Gemfile Gemfile.lock _config.yml bin/verify
git commit -m "chore: add jekyll-redirect-from, html-proofer, and verify script"
```

---

# Phase 1 — Technical foundation + landing page

## Task 2: Per-page SEO meta (title, description, canonical, OG/Twitter)

**Files:**
- Create: `_includes/seo-meta.html`
- Modify: `_includes/head.html`
- Modify: `index.md`, `index-en.md` (front matter only)
- Modify: `_config.yml` (default OG image)

- [ ] **Step 1: Add SEO defaults to `_config.yml`**

```yaml
# SEO / social defaults
og_image: /assets/images/nosia-social-card.png
twitter_handle: ""   # set if/when a Twitter/X account exists
```

> Note: `assets/images/nosia-social-card.png` (1200×630) is a design asset to be produced separately. Until it exists, the build still works; the OG image URL simply 404s in previews. Reference it now so markup is correct.

- [ ] **Step 2: Create `_includes/seo-meta.html`**

```liquid
{%- comment -%} Per-page SEO + social meta. Driven by front matter with fallbacks. {%- endcomment -%}
{%- assign seo_title = page.seo_title | default: page.title -%}
{%- if seo_title and seo_title != "Home" and seo_title != "Accueil" -%}
  {%- assign full_title = seo_title | append: " | " | append: site.title -%}
{%- else -%}
  {%- assign full_title = site.title | append: " — " | append: site.description -%}
{%- endif -%}
{%- assign seo_desc = page.seo_description | default: site.description -%}
{%- assign canonical = page.url | replace: 'index.html', '' | absolute_url -%}
{%- assign og_image = page.og_image | default: site.og_image | absolute_url -%}
{%- assign locale = page.lang | default: 'fr' -%}
{%- if locale == 'fr' -%}{%- assign og_locale = 'fr_FR' -%}{%- assign og_alt = 'en_US' -%}
{%- else -%}{%- assign og_locale = 'en_US' -%}{%- assign og_alt = 'fr_FR' -%}{%- endif -%}

<title>{{ full_title }}</title>
<meta name="description" content="{{ seo_desc }}">
<link rel="canonical" href="{{ canonical }}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="{{ site.title }}">
<meta property="og:url" content="{{ canonical }}">
<meta property="og:title" content="{{ full_title }}">
<meta property="og:description" content="{{ seo_desc }}">
<meta property="og:image" content="{{ og_image }}">
<meta property="og:locale" content="{{ og_locale }}">
<meta property="og:locale:alternate" content="{{ og_alt }}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ full_title }}">
<meta name="twitter:description" content="{{ seo_desc }}">
<meta name="twitter:image" content="{{ og_image }}">
```

- [ ] **Step 3: Slim `_includes/head.html` to use the partial**

Replace the description/OG/Twitter block and the `<title>` line (currently lines 3–16 and 38) with a single include. The resulting `head.html`:

```liquid
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

{% include seo-meta.html %}
{% include hreflang.html %}
{% include structured-data.html %}

<!-- Favicon -->
<link rel="icon" type="image/png" href="{{ site.baseurl }}/assets/images/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="{{ site.baseurl }}/assets/images/favicon-16x16.png" sizes="16x16">
<link rel="apple-touch-icon" href="{{ site.baseurl }}/assets/images/nosia-logo.png">

<!-- Theme: apply saved/preferred color scheme before paint to avoid a flash -->
<script>
  (function () {
    try {
      var stored = localStorage.getItem('nosia-theme');
      var dark = stored ? stored === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (dark) document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
</script>

<!-- Styles -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/style.css">
```

> `hreflang.html` and `structured-data.html` are created in Tasks 3 and 4. To keep this task's build green, create them now as empty placeholder files (`touch _includes/hreflang.html _includes/structured-data.html`).

- [ ] **Step 4: Add SEO front matter to `index.md` and `index-en.md`**

`index.md` (FR) front matter:
```yaml
---
layout: default
lang: fr
ref: home
permalink: /
title: Accueil
seo_title: "Plateforme IA auto-hébergée — RAG, MCP et données privées"
seo_description: "Nosia est une plateforme IA open source et auto-hébergée : RAG, MCP et API compatible OpenAI, sur votre infrastructure. Confidentialité et souveraineté totales."
schema: [SoftwareApplication, FAQPage]
---
```

`index-en.md` (EN) front matter (permalink moves to `/en/` in Task 6; for now keep `/index-en.html` to isolate this change):
```yaml
---
layout: default
lang: en
ref: home
title: Home
seo_title: "Self-Hosted AI Platform — RAG, MCP & Private Data"
seo_description: "Nosia is an open-source, self-hosted AI platform: RAG, MCP, and an OpenAI-compatible API on your own infrastructure. Complete privacy and data sovereignty."
schema: [SoftwareApplication, FAQPage]
---
```

- [ ] **Step 5: Build and verify the meta tags**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
grep -o '<title>[^<]*</title>' _site/index.html && \
grep -c 'rel="canonical"' _site/index.html && \
grep -c 'og:locale' _site/index.html
```
Expected: title is the FR `seo_title` + brand; one canonical; two `og:locale` lines (locale + alternate).

- [ ] **Step 6: Run full verify and commit**

Run: `./bin/verify`
Expected: passes.
```bash
git add _includes/head.html _includes/seo-meta.html _includes/hreflang.html _includes/structured-data.html _config.yml index.md index-en.md
git commit -m "feat(seo): per-page title, description, canonical, and social meta"
```

---

## Task 3: hreflang alternate tags

**Files:**
- Modify: `_includes/hreflang.html`

- [ ] **Step 1: Verify hreflang is currently absent**

Run: `grep -c 'hreflang' _site/index.html`
Expected: `0`.

- [ ] **Step 2: Implement `_includes/hreflang.html`**

```liquid
{%- comment -%}
  Emit hreflang alternates for every page sharing this page's `ref`.
  x-default points to the French (default) version.
{%- endcomment -%}
{%- if page.ref -%}
  {%- assign siblings = site.pages | where: "ref", page.ref -%}
  {%- for p in siblings -%}
    {%- assign u = p.url | replace: 'index.html', '' | absolute_url -%}
    <link rel="alternate" hreflang="{{ p.lang }}" href="{{ u }}">
    {%- if p.lang == 'fr' -%}
    <link rel="alternate" hreflang="x-default" href="{{ u }}">
    {%- endif -%}
  {%- endfor -%}
{%- endif -%}
```

- [ ] **Step 3: Build and verify hreflang set**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
grep -o 'hreflang="[^"]*"' _site/index.html | sort -u
```
Expected: `hreflang="en"`, `hreflang="fr"`, `hreflang="x-default"` all present on the FR home page (it pairs with `index-en.md` via `ref: home`).

- [ ] **Step 4: Verify the EN page also links back**

Run: `grep -o 'hreflang="[^"]*"' _site/index-en.html | sort -u`
Expected: same three values (symmetric pairing).

- [ ] **Step 5: Run verify and commit**

Run: `./bin/verify`
```bash
git add _includes/hreflang.html
git commit -m "feat(seo): hreflang alternates via ref pairing (fr/en/x-default)"
```

---

## Task 4: JSON-LD structured data

**Files:**
- Modify: `_includes/structured-data.html`

- [ ] **Step 1: Verify no JSON-LD currently**

Run: `grep -c 'application/ld+json' _site/index.html`
Expected: `0`.

- [ ] **Step 2: Implement `_includes/structured-data.html`**

Emits blocks based on `page.schema`. `Organization` is always emitted. FAQ data comes from an optional `page.faq` front-matter list (`- q:` / `- a:`).

```liquid
{%- comment -%} Organization — site-wide {%- endcomment -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dilolabs",
  "url": "{{ site.url }}",
  "logo": "{{ '/assets/images/nosia-logo.png' | absolute_url }}",
  "sameAs": [
    "https://github.com/dilolabs/nosia",
    "https://hub.docker.com/r/dilolabs/nosia"
  ]
}
</script>

{%- if page.schema contains "SoftwareApplication" -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Nosia",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Linux, macOS, Windows",
  "description": {{ page.seo_description | default: site.description | jsonify }},
  "url": "{{ site.url }}",
  "license": "https://github.com/dilolabs/nosia/blob/main/LICENSE",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "sameAs": [
    "https://github.com/dilolabs/nosia",
    "https://hub.docker.com/r/dilolabs/nosia"
  ]
}
</script>
{%- endif -%}

{%- if page.schema contains "FAQPage" and page.faq -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {%- for item in page.faq -%}
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

{%- if page.schema contains "BreadcrumbList" -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "{{ site.title }}", "item": "{{ site.url }}" },
    { "@type": "ListItem", "position": 2, "name": {{ page.title | jsonify }}, "item": "{{ page.url | absolute_url }}" }
  ]
}
</script>
{%- endif -%}
```

> Only one `FAQPage` block is ever emitted per page (single `page.faq` list), per the spec's de-duplication rule.

- [ ] **Step 3: Build and verify JSON-LD presence and validity**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
grep -c 'application/ld+json' _site/index.html && \
ruby -rjson -e 'h=File.read("_site/index.html"); h.scan(/<script type="application\/ld\+json">(.*?)<\/script>/m).each{|m| JSON.parse(m[0]); puts "valid JSON-LD block"}'
```
Expected: at least 2 blocks (Organization + SoftwareApplication; FAQPage appears once Task 8 adds `page.faq`). Each parses as valid JSON.

- [ ] **Step 4: Run verify and commit**

Run: `./bin/verify`
```bash
git add _includes/structured-data.html
git commit -m "feat(seo): JSON-LD Organization, SoftwareApplication, FAQPage, BreadcrumbList"
```

---

## Task 5: robots.txt and llms.txt

**Files:**
- Create: `robots.txt`
- Create: `llms.txt`

- [ ] **Step 1: Create `robots.txt`** (plain file, no front matter — Jekyll copies as-is)

```
User-agent: *
Allow: /

# AI / answer-engine crawlers explicitly welcome (GEO)
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: https://nosia.ai/sitemap.xml
```

- [ ] **Step 2: Create `llms.txt`** (plain Markdown at site root)

```markdown
# Nosia

> Nosia is an open-core, self-hosted AI platform that runs large language models on your own infrastructure with Retrieval Augmented Generation (RAG), Model Context Protocol (MCP), an OpenAI-compatible API, and (soon) agent skills. It is built for data privacy and sovereignty.

## Key facts
- License: MIT (open source). Repository: https://github.com/dilolabs/nosia
- Install (Linux/macOS): `curl -fsSL https://get.nosia.ai | sh`
- OpenAI-compatible API: drop-in replacement for OpenAI clients.
- Self-hosted: your data stays on your own servers.
- Maintained by Dilolabs.

## Links
- Website: https://nosia.ai
- English site: https://nosia.ai/en/
- GitHub: https://github.com/dilolabs/nosia
- Docker Hub: https://hub.docker.com/r/dilolabs/nosia
- Blog: https://blog.nosia.ai
```

- [ ] **Step 3: Build and verify both are served**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
test -f _site/robots.txt && test -f _site/llms.txt && \
grep -c 'Sitemap:' _site/robots.txt
```
Expected: both files exist; one `Sitemap:` line.

- [ ] **Step 4: Run verify and commit**

Run: `./bin/verify`
```bash
git add robots.txt llms.txt
git commit -m "feat(seo): add robots.txt and llms.txt for crawlers and AI engines"
```

---

## Task 6: Move English to `/en/` with redirect, update language toggle

**Files:**
- Modify: `index-en.md` (front matter)
- Modify: `assets/js/language-toggle.js`

- [ ] **Step 1: Add permalink + redirect to `index-en.md`**

Update front matter:
```yaml
---
layout: default
lang: en
ref: home
permalink: /en/
redirect_from:
  - /index-en.html
title: Home
seo_title: "Self-Hosted AI Platform — RAG, MCP & Private Data"
seo_description: "Nosia is an open-source, self-hosted AI platform: RAG, MCP, and an OpenAI-compatible API on your own infrastructure. Complete privacy and data sovereignty."
schema: [SoftwareApplication, FAQPage]
---
```

- [ ] **Step 2: Build and verify the new URL + redirect**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
test -f _site/en/index.html && \
grep -i 'http-equiv="refresh"' _site/index-en.html
```
Expected: `_site/en/index.html` exists; the old `_site/index-en.html` is now a redirect stub pointing to `/en/` (generated by `jekyll-redirect-from`).

- [ ] **Step 3: Update `assets/js/language-toggle.js` to use `/en/`**

Replace the path detection and `getLangUrl` logic so it maps FR `/` ↔ EN `/en/` (and, generally, `/path/` ↔ `/en/path/`). Replace the body of `getCurrentLang` and `getLangUrl`:

```javascript
  function getCurrentLang() {
    const path = window.location.pathname;
    if (path === '/en' || path === '/en/' || path.startsWith('/en/')) {
      return 'en';
    }
    return 'fr';
  }

  function getLangUrl(lang) {
    const origin = window.location.origin;
    let path = window.location.pathname;
    // Normalize: strip an existing /en prefix to get the FR-relative path.
    let frPath = path.replace(/^\/en(\/|$)/, '/');
    if (lang === 'en') {
      return origin + (frPath === '/' ? '/en/' : '/en' + frPath);
    }
    return origin + frPath;
  }
```

> Leave `switchLanguage`, `init`, and `updateToggleButtons` as-is — they call these two functions. This makes the toggle work across all paired pages, not just the home page.

- [ ] **Step 4: Verify the toggle logic by build + manual check**

Run: `bundle exec jekyll build --baseurl ""`
Then manually (or with a quick local serve `bundle exec jekyll serve`) confirm: on `/` the toggle links to `/en/`; on `/en/` it links to `/`. (Document the manual check result.)

- [ ] **Step 5: Run verify and commit**

Run: `./bin/verify`
Expected: html-proofer passes, including the new `/en/` page and the redirect stub.
```bash
git add index-en.md assets/js/language-toggle.js
git commit -m "feat(seo): serve English at /en/ with redirect; pair-aware language toggle"
```

---

## Task 7: Translations and navigation scaffolding for new pages

**Files:**
- Modify: `_data/translations.yml`
- Modify: `_includes/header.html`

This task adds nav strings now so Phase 2 pages have somewhere to link from; the new pages themselves are created later. Footer/nav links to not-yet-created pages would break html-proofer, so **the nav entries are added but commented/guarded until the target pages exist** — instead, we add the translation keys here and wire the visible nav links in the Phase 2 tasks that create each page.

- [ ] **Step 1: Add nav + page title strings to `_data/translations.yml`**

> The block below is the full intended file — it **preserves the existing 8 keys** (`home`, `logo_alt`, `nav_aria`, `documentation`, `community`, `toggle_lang`, `toggle_theme`) and adds the new ones. Merge into the existing file; do not drop existing keys.

```yaml
fr:
  home: "Nosia Accueil"
  logo_alt: "Logo Nosia"
  nav_aria: "Navigation principale"
  documentation: "Documentation"
  community: "Communauté"
  toggle_lang: "Changer de langue"
  toggle_theme: "Changer de thème"
  nav_features: "Fonctionnalités"
  nav_usecases: "Cas d'usage"
  nav_faq: "FAQ"
  usecases_url: "/cas-usage/"
  faq_url: "/faq/"

en:
  home: "Nosia Home"
  logo_alt: "Nosia Logo"
  nav_aria: "Main navigation"
  documentation: "Documentation"
  community: "Community"
  toggle_lang: "Change language"
  toggle_theme: "Toggle theme"
  nav_features: "Features"
  nav_usecases: "Use cases"
  nav_faq: "FAQ"
  usecases_url: "/en/use-cases/"
  faq_url: "/en/faq/"
```

- [ ] **Step 2: Fix the GitHub link in `_includes/header.html`**

Change `https://github.com/nosia-ai/nosia` → `https://github.com/dilolabs/nosia` (line 10).

- [ ] **Step 3: Build and verify the link fix**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
grep -rc 'nosia-ai/nosia' _site/index.html _site/en/index.html
```
Expected: header no longer contributes `nosia-ai/nosia` (remaining count comes only from body links fixed in Task 9).

- [ ] **Step 4: Commit**

```bash
git add _data/translations.yml _includes/header.html
git commit -m "feat: add nav/SEO translation keys; fix header GitHub link to dilolabs/nosia"
```

---

## Task 8: Rewrite the landing page content + FAQ (FR + EN)

**Files:**
- Modify: `index.md` (FR), `index-en.md` (EN)

Preserve the existing section structure (hero, description, story, demo, features, quickstart, documentation, community, footer) and CSS classes. Apply keyword-led headings, expand feature cards into short paragraphs, add a quotable "What is Nosia" sentence, add a use-cases teaser, and add an FAQ section. Add a `faq:` list to front matter so the `FAQPage` schema populates.

> **Copy is written in both languages.** Below is the EN content; produce the equivalent FR copy in `index.md`. Keep the brand voice. Do not invent product capabilities beyond the spec (RAG, MCP, OpenAI-compatible API, agent skills "soon", self-hosted/private, real-time streaming).

- [ ] **Step 1: Add the FAQ data to front matter (both files)**

EN (`index-en.md`), append to front matter:
```yaml
faq:
  - q: "Is Nosia free and open-source?"
    a: "Yes. Nosia is open source under the MIT license and free to self-host. The source is on GitHub at github.com/dilolabs/nosia."
  - q: "Does my data leave my servers?"
    a: "No. Nosia is self-hosted, so your documents and model interactions stay on your own infrastructure. You keep full control and data sovereignty."
  - q: "What is the difference between Nosia and ChatGPT?"
    a: "ChatGPT is a hosted service run by OpenAI. Nosia is a self-hosted platform you run on your own infrastructure, with RAG over your data, MCP tool integration, and an OpenAI-compatible API."
  - q: "Does Nosia work with the OpenAI API?"
    a: "Yes. Nosia exposes an OpenAI-compatible API, so existing OpenAI client libraries and tools can point at your Nosia instance with minimal changes."
  - q: "What are the hardware requirements?"
    a: "Nosia runs via Docker on Linux, macOS, or Windows. Requirements depend on the model you run; smaller models run on commodity hardware while larger models benefit from a GPU."
  - q: "What are RAG and MCP?"
    a: "RAG (Retrieval Augmented Generation) augments model answers with your own documents. MCP (Model Context Protocol) is an open standard for connecting AI to external tools and data sources."
```
Add the equivalent translated `faq:` list to `index.md` (FR).

- [ ] **Step 2: Update the hero H1 + subtitle (keyword-led)**

EN hero:
```html
<h1>Self-Hosted AI Platform — RAG, MCP &amp; Agent Skills on Your Own Data</h1>
<p class="subtitle">Run open large language models on your own infrastructure with Retrieval Augmented Generation, an OpenAI-compatible API, and complete data privacy.</p>
```
FR hero: translate equivalently (keep existing class names and the `Get Started`/`Commencer` button).

- [ ] **Step 3: Add a quotable "What is Nosia" sentence to the description section**

EN, lead the description with a single quotable sentence:
```html
<p><strong>Nosia is an open-source, self-hosted AI platform that runs large language models on your own infrastructure — with RAG over your documents, MCP tool integration, and an OpenAI-compatible API.</strong> It brings enterprise-grade AI to your servers with complete privacy and control, so your data never leaves your infrastructure.</p>
```

- [ ] **Step 4: Expand the six feature cards into short keyword-rich paragraphs**

Keep the grid/card/icon markup. Example EN edits (apply the same expansion pattern to all six, FR too):
```html
<div class="card">
  <span class="icon">🔒</span>
  <h3>Private &amp; Self-Hosted</h3>
  <p>Run AI entirely on your own servers. Your documents and prompts never leave your infrastructure — ideal for data sovereignty and regulated environments.</p>
</div>
<div class="card">
  <span class="icon">📚</span>
  <h3>RAG-Powered</h3>
  <p>Retrieval Augmented Generation grounds answers in your own documents, so responses are accurate, current, and specific to your organization.</p>
</div>
```
(Expand the OpenAI-compatible API, MCP integration, Agent Skills (soon), and real-time streaming cards similarly.)

- [ ] **Step 5: Add a use-cases teaser section (links to the Phase 2 page)**

Place after the features section. Use the translated URL from translations data:
```liquid
{%- assign t = site.data.translations[page.lang] -%}
<section id="use-cases-teaser" class="description">
  <div class="container">
    <h2>What can you build with Nosia?</h2>
    <p>From internal knowledge bases and document Q&amp;A to private customer-support assistants and developer tooling — Nosia adapts to your use case.</p>
    <a href="{{ t.usecases_url | relative_url }}" class="btn">Explore use cases</a>
  </div>
</section>
```
> This link targets `/en/use-cases/` (or `/cas-usage/`), created in Task 12. To keep html-proofer green until then, add this section in the **same commit sequence** only after Task 12, OR temporarily point the link at `#features`. Recommended: implement Steps 1–4 and 6–8 now; add this teaser in Task 12 once the target exists. Mark this step deferred if the target page does not yet exist.

- [ ] **Step 6: Give the Story section a proper H2 and trim**

Ensure the Story uses `<h2>` (it already does) and trim to ~3 short paragraphs to reduce noise above the fold for ranking; keep the human/E-E-A-T tone.

- [ ] **Step 7: Add the FAQ section markup**

Before the footer, render the FAQ from front matter (so the visible content matches the `FAQPage` schema):
```liquid
<section id="faq" class="features">
  <div class="container">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
      {% for item in page.faq %}
      <details class="faq-item">
        <summary><h3>{{ item.q }}</h3></summary>
        <p>{{ item.a }}</p>
      </details>
      {% endfor %}
    </div>
  </div>
</section>
```

- [ ] **Step 8: Build and verify content + FAQ schema**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
grep -c '"@type": "FAQPage"' _site/index.html && \
grep -c '"@type": "Question"' _site/index.html
```
Expected: one `FAQPage`; six `Question` entries (matching the six FAQ items). Repeat for `_site/en/index.html`.

- [ ] **Step 9: Run verify and commit**

Run: `./bin/verify`
```bash
git add index.md index-en.md
git commit -m "feat(content): keyword-led landing rewrite, feature detail, and FAQ (fr/en)"
```

---

## Task 9: Fix remaining broken `nosia-ai/nosia` links

**Files:**
- Modify: `index.md`, `index-en.md` (documentation, community, footer link blocks)

- [ ] **Step 1: Find all remaining occurrences**

Run: `grep -rn 'nosia-ai/nosia' index.md index-en.md`
Expected: lists the doc/community/footer links (ARCHITECTURE.md, DEPLOYMENT.md, OBSERVABILITY.md, docs tree, DIAGRAMS.md, discussions, issues, CONTRIBUTING.md, CODE_OF_CONDUCT.md, LICENSE, GitHub footer link).

- [ ] **Step 2: Replace `nosia-ai/nosia` → `dilolabs/nosia`**

Replace all occurrences in both files. (The Docker Hub link `dilolabs/nosia` is already correct.)

- [ ] **Step 3: Build and verify none remain**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
grep -rc 'nosia-ai/nosia' _site/ | grep -v ':0$' || echo "none remaining"
```
Expected: `none remaining`.

- [ ] **Step 4: Run verify and commit**

Run: `./bin/verify`
```bash
git add index.md index-en.md
git commit -m "fix: correct GitHub repo links from nosia-ai/nosia to dilolabs/nosia"
```

---

## Task 10: Add html-proofer to CI

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Add a verification step before the build/deploy**

Insert after "Install dependencies" and before "Build site":
```yaml
      - name: Build and verify (html-proofer)
        run: |
          bundle exec jekyll build --baseurl ""
          bundle exec htmlproofer ./_site \
            --disable-external \
            --allow-missing-href \
            --ignore-empty-alt \
            --no-enforce-https
```
> This duplicates the later "Build site" step's build; that is acceptable (cheap) and keeps the deploy step unchanged. Optionally remove the redundant standalone build if desired — but keeping them separate is lower-risk.

- [ ] **Step 2: Validate the workflow YAML locally**

Run: `ruby -ryaml -e 'YAML.load_file(".github/workflows/deploy.yml"); puts "valid"'`
Expected: `valid`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: run html-proofer on build before deploy"
```

**End of Phase 1 — the site is shippable: optimized landing page, full technical SEO/GEO foundation, fixed links, clean `/en/` URLs.**

---

# Phase 2 — Content pages

All Phase 2 pages share the conventions in the File Structure section (front matter with `lang`, `ref`, `permalink`, `seo_title`, `seo_description`, `schema`). Each is created in both FR and EN. Each task ends with `./bin/verify` and a commit. When a page is created, also add its nav link (using the translation keys from Task 7) and verify the link resolves.

## Task 11: Shared comparison-table partial

**Files:**
- Create: `_includes/comparison-table.html`

- [ ] **Step 1: Create the partial** (renders a table from a `rows` list passed via `include`)

```liquid
{%- comment -%}
  Usage:
    {% include comparison-table.html
        col_a="Nosia" col_b="OpenAI / ChatGPT"
        rows=page.comparison %}
  where page.comparison is a list of { dimension, a, b } maps.
{%- endcomment -%}
<table class="comparison-table">
  <thead>
    <tr><th></th><th>{{ include.col_a }}</th><th>{{ include.col_b }}</th></tr>
  </thead>
  <tbody>
    {%- for row in include.rows -%}
    <tr>
      <th scope="row">{{ row.dimension }}</th>
      <td>{{ row.a }}</td>
      <td>{{ row.b }}</td>
    </tr>
    {%- endfor -%}
  </tbody>
</table>
```

- [ ] **Step 2: Build (no page uses it yet — just verify no syntax error)**

Run: `bundle exec jekyll build --baseurl ""`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add _includes/comparison-table.html
git commit -m "feat: shared comparison-table include for comparison pages"
```

---

## Task 12: FAQ page (FR + EN) and use-cases page (FR + EN)

> Grouped: both are content pages following the same pattern. Create all four files, wire nav links, then verify once.

**Files:**
- Create: `faq.md`, `en/faq.md`, `cas-usage.md`, `en/use-cases.md`
- Modify: `_includes/header.html` (add FAQ + use-cases nav links), `index.md`/`index-en.md` (enable the use-cases teaser deferred in Task 8 Step 5)

- [ ] **Step 1: Create the FAQ pages** (reuse the landing FAQ pattern; longer, more questions)

`en/faq.md`:
```yaml
---
layout: default
lang: en
ref: faq
permalink: /en/faq/
title: FAQ
seo_title: "Nosia FAQ — Self-Hosted AI, RAG, MCP & Privacy"
seo_description: "Answers to common questions about Nosia: pricing, self-hosting, data privacy, OpenAI API compatibility, hardware requirements, RAG and MCP."
schema: [FAQPage, BreadcrumbList]
faq:
  # 8-12 Q&As expanding the landing set (license, deployment, models supported,
  # MCP, agent skills, comparison with ChatGPT/Ollama, GPU needs, updates, support)
---
```
Then a body that renders `page.faq` with the same `<details>` markup as Task 8 Step 7, wrapped in a hero/section with an `<h1>`. Create `faq.md` (FR, `permalink: /faq/`, `ref: faq`) with translated content.

- [ ] **Step 2: Create the use-cases pages**

`en/use-cases.md` front matter: `lang: en`, `ref: use-cases`, `permalink: /en/use-cases/`, `seo_title`/`seo_description` targeting "private AI for [use case]", `schema: [BreadcrumbList]`. Body: an `<h1>`, intro, and 4–6 use-case sections (internal knowledge base / document Q&A, customer-support assistant, developer tooling via OpenAI-compatible API, connecting AI to internal tools via MCP, regulated/sovereign deployments), each with problem → how Nosia solves it → link to quickstart/feature. Create `cas-usage.md` (FR, `permalink: /cas-usage/`, `ref: use-cases`) with translated content.

- [ ] **Step 3: Add nav links in `_includes/header.html`**

Add, using translation keys:
```liquid
<a href="{{ t.usecases_url | relative_url }}">{{ t.nav_usecases }}</a>
<a href="{{ t.faq_url | relative_url }}">{{ t.nav_faq }}</a>
```

- [ ] **Step 4: Enable the landing use-cases teaser**

Add the teaser section from Task 8 Step 5 to `index.md` and `index-en.md` (now that the target pages exist).

- [ ] **Step 5: Build and verify pages, schema, hreflang, and nav links**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
test -f _site/faq/index.html && test -f _site/en/faq/index.html && \
test -f _site/cas-usage/index.html && test -f _site/en/use-cases/index.html && \
grep -o 'hreflang="[^"]*"' _site/en/faq/index.html | sort -u && \
grep -c '"@type": "FAQPage"' _site/en/faq/index.html
```
Expected: all four pages exist; FAQ page has fr/en/x-default hreflang and one FAQPage block.

- [ ] **Step 6: Run verify and commit**

Run: `./bin/verify` (confirms nav links and teaser resolve — no broken links)
```bash
git add faq.md en/faq.md cas-usage.md en/use-cases.md _includes/header.html index.md index-en.md
git commit -m "feat(content): add bilingual FAQ and use-cases pages with nav + teaser"
```

---

## Task 13: Comparison page — Nosia vs OpenAI/ChatGPT (FR + EN)

**Files:**
- Create: `nosia-vs-openai.md`, `en/nosia-vs-openai.md`

- [ ] **Step 1: Create `en/nosia-vs-openai.md`**

Front matter: `lang: en`, `ref: vs-openai`, `permalink: /en/nosia-vs-openai/`, `schema: [FAQPage, BreadcrumbList]`, `seo_title: "Nosia vs OpenAI / ChatGPT — Self-Hosted, Open-Source Alternative"`, a `seo_description`, a `comparison:` list (dimension/a/b), and a `faq:` list.
`comparison:` dimensions (verify facts before publishing): Hosting (self-hosted vs cloud), Data privacy/sovereignty, Cost model, RAG over your data, MCP/tool integration, OpenAI API compatibility, Open source / license, Customization.
Body: `<h1>`, a quotable TL;DR / "which should you choose" callout, `{% include comparison-table.html col_a="Nosia" col_b="OpenAI / ChatGPT" rows=page.comparison %}`, per-dimension prose, FAQ block rendered from `page.faq`.

- [ ] **Step 2: Create `nosia-vs-openai.md`** (FR, `permalink: /nosia-vs-openai/`, `ref: vs-openai`) with translated content.

- [ ] **Step 3: Build and verify**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
test -f _site/en/nosia-vs-openai/index.html && \
grep -c 'comparison-table' _site/en/nosia-vs-openai/index.html && \
grep -o 'hreflang="[^"]*"' _site/en/nosia-vs-openai/index.html | sort -u
```
Expected: page exists, comparison table present, fr/en/x-default hreflang.

- [ ] **Step 4: Run verify and commit**

Run: `./bin/verify`
```bash
git add nosia-vs-openai.md en/nosia-vs-openai.md
git commit -m "feat(content): add Nosia vs OpenAI/ChatGPT comparison page (fr/en)"
```

---

## Task 14: Comparison page — Nosia vs Ollama (FR + EN)

**Files:**
- Create: `nosia-vs-ollama.md`, `en/nosia-vs-ollama.md`

- [ ] **Step 1: Create `en/nosia-vs-ollama.md`**

Same template as Task 13. `ref: vs-ollama`, `permalink: /en/nosia-vs-ollama/`, `seo_title: "Nosia vs Ollama — From Local Models to a Full RAG + MCP Platform"`. Framing: complementary — Ollama runs local models; Nosia is the full RAG + MCP + agent-skills platform around them. `comparison:` dimensions: What it is (model runner vs platform), RAG over your documents, MCP/tool integration, Web UI / chat, OpenAI-compatible API, Multi-user/teams, Agent skills, Self-hosted/privacy (both strong). FAQ block.

- [ ] **Step 2: Create `nosia-vs-ollama.md`** (FR, `permalink: /nosia-vs-ollama/`, `ref: vs-ollama`) with translated content.

- [ ] **Step 3: Build and verify**

Run:
```bash
bundle exec jekyll build --baseurl "" && \
test -f _site/en/nosia-vs-ollama/index.html && \
grep -o 'hreflang="[^"]*"' _site/en/nosia-vs-ollama/index.html | sort -u
```
Expected: page exists; fr/en/x-default hreflang.

- [ ] **Step 4: Run verify and commit**

Run: `./bin/verify`
```bash
git add nosia-vs-ollama.md en/nosia-vs-ollama.md
git commit -m "feat(content): add Nosia vs Ollama comparison page (fr/en)"
```

---

## Task 15: Final full-site verification

- [ ] **Step 1: Full build + proofer**

Run: `./bin/verify`
Expected: passes with all 9 pages (home, faq, use-cases, vs-openai, vs-ollama × fr/en, minus home counted once each) built.

- [ ] **Step 2: Confirm sitemap lists all new pages**

Run: `grep -o '<loc>[^<]*</loc>' _site/sitemap.xml`
Expected: includes `/`, `/en/`, `/faq/`, `/en/faq/`, `/cas-usage/`, `/en/use-cases/`, and both comparison URLs in both languages.

- [ ] **Step 3: Confirm no `nosia-ai/nosia` anywhere in output**

Run: `grep -rl 'nosia-ai/nosia' _site/ || echo "clean"`
Expected: `clean`.

- [ ] **Step 4: Validate every JSON-LD block parses**

Run:
```bash
ruby -rjson -e 'Dir.glob("_site/**/*.html").each{|f| File.read(f).scan(/<script type="application\/ld\+json">(.*?)<\/script>/m).each{|m| begin; JSON.parse(m[0]); rescue=>e; puts "INVALID in #{f}: #{e}"; end}}; puts "checked"'
```
Expected: `checked` with no `INVALID` lines.

- [ ] **Step 5: Manual external-link + social-preview spot check**

Manually confirm a sample of external links (GitHub docs paths on `dilolabs/nosia`, Docker Hub) resolve, and that the OG card image path is referenced (the image asset itself is produced separately). Document results.

- [ ] **Step 6: Final commit (if any cleanup)**

```bash
git add -A && git commit -m "chore: final SEO/GEO verification pass" || echo "nothing to commit"
```

---

## Deferred / out-of-plan items (tracked, not implemented here)

- **Social card image** `assets/images/nosia-social-card.png` (1200×630) — design asset, produced separately; markup already references it.
- **Final keyword finalization** and **comparison-table factual accuracy** — content owners verify before publishing (spec §12).
- Per-page OG images, glossary, and ongoing blog content — explicitly out of scope (spec §2 non-goals).
