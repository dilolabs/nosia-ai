---
layout: default
title: Home
---

<section class="hero">
  <div class="container">
    <img src="{{ site.baseurl }}/assets/images/nosia-logo.png" alt="Nosia" height="80">
    <h1>Self-hosted AI RAG + MCP Platform</h1>
    <p class="subtitle">Run AI models on your own data with complete privacy and control</p>
    <a href="https://get.nosia.ai" class="btn btn-primary">Get Started</a>
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
    <div class="grid">
      <a href="https://guides.nosia.ai/" class="card" target="_blank" rel="noopener">
        <span class="icon">📖</span>
        <h3>Nosia Guides</h3>
        <p>Step-by-step tutorials</p>
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
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/agent-skills-development.md" class="card" target="_blank" rel="noopener">
        <span class="icon">🤖</span>
        <h3>Agent Skills Development</h3>
        <p>Create custom skills</p>
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
    <p>Copyright © 2024-2026 Cyril Blaecke</p>
    <p>Licensed under <a href="https://github.com/nosia-ai/nosia/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a></p>
    <div class="links">
      <a href="https://nosia.ai" target="_blank" rel="noopener">Website</a>
      <a href="https://github.com/nosia-ai/nosia" target="_blank" rel="noopener">GitHub</a>
      <a href="https://hub.docker.com/u/ai" target="_blank" rel="noopener">Docker Hub</a>
    </div>
  </div>
</footer>

<script>
// Scroll behavior for header
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

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
</script>
