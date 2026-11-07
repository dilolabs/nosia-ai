# Nosia — un modernisme chaleureux, une vraie page produit

Référence du site vitrine, 7 novembre 2026. Implémentation : `assets/css/marketing.css`. Ce document complète les tokens historiques de `style.css` et les spécifications de novembre ; il ne les écrase pas et ne redessine pas l’application.

## Audit : observation, code et proposition

| Source | Constat vérifié | Conséquence |
| --- | --- | --- |
| **Dilolabs en ligne**, https://dilolabs.fr/ | Consulté dans Chromium à 1440 × 1000 et 375 × 812. Raleway, papier ivoire, panneaux généreusement arrondis, bleu sombre, vraies captures, ton concret, interactions sobres. Aucune largeur de page débordante observée. | Reprendre la famille, pas copier l’identité bleue. |
| **Dilolabs en ligne**, `/contact` | Parcours public « Parlons de votre besoin », sans compte ; accompagnement IA sur le site. | Liens d’accompagnement vers `https://dilolabs.fr/contact`, sans inventer une offre Nosia, un prix ou un formulaire local. |
| **Dilolabs dans le code voisin**, `docs/design-system/swiss-redesign.md`, `marketing-swiss-tokens.scss`, `fonts.scss` | Valeurs exactes des couleurs, rayons, ombres et police ; Heroicons outline ; Cyril, Aude et Melvin co-gérants. Les valeurs concordent avec le rendu public consulté. | Réutiliser les fondations effectivement disponibles. Aucune modification du dépôt Dilolabs. |
| **Nosia en ligne** | `nosia.ai` n’a pas répondu via webfetch, curl (résolution expirée) et Chromium. `get.nosia.ai` inaccessible également. | Ne pas prétendre avoir inspecté le Nosia public. Audit des pages via le dépôt et le build local ; disponibilité réseau des installateurs non certifiée. |
| **Nosia dans ce dépôt** | Jekyll 4/Liquid, Markdown + HTML, YAML FR/EN, CSS natif, JS progressif sans bundler. Aucun AGENTS.md ni MASTER.md trouvé dans ce dépôt. Tokens historiques au début de `style.css`, corrections et ancien accueil dans `developer.css`, specs antérieures dans `docs/superpowers`. Dépôt propre au départ ; 96 tests navigateur réussis avant modification. | Garder la stack, la navigation, les deux langues, les URL, les ancres, le thème et les films. Nouvelle couche publique explicite, sans dépendance JS. |
| **Assets Nosia** | Logo PNG 393 × 121 transparent : verts dominants mesurés `#1BD626` et `#16AB21`. Gamme CSS verte existante, dont `#166534`. GIF de démonstration ancien ; trois MP4 locaux. Pas de police locale initiale ni de carte sociale malgré sa référence SEO. | Logo inchangé ; vert foncé existant pour les textes et CTA contrastés. Pas de GIF animé automatique. |
| **Produit public**, README et release GitHub v0.6.1 | Documents, conversations, configuration locale Mac, espaces distants, RAG, MCP, API compatible OpenAI et compétences d’agent. MIT confirmé par LICENSE. DMG, M1+, macOS 26.5+, 16 Go conseillés, téléchargements initiaux et autorisations confirmés par l’API GitHub de release. | Séparer parcours Mac natif et plateforme d’équipe. Ne pas attribuer toute capacité technique à chaque configuration du client Mac. |
| **Produit dans le code voisin** | Routes de conversation, sources, serveurs MCP et `/v1/chat/completions` présentes. | Confirmation complémentaire, sans lancer ni modifier l’application ni une base de données. |
| **Proposition de redesign** | Hiérarchie orientée usages, capture réelle dès l’ouverture, explication progressive, fond commun et accent vert. Retour en haut dans le footer, pas au-dessus des textes. | Décisions nouvelles du site vitrine, pas des faits produit ou des propriétés supposées du site public. |

