# Nosia.ai SEO & GEO Content Improvement — Design

- **Date:** 2026-06-18
- **Status:** Approved (pending spec review)
- **Branch:** feat/landing
- **Author:** Cyril Blaecke (with Claude Code)

## 1. Summary

Improve the content of the Nosia.ai marketing site for organic search (SEO) and
generative-engine optimization (GEO — being cited by ChatGPT, Perplexity, Google AI
Overviews, etc.). Nosia is an open-core, self-hosted AI platform (RAG, MCP, and soon
agent skills). The site is a bilingual Jekyll/GitHub Pages site (French default at `/`,
English at `/index-en.html`).

The work expands the current single-page site into a small, focused content
architecture (landing page + a few high-value pages), and adds the technical SEO/GEO
foundation that every page inherits. It is delivered in two phases so the optimized
landing page can ship and start ranking while Phase 2 content pages are written.

## 2. Goals & non-goals

### Primary success metric
- **Organic search traffic** (breadth of qualified visitors across FR and EN markets).

### Secondary outcomes
- AI-engine citations (GEO) for "self-hosted RAG / private AI" style questions.
- Conversions to the quickstart install and the GitHub repository.

### Audience
All four of: self-hosting developers, privacy/sovereignty-focused organizations
(EU companies, public sector, regulated industries), AI/ML engineers & teams, and
decision-makers/CTOs. Primary hooks: **developers** and **data sovereignty**, with
CTO/ML-engineer framing layered on top.

### Non-goals
- No full content hub / ongoing blog program in this scope (the blog already exists at
  `blog.nosia.ai` and is out of scope here).
- No redesign of the visual design system (a redesign landed recently).
- No backend/app changes — this is a static content site.

## 3. Current state (findings)

- **Stack:** Jekyll, GitHub Pages (`CNAME` → nosia.ai), plugins `jekyll-sitemap`,
  `jekyll-feed`. Bilingual via two page files: `index.md` (FR, `/`) and `index-en.md`
  (EN, `/index-en.html`). Language toggle is a URL redirect in
  `assets/js/language-toggle.js` (both languages are real, crawlable pages).
- **Existing SEO:** basic `<meta name="description">`, Open Graph, Twitter cards,
  favicons, sitemap + feed.
- **Gaps identified:**
  - `<title>` is `{{ site.title }} - {{ page.title }}` → "Nosia - Home" (not keyword-led).
  - No `<link rel="canonical">`.
  - **No `hreflang`** linking the FR and EN pages (critical for a bilingual site).
  - **No structured data (JSON-LD).**
  - OG/Twitter image is the logo, not a proper 1200×630 social card.
  - English URL `/index-en.html` is suboptimal vs. a clean `/en/` prefix.
  - Content is friendly but thin on keywords; feature cards are one-liners; the Story
    section is long and not search-oriented.
  - **Broken links:** doc/community/footer links point to `github.com/nosia-ai/nosia`,
    but the canonical repository is `github.com/dilolabs/nosia`. All occurrences must be
    fixed.

## 4. Approach

**Foundation-first, then content** (chosen over content-first and single-big-push). The
technical SEO/GEO foundation is reusable infrastructure every current and future page
depends on, so building it first means every page is born SEO/GEO-ready, the optimized
landing page can ship and be measured early, and the spec stays reviewable in two phases.

## 5. Information architecture & URLs

Each page exists in both languages. French stays at the root (current default); English
moves under an `/en/` prefix.

| Page | FR (default) | EN |
|------|--------------|-----|
| Landing | `/` | `/en/` |
| FAQ | `/faq/` | `/en/faq/` |
| Use cases | `/cas-usage/` | `/en/use-cases/` |
| Nosia vs OpenAI/ChatGPT | `/nosia-vs-openai/` | `/en/nosia-vs-openai/` |
| Nosia vs Ollama | `/nosia-vs-ollama/` | `/en/nosia-vs-ollama/` |

### URL restructure (English → `/en/`)
- Move English from `/index-en.html` to `/en/` (clean, SEO-standard, enables clean
  `hreflang`).
- Add the `jekyll-redirect-from` plugin and a `redirect_from: /index-en.html` on the EN
  landing page so old links/bookmarks 301-style redirect to `/en/` (GitHub Pages supports
  this plugin; it generates static redirect pages).

