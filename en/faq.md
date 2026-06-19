---
layout: default
lang: en
ref: faq
permalink: /en/faq/
title: FAQ
seo_title: "Nosia FAQ — Self-Hosted AI, RAG, MCP & Privacy"
seo_description: "Answers to common questions about Nosia: pricing, self-hosting, data privacy, OpenAI API compatibility, hardware requirements, RAG and MCP, and agent skills."
schema: [FAQPage, BreadcrumbList]
faq:
  - q: "Is Nosia free and open-source?"
    a: "Yes. Nosia is open source under the MIT license and free to self-host. The source is on GitHub at github.com/dilolabs/nosia."
  - q: "Does my data leave my servers?"
    a: "No. Nosia is self-hosted, so your documents and model interactions stay on your own infrastructure. You keep full control and data sovereignty."
  - q: "How do I install Nosia?"
    a: "On Linux or macOS, a single command installs Docker and all dependencies: curl -fsSL https://get.nosia.ai | sh. A PowerShell installer is available for Windows."
  - q: "What is the difference between Nosia and ChatGPT?"
    a: "ChatGPT is a hosted service run by OpenAI. Nosia is a self-hosted platform you run on your own infrastructure, with RAG over your data, MCP tool integration, and an OpenAI-compatible API."
  - q: "How is Nosia different from Ollama?"
    a: "Ollama runs language models locally. Nosia is a full platform built around models, adding RAG over your documents, MCP tool integration, a chat interface, an OpenAI-compatible API, and (soon) agent skills."
  - q: "Does Nosia work with the OpenAI API?"
    a: "Yes. Nosia exposes an OpenAI-compatible API, so existing OpenAI client libraries and tools can point at your Nosia instance with minimal changes."
  - q: "Which models can I run?"
    a: "Nosia runs open large language models. You choose the model that fits your hardware and use case, from small models on commodity hardware to larger models on a GPU."
  - q: "What are the hardware requirements?"
    a: "Nosia runs via Docker on Linux, macOS, or Windows. Requirements depend on the model you run; smaller models run on commodity hardware while larger models benefit from a GPU."
  - q: "What are RAG and MCP?"
    a: "RAG (Retrieval Augmented Generation) augments model answers with your own documents. MCP (Model Context Protocol) is an open standard for connecting AI to external tools and data sources."
  - q: "What are agent skills?"
    a: "Agent skills (coming soon) extend the chat with custom, LLM-driven skills written in Ruby, letting you automate business workflows directly inside Nosia."
  - q: "Where can I get help?"
    a: "Use GitHub Discussions for questions, GitHub Issues for bugs and feature requests, and the documentation in the repository at github.com/dilolabs/nosia."
---

<section class="hero">
  <div class="container">
    <h1>Frequently Asked Questions</h1>
    <p class="subtitle">Everything you need to know about Nosia — the open-source, self-hosted AI platform.</p>
  </div>
</section>

<section id="faq" class="features">
  <div class="container">
    <div class="faq-list">
      {% for item in page.faq %}
      <details class="faq-item">
        <summary><h2>{{ item.q }}</h2></summary>
        <p>{{ item.a }}</p>
      </details>
      {% endfor %}
    </div>
  </div>
</section>
