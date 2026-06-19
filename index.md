---
layout: default
lang: fr
ref: home
permalink: /
title: Accueil
seo_title: "Plateforme IA auto-hébergée — RAG, MCP et données privées"
seo_description: "Nosia est une plateforme IA open source et auto-hébergée : RAG, MCP et API compatible OpenAI, sur votre infrastructure. Confidentialité et souveraineté totales."
schema: [SoftwareApplication, FAQPage]
faq:
  - q: "Nosia est-il gratuit et open source ?"
    a: "Oui. Nosia est open source sous licence MIT et gratuit à auto-héberger. Le code source est disponible sur GitHub : github.com/dilolabs/nosia."
  - q: "Mes données quittent-elles mes serveurs ?"
    a: "Non. Nosia est auto-hébergé : vos documents et vos interactions avec les modèles restent sur votre propre infrastructure. Vous gardez un contrôle total et la souveraineté de vos données."
  - q: "Quelle est la différence entre Nosia et ChatGPT ?"
    a: "ChatGPT est un service hébergé par OpenAI. Nosia est une plateforme auto-hébergée que vous exécutez sur votre propre infrastructure, avec du RAG sur vos données, l'intégration d'outils via MCP et une API compatible OpenAI."
  - q: "Nosia fonctionne-t-il avec l'API OpenAI ?"
    a: "Oui. Nosia expose une API compatible OpenAI : les bibliothèques et outils clients OpenAI existants peuvent pointer vers votre instance Nosia avec un minimum de modifications."
  - q: "Quelle est la configuration matérielle requise ?"
    a: "Nosia s'exécute via Docker sur Linux, macOS ou Windows. Les besoins dépendent du modèle utilisé : les petits modèles fonctionnent sur du matériel courant, tandis que les modèles plus grands bénéficient d'un GPU."
  - q: "Qu'est-ce que le RAG et le MCP ?"
    a: "Le RAG (génération augmentée par récupération) enrichit les réponses du modèle avec vos propres documents. Le MCP (Model Context Protocol) est un standard ouvert pour connecter l'IA à des outils et sources de données externes."
---

<section class="hero">
  <div class="container">
    <img src="{{ site.baseurl }}/assets/images/nosia-logo.png" alt="Nosia" height="80">
    <h1>Plateforme IA auto-hébergée — RAG, MCP et compétences d'agent sur vos propres données</h1>
    <p class="subtitle">Exécutez des grands modèles de langage open source sur votre propre infrastructure, avec la génération augmentée par récupération (RAG), une API compatible OpenAI et une confidentialité totale des données.</p>
    <a href="#quickstart" class="btn btn-primary">Commencer</a>
  </div>
</section>

<section id="description" class="description">
  <div class="container">
    <p><strong>Nosia est une plateforme IA open source et auto-hébergée qui exécute de grands modèles de langage sur votre propre infrastructure — avec du RAG sur vos documents, l'intégration d'outils via MCP et une API compatible OpenAI.</strong> Elle apporte une IA de niveau entreprise sur vos serveurs, avec une confidentialité et un contrôle complets : vos données ne quittent jamais votre infrastructure.</p>
  </div>
</section>

<section id="story" class="story highlighted">
  <div class="container">
    <h2>🌱 Notre histoire</h2>
    <div class="story-content">
      <p>Nosia, c'est avant tout une <strong>belle histoire humaine</strong>. Celle de quatre passionnés — Cyril, Olivier, Aude et Melvin — unis par des années d'amitié et de collaboration. Une aventure née d'une conviction commune : <strong>la technologie doit servir l'humain, pas l'inverse</strong>.</p>

      <p><strong>Tout a commencé en 2024</strong>, lorsque Olivier partage avec Cyril sa découverte du RAG. Une étincelle. <strong>C'est Cyril qui trouve le nom Nosia</strong> — un nom qui porte nos valeurs : souveraineté numérique, éthique, respect des données. Toujours la même question nous anime : comment concilier innovation technologique, souveraineté des données, open source et valeurs européennes ?</p>

      <p><strong>Et cette aventure humaine et responsable</strong> continue. En <strong>juin 2026</strong>, François, qui anime la chaîne YouTube <strong>Kokori Kodo</strong>, a réalisé une première vidéo de présentation — que vous pouvez découvrir ci-dessous.</p>
    </div>
  </div>
</section>

<section id="demo" class="demo">
  <div class="container">
    <h2>Découvrez Nosia en action</h2>
    <div class="video-container">
      <iframe
        src="https://www.youtube-nocookie.com/embed/HD5k-LjGvGw?si=eaYP5pCkKq-qHh3A"
        title="Nosia - Démo de la plateforme AI RAG + MCP auto-hébergée"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
      </iframe>
    </div>
  </div>
</section>

