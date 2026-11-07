# Recette du redesign Nosia

7 novembre 2026. Site vitrine uniquement ; aucune modification du produit, de sa base ou des scripts d’installation. Ce rapport décrit l’état validé avant l’intégration Git locale demandée ensuite. Aucun push ou déploiement de production effectué.

## Prévisualisation

- Français : http://localhost:4000/
- Anglais : http://localhost:4000/en/
- Serveur : `bundle exec jekyll serve --host 0.0.0.0 --port 4000 --skip-initial-build --no-watch` après construction. Le serveur sert `_site` ; relancer `bin/verify` après une modification pour actualiser ce mode sans surveillance.

## Livrables

- [Design system, audit sourcé et tableau Nosia / Dilolabs](design-system/nosia.md).
- [Plan et décisions](superpowers/plans/2026-11-07-nosia-redesign.md).
- Couche publique `assets/css/marketing.css`, contenus FR/EN dans `_data/home.yml` et `_data/product.yml`, includes partagés.
- Captures réelles WebP/PNG, police locale licenciée, carte sociale 1200 × 630 ; logo d’origine intact.
- Accueils, cas d’usage, FAQ, comparaisons, engagement et 404 avec un même shell. Les textes du plaidoyer et les MP4 sont inchangés.

## Vérifications exécutées

| Contrôle | Résultat |
| --- | --- |
| État initial | Dépôt propre ; **96/96 tests** avant intervention. |
| Tests ajoutés avant implémentation | Cinq tests de redesign échouaient sur la capture absente, la famille de police, les tableaux et les promesses absolues ; corrigés. Régression Ollama également observée avant correction. |
| `bin/verify` | Construction Jekyll et HTML-Proofer réussis : **14 fichiers**, **37 liens internes**, ancres dans **13 fichiers**. Un avertissement Ruby `IO::Buffer` expérimental émis par html-proofer, pas une erreur du site. Les liens externes ne sont pas couverts par cette commande. |
| `node --test test/*.test.mjs` | **109 tests réussis, 0 échec, 0 ignoré** lors de la recette finale. |
| Responsive | Accueils FR/EN, clair/sombre : 320, 375, 768, 1024, 1280, 1440 px selon les suites ; paysage 812 × 375. Toutes les pages de contenu et 404 vérifiées à 320 et 720 px, sans débordement horizontal de page. |
| Zoom | Reflow vérifié au viewport **720 CSS px**, équivalent d’un écran 1440 px zoomé à **200 %**. Ce n’est pas un essai manuel du zoom dans tous les navigateurs. |
| Typographie et surfaces | Raleway réellement chargée ; rayons mesurés : panneau 28 px mobile / 36 px desktop, carte 24 px, boutons 14 px. Largeur de l’engagement corrigée à 900 px maximum. |
| Contraste | Calcul dans Chromium des couleurs composées des textes visibles, disclosures ouvertes, sur les nouvelles surfaces et les contrôles en clair/sombre : ≥4,5:1 pour texte normal, ≥3:1 pour grands caractères. Tests de contrastes historiques maintenus. Pas de certification d’accessibilité. |
| Navigation clavier | Lien d’évitement, menu mobile, Échap/restitution du focus, changement de breakpoint, copie des commandes et retour en haut. Gouttières de focus du menu testées en portrait/paysage. |
| Tableaux mobiles | Région nommée et focalisable, trois en-têtes de colonnes, défilement indépendant. Un vrai appui Chromium `ArrowRight` a déplacé le tableau ; consigne visible ajoutée. |
| Sans JavaScript | Navigation, liens de langue, étapes écrites, disclosures, commandes sélectionnables et liens vidéo disponibles. Boutons de copie masqués si non initialisés. |
| Médias | Tutoriel Mac et deux films : type MP4, requêtes partielles HTTP 206, décodage, lecture après geste et recherche temporelle testés. Aucune lecture automatique ni requête de tutoriel au chargement. Échec du lecteur : étapes et fichier de secours conservés. |
| Presse-papiers | Succès annoncé seulement après résolution de la copie ; API absente et rejet testés dans les deux parcours. |
| Métadonnées | Canonical, alternates FR/EN et redirection `/index-en.html` conservés. JSON-LD analysable, FAQ identique au contenu visible, publisher Dilolabs corrigé, image OG réellement présente. |
| Sous-chemin | Build `--baseurl /preview --destination /tmp/opencode/nosia-baseurl` réussi. Analyse HTML de tous les `href`, `src` et `poster` relatifs à la racine : préfixe conservé. Quatorze liens historiques en dur ont été corrigés, URL de production inchangée. |
| Prévisualisation réelle | `http://127.0.0.1:4000/` retourne HTTP 200. |