Sources produit : [README](https://github.com/dilolabs/nosia), [release v0.6.1](https://github.com/dilolabs/nosia/releases/tag/v0.6.1), [API release](https://api.github.com/repos/dilolabs/nosia/releases/tags/v0.6.1), [MIT](https://github.com/dilolabs/nosia/blob/main/LICENSE). Les chemins CONTRIBUTING, CODE_OF_CONDUCT et les cinq ressources techniques liées ont retourné HTTP 200 sur raw.githubusercontent.com pendant l’audit.

## Utilisation effective de ui-ux-pro-max

SKILL.md lu à `/home/cbldev/.opencode/skills/ui-ux-pro-max/SKILL.md`. Script présent à `scripts/search.py` dans ce répertoire ; Python 3.13.5 disponible. Aucune installation système.

| Recherche exécutée | Résultat vérifié | Décision |
| --- | --- | --- |
| `self-hosted AI platform --design-system -p Nosia -f markdown` | **Product Demo + Features**, style AI-Native UI, violet/cyan, Inter, animations de conversation. | Retenir preuve produit + explication + CTA. Rejeter palette, police et animations génériques : elles ne correspondent pas à la famille vérifiée. |
| `Swiss Modernism 2.0 --domain style` | `swiss-modernism-2-0`, supplemental, parent `minimalism-and-swiss-style` ; grille et hiérarchie. | Rigueur de composition et rythme, **pas angles carrés**. |
| `Soft UI Evolution --domain style` | `soft-ui-evolution`, active ; profondeur subtile, focus et contraste. | Complément chaleureux ; rejeter neumorphisme, plastique, pastels et rayon uniforme de l’exemple automatique. |
| `product showcase --domain landing` | Aucun résultat. Reprise unique : `Product Demo Features`, premier résultat **Product Demo + Features**. | Deux captures statiques authentiques plus utiles qu’une fausse démo interactive. Vidéo existante volontaire, sans préchargement. |
| `editorial system sans --domain typography` | Premier résultat mobile/system bold, peu adapté. Reprise : `professional warm sans`, **Modern Professional**, Poppins / Open Sans. | Ton professionnel accessible retenu ; familles proposées non importées. Raleway locale donne la parenté effective avec Dilolabs. |
| `focus not obscured --domain ux` | Focus Not Obscured Enhanced (AAA) et Minimum (AA), Web. | Focus 3 px décalé, gouttière du menu protégée, aucune superposition flottante. Ne pas assimiler AAA à une exigence AA. |
| `reduced motion interaction --domain ux` | Reduced Motion, Excessive Motion, Motion Sensitivity. | Pas d’animations d’entrée, de parallax ou d’arrière-plan animé ; transitions couleur 160 ms, supprimées en mouvement réduit. |
| `responsive semantic keyboard --stack html-tailwind` | Semantic colors, Focus visible, Theme color variables. | Seules les règles transférables à HTML/CSS sont utilisées. **Jekyll/CSS natif n’est pas une stack du catalogue** : ne pas introduire Tailwind, `@theme`, React ou GSAP. |

Pas de `--persist --force` : aucune sortie automatique non vérifiée n’est devenue la charte. Ce document est la synthèse choisie après audit, et non la palette brute du générateur.

## Tableau de cohérence

| Élément | Commun avec Dilolabs | Propre à Nosia |
| --- | --- | --- |
| Typographie | Raleway locale, titres 600, hiérarchie nette, interligne confortable | Monospace système réservé aux commandes |
| Surfaces | Papier ivoire, blanc, bordures fines, ombres neutres légères | Teinte vert chaud, thème sombre conservé |
| Composants | Contrôles 14 px, cartes 24 px, panneaux 28–36 px, focus 3 px | Copie des commandes, installation Mac, ressources développeurs |
| Composition | Rythme 4/8 px, conteneur 1248 px, sections ouvertes et panneaux | Interface Nosia dès l’ouverture, repères d’usage sous la capture |
| Identité | Heroicons outline 24/1,5 px, ton direct, interactions sobres | Nom, logo et gamme verte existants, aucun bleu emprunté |
| Édition | Besoin avant technologie, rôle de l’entreprise explicite | Déploiement, données, modèles, contribution et communauté |

## Tokens retenus

Les valeurs communes ci-dessous sont relevées dans Dilolabs ; la teinte verte et le thème sombre sont des **adaptations proposées**, pas des tokens prétendument observés chez Dilolabs.

| Token | Clair | Sombre | Rôle |
| --- | --- | --- | --- |
| `--site-paper` | `#f8f7f3` | `#171c19` | Papier |
| `--site-surface` | `#ffffff` | `#222923` | Cartes |
| `--site-soft` | `#eeede7` | `#2b332b` | Panneaux secondaires |
| `--site-ink` | `#202627` | `#f1f3ed` | Texte principal |
| `--site-muted` | `#545b5c` | `#bdc5bb` | Texte secondaire |
| `--site-line` | `#d3d5cf` | `#495347` | Bordure décorative |
| `--site-control` | `#777f80` | `#8c9988` | Frontière des contrôles |
| `--site-brand` | green-800 `#166534` | green-300 `#86efac` | Liens, CTA, focus |
| `--site-brand-hover` | green-900 `#14532d` | green-200 `#bbf7d0` | Retour d’interaction |
| `--site-tint` | `#eaf1e6` | `#263b2b` | Panneaux verts discrets |

- Le logo conserve ses verts lumineux intacts ; ils ne deviennent pas une couleur de texte sur papier.
- Code : fond `#202627`, texte `#f1f3ed`, statut `#bdc5bb`, frontière `#8c9988`. Même contraste dans les deux thèmes, sélection et retour de copie conservés.
- Rayons : petit 10 px ; bouton/champ 14 px ; capture imbriquée 14–20 px ; carte 24 px ; panneau 28–36 px fluide. Le padding réel sépare les rayons imbriqués. Pas de capsule systématique.
- Espaces : 4, 8, 12, 16, 24, 32, 48, 64, 96 px ; sections 64–112 px ; gouttières 16–48 px. Grilles 5/7 environ à l’ouverture, 4/8 aux sections éditoriales ; une colonne quand le contenu le demande.
- Raleway variable latin, 47 Ko, locale, `font-display: swap`, secours système. Titres 600, texte 400, libellés 600/700. Aucun appel Google Fonts. Licence dans `assets/fonts/OFL.txt` ; source binaire : fichier inchangé du site Dilolabs voisin.
- Corps 16–18 px, paragraphes secondaires 15 px, légendes 12–13 px, micro-libellés de capture 9–10 px sans information exclusive. H1 fluide 30–64 px, H2 28–44 px. Mesure de lecture bornée ; engagement à 900 px maximum, corps 18 px.
- SVG Heroicons 24 outline, trait 1,5 px, importés en chemins locaux sans bibliothèque JS ; décoratifs à côté du texte. Licence `assets/licenses/heroicons.txt`.
- Ombres : `0 4px 16px rgb(32 38 39 / 4%)`, surélevée `0 8px 24px rgb(32 38 39 / 7%)`. Pas d’ombre interne ni de glow.

## Composants, parcours et contenu

1. Ouverture : promesse usages/maîtrise, téléchargement Mac vérifié, lien de fonctionnement, prérequis et alternatives, signature Dilolabs, vraie capture légendée. Pas de terminal dans le premier écran.
2. Trois usages avec besoin, action et question **illustrative** ; avertissement sur les erreurs d’IA. Cas d’usage détaillés conservés à leurs URL.
3. Produit : capture entière, trois repères textuels sous l’image et accès au PNG grand format sur mobile. Les repères ne sont pas des contrôles fictifs ni des annotations modifiant l’application.
4. Fonctionnement : documents, modèles, outils et hébergement en lecture simple ; RAG, MCP et API développés au second niveau, lien d’architecture.
5. Installation : Mac natif v0.6.1 en premier ; étapes écrites et vidéo volontaire. Prérequis centralisés dans `_data/downloads.yml`, pas de détection automatique ou téléchargement déclenché par la page. Linux et Windows dans une disclosure native, prérequis Docker et avertissement avant les commandes. Guide complet lié. Serveur d’équipe traité séparément.
6. Ouverture : licence MIT, choix du déploiement et obligations d’exploitation. **Le lieu de traitement dépend aussi des modèles et services externes activés.** Pas de promesse absolue, de conformité ou d’avantage économique garanti.
7. Entreprise et communauté : trois co-gérants nommés séparément de l’histoire. Contributions d’Olivier et François préservées. Lien vers accompagnement réel ; ressources GitHub, blog, Docker Hub et comparaisons conservés.
8. FAQ, action finale et footer commun à toutes les pages ; retour en haut inline. Pas de formulaire, tarif, témoignage, connecteur ou chiffre ajouté sans source.

Les versions anglaises « coming soon » sur les compétences d’agent sont corrigées selon le README actuel. Les pages de comparaison décrivent des catégories de produits, sans inventer des prix ou une exhaustivité de compatibilité. Les textes et films du plaidoyer restent inchangés.

La comparaison Ollama est aussi corrigée après consultation de [l’annonce officielle de l’application](https://ollama.com/blog/new-app) et de [la FAQ actuelle](https://docs.ollama.com/faq) : l’application macOS/Windows permet bien les conversations et les fichiers ; les modèles cloud existent. Les anciens « pas d’interface » et « toujours local » n’étaient plus exacts. Sources datées liées sur les pages FR/EN.

## Provenance des captures et médias

- Source : `assets/films/nosia-macos-installation-fr-v0.6.1.mp4`, déjà versionné, 1048 × 720, 108,4 s.
- Décodage dans Chromium et export canvas à **100 s** (espace de travail) et **106 s** (nouvelle conversation). Recadrage extérieur `904x574+73+73` pour enlever le bureau, sans reconstruire l’interface ni son contenu ; aucun pixel intérieur utile masqué par un panneau.
- `nosia-workspace.webp` ≈26 Ko, `nosia-macos.webp` ≈16 Ko. PNG de secours/grand format ≈114/74 Ko. Dimensions intrinsèques renseignées, image d’ouverture prioritaire, seconde différée.
- Poster du tutoriel : vraie image à 30 s, redimensionnée à 800 px, ≈10 Ko. Il ne lance pas la lecture et n’est pas une promesse de durée de préparation.
- Interface des captures en français dans les deux langues : légende explicite. Pas de fausse traduction graphique ni de réponse d’assistant inventée.
- Carte sociale 1200 × 630 : composition statique du vrai logo, de la promesse et de la capture à 100 s, rendue dans Chromium avec les mêmes tokens et la police locale. Elle remplace une référence OG jusque-là absente ; aucun élément fictif ajouté à l’interface.
- Le GIF ancien reste accessible par son lien historique, pas chargé dans la page. Films du plaidoyer et tutoriel sans autoplay, sans boucle, `preload="none"`, contrôles et liens de secours conservés.

## Contrat d’accessibilité et recette

HTML sémantique, un H1, navigation nommée/active, lien d’évitement, langue et correspondance FR/EN natives. Menu progressif disponible sans JS, Échap et restitution du focus, focus non rogné par le défilement du menu. Aucun `overflow: hidden` ajouté aux grands panneaux. Captures sans `object-fit: cover`. Tableaux nommés, focusables et défilants indépendamment de la page, en-têtes associés. Code sélectionnable et retours de copie annoncés après succès ou échec réel.

La recette exécutée, les captures visuelles et les limites sont consignées dans `docs/redesign-verification.md`. Il ne s’agit pas d’une certification WCAG ni d’un test complet de l’application ou de l’installation sur chaque OS.
