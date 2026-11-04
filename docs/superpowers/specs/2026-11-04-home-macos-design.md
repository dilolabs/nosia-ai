# Accueil Nosia accessible au grand public, macOS en premier

## Demande

Mettre à jour la page d’accueil pour présenter l’application native macOS de Nosia v0.6.1 avant Linux et Windows, expliquer son installation et rendre l’ensemble compréhensible aux personnes non techniciennes. S’appuyer si utile sur la vidéo française et le plaidoyer existant.

## Decisions

- « Mettre en avant macOS avant Linux et Windows » : rendre le nouveau parcours natif prioritaire, sans supprimer les autres plateformes.
- « Vulgarise la page d’accueil […] à des personnes non techniciens informatique » : partir des usages et expliquer les termes plutôt que supposer des connaissances techniques.
- « Inspire toi du plaidoyer si besoin ou cite le en extrait » : autoriser sa réutilisation éditoriale sans modifier le plaidoyer lui-même.
- Compagnon visuel accepté (« Oui ») : comparer des maquettes dans le navigateur pendant le cadrage.
- « Français et anglais (conseillé) » : appliquer la simplification et la priorité macOS aux deux accueils pour conserver une expérience cohérente entre les langues.
- « Lecteur intégré (conseillé) » pour la vidéo d’installation : proposer la vidéo à côté des étapes écrites, sans lecture automatique, et l’indiquer comme étant en français sur l’accueil anglais.
- Approche « C » choisie : placer la conviction et la liberté de choix au début, puis les usages concrets et l’installation, pour rester dans l’esprit du plaidoyer.
- Ton et ordre de la maquette C détaillée validés (« Oui ») : conserver le bandeau éditorial, l’extrait du plaidoyer, les usages, le guide Mac avant Linux/Windows, puis une FAQ grand public et les ressources techniques plus bas.
- Cadre d’intégration validé (« Oui ») : conserver le site actuel sans nouvelle dépendance, héberger la vidéo avec le site sans lecture ni chargement automatique, conserver les étapes écrites, exposer les prérequis Mac et limiter la confidentialité à l’espace « Sur ce Mac » ; ces choix rendent le parcours accessible sans promesses excessives.
- Corrections ciblées des réponses d’installation des FAQ FR/EN et vérifications mobile, langues, thèmes, accessibilité et lecture réelle validées avec le cadre : éviter les contradictions et les régressions sans refondre les autres pages.
- « Le plaidoyer et ses films restent inchangés » : préserver les contenus existants tout en utilisant un court extrait sur l’accueil.

## Contexte vérifié

- Site statique Jekyll, accueils dans `index.md` et `index-en.md`, bandeau partagé dans `_includes/home-hero.html`, textes du bandeau dans `_data/home.yml`.
- L’accueil actuel cible les développeurs : RAG, MCP, API, Docker et commande Terminal dès le premier écran.
- La page `engagement.md` met en avant les usages concrets, la maîtrise des données, l’ouverture et la sobriété ; elle rappelle qu’une IA peut se tromper.
- Les tests navigateur existants couvrent les deux langues, les thèmes, le mobile, la navigation, la copie des commandes et les films du plaidoyer.
- Le dépôt est propre au début du cadrage. Les derniers commits concernent les films du plaidoyer.

## Sources de la version macOS

- Release : https://github.com/dilolabs/nosia/releases/tag/v0.6.1
- Téléchargement confirmé par l’API GitHub : https://github.com/dilolabs/nosia/releases/download/v0.6.1/Nosia-Native-arm64.dmg
- Vidéo française publique référencée par la release : https://github.com/user-attachments/assets/1f41e171-75e7-4cf8-bacb-889312e4e8cb
- Le lien privé signé fourni dans la demande est temporaire : ne pas le publier comme URL durable.
- Le contenu vidéo n’a pas été visionné à ce stade ; les informations d’installation ci-dessous proviennent des notes de version.
- Une requête GET partielle au lien public de la vidéo fonctionne (HTTP 206, `video/mp4`) et indique une taille totale de 6 669 573 octets. Une requête HEAD redirigée reçoit un 403 ; ne pas en déduire que la lecture GET est indisponible.

## Faits à respecter

- Application destinée aux Mac avec puce Apple M1 ou ultérieure, sous macOS 26.5 ou ultérieur.
- Prévoir au moins 16 Go de mémoire pour la configuration d’IA fournie, une connexion internet pour les téléchargements initiaux de plusieurs gigaoctets et de l’espace pour les documents.
- Installation : télécharger le DMG, l’ouvrir, glisser Nosia dans Applications, ouvrir Nosia, cliquer sur « Préparer Nosia » et suivre les indications. Aucune commande Terminal à saisir pour ce parcours.
- Employer les libellés de l’application dans chaque langue : « Sur ce Mac » / « On this Mac » et « Préparer Nosia » / « Set Up Nosia ».
- Un mot de passe administrateur ainsi que des autorisations réseau local et Trousseau peuvent être demandés ; l’app accompagne ces étapes.
- Application et DMG signés par Dilolabs et notarisés par Apple.
- Dans l’espace « Sur ce Mac », l’IA s’exécute localement et les conversations et documents sont conservés sur l’ordinateur. Ne pas généraliser cette promesse aux espaces Cloud et aux connexions externes.
- Fermer la fenêtre laisse Nosia actif ; quitter l’application arrête les services locaux et conserve les données.

