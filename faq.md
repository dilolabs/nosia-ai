---
layout: default
lang: fr
ref: faq
permalink: /faq/
title: FAQ
seo_title: "FAQ Nosia — IA auto-hébergée, RAG, MCP et confidentialité"
seo_description: "Réponses aux questions fréquentes sur Nosia : tarif, auto-hébergement, confidentialité des données, compatibilité API OpenAI, configuration matérielle, RAG, MCP et compétences d'agent."
schema: [FAQPage, BreadcrumbList]
faq:
  - q: "Nosia est-il gratuit et open source ?"
    a: "Oui. Nosia est open source sous licence MIT et gratuit à auto-héberger. Le code source est disponible sur GitHub : github.com/dilolabs/nosia."
  - q: "Mes données quittent-elles mes serveurs ?"
    a: "Non. Nosia est auto-hébergé : vos documents et vos interactions avec les modèles restent sur votre propre infrastructure. Vous gardez un contrôle total et la souveraineté de vos données."
  - q: "Comment installer Nosia ?"
    a: "Sur Linux ou macOS, une seule commande installe Docker et toutes les dépendances : curl -fsSL https://get.nosia.ai | sh. Un installeur PowerShell est disponible pour Windows."
  - q: "Quelle est la différence entre Nosia et ChatGPT ?"
    a: "ChatGPT est un service hébergé par OpenAI. Nosia est une plateforme auto-hébergée que vous exécutez sur votre propre infrastructure, avec du RAG sur vos données, l'intégration d'outils via MCP et une API compatible OpenAI."
  - q: "En quoi Nosia est-il différent d'Ollama ?"
    a: "Ollama exécute des modèles de langage en local. Nosia est une plateforme complète construite autour des modèles : elle ajoute le RAG sur vos documents, l'intégration d'outils via MCP, une interface de chat, une API compatible OpenAI et (bientôt) des compétences d'agent."
  - q: "Nosia fonctionne-t-il avec l'API OpenAI ?"
    a: "Oui. Nosia expose une API compatible OpenAI : les bibliothèques et outils clients OpenAI existants peuvent pointer vers votre instance Nosia avec un minimum de modifications."
  - q: "Quels modèles puis-je exécuter ?"
    a: "Nosia exécute des grands modèles de langage open source. Vous choisissez le modèle adapté à votre matériel et à votre cas d'usage, du petit modèle sur matériel courant aux modèles plus grands sur GPU."
  - q: "Quelle est la configuration matérielle requise ?"
    a: "Nosia s'exécute via Docker sur Linux, macOS ou Windows. Les besoins dépendent du modèle utilisé : les petits modèles fonctionnent sur du matériel courant, tandis que les modèles plus grands bénéficient d'un GPU."
  - q: "Qu'est-ce que le RAG et le MCP ?"
    a: "Le RAG (génération augmentée par récupération) enrichit les réponses du modèle avec vos propres documents. Le MCP (Model Context Protocol) est un standard ouvert pour connecter l'IA à des outils et sources de données externes."
  - q: "Que sont les compétences d'agent ?"
    a: "Les compétences d'agent (bientôt disponibles) étendent le chat avec des compétences personnalisées, pilotées par LLM et écrites en Ruby, pour automatiser vos workflows métier directement dans Nosia."
  - q: "Où puis-je obtenir de l'aide ?"
    a: "Utilisez les Discussions GitHub pour vos questions, les Issues GitHub pour les bugs et demandes de fonctionnalités, et la documentation du dépôt sur github.com/dilolabs/nosia."
---

<section class="hero">
  <div class="container">
    <h1>Questions fréquentes</h1>
    <p class="subtitle">Tout ce qu'il faut savoir sur Nosia — la plateforme IA open source et auto-hébergée.</p>
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
