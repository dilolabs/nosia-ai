# 2026-06-17 Nosia.ai Landing Page Design

**Status:** Draft  
**Author:** Mistral Vibe  
**Reviewers:** Pending  
**Last Updated:** 2026-06-17  

---

## Overview

### Purpose

This document specifies the design for a static GitHub Pages site serving as the project overview hub for **Nosia.ai**. The site will be hosted at `nosia.ai` from the `dilolabs/nosia-ai` GitHub repository and will act as a central directory linking to all existing Nosia resources (documentation, guides, community, installation).

### Background

Nosia is an open-source, self-hosted AI RAG + MCP Platform that allows users to run AI models on their own data with complete privacy and control. The project currently has:
- Main repository: [github.com/nosia-ai/nosia](https://github.com/nosia-ai/nosia)
- Documentation: [guides.nosia.ai](https://guides.nosia.ai/)
- Installation: [get.nosia.ai](https://get.nosia.ai)
- Existing documentation in the main repo under `/docs`

The new landing page will consolidate access to these resources in a single, professional, easy-to-navigate hub.

### Goals

1. Provide a clear, professional first impression of the Nosia project
2. Direct users to the appropriate resources based on their needs
3. Showcase key features and capabilities
4. Facilitate quick installation and getting started
5. Link to all existing documentation and community resources
6. Maintain consistency with existing Nosia branding

### Non-Goals

- Replace existing documentation sites (guides.nosia.ai, docs in main repo)
- Host detailed technical documentation on the landing page
- Create a multi-page website (single-page design)
- Implement user authentication or dynamic features

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| R01 | Display project logo prominently | High |
| R02 | Present hero section with main value proposition | High |
| R03 | Show key features in an easily scannable format | High |
| R04 | Provide one-command installation instructions | High |
| R05 | Link to all existing documentation resources | High |
| R06 | Link to community support channels | High |
| R07 | Include copyright and license information | Medium |
| R08 | Support dark theme | High |
| R09 | Be fully responsive on mobile devices | High |
| R10 | Load quickly (< 2 seconds) | Medium |

### Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NF01 | Hosted on GitHub Pages | High |
| NF02 | Custom domain: nosia.ai | High |
| NF03 | Built with Jekyll | High |
| NF04 | HTTPS enabled | High |
| NF05 | SEO optimized | Medium |
| NF06 | Accessible (WCAG 2.1 AA) | Medium |
| NF07 | Maintainable by non-developers | Medium |

---

## Design

### Architecture

**Static Site Generator:** Jekyll  
**Hosting:** GitHub Pages  
**Repository:** `dilolabs/nosia-ai`  
**Custom Domain:** `nosia.ai`  
**Build:** GitHub Pages native Jekyll build  

### Repository Structure

```
dilolabs/nosia-ai/
├── _config.yml              # Jekyll configuration
├── _includes/
│   ├── head.html            # HTML head with metadata, favicon, styles
│   └── header.html          # Site header with logo and navigation
├── _layouts/
│   └── default.html         # Base layout wrapping all pages
├── assets/
│   ├── css/
│   │   └── style.css        # Custom styles (dark theme)
│   └── images/
│       ├── nosia-logo.png   # Project logo (provided by user)
│       ├── favicon-16x16.png # Favicon
│       └── favicon-32x32.png # Favicon
├── index.md                 # Main page content in Markdown
├── 404.html                 # Custom 404 page
├── CNAME                    # Custom domain configuration
├── Gemfile                  # Jekyll dependencies
├── Gemfile.lock             # Locked dependency versions
├── .gitignore               # Git ignore rules
└── .github/
    └── workflows/
        └── deploy.yml       # GitHub Actions workflow (optional)
```

**Rationale:**
- Minimal structure for a single-page site
- Separation of concerns: layouts, includes, assets
- Markdown for content enables easy editing by non-developers
- Custom CSS for consistent branding

### Page Layout

Single-column, scrollable layout with the following sections in order:

#### 1. Header
- **Content:** Logo (left), Navigation links (right)
- **Navigation Links:**
  - Documentation
  - Community
  - GitHub
- **Behavior:** Fixed at top, collapses on scroll

#### 2. Hero Section
- **Content:**
  - Logo (nosia-logo.png, 80px height)
  - Headline: "Self-hosted AI RAG + MCP Platform"
  - Subheadline: "Run AI models on your own data with complete privacy and control"
  - Primary CTA Button: "Get Started" → links to https://get.nosia.ai
- **Behavior:** Centered, full-width background

#### 3. Project Description
- **Content:** 2-3 sentence overview
- **Example text:**
  > "Nosia is an open-source platform that brings enterprise-grade AI capabilities to your own infrastructure. With Retrieval Augmented Generation (RAG), Model Context Protocol (MCP) integration, and OpenAI-compatible APIs, you can build AI applications that work with your data, your way."

#### 4. Key Features
- **Format:** Grid of feature cards (3 columns on desktop, 2 on tablet, 1 on mobile)
- **Features to include:**
  1. 🔒 Private & Secure - Your data stays on your infrastructure
  2. 🤖 OpenAI-Compatible API - Drop-in replacement for OpenAI clients
  3. 📚 RAG-Powered - Augment AI responses with your documents
  4. 🔌 MCP Integration - Connect AI to external tools and services
  5. 🤖 Agent Skills - Extend chat with custom LLM-driven and Ruby-based skills
  6. 🔄 Real-time Streaming - Server-sent events for live responses
- **Each card:** Icon, title, brief description

#### 5. Quick Start
- **Content:**
  - Section title: "Get Started in Minutes"
  - macOS/Linux install command:
    ```bash
    curl -fsSL https://get.nosia.ai | sh
    ```
  - Windows install command:
    ```powershell
    Invoke-WebRequest https://get.nosia.ai/install.ps1 -OutFile install.ps1; .\install.ps1
    ```
  - Note: "One command installs Docker and all dependencies"

#### 6. Documentation Links
- **Format:** Grid of documentation cards
- **Links:**
  1. 📖 [Nosia Guides](https://guides.nosia.ai/) - Step-by-step tutorials
  2. 📐 [Architecture Documentation](https://github.com/nosia-ai/nosia/blob/main/docs/ARCHITECTURE.md) - Technical deep dive
  3. 🚀 [Deployment Guide](https://github.com/nosia-ai/nosia/blob/main/docs/DEPLOYMENT.md) - Production deployment strategies
  4. 🤖 [Agent Skills Development](https://github.com/nosia-ai/nosia/blob/main/docs/agent-skills-development.md) - Create custom skills
  5. 📋 [Complete Documentation Index](https://github.com/nosia-ai/nosia/tree/main/docs) - All documentation
  6. 📊 [System Diagrams](https://github.com/nosia-ai/nosia/blob/main/docs/DIAGRAMS.md) - Visual representations
- **Note:** All links open in new tabs

#### 7. Community & Support
- **Format:** Grid of community cards
- **Links:**
  1. 💬 [GitHub Discussions](https://github.com/nosia-ai/nosia/discussions) - Ask questions and share ideas
  2. 🐛 [Report Issues](https://github.com/nosia-ai/nosia/issues) - Bug reports and feature requests
  3. 📝 [Contributing Guide](https://github.com/nosia-ai/nosia/blob/main/CONTRIBUTING.md) - How to contribute
  4. 🤝 [Code of Conduct](https://github.com/nosia-ai/nosia/blob/main/CODE_OF_CONDUCT.md) - Community guidelines

#### 8. Footer
- **Content:**
  - Copyright: "Copyright © 2024-2026 Cyril Blaecke"
  - License: "Licensed under MIT License"
  - Links:
    - Website: [nosia.ai](https://nosia.ai)
    - GitHub: [github.com/nosia-ai/nosia](https://github.com/nosia-ai/nosia)
    - Docker Hub: [hub.docker.com/u/ai](https://hub.docker.com/u/ai)
- **Note:** Social links if any exist

### Visual Design

#### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#22c55e` | Logo, accents, buttons |
| Primary Dark | `#16a34a` | Hover states |
| Background | `#0f172a` | Page background |
| Background Secondary | `#1e293b` | Card backgrounds |
| Background Tertiary | `#334155` | Borders |
| Text Primary | `#f1f5f9` | Body text |
| Text Secondary | `#94a3b8` | Subtle text, descriptions |
| Accent | `#06b6d4` | CTA buttons, links |
| Accent Dark | `#0891b2` | CTA hover states |

#### Typography

```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace;
}

body {
  font-family: var(--font-sans);
  line-height: 1.6;
}

code, pre {
  font-family: var(--font-mono);
}
```

**Headings:**
- H1: 3rem (48px), bold, primary color
- H2: 2.25rem (36px), bold, text primary
- H3: 1.5rem (24px), bold, text primary
- H4: 1.25rem (20px), semibold, text secondary

**Body:**
- Base: 1rem (16px), regular, text primary
- Lead: 1.125rem (18px), lighter weight

#### Spacing

- Base unit: 0.25rem (4px)
- Section gaps: 3rem (48px) on desktop, 2rem (32px) on mobile
- Card padding: 1.5rem (24px)
- Border radius: 0.5rem (8px) for cards, 0.25rem (4px) for buttons

#### Logo Usage

- Header: 48px height
- Hero: 80px height
- File: `assets/images/nosia-logo.png`
- Format: PNG with transparent background

#### Component Styles

**Cards:**
- Background: `var(--background-secondary)`
- Border: 1px solid `var(--background-tertiary)`
- Border radius: 0.5rem
- Padding: 1.5rem
- Hover: border color changes to primary

**Buttons:**
- Primary: Background `#22c55e`, text white
- Secondary: Background `var(--background-secondary)`, border `#334155`
- Padding: 0.75rem 1.5rem
- Border radius: 0.25rem
- Transition: all 0.2s ease

**Links:**
- Color: `#06b6d4`
- Hover: `#0891b2`
- External: opens in new tab, has external link icon (┗)

**Code Blocks:**
- Background: `var(--background-secondary)`
- Border: 1px solid `var(--background-tertiary)`
- Border radius: 0.5rem
- Padding: 1rem
- Overflow: auto

### Navigation & User Flow

**Header Navigation:**
```
[Logo]    Documentation    Community    GitHub
```

**In-Page Navigation:**
- Clicking nav links smoothly scrolls to corresponding section
- URL hash updates (e.g., `nosia.ai/#features`)
- Current section highlighted in nav (optional enhancement)

**External Links:**
- All documentation, community, and install links point to external sites
- Opens in new tab by default
- External link indicator (┗ icon)

**CTA Priority:**
1. **Primary:** "Get Started" button in hero → https://get.nosia.ai
2. **Secondary:** Documentation cards
3. **Tertiary:** Community cards

**Scroll Behavior:**
- Smooth scroll for all anchor links
- Header reduces in size on scroll (from 80px to 64px)
- "Back to top" button appears when scrolled past viewport height

### Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: ≥ 1024px

**Adaptations:**
- Mobile: Single column, stacked sections, navigation hidden
- Tablet: 2-column grid for features and cards
- Desktop: 3-column grid for features and cards

---

## Technical Implementation

### Jekyll Configuration (`_config.yml`)

```yaml
# Site settings
title: Nosia
description: >-
  Self-hosted AI RAG + MCP Platform. Run AI models on your own data with 
  complete privacy and control.
url: https://nosia.ai
baseurl: ""

# Build settings
 theme: null
 plugins:
   - jekyll-sitemap
   - jekyll-feed

# Exclude from processing
exclude:
  - Gemfile
  - Gemfile.lock
  - node_modules
  - vendor/bundle/
  - .github/
  - .gitignore
```

### Layout Template (`_layouts/default.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  {% include head.html %}
</head>
<body>
  {% include header.html %}
  <main>
    {{ content }}
  </main>
</body>
</html>
```

### Head Include (`_includes/head.html`)

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{{ site.description }}">

<!-- Open Graph / Social -->
<meta property="og:type" content="website">
<meta property="og:url" content="{{ site.url }}">
<meta property="og:title" content="{{ site.title }}">
<meta property="og:description" content="{{ site.description }}">
<meta property="og:image" content="{{ site.url }}/assets/images/nosia-logo.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="{{ site.title }}">
<meta property="twitter:description" content="{{ site.description }}">
<meta property="twitter:image" content="{{ site.url }}/assets/images/nosia-logo.png">

<!-- Favicon -->
<link rel="icon" type="image/png" href="{{ site.baseurl }}/assets/images/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="{{ site.baseurl }}/assets/images/favicon-16x16.png" sizes="16x16">
<link rel="apple-touch-icon" href="{{ site.baseurl }}/assets/images/nosia-logo.png">

<!-- Styles -->
<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/style.css">

<title>{{ site.title }} - {{ page.title }}</title>
```

### Header Include (`_includes/header.html`)

```html
<header class="header">
  <div class="container">
    <a href="{{ site.baseurl }}/" class="logo">
      <img src="{{ site.baseurl }}/assets/images/nosia-logo.png" alt="Nosia" height="48">
    </a>
    <nav class="nav">
      <a href="#documentation">Documentation</a>
      <a href="#community">Community</a>
      <a href="https://github.com/nosia-ai/nosia" target="_blank" rel="noopener">GitHub┗</a>
    </nav>
  </div>
</header>
```

### Page Content (`index.md`)

```markdown
---
layout: default
title: Home
---

<section class="hero">
  <div class="container">
    <img src="{{ site.baseurl }}/assets/images/nosia-logo.png" alt="Nosia" height="80">
    <h1>Self-hosted AI RAG + MCP Platform</h1>
    <p class="subtitle">Run AI models on your own data with complete privacy and control</p>
    <a href="https://get.nosia.ai" class="btn btn-primary">Get Started ┗</a>
  </div>
</section>

<section id="description" class="description">
  <div class="container">
    <p>Nosia is an open-source platform that brings enterprise-grade AI capabilities to your own infrastructure. With Retrieval Augmented Generation (RAG), Model Context Protocol (MCP) integration, and OpenAI-compatible APIs, you can build AI applications that work with your data, your way.</p>
  </div>
</section>

<section id="features" class="features">
  <div class="container">
    <h2>Key Features</h2>
    <div class="grid">
      <div class="card">
        <span class="icon">🔒</span>
        <h3>Private & Secure</h3>
        <p>Your data stays on your infrastructure</p>
      </div>
      <div class="card">
        <span class="icon">🤖</span>
        <h3>OpenAI-Compatible API</h3>
        <p>Drop-in replacement for OpenAI clients</p>
      </div>
      <div class="card">
        <span class="icon">📚</span>
        <h3>RAG-Powered</h3>
        <p>Augment AI responses with your documents</p>
      </div>
      <div class="card">
        <span class="icon">🔌</span>
        <h3>MCP Integration</h3>
        <p>Connect AI to external tools and services</p>
      </div>
      <div class="card">
        <span class="icon">🤖</span>
        <h3>Agent Skills</h3>
        <p>Extend chat with custom LLM-driven and Ruby-based skills</p>
      </div>
      <div class="card">
        <span class="icon">🔄</span>
        <h3>Real-time Streaming</h3>
        <p>Server-sent events for live responses</p>
      </div>
    </div>
  </div>
</section>

<section id="quickstart" class="quickstart">
  <div class="container">
    <h2>Get Started in Minutes</h2>
    <div class="code-block">
      <code>curl -fsSL https://get.nosia.ai | sh</code>
    </div>
    <p>One command installs Docker and all dependencies</p>
    <p>For Windows:</p>
    <div class="code-block">
      <code>Invoke-WebRequest https://get.nosia.ai/install.ps1 -OutFile install.ps1; .\install.ps1</code>
    </div>
  </div>
</section>

<section id="documentation" class="documentation">
  <div class="container">
    <h2>Documentation</h2>
    <div class="grid">
      <a href="https://guides.nosia.ai/" class="card">
        <span class="icon">📖</span>
        <h3>Nosia Guides</h3>
        <p>Step-by-step tutorials</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/ARCHITECTURE.md" class="card">
        <span class="icon">📐</span>
        <h3>Architecture Documentation</h3>
        <p>Technical deep dive</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/DEPLOYMENT.md" class="card">
        <span class="icon">🚀</span>
        <h3>Deployment Guide</h3>
        <p>Production deployment strategies</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/agent-skills-development.md" class="card">
        <span class="icon">🤖</span>
        <h3>Agent Skills Development</h3>
        <p>Create custom skills</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/tree/main/docs" class="card">
        <span class="icon">📋</span>
        <h3>Complete Documentation Index</h3>
        <p>All documentation</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/DIAGRAMS.md" class="card">
        <span class="icon">📊</span>
        <h3>System Diagrams</h3>
        <p>Visual representations</p>
      </a>
    </div>
  </div>
</section>

<section id="community" class="community">
  <div class="container">
    <h2>Community & Support</h2>
    <div class="grid">
      <a href="https://github.com/nosia-ai/nosia/discussions" class="card">
        <span class="icon">💬</span>
        <h3>GitHub Discussions</h3>
        <p>Ask questions and share ideas</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/issues" class="card">
        <span class="icon">🐛</span>
        <h3>Report Issues</h3>
        <p>Bug reports and feature requests</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/CONTRIBUTING.md" class="card">
        <span class="icon">📝</span>
        <h3>Contributing Guide</h3>
        <p>How to contribute</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/CODE_OF_CONDUCT.md" class="card">
        <span class="icon">🤝</span>
        <h3>Code of Conduct</h3>
        <p>Community guidelines</p>
      </a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <p>Copyright © 2024-2026 Cyril Blaecke</p>
    <p>Licensed under <a href="https://github.com/nosia-ai/nosia/blob/main/LICENSE">MIT License</a></p>
    <div class="links">
      <a href="https://nosia.ai">Website</a>
      <a href="https://github.com/nosia-ai/nosia">GitHub</a>
      <a href="https://hub.docker.com/u/ai">Docker Hub</a>
    </div>
  </div>
</footer>

<script>
// Simple scroll behavior for header
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Back to top button
window.addEventListener('scroll', function() {
  const backToTop = document.querySelector('.back-to-top');
  if (window.scrollY > window.innerHeight) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});
</script>
```

### Styles (`assets/css/style.css`)

```css
/* ===== CSS Variables ===== */
:root {
  --color-primary: #22c55e;
  --color-primary-dark: #16a34a;
  --color-bg: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-tertiary: #334155;
  --color-text: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-accent: #06b6d4;
  --color-accent-dark: #0891b2;
  
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  
  --max-width: 1200px;
}

/* ===== Reset & Base ===== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* ===== Typography ===== */
h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  font-weight: 700;
}

h1 { font-size: 3rem; }
h2 { font-size: 2.25rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; font-weight: 600; }

p {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

.subtitle {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

/* ===== Layout ===== */
section {
  padding: var(--spacing-3xl) 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

/* ===== Header ===== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: var(--spacing-md) 0;
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-bg-tertiary);
  transition: padding 0.2s ease, box-shadow 0.2s ease;
}

.header.scrolled {
  padding: var(--spacing-sm) 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: block;
}

.logo img {
  height: 48px;
}

.nav {
  display: flex;
  gap: var(--spacing-xl);
}

.nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  font-weight: 500;
}

.nav a:hover {
  color: var(--color-text);
}

/* ===== Hero ===== */
.hero {
  padding-top: calc(var(--spacing-3xl) + 80px);
  text-align: center;
}

.hero .container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero img {
  margin-bottom: var(--spacing-xl);
}

.hero h1 {
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ===== Cards ===== */
.card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  display: block;
}

.card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card .icon {
  font-size: 2rem;
  display: block;
  margin-bottom: var(--spacing-md);
}

.card h3 {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.card p {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

/* ===== Buttons ===== */
.btn {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

/* ===== Code Blocks ===== */
.code-block {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  overflow-x: auto;
  margin-bottom: var(--spacing-md);
}

.code-block code {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text);
  background: none;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

/* ===== Footer ===== */
.footer {
  padding: var(--spacing-3xl) 0 var(--spacing-xl);
  border-top: 1px solid var(--color-bg-tertiary);
  text-align: center;
}

.footer .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.footer p {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.footer .links {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  justify-content: center;
}

.footer .links a {
  color: var(--color-text-secondary);
  text-decoration: none;
}

.footer .links a:hover {
  color: var(--color-text);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .nav {
    display: none;
  }
  
  h1 { font-size: 2.25rem; }
  h2 { font-size: 1.75rem; }
  
  .hero {
    padding-top: calc(var(--spacing-3xl) + 60px);
  }
  
  .subtitle {
    font-size: 1rem;
  }
}

/* ===== External Link Indicator ===== */
a[target="_blank"]::after {
  content: "┗";
  margin-left: var(--spacing-xs);
  font-size: 0.75em;
  opacity: 0.7;
}

/* ===== Back to Top Button ===== */
.back-to-top {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  display: none;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-bg-tertiary);
  border-radius: 50%;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 1.5rem;
  transition: all 0.2s ease;
  z-index: 1000;
}

.back-to-top:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.back-to-top.visible {
  display: flex;
}

/* ===== In-page anchor link styling ===== */
[href^="#"] {
  color: var(--color-accent);
}

[href^="#"]:hover {
  color: var(--color-accent-dark);
}