## Approches examinées

1. **Bénéfices, puis installation — recommandation initiale, non retenue.** Présenter une IA utile au quotidien, trois usages simples, puis un guide macOS avec sa vidéo. Téléchargement Mac accessible dès le bandeau ; Linux et Windows après le parcours Mac. Bon équilibre entre compréhension et passage à l’action.
2. **Installation d’abord.** Organiser l’accueil autour du téléchargement Mac et des étapes de préparation ; présenter les usages ensuite. Plus direct pour une personne déjà décidée, mais moins explicatif pour les nouveaux visiteurs.
3. **Conviction d’abord — retenue par l’utilisateur.** Ouvrir sur la maîtrise des données et un extrait du plaidoyer, puis montrer les usages et l’installation. Identité plus éditoriale, mais accès moins immédiat à l’explication du produit.

Les trois propositions conservent l’identité verte, remplacent le Terminal du bandeau par un contenu accessible et placent macOS avant Linux et Windows. Seule l’approche C est à implémenter.

## Design approuvé — parcours et rédaction

- Bandeau éditorial : « Une IA utile. Et la liberté de choisir. », avec une explication immédiate de Nosia comme assistant pour écrire, réfléchir et interroger ses documents. Expliquer « IA » par « intelligence artificielle » ; aucun Terminal ni sigle destiné aux développeurs (RAG, MCP, API, SSE) dans le premier écran.
- Introduction proposée : « Vos documents racontent votre travail, vos projets et votre histoire. Vous devriez pouvoir vous faire aider par une IA sans en perdre la maîtrise. » La phrase suivante explique concrètement le rôle de Nosia et le fonctionnement de l’espace « Sur ce Mac ». Adapter naturellement ces textes en anglais sans changer leur sens.
- Bouton principal « Télécharger pour Mac », lien vers les étapes et accès secondaire à Linux et Windows. Compatibilité et mémoire visibles près du téléchargement.
- Extrait exact du plaidoyer : « Le droit de comprendre un système, de l’adapter et de pouvoir en changer. », avec lien vers `/engagement/`. En anglais, reprendre la phrase correspondante du plaidoyer anglais et pointer vers `/en/commitment/`. Ne pas réécrire les pages du plaidoyer.
- Trois usages en langage courant : préparer un texte, comprendre un dossier et retrouver une information ; pas de promesse d’exactitude des réponses.
- Parcours macOS avec étapes numérotées, vidéo à côté sur grand écran et en dessous sur mobile, prérequis et explication des autorisations.
- Linux puis Windows dans un bloc secondaire après le parcours Mac, sans les présenter comme des applications natives.
- Questions fréquentes grand public : prix, compatibilité, confidentialité selon l’espace utilisé, préparation initiale, limites de l’IA.
- Conserver les accès aux cas d’usage, à l’histoire, à la communauté, aux comparaisons et à la documentation ; réunir les informations destinées aux équipes techniques plus bas. La démonstration technique existante y devient un lien plutôt qu’un second lecteur concurrent du tutoriel Mac.
- Adapter également les titres SEO et descriptions des deux accueils, les cartes de fonctionnalités et le libellé « Déployer Nosia » en « Installer Nosia » dans l’en-tête partagé.
- Identité visuelle conservée : vert Nosia, fonds sobres, typographie système, thèmes clair/sombre, lecture aérée et mise en page adaptative.

### Ordre des contenus

1. Bandeau éditorial et téléchargement Mac.
2. Extrait du plaidoyer.
3. Usages concrets et accès aux cas d’usage détaillés.
4. Installation macOS et vidéo, puis Linux et Windows.
5. FAQ grand public.
6. Histoire, rappel de l’engagement et communauté.
7. Ressources techniques, comparaisons et lien vers la démonstration existante.
8. Pied de page et liens existants.

L’extrait placé après le bandeau ne supprime pas le lien vers le plaidoyer dans la navigation ni son rappel après l’histoire. La maquette détaillée est conservée dans `.superpowers/brainstorm/387673-1793803122/03-direction-c-detail.html` (fichier local ignoré par Git) ; le présent document constitue la référence durable.

## Design approuvé — intégration et vérification

### Composants et données

