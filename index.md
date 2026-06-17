---
layout: default
title: Accueil
lang: fr
---

<section class="hero">
  <div class="container">
    <img src="{{ site.baseurl }}/assets/images/nosia-logo.png" alt="Nosia" height="80">
    <h1>Plateforme AI RAG + MCP auto-hébergée</h1>
    <p class="subtitle">Exécutez des modèles d'IA sur vos propres données avec une confidentialité et un contrôle complets</p>
    <a href="#quickstart" class="btn btn-primary">Commencer</a>
  </div>
</section>

<section id="description" class="description">
  <div class="container">
    <p>Nosia est une plateforme open-source qui apporte des capacités d'IA de niveau entreprise à votre propre infrastructure. Avec la génération augmentée par récupération (RAG), l'intégration du protocole MCP (Model Context Protocol), et des APIs compatibles OpenAI, vous pouvez construire des applications d'IA qui fonctionnent avec vos données, à votre manière.</p>
  </div>
</section>

<section id="story" class="story highlighted">
  <div class="container">
    <h2>🌱 Notre histoire</h2>
    <div class="story-content">
      <p>Nosia, c'est avant tout une <strong>belle histoire humaine</strong>. Celle de quatre passionnés — Cyril, Olivier, Aude et Melvin — unis par des années d'amitié et de collaboration. Une aventure née d'une conviction commune : <strong>la technologie doit servir l'humain, pas l'inverse</strong>.</p>
      
      <p><strong>Tout a commencé en 2024.</strong> Olivier, toujours à l'affût des innovations qui font sens, partage avec Cyril sa découverte du RAG. Une étincelle. <strong>C'est Cyril qui trouve le nom Nosia</strong> — un nom qui porte nos valeurs : souveraineté numérique, éthique, respect des données. Puis Aude, Cyril et Melvin relèvent le défi : allier l'expertise technique à une approche centrée humain, pour créer une IA qui respecte à la fois les personnes et la planète.</p>
      
      <p><strong>Des heures de brainstorming, des tests, des prototypes...</strong> Toujours la même question : comment concilier innovation technologique, souveraineté des données, open source et valeurs européennes ? Comment prouver qu'un autre numérique est possible, plus responsable, plus humain ?</p>
      
      <p><strong>C'est dans cette énergie collective que Nosia a pris vie.</strong> Pas dans le cadre formel d'une entreprise, mais dans l'enthousiasme de quatre personnes convaincues qu'on peut allier performance technique et éthique. Une aventure où chaque détail compte : du choix du nom jusqu'à la dernière ligne de code.</p>
      
      <p><strong>Et cette aventure humaine et responsable</strong> continue. En <strong>juin 2026</strong>, François, qui anime la chaîne YouTube <strong>Kokori Kodo</strong>, a réalisé une première vidéo de présentation — que vous pouvez découvrir dans la section suivante.</p>
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
        <h3>Privé & Sécurisé</h3>
        <p>Vos données restent sur votre infrastructure</p>
      </div>
      <div class="card">
        <span class="icon">🤖</span>
        <h3>API compatible OpenAI</h3>
        <p>Remplacement direct des clients OpenAI</p>
      </div>
      <div class="card">
        <span class="icon">📚</span>
        <h3>Propulsé par RAG</h3>
        <p>Enrichissez les réponses de l'IA avec vos documents</p>
      </div>
      <div class="card">
        <span class="icon">🔌</span>
        <h3>Intégration MCP</h3>
        <p>Connectez l'IA à des outils et services externes</p>
      </div>
      <div class="card">
        <span class="icon">🤖</span>
        <h3>Compétences d'agent (bientôt)</h3>
        <p>Étendez le chat avec des compétences personnalisées basées sur LLM et Ruby</p>
      </div>
      <div class="card">
        <span class="icon">🔄</span>
        <h3>Streaming en temps réel</h3>
        <p>Événements envoyés par le serveur pour des réponses en direct</p>
      </div>
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
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/ARCHITECTURE.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📐</span>
        <h3>Documentation sur l'architecture</h3>
        <p>Plongée technique approfondie</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/DEPLOYMENT.md" class="card" target="_blank" rel="noopener">
        <span class="icon">🚀</span>
        <h3>Guide de déploiement</h3>
        <p>Stratégies de déploiement en production</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/OBSERVABILITY.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📝</span>
        <h3>Observabilité</h3>
        <p>Observabilité complète</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/tree/main/docs" class="card" target="_blank" rel="noopener">
        <span class="icon">📋</span>
        <h3>Index complet de la documentation</h3>
        <p>Toute la documentation</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/docs/DIAGRAMS.md" class="card" target="_blank" rel="noopener">
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
      <a href="https://github.com/nosia-ai/nosia/discussions" class="card" target="_blank" rel="noopener">
        <span class="icon">💬</span>
        <h3>Discussions GitHub</h3>
        <p>Posez des questions et partagez vos idées</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/issues" class="card" target="_blank" rel="noopener">
        <span class="icon">🐛</span>
        <h3>Signaler des problèmes</h3>
        <p>Signaler des bugs et demander des fonctionnalités</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/CONTRIBUTING.md" class="card" target="_blank" rel="noopener">
        <span class="icon">📝</span>
        <h3>Guide de contribution</h3>
        <p>Comment contribuer</p>
      </a>
      <a href="https://github.com/nosia-ai/nosia/blob/main/CODE_OF_CONDUCT.md" class="card" target="_blank" rel="noopener">
        <span class="icon">🤝</span>
        <h3>Code de conduite</h3>
        <p>Règles de la communauté</p>
      </a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <p>Copyright © 2024-2026 Dilolabs</p>
    <p class="links">Sous licence <a href="https://github.com/nosia-ai/nosia/blob/main/LICENSE" target="_blank" rel="noopener">MIT</a></p>
    <div class="links">
      <a href="https://nosia.ai" target="_blank" rel="noopener">Site web</a>
      <a href="https://github.com/nosia-ai/nosia" target="_blank" rel="noopener">GitHub</a>
      <a href="https://hub.docker.com/r/dilolabs/nosia" target="_blank" rel="noopener">Docker Hub</a>
    </div>
  </div>
</footer>
