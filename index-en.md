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
---

<section class="hero">
  <div class="container">
    <img src="{{ site.baseurl }}/assets/images/nosia-logo.png" alt="Nosia" height="80">
    <h1>Self-Hosted AI Platform — RAG, MCP &amp; Agent Skills on Your Own Data</h1>
    <p class="subtitle">Run open large language models on your own infrastructure with Retrieval Augmented Generation, an OpenAI-compatible API, and complete data privacy.</p>
    <a href="#quickstart" class="btn btn-primary">Get Started</a>
  </div>
</section>

<section id="description" class="description">
  <div class="container">
    <p><strong>Nosia is an open-source, self-hosted AI platform that runs large language models on your own infrastructure — with RAG over your documents, MCP tool integration, and an OpenAI-compatible API.</strong> It brings enterprise-grade AI to your servers with complete privacy and control, so your data never leaves your infrastructure.</p>
  </div>
</section>

<section id="story" class="story highlighted">
  <div class="container">
    <h2>🌱 Our Story</h2>
    <div class="story-content">
      <p>Nosia is first and foremost <strong>a human story</strong>. The story of four passionate individuals — Cyril, Olivier, Aude, and Melvin — united by years of friendship and collaboration. An adventure born from a shared conviction: <strong>technology should serve humans, not the other way around</strong>.</p>

      <p><strong>It all began in 2024</strong>, when Olivier shared his discovery of RAG with Cyril. A spark. <strong>Cyril came up with the name Nosia</strong> — a name that carries our values: digital sovereignty, ethics, and data respect. The same question has driven us ever since: how do you reconcile technological innovation with data sovereignty, open source, and European values?</p>

      <p><strong>And this human and responsible adventure</strong> continues. In <strong>June 2026</strong>, François, who runs the YouTube channel <strong>Kokori Kodo</strong>, created the first presentation video — which you can discover in the French version.</p>
    </div>
  </div>
</section>

<section id="demo" class="demo">
  <div class="container">
    <h2>See Nosia in Action</h2>
    <div class="video-container">
      <img src="{{ site.baseurl }}/assets/images/nosia-demo.gif" alt="Nosia Demo" class="demo-gif">
    </div>
  </div>
</section>

<section id="features" class="features">
  <div class="container">
    <h2>Key Features</h2>
    <p>Discover how Nosia gives you complete control over your AI with powerful and intuitive tools.</p>
    <div class="grid">
      <div class="card">
        <span class="icon">🔒</span>
        <h3>Private &amp; Self-Hosted</h3>
        <p>Run AI entirely on your own servers. Your documents and prompts never leave your infrastructure — ideal for data sovereignty and regulated environments.</p>
      </div>
      <div class="card">
        <span class="icon">🤖</span>
        <h3>OpenAI-Compatible API</h3>
        <p>Nosia exposes an OpenAI-compatible API, so your existing OpenAI client libraries and tools can point at your instance without rewriting code.</p>
      </div>
      <div class="card">
        <span class="icon">📚</span>
        <h3>RAG-Powered</h3>
        <p>Retrieval Augmented Generation grounds answers in your own documents, so responses are accurate, current, and specific to your organization.</p>
      </div>
      <div class="card">
        <span class="icon">🔌</span>
        <h3>MCP Integration</h3>
        <p>The Model Context Protocol connects AI to your internal tools, APIs, and data sources through an open, interoperable standard.</p>
      </div>
      <div class="card">
        <span class="icon">🤖</span>
        <h3>Agent Skills (soon)</h3>
        <p>Extend chat with custom, LLM-driven skills written in Ruby to automate your business workflows.</p>
      </div>
      <div class="card">
        <span class="icon">🔄</span>
        <h3>Real-time Streaming</h3>
        <p>Server-sent events (SSE) stream responses live for a smooth, responsive chat experience.</p>
      </div>
    </div>
  </div>
</section>

<section id="quickstart" class="quickstart">
  <div class="container">
    <h2>Get Started in Minutes</h2>
    <p>One command installs Docker and all dependencies:</p>
    <div class="code-block">
      <code>curl -fsSL https://get.nosia.ai | sh</code>
    </div>
    <p>For Windows:</p>
    <div class="code-block">
      <code>Invoke-WebRequest https://get.nosia.ai/install.ps1 -OutFile install.ps1; .\install.ps1</code>
    </div>
  </div>
</section>

<section id="documentation" class="documentation">
  <div class="container">
    <h2>Documentation</h2>
    <p>All the documentation you need to deploy and use Nosia effectively.</p>
    <div class="grid">
      <a href="https://blog.nosia.ai/" class="card" target="_blank" rel="noopener">
        <span class="icon">📖</span>
        <h3>Nosia Blog</h3>
        <p>Our vision, mission, stories</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/docs/ARCHITECTURE.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📐</span>
        <h3>Architecture Documentation</h3>
        <p>Technical deep dive</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/docs/DEPLOYMENT.md" class="card" target="_blank" rel="noopener">
        <span class="icon">🚀</span>
        <h3>Deployment Guide</h3>
        <p>Production deployment strategies</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/docs/OBSERVABILITY.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📝</span>
        <h3>Observability</h3>
        <p>Comprehensive observability</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/tree/main/docs" class="card" target="_blank" rel="noopener">
        <span class="icon">📋</span>
        <h3>Complete Documentation Index</h3>
        <p>All documentation</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/docs/DIAGRAMS.md" class="card" target="_blank" rel="noopener">
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
    <p>Join our growing community and benefit from active support.</p>
    <div class="grid">
      <a href="https://github.com/dilolabs/nosia/discussions" class="card" target="_blank" rel="noopener">
        <span class="icon">💬</span>
        <h3>GitHub Discussions</h3>
        <p>Ask questions and share ideas</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/issues" class="card" target="_blank" rel="noopener">
        <span class="icon">🐛</span>
        <h3>Report Issues</h3>
        <p>Bug reports and feature requests</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/CONTRIBUTING.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📝</span>
        <h3>Contributing Guide</h3>
        <p>How to contribute</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/CODE_OF_CONDUCT.md" class="card" target="_blank" rel="noopener">
        <span class="icon">🤝</span>
        <h3>Code of Conduct</h3>
        <p>Community guidelines</p>
      </a>
    </div>
  </div>
</section>

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

<footer class="footer">
  <div class="container">
    <p>Copyright © 2024-2026 Dilolabs</p>
    <p class="links">Licensed under <a href="https://github.com/dilolabs/nosia/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a></p>
    <div class="links">
      <a href="https://nosia.ai" target="_blank" rel="noopener">Website</a>
      <a href="https://github.com/dilolabs/nosia" target="_blank" rel="noopener">GitHub</a>
      <a href="https://hub.docker.com/r/dilolabs/nosia" target="_blank" rel="noopener">Docker Hub</a>
    </div>
  </div>
</footer>