- Conserver Jekyll et les mécanismes actuels de traduction ; pas de framework ou de dépendance JavaScript supplémentaire.
- Conserver `_data/home.yml` pour les textes localisés du bandeau ; centraliser les faits macOS partagés (version, URL DMG, compatibilité, mémoire et source vidéo locale) dans `_data/downloads.yml`.
- Remplacer le contenu développeur de `_includes/home-hero.html` par le bandeau éditorial approuvé ; réutiliser un include `_includes/home-installation.html` pour le guide d’installation FR/EN.
- Les deux pages d’accueil consomment les mêmes faits et des textes traduits. Les liens pointent vers le DMG versionné v0.6.1 et la release d’origine ; pas de détection automatique du système ni de changement silencieux de version.
- Les styles restent dans les feuilles CSS existantes, limités aux éléments concernés ; conserver thèmes, navigation, changement de langue et copie des commandes.
- Conserver `#quickstart`, `#documentation`, `#community`, `#features`, `#faq` et les autres ancres publiques utilisées ; ajouter `#other-installations` pour l’accès secondaire Linux/Windows.

### Vidéo et cas d’échec

- Lors de l’implémentation, récupérer le MP4 public dans `assets/films/nosia-macos-installation-fr-v0.6.1.mp4`, sans réencodage ; ne pas embarquer les URLs signées temporaires dans le site.
- Lecteur HTML natif avec contrôles, `playsinline`, `preload="none"`, nom accessible traduit et espace réservé au ratio réel. Pas d’autoplay, de boucle ni de lecteur tiers.
- Légende indiquant que la vidéo est en français dans les deux langues. Lien visible pour ouvrir le fichier et étapes écrites utilisables si la vidéo ne se charge pas.
- Aucune transcription ou piste de sous-titres inventée : les étapes constituent le guide écrit, pas une transcription vérifiée de la vidéo.
- Si le MP4 ne peut pas être récupéré ou décodé lors de l’implémentation, signaler le blocage plutôt que publier un lecteur vide ou affirmer que sa lecture est vérifiée.
- Préparation initiale : expliquer les téléchargements et les demandes possibles de mot de passe administrateur, d’accès au réseau local et au Trousseau. Ne pas promettre une durée fixe ni une installation sans internet.

### Cohérence et limites du périmètre

- Actualiser SEO, descriptions et FAQ des accueils ; le JSON-LD reprend la FAQ affichée, présente macOS avant Linux/Windows et utilise la catégorie `ProductivityApplication` plutôt que `DeveloperApplication`.
- Corriger aussi, de manière ciblée, les réponses d’installation et de configuration des FAQ dédiées `faq.md` et `en/faq.md`, qui présentent encore Docker comme le parcours Mac. Ne pas refondre ces pages.
- Ne modifier ni les textes ni les films du plaidoyer, les autres pages de contenu, les scripts d’installation ou le déploiement du site.
- Les commandes Linux et Windows existantes restent inchangées, avec copie fonctionnelle ; elles sont placées après macOS, dans un bloc secondaire dépliable utilisable sans JavaScript.
- Commande Linux : `curl -fsSL https://get.nosia.ai | sh`. Commande Windows, dans PowerShell : `irm https://get.nosia.ai/install.ps1 | iex`. Ne pas afficher ces commandes dans le bandeau ni laisser entendre qu’elles sont nécessaires au parcours Mac natif.

### Vérifications prévues

- `bin/verify` : construction Jekyll et vérification des liens internes.
- Tests navigateur Node existants et tests ajoutés : parcours FR/EN, ordre macOS/Linux/Windows, absence de commande dans le bandeau, liens DMG/release, prérequis, FAQ et métadonnées cohérentes.
- Vidéo réelle : présence du fichier, chargement à la demande, métadonnées, lecture et progression après action volontaire ; absence d’autoplay et de téléchargement vidéo avant action.
- Affichage à 320, 375, 768 et 1280 px, thèmes clair/sombre, navigation clavier, focus visible, absence de débordement et accès au guide et aux commandes sans JavaScript.
- Tests de non-régression du plaidoyer et de ses films ; mettre à jour uniquement les assertions devenues incompatibles avec la nouvelle structure d’accueil approuvée.

## Critères de réussite

- Une personne sans connaissances techniques comprend ce qu’est Nosia, ce qu’elle peut en faire et comment commencer sur un Mac compatible.
- Le téléchargement natif v0.6.1 et les prérequis sont accessibles dès le bandeau ; macOS précède Linux et Windows dans le parcours d’installation des deux langues.
- Les étapes écrites suffisent pour installer Nosia ; le tutoriel français est lisible à la demande sur les deux accueils.
- Les formulations distinguent clairement le fonctionnement local de l’espace « Sur ce Mac » des espaces Cloud et des connexions externes. Elles rappellent qu’une réponse d’IA peut nécessiter une vérification.
- Les ressources techniques restent accessibles sans dominer le parcours grand public ; aucune régression des pages du plaidoyer, de leurs films, des ancres conservées ou de la navigation FR/EN.
