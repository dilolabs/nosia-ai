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
    a: "It depends on your configuration. In the On this Mac workspace with the included local AI, conversations and documents are stored on your computer. For a self-hosted instance, also check where models and document processing run. A remote model or connected external service may receive the data needed to operate."
  - q: "How do I install Nosia?"
    a: "On a Mac with Apple M1 or later, use the native app: download the DMG from version 0.6.1, drag Nosia into Applications, open the app and click Set Up Nosia. The homepage guide explains each step. Linux and Windows also have command-line installation methods."
  - q: "What is the difference between Nosia and ChatGPT?"
    a: "ChatGPT is a hosted service run by OpenAI. Nosia can run on your infrastructure and provides Retrieval Augmented Generation (RAG) over your documents, tool connections through the Model Context Protocol (MCP), and an OpenAI-compatible application programming interface (API)."
  - q: "How is Nosia different from Ollama?"
    a: "Ollama runs models and offers a chat app with files on macOS and Windows. Nosia organizes a knowledge base, conversations, accounts and tool connections in a configurable platform. The model runtime used depends on your deployment."
  - q: "Does Nosia work with the OpenAI API?"
    a: "Yes. Nosia exposes an OpenAI-compatible API, so existing OpenAI client libraries and tools can point at your Nosia instance with minimal changes."
  - q: "Which models can I run?"
    a: "Nosia runs open large language models. You choose the model that fits your hardware and use case, from small models on commodity hardware to larger models on a GPU."
  - q: "What are the hardware requirements?"
    a: "The Mac app v0.6.1 requires Apple M1 or later and macOS 26.5 or later. Plan for 16 GB of memory or more for the included AI configuration, internet to download several gigabytes during setup, and space for your documents. Requirements for other installations depend on the model you choose."
  - q: "What are RAG and MCP?"
    a: "RAG (Retrieval Augmented Generation) augments model answers with your own documents. MCP (Model Context Protocol) is an open standard for connecting AI to external tools and data sources."
  - q: "What are agent skills?"
    a: "Agent skills extend the chat with custom capabilities driven by a language model or written in Ruby. They require configuration and development suited to your workflow; they are not a promise of autonomous or error-free execution."
  - q: "Where can I get help?"
    a: "Use GitHub Discussions for questions, Issues for problems and the repository documentation for configuration. Dilolabs, the company developing Nosia, also offers support: dilolabs.fr/contact."
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