Les tests d’ancienne composition ont été actualisés pour l’ordre des sections, le nouveau titre, les huit questions et le retour inline plutôt que flottant. Les assertions de contenu du plaidoyer, de métadonnées, de films, de navigation, de copie, de thèmes et de lecture ont été conservées. L’ancienne assertion « tous les fonds identiques » exclut désormais les nouveaux bandeaux volontairement teintés, pas les contrôles de contraste.

Relecture indépendante en lecture seule : aucune anomalie importante détectée ; rendu statique sans cible locale manquante, doublon d’identifiant ou JSON-LD invalide. Deux remarques mineures intégrées avec tests de régression : traduction « Normandy » dans le pied de page anglais et avertissement d’exécution placé **avant** les commandes copiables.

## Inspection visuelle réalisée

Captures Chromium dans `/tmp/opencode/nosia-review/` : les deux accueils en FR/EN et clair/sombre, 320/375/768/1440 px et paysage ; détails usages, produit, installation, équipe, FAQ, comparaison et engagement. Images effectivement relues : ouvertures FR desktop clair/sombre, FR mobile, EN 320 sombre et desktop, tablette, capture produit mobile, installation mobile/desktop, comparaison mobile et engagement desktop.

Points corrigés après lecture : coupures mal équilibrées de la promesse desktop, capture d’ouverture trop vide remplacée par l’espace de travail réel, mesure de lecture de l’engagement, typographie des prérequis, couleur de la promesse en sombre, tableau mobile sans consigne et retour flottant empiétant auparavant sur l’espace de lecture. Aucun panneau n’ajoute de découpe `overflow: hidden` aux textes ou aux focus.

Références visuelles Dilolabs : `/tmp/opencode/dilolabs-current-1440.png`, `/tmp/opencode/dilolabs-current-375.png`. Avant Nosia local : `/tmp/opencode/nosia-before-desktop.png`, `/tmp/opencode/nosia-before-mobile.png`. Ces captures de diagnostic sont temporaires et non publiées sur le site.

## Limites et informations manquantes

- **Nosia public et installateurs non joignables** depuis cet environnement (`nosia.ai`, `get.nosia.ai`). Les méthodes et prérequis sont vérifiés dans le README public et la release GitHub ; les scripts n’ont pas été exécutés, le DMG n’a pas été installé. Leur disponibilité réseau et le parcours système complet restent à tester sur les OS concernés.
- L’application elle-même n’a pas été exécutée : captures extraites du tutoriel réel v0.6.1. Interface en français signalée sur l’accueil anglais. Pas de nouveaux cas clients, de métriques ou de résultats inventés.
- Tests sur Chromium headless/Linux ARM ; pas de Safari, Firefox, lecteur d’écran matériel ou appareil mobile réel. Les vérifications sémantiques et clavier ne remplacent pas une recette assistive humaine.
- Pas d’audit exhaustif des services externes ni de leurs politiques. Les chemins GitHub de documentation/contribution et le contact Dilolabs ont été consultés ; la disponibilité future des liens n’est pas garantie.
- Un lancement initial de prévisualisation a rencontré une collision entre deux builds écrivant simultanément `_site`. Cause identifiée, construction séquentielle puis serveur `--skip-initial-build --no-watch` ; aucune modification de dépendance nécessaire.
- Le choix d’un hébergement, d’un modèle, d’un service documentaire ou d’un serveur MCP exige une analyse de flux et des droits adaptée à l’organisation. Le site n’en déduit ni conformité, ni confidentialité absolue, ni coût garanti.