<section id="features" class="features">
  <div class="container">
    <h2>Fonctionnalités clés</h2>
    <p>Découvrez comment Nosia vous donne le contrôle total sur votre IA avec des outils puissants et intuitifs.</p>
    <div class="grid">
      <div class="card">
        <span class="icon">🔒</span>
        <h3>Privé et auto-hébergé</h3>
        <p>Exécutez l'IA entièrement sur vos propres serveurs. Vos documents et vos requêtes ne quittent jamais votre infrastructure — idéal pour la souveraineté des données et les environnements réglementés.</p>
      </div>
      <div class="card">
        <span class="icon">🤖</span>
        <h3>API compatible OpenAI</h3>
        <p>Nosia expose une API compatible OpenAI : pointez vos bibliothèques et outils clients OpenAI existants vers votre instance, sans réécrire votre code.</p>
      </div>
      <div class="card">
        <span class="icon">📚</span>
        <h3>Propulsé par RAG</h3>
        <p>La génération augmentée par récupération ancre les réponses dans vos propres documents, pour des réponses précises, à jour et spécifiques à votre organisation.</p>
      </div>
      <div class="card">
        <span class="icon">🔌</span>
        <h3>Intégration MCP</h3>
        <p>Le Model Context Protocol connecte l'IA à vos outils, API et sources de données internes via un standard ouvert et interopérable.</p>
      </div>
      <div class="card">
        <span class="icon">🤖</span>
        <h3>Compétences d'agent (bientôt)</h3>
        <p>Étendez le chat avec des compétences personnalisées, pilotées par LLM et écrites en Ruby, pour automatiser vos workflows métier.</p>
      </div>
      <div class="card">
        <span class="icon">🔄</span>
        <h3>Streaming en temps réel</h3>
        <p>Les événements envoyés par le serveur (SSE) diffusent les réponses en direct, pour une expérience de chat fluide et réactive.</p>
      </div>
    </div>
  </div>
</section>

<section id="use-cases-teaser" class="description">
  <div class="container">
    {%- assign t = site.data.translations[page.lang] -%}
    <h2>Que pouvez-vous construire avec Nosia ?</h2>
    <p>Des bases de connaissances internes et questions-réponses sur documents aux assistants de support privés et aux outils pour développeurs — Nosia s'adapte à votre cas d'usage.</p>
    <a href="{{ t.usecases_url | relative_url }}" class="btn">Explorer les cas d'usage</a>
  </div>
</section>

<section id="comparisons-teaser" class="features">
  <div class="container">
    <h2>Nosia comparé aux alternatives</h2>
    <p>Vous évaluez vos options ? Découvrez comment Nosia se positionne face aux principales solutions d'IA et de LLM.</p>
    <div class="cta-group">
      <a href="{{ '/nosia-vs-openai/' | relative_url }}" class="btn">Nosia vs OpenAI / ChatGPT</a>
      <a href="{{ '/nosia-vs-ollama/' | relative_url }}" class="btn">Nosia vs Ollama</a>
    </div>
  </div>
</section>

<section id="quickstart" class="quickstart">
  <div class="container">
    <h2>Commencez en quelques minutes</h2>
    <p>Une seule commande installe Docker et toutes ses dépendances :</p>
    <div class="code-block">
      <code>curl -fsSL https://get.nosia.ai | sh</code>
    </div>
    <p>Pour Windows :</p>
    <div class="code-block">
      <code>Invoke-WebRequest https://get.nosia.ai/install.ps1 -OutFile install.ps1; .\install.ps1</code>
    </div>
  </div>
</section>

<section id="documentation" class="documentation">
  <div class="container">
    <h2>Documentation</h2>
    <p>Toute la documentation dont vous avez besoin pour déployer et utiliser Nosia efficacement.</p>
    <div class="grid">
      <a href="https://blog.nosia.ai/" class="card" target="_blank" rel="noopener">
        <span class="icon">📖</span>
        <h3>Blog Nosia</h3>
        <p>Notre vision, notre mission, nos histoires</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/docs/ARCHITECTURE.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📐</span>
        <h3>Documentation sur l'architecture</h3>
        <p>Plongée technique approfondie</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/docs/DEPLOYMENT.md" class="card" target="_blank" rel="noopener">
        <span class="icon">🚀</span>
        <h3>Guide de déploiement</h3>
        <p>Stratégies de déploiement en production</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/docs/OBSERVABILITY.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📝</span>
        <h3>Observabilité</h3>
        <p>Observabilité complète</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/tree/main/docs" class="card" target="_blank" rel="noopener">
        <span class="icon">📋</span>
        <h3>Index complet de la documentation</h3>
        <p>Toute la documentation</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/docs/DIAGRAMS.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📊</span>
        <h3>Diagrammes du système</h3>
        <p>Représentations visuelles</p>
      </a>
    </div>
  </div>
</section>

<section id="community" class="community">
  <div class="container">
    <h2>Communauté & Support</h2>
    <p>Rejoignez notre communauté croissante et bénéficiez d'un support actif.</p>
    <div class="grid">
      <a href="https://github.com/dilolabs/nosia/discussions" class="card" target="_blank" rel="noopener">
        <span class="icon">💬</span>
        <h3>Discussions GitHub</h3>
        <p>Posez des questions et partagez vos idées</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/issues" class="card" target="_blank" rel="noopener">
        <span class="icon">🐛</span>
        <h3>Signaler des problèmes</h3>
        <p>Signaler des bugs et demander des fonctionnalités</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/CONTRIBUTING.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📝</span>
        <h3>Guide de contribution</h3>
        <p>Comment contribuer</p>
      </a>
      <a href="https://github.com/dilolabs/nosia/blob/main/CODE_OF_CONDUCT.md" class="card" target="_blank" rel="noopener">
        <span class="icon">🤝</span>
        <h3>Code de conduite</h3>
        <p>Règles de la communauté</p>
      </a>
    </div>
  </div>
</section>

<section id="faq" class="features">
  <div class="container">
    <h2>Questions fréquentes</h2>
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
    <p class="links">Sous licence <a href="https://github.com/dilolabs/nosia/blob/main/LICENSE" target="_blank" rel="noopener">MIT</a></p>
    <div class="links">
      <a href="https://nosia.ai" target="_blank" rel="noopener">Site web</a>
      <a href="https://github.com/dilolabs/nosia" target="_blank" rel="noopener">GitHub</a>
      <a href="https://hub.docker.com/r/dilolabs/nosia" target="_blank" rel="noopener">Docker Hub</a>
    </div>
  </div>
</footer>
