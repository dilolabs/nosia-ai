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
    a: "Cela dépend de votre configuration. Dans l’espace Sur ce Mac avec l’IA locale fournie, vos conversations et documents sont conservés sur l’ordinateur. Sur une instance auto-hébergée, vérifiez aussi où s’exécutent les modèles et les traitements documentaires. Un modèle distant ou un service externe connecté peut recevoir les données nécessaires à son fonctionnement."
  - q: "Comment installer Nosia ?"
    a: "Sur un Mac avec puce Apple M1 ou ultérieure, utilisez l’application native : téléchargez le fichier DMG depuis la version 0.6.1, glissez Nosia dans Applications, ouvrez l’app puis cliquez sur Préparer Nosia. Le guide de l’accueil détaille les étapes. Linux et Windows disposent aussi d’installations en ligne de commande."
  - q: "Quelle est la différence entre Nosia et ChatGPT ?"
    a: "ChatGPT est un service hébergé par OpenAI. Nosia peut fonctionner sur votre infrastructure et propose la génération augmentée par récupération (RAG) sur vos documents, les connexions d’outils via le Model Context Protocol (MCP) et une interface de programmation (API) compatible OpenAI."
  - q: "En quoi Nosia est-il différent d'Ollama ?"
    a: "Ollama exécute des modèles et propose une application de conversation avec fichiers sur macOS et Windows. Nosia organise une base documentaire, des conversations, des comptes et des connexions d’outils dans une plateforme configurable. Le moteur de modèles utilisé dépend de votre déploiement."
  - q: "Nosia fonctionne-t-il avec l'API OpenAI ?"
    a: "Oui. Nosia expose une API compatible OpenAI : les bibliothèques et outils clients OpenAI existants peuvent pointer vers votre instance Nosia avec un minimum de modifications."
  - q: "Quels modèles puis-je exécuter ?"
    a: "Nosia exécute des grands modèles de langage open source. Vous choisissez le modèle adapté à votre matériel et à votre cas d'usage, du petit modèle sur matériel courant aux modèles plus grands sur GPU."
  - q: "Quelle est la configuration matérielle requise ?"
    a: "L’application Mac v0.6.1 nécessite une puce Apple M1 ou ultérieure et macOS 26.5 ou ultérieur. Prévoyez 16 Go de mémoire ou plus pour l’IA fournie, internet pour télécharger plusieurs gigaoctets lors de la préparation et de l’espace pour vos documents. Pour les autres installations, les besoins dépendent du modèle choisi."
  - q: "Qu'est-ce que le RAG et le MCP ?"
    a: "Le RAG (génération augmentée par récupération) enrichit les réponses du modèle avec vos propres documents. Le MCP (Model Context Protocol) est un standard ouvert pour connecter l'IA à des outils et sources de données externes."
  - q: "Que sont les compétences d'agent ?"
    a: "Les compétences d'agent étendent le chat avec des compétences personnalisées, pilotées par LLM et écrites en Ruby, pour automatiser vos workflows métier directement dans Nosia."
  - q: "Où puis-je obtenir de l'aide ?"
    a: "Utilisez les Discussions GitHub pour vos questions, les Issues pour les problèmes et la documentation du dépôt pour la configuration. Dilolabs, l’entreprise qui développe Nosia, peut aussi vous accompagner : dilolabs.fr/contact."
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
