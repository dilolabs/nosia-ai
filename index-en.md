---
layout: default
lang: en
ref: home
title: Home
seo_title: "Self-Hosted AI Platform — RAG, MCP & Private Data"
seo_description: "Nosia is an open-source, self-hosted AI platform: RAG, MCP, and an OpenAI-compatible API on your own infrastructure. Complete privacy and data sovereignty."
schema: [SoftwareApplication, FAQPage]
---

<section class="hero">
  <div class="container">
    <img src="{{ site.baseurl }}/assets/images/nosia-logo.png" alt="Nosia" height="80">
    <h1>Self-hosted AI RAG + MCP Platform</h1>
    <p class="subtitle">Run AI models on your own data with complete privacy and control</p>
    <a href="#quickstart" class="btn btn-primary">Get Started</a>
  </div>
</section>

<section id="description" class="description">
  <div class="container">
    <p>Nosia is an open-source platform that brings enterprise-grade AI capabilities to your own infrastructure. With Retrieval Augmented Generation (RAG), Model Context Protocol (MCP) integration, and OpenAI-compatible APIs, you can build AI applications that work with your data, your way.</p>
  </div>
</section>

<section id="story" class="story highlighted">
  <div class="container">
    <h2>🌱 Our Story</h2>
    <div class="story-content">
      <p>Nosia is first and foremost <strong>a human story</strong>. The story of four passionate individuals — Cyril, Olivier, Aude, and Melvin — united by years of friendship and collaboration. An adventure born from a shared conviction: <strong>technology should serve humans, not the other way around</strong>.</p>
      
      <p><strong>It all began in 2024.</strong> Olivier, always on the lookout for meaningful innovations, shared his discovery of RAG with Cyril. A spark. <strong>Cyril came up with the name Nosia</strong> — a name that carries our values: digital sovereignty, ethics, data respect. Then Aude, Cyril, and Melvin took on the challenge: combining technical expertise with a human-centered approach to create an AI that respects both people and the planet.</p>
      
      <p><strong>Hours of brainstorming, testing, prototyping...</strong> Always the same question: how to reconcile technological innovation with data sovereignty, open source, and European values? How to prove that a different kind of digital world is possible, more responsible, more human?</p>
      
      <p><strong>It was in this collective energy that Nosia came to life.</strong> Not within the formal framework of a company, but in the enthusiasm of four people convinced that we can combine technical performance with ethics. An adventure where every detail matters: from choosing the name to the last line of code.</p>
      
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
        <h3>Agent Skills (soon)</h3>
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
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/ARCHITECTURE.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📐</span>
        <h3>Architecture Documentation</h3>
        <p>Technical deep dive</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/DEPLOYMENT.md" class="card" target="_blank" rel="noopener">
        <span class="icon">🚀</span>
        <h3>Deployment Guide</h3>
        <p>Production deployment strategies</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/OBSERVABILITY.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📝</span>
        <h3>Observability</h3>
        <p>Comprehensive observability</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/tree/main/docs" class="card" target="_blank" rel="noopener">
        <span class="icon">📋</span>
        <h3>Complete Documentation Index</h3>
        <p>All documentation</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/DIAGRAMS.md" class="card" target="_blank" rel="noopener">
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
      <a href="https://github.com/nosia-ai/nosia/discussions" class="card" target="_blank" rel="noopener">
        <span class="icon">💬</span>
        <h3>GitHub Discussions</h3>
        <p>Ask questions and share ideas</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/issues" class="card" target="_blank" rel="noopener">
        <span class="icon">🐛</span>
        <h3>Report Issues</h3>
        <p>Bug reports and feature requests</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/CONTRIBUTING.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📝</span>
        <h3>Contributing Guide</h3>
        <p>How to contribute</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/CODE_OF_CONDUCT.md" class="card" target="_blank" rel="noopener">
        <span class="icon">🤝</span>
        <h3>Code of Conduct</h3>
        <p>Community guidelines</p>
      </a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <p>Copyright © 2024-2026 Dilolabs</p>
    <p class="links">Licensed under <a href="https://github.com/nosia-ai/nosia/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a></p>
    <div class="links">
      <a href="https://nosia.ai" target="_blank" rel="noopener">Website</a>
      <a href="https://github.com/nosia-ai/nosia" target="_blank" rel="noopener">GitHub</a>
      <a href="https://hub.docker.com/r/dilolabs/nosia" target="_blank" rel="noopener">Docker Hub</a>
    </div>
  </div>
</footer>