### Page pairing & translation structure
- Each page is a thin Markdown file with front matter: `lang`, `permalink`, `seo_title`,
  `seo_description`, and a shared **`ref`** key linking the FR/EN pair (e.g. `ref: faq`).
- The `ref` pairing powers automatic `hreflang` tag generation and the language toggle.
- Reusable UI strings continue to live in `_data/translations.yml`; longer page prose
  lives in the page files themselves.

### Language toggle
- Update `assets/js/language-toggle.js` to map between paired URLs via the `ref`/page
  structure instead of the hardcoded `/index-en.html`.

## 6. Technical SEO/GEO foundation

Implemented primarily in `_includes/head.html` (driven by front matter with fallbacks),
plus new files.

### Per-page metadata
- **`<title>`** template: page-specific, keyword-led title + brand, e.g.
  "Self-Hosted AI RAG + MCP Platform | Nosia". Each page sets `seo_title`.
- **`<meta name="description">`** — unique, ~150–160 chars, per page (`seo_description`).
- **`<link rel="canonical">`** — self-referencing on every page.
- **`hreflang`** — for each page, emit `alternate` tags for `fr`, `en`, and `x-default`
  (→ FR), resolved from the `ref` pairing.
- **Open Graph / Twitter** — extend existing tags with per-page title/description/image,
  plus `og:locale` and `og:locale:alternate`.

### Structured data (JSON-LD)
- **`SoftwareApplication`** on the landing page: name, category, operating systems,
  license (MIT), offers (free / open-source), `sameAs` → GitHub (`dilolabs/nosia`),
  Docker Hub (`dilolabs/nosia`).
- **`Organization`** (Dilolabs) site-wide.
- **`FAQPage`** on any page with a Q&A block (landing FAQ section, FAQ page, comparison
  pages). **At most one `FAQPage` block per page** (Google expects a single FAQPage per
  URL) — do not stack multiple Q&A blocks into separate FAQPage schemas on one page.
- **`BreadcrumbList`** on sub-pages. The IA is flat, so the trail is simply
  Home → Page (e.g. Home → FAQ, Home → Nosia vs OpenAI), localized per language.

### Crawler & AI-engine files
- **`robots.txt`** — allow all; reference `sitemap.xml`. Explicitly allow AI crawlers
  (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) consistent with the GEO goal.
- **`llms.txt`** at `/llms.txt` — concise, structured Markdown summary of what Nosia is,
  key facts, and links, to help LLMs ingest and cite the product accurately.

### Social cards
- Replace the logo OG image with a **single branded default 1200×630 social-share image**
  reused across pages (per-page images deferred). Spec the dimensions and default path;
  actual image asset creation is a design task.

## 7. Landing page content (Phase 1)

Preserve the warm brand voice and the Story; restructure for keyword coverage and
AI-quotability without keyword stuffing. Final copy is written during implementation; this
spec fixes the structure, the quotable definition, the FAQ question list, and the keyword
map. Applies to both FR and EN.

- **H1** — keyword-led. EN example: "Self-Hosted AI Platform — RAG, MCP & Agent Skills on
  Your Own Data". FR equivalent.
- **"What is Nosia" intro** — a tight, factual, quotable one-paragraph definition near the
  top (lifted verbatim by AI engines), with one clear sentence answering "What is Nosia?".
- **Features** — expand the six one-line cards into short paragraphs with natural keyword
  phrasing (self-hosted RAG, OpenAI-compatible API, Model Context Protocol, on-premise /
  private AI, data sovereignty, agent skills, real-time streaming). Keep icons/grid.
- **Use-cases teaser** — short section linking to the full use-cases page.
- **Story** — kept, trimmed slightly, given a proper H2 (brand/E-E-A-T signal, not a
  ranking target).
- **Quickstart** — kept as-is (strong conversion element).
- **FAQ section** — 5–8 high-intent Q&As doubling as `FAQPage` schema. Seed questions:
  - Is Nosia free and open-source?
  - Does my data leave my servers?
  - What's the difference between Nosia and ChatGPT?
  - What are the hardware requirements?
  - Does Nosia work with the OpenAI API?
  - What is RAG / what is MCP (short)?

## 8. Keyword strategy

Define a primary + secondary keyword set per language, each mapped to a single page to
avoid cannibalization. Indicative (finalized during implementation):

- **EN primary:** "self-hosted AI platform", "self-hosted RAG", "open source ChatGPT
  alternative", "private AI", "OpenAI-compatible API self-hosted".
