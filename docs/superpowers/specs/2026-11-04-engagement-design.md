# Intégration du plaidoyer Nosia

## Objectif

Publier le plaidoyer « Pour une intelligence artificielle dont nous gardons la maîtrise » sans le réécrire, sur une page pérenne et accessible depuis l’accueil et la navigation du site.

## Decisions

- « Page dédiée + extrait » : option approuvée par l’utilisateur (« Oui »), pour donner au plaidoyer une place durable sans allonger excessivement l’accueil.
- Page intitulée « Notre engagement », à `/engagement/` : proposition approuvée avec cette option, pour disposer d’une adresse lisible et partageable.
- « Votre plaidoyer conservé intégralement, sans réécriture » : proposition approuvée, pour respecter la voix et les nuances du texte fourni.
- « Un lien dans la navigation » et « un court extrait sur l’accueil, près de “Notre histoire” » : proposition approuvée, pour rendre le texte visible dans les parcours existants.
- « Une mise en page de lecture sobre, cohérente avec le site » : proposition approuvée, pour privilégier la lecture plutôt qu’un nouveau dispositif graphique.
- Cadrage écrit validé par l’utilisateur (« Oui »), y compris la première publication en français uniquement : le document ci-dessous constitue la référence pour l’implémentation.
- Demande complémentaire après publication dans le dépôt : « Traduit la en anglais aussi ». Ajouter la traduction avec la même présentation et les mêmes points d’accès ; cette demande lève la restriction française de la première publication, sans modifier le texte français.

## Extension anglaise demandée

Cette extension reprend le design approuvé, sans nouveau composant ni style. Ajouter `en/commitment.md`, à `/en/commitment/`, intitulé « Our commitment », avec `lang: en` et le même `ref: engagement`. Le titre du plaidoyer devient « For artificial intelligence that remains under our control ». Conserver les treize paragraphes, leur sens et leurs nuances, notamment les limites des modèles, les responsabilités d’hébergement et la sobriété ; garder la conclusion en gras.

Traduire également l’extrait de l’accueil anglais et son lien (« Read our commitment »), ainsi que le libellé de navigation. Les mécanismes existants relient désormais directement les deux traductions dans le sélecteur de langue et les alternates hreflang. Étendre les tests de texte, métadonnées, affichage, navigation mobile et dégagement de la conclusion à l’anglais. Les restrictions françaises et le repli du sélecteur EN décrits plus bas documentent uniquement la première publication, antérieure à cette demande.

## Périmètre proposé pour cette première publication

- Version française uniquement : aucune traduction ni page anglaise ne sont créées sans demande complémentaire. Les pages anglaises et leur navigation restent inchangées.
- Aucun formulaire, dispositif de don, lien de financement, nouvelle image, dépendance ou comportement JavaScript.
- Aucun remaniement des autres textes du site, même lorsque leurs formulations diffèrent de celles du plaidoyer.

## Page dédiée

- Ajouter `engagement.md`, avec le layout Jekyll `default`, `lang: fr`, `ref: engagement`, `permalink: /engagement/` et `title: Notre engagement`.
- Afficher un seul titre principal : « Pour une intelligence artificielle dont nous gardons la maîtrise ».
- Reproduire les treize paragraphes ci-dessous dans leur ordre, avec leur ponctuation et leurs accents. Conserver la dernière phrase en gras. Ne pas ajouter d’intertitres dans le plaidoyer.
- Utiliser un article sémantique, une largeur de lecture d’environ 70 caractères, une hauteur de ligne confortable et des espacements entre paragraphes.
- Réutiliser les couleurs, la typographie et les thèmes clair/sombre du site ; garder une lecture sans débordement sur mobile.
- Renseigner un titre SEO et une description propres à la page. Réutiliser les mécanismes existants de canonical, métadonnées sociales, sitemap et fil d’Ariane (`BreadcrumbList`).
- En l’absence de traduction, le sélecteur EN conserve son comportement actuel : retour vers `/en/`. Aucun équivalent anglais inexistant n’est annoncé dans les liens alternatifs.

## Navigation et extrait d’accueil

- Ajouter « Notre engagement » à la navigation française, après « Cas d’usage », sur ordinateur comme dans le menu mobile.
- Déclarer le libellé et l’URL dans `_data/translations.yml` ; n’afficher ce lien que lorsque l’URL est définie pour la langue courante.
- Ajouter sur l’accueil français une section `commitment-teaser`, immédiatement après `story` et avant `community`, sans supprimer ni renommer les ancres existantes.
- Titre de l’extrait : « Notre engagement ».
- Extrait repris mot pour mot du plaidoyer : « Nous défendons le droit de choisir où nos données sont traitées, quels modèles nous utilisons et comment nos outils évoluent. Le droit de comprendre un système, de l’adapter et de pouvoir en changer. »
- Lien de lecture : « Lire notre engagement », vers `/engagement/`, en utilisant le filtre Jekyll `relative_url` comme dans les autres pages.