- **FR primary:** "IA auto-hébergée", "RAG souveraineté des données", "alternative
  ChatGPT open source", "IA privée", "plateforme IA on-premise".
- **Page mapping:** landing → core platform/self-hosted terms; FAQ → question/long-tail;
  use-cases → "IA pour [cas]" / "private AI for [use case]"; comparison pages → "Nosia vs
  X" / "X alternative". Each comparison page owns a **distinct** primary term to avoid
  cannibalization: `/nosia-vs-openai/` → "Nosia vs OpenAI / open source ChatGPT
  alternative"; `/nosia-vs-ollama/` → "Nosia vs Ollama".

## 9. Phase 2 pages

Each bilingual, inherits the Section 6 foundation, targets a distinct keyword cluster.

### Use-cases page (`/cas-usage/`, `/en/use-cases/`)
- 4–6 concrete scenarios mapped to the audiences: internal knowledge base / document Q&A
  (RAG); customer-support assistant; developer tooling via OpenAI-compatible API;
  connecting AI to internal tools (MCP); regulated/sovereign deployments (privacy orgs,
  public sector).
- Each scenario: problem → how Nosia solves it → relevant feature link. Scannable,
  quotable.

### Comparison pages
Consistent, GEO-friendly template (honest, factual — unfair comparisons are penalized and
not cited):
- **Nosia vs OpenAI/ChatGPT** (`/nosia-vs-openai/`, `/en/nosia-vs-openai/`) — self-hosted /
  data-sovereignty / cost / open-source angle.
- **Nosia vs Ollama** (`/nosia-vs-ollama/`, `/en/nosia-vs-ollama/`) — Ollama runs models;
  Nosia is the full RAG + MCP + agent-skills platform around them (complementary framing).
- **Shared template:** comparison table; at-a-glance "TL;DR / which should you choose"
  callout; per-dimension prose; FAQ block (`FAQPage` schema).
- **Comparison dimensions** (defined in spec; team verifies factual accuracy before
  publishing): hosting/deployment (self-hosted vs cloud), data privacy/sovereignty, cost
  model, RAG support, MCP/tool integration, API compatibility, open-source/license,
  customization/extensibility.

### Internal linking & navigation
- Landing → use-cases & comparisons; comparisons & use-cases → quickstart and back to
  landing.
- Add the new pages to header/footer navigation (translated) so they are crawlable and
  reachable.

## 10. Verification & testing

Static content site — verification means build correctness and SEO/GEO correctness:

- **Build:** `bundle exec jekyll build` succeeds with no errors; all pages render in both
  languages.
- **Link integrity:** run `html-proofer` against `_site` — catches broken links, confirms
  the `dilolabs/nosia` fixes and the `/index-en.html` → `/en/` redirect.
- **Metadata:** each page emits a unique `<title>`, description, self-canonical, and a
  complete `hreflang` set (fr / en / x-default) pointing at the correct paired URLs.
- **Structured data:** validate JSON-LD against Schema.org / Google Rich Results
  expectations (`SoftwareApplication`, `Organization`, `FAQPage`, `BreadcrumbList`).
- **Crawler files:** `robots.txt`, `sitemap.xml`, and `llms.txt` present, well-formed, and
  listing the new pages.
- **Manual spot-check:** language toggle maps between paired URLs; OG/Twitter preview
  renders the default social card.
- **CI:** add `html-proofer` to the existing `.github/` workflow so link/markup
  regressions are caught automatically.

## 11. Phasing

- **Phase 1 — Foundation + landing (ship & measure):** Section 5 URL restructure, Section
  6 technical foundation, Section 7 landing-page rewrite + FAQ, fix `dilolabs/nosia` links.
- **Phase 2 — Content pages:** Section 9 use-cases page + two comparison pages.

## 12. Open items / assumptions

- Canonical repository is `github.com/dilolabs/nosia` (stated by owner); existing
  `nosia-ai/nosia` links are treated as incorrect and will be fixed. Docker Hub is
  `dilolabs/nosia`.
- Final marketing copy, exact keyword finalization, comparison-table factual content, and
  the branded OG image asset are produced during implementation and verified by the team
  before publishing.
- `jekyll-redirect-from` is compatible with the GitHub Pages build (confirm during
  implementation; if not, fall back to a static meta-refresh redirect page).