## Architecture et vérifications

Le contenu reste statique et versionné dans Jekyll. Le layout et les includes existants composent la page ; seules des règles CSS ciblées de lecture sont nécessaires. Il n’y a ni traitement serveur supplémentaire ni état interactif propre au plaidoyer.

Les tests navigateur existants seront étendus pour vérifier :

- la disponibilité de `/engagement/`, sa langue française, son titre principal unique et son URL canonique ;
- la présence des treize paragraphes, leur texte exact et la conclusion en gras ;
- le lien dans la navigation française, sa disponibilité dans le menu mobile et sans JavaScript ;
- l’extrait et son lien à l’emplacement prévu sur l’accueil français ;
- l’absence d’ajout à l’accueil et à la navigation anglais, et le repli du sélecteur EN vers `/en/` ;
- l’absence de débordement horizontal sur petit écran et la lisibilité en thèmes clair et sombre ;
- la conservation des ancres existantes, en adaptant le test qui compare leur liste complète.

Vérification finale : `bin/verify` (construction Jekyll et liens internes), puis `node --test test/site-ui.test.mjs` (tests navigateur). Aucun changement direct dans `_site/`, qui est généré.

## Texte de référence

### Pour une intelligence artificielle dont nous gardons la maîtrise

Une entreprise possède des années de savoir-faire. Une association conserve la mémoire de ses actions. Une collectivité connaît son territoire. Derrière leurs documents, leurs échanges et leurs procédures, il y a un patrimoine construit par des personnes.

L’intelligence artificielle peut rendre ce patrimoine plus accessible. Elle peut aider à retrouver une information, comprendre un dossier, transmettre une compétence ou alléger une tâche répétitive. Mais son adoption pose une question essentielle : qui garde la maîtrise de ce que nous lui confions ?

Nous défendons le droit de choisir où nos données sont traitées, quels modèles nous utilisons et comment nos outils évoluent. Le droit de comprendre un système, de l’adapter et de pouvoir en changer.

C’est cette conviction qui anime Nosia.

Nosia permet de déployer une plateforme d’intelligence artificielle sur sa propre infrastructure, de l’appuyer sur ses documents et de la connecter à ses outils. Son code est ouvert : chacun peut l’étudier, l’utiliser, le modifier et contribuer à son évolution.

Ces choix techniques portent une ambition très concrète : donner aux organisations les moyens de construire une IA adaptée à leurs besoins, avec une maîtrise réelle de son fonctionnement.

Pour une petite entreprise, cela peut signifier retrouver une procédure sans interrompre toute une équipe. Pour une association, transmettre ses connaissances malgré le départ de bénévoles. Pour une organisation qui manipule des informations sensibles, choisir une architecture dans laquelle les documents et leur traitement restent dans un environnement maîtrisé.

Cette autonomie demande du travail. Héberger un logiciel implique de le maintenir, de le sécuriser et d’accompagner ses utilisateurs. Un modèle peut se tromper. Une réponse doit pouvoir être vérifiée. L’ouverture du code et l’hébergement local donnent des moyens d’agir ; la confiance se construit ensuite par la qualité du déploiement et des usages.

Nous défendons aussi une démarche de sobriété : partir d’un besoin précis, choisir un modèle et un matériel adaptés, mesurer l’utilité du service rendu. Chaque tâche ne nécessite pas le modèle le plus volumineux. Chaque nouvel usage mérite que l’on examine ses bénéfices et ses coûts.

Soutenir Nosia, c’est contribuer à rendre cette autonomie accessible. C’est financer du développement, de la documentation, des essais sur le terrain et de l’accompagnement. C’est permettre à davantage d’organisations de s’approprier ces technologies et de développer leurs compétences.

Nous invitons les entreprises, les associations, les collectivités, les développeurs et les partenaires à participer : tester Nosia sur un besoin réel, partager leurs retours, contribuer au code ou soutenir sa maintenance.

L’avenir de l’intelligence artificielle se joue aussi dans notre capacité collective à la comprendre, à l’adapter et à décider de la place que nous voulons lui donner.

**Avec Nosia, nous voulons rendre cette liberté concrète.**
