# Films du plaidoyer Nosia

## Demande

« Ajoute la vidéo des films du plaidoyer de @assets/films/ » : intégrer les médias fournis au plaidoyer existant, sans modifier les textes français et anglais.

## Contexte vérifié

- Page française : `engagement.md`, publiée à `/engagement/`.
- Page anglaise : `en/commitment.md`, publiée à `/en/commitment/`.
- Film français : `assets/films/nosia-film-fr-1280x720.mp4`, 22 132 723 octets.
- Film anglais : `assets/films/nosia-film-en-1280x720.mp4`, 21 497 782 octets.
- Les vidéos sont des fichiers utilisateur non encore suivis par Git ; ne pas les modifier ni les réencoder sans demande.
- Aucun fichier de sous-titres séparé n’est présent dans `assets/films/`.
- `ffprobe` n’est pas disponible. L’analyse directe des conteneurs MP4 confirme pour chaque film une durée de 84 secondes, une piste vidéo H.264 (`avc1`) et des dimensions de 1280×720 ; la lecture effective reste à vérifier dans le navigateur.

## Decisions

- Utiliser les films présents dans `assets/films/` : demande explicite de l’utilisateur, pour réutiliser les médias fournis sans hébergement tiers.
- Placement sous le titre, avant le texte, avec le film de chaque langue : proposition approuvée par l’utilisateur (« Ouoi », compris comme « Oui »), pour rendre le film visible sans remplacer le plaidoyer écrit.
- Lecteur adaptatif avec contrôles, sans démarrage automatique ni préchargement : inclus dans la proposition approuvée, pour laisser le choix de la lecture et éviter de charger environ 21–22 Mo sans action de l’utilisateur.
- Document de cadrage validé par l’utilisateur (« Oui ») avant préparation du plan d’implémentation.

## Intégration retenue

Intégrer le film de la langue correspondante juste sous le titre de chaque page dédiée, avant le premier paragraphe. Réutiliser la largeur de lecture existante et un lecteur vidéo HTML natif adaptatif, avec `controls`, `playsinline`, `preload="none"` et une source `video/mp4`. Ne pas ajouter `autoplay`, `loop`, de lecteur tiers ou de JavaScript pour piloter la lecture.

Le lecteur porte un nom accessible traduit : « Le film de notre engagement » en français et « Our commitment film » en anglais. Un lien visible adjacent, « Ouvrir la vidéo » / « Open the video », donne accès au fichier même si la lecture intégrée n’est pas disponible. Construire les URLs avec `relative_url` et réserver l’espace du lecteur pour éviter les sauts de mise en page. Conserver tous les paragraphes à l’identique et utiliser une figure/légende plutôt qu’un paragraphe supplémentaire dans l’article.

Réutiliser un include partagé pour le bloc média si les deux pages nécessitent le même balisage. Limiter les styles au film du plaidoyer, sans changer la vidéo de démonstration existante. Aucune nouvelle vidéo n’est ajoutée sur les accueils.

## Périmètre et limites

- Conserver les fichiers vidéo fournis octet pour octet ; pas de compression, réencodage ou remplacement.
- Ne pas générer de sous-titres ou de transcription présentés comme vérifiés. L’ajout de pistes de sous-titres nécessite leur fourniture ou une demande distincte.
- Garder les liens FR/EN, le texte écrit et la conclusion en gras inchangés.
- Aucun changement de navigation, de route, de déploiement ni d’hébergement.
- Si le navigateur de test ne peut pas décoder un fichier, identifier et signaler la limite plutôt que prétendre que la lecture est vérifiée.

## Vérifications prévues

- Bonne source vidéo selon la langue, URL construite avec `relative_url`, contrôles présents, absence d’autoplay et préchargement désactivé.
- Fichiers copiés dans la sortie Jekyll et lecteur utilisable avec les vidéos réelles : charger et lancer volontairement chaque film dans le navigateur, puis vérifier les métadonnées et la progression de la lecture.
- Affichage mobile/ordinateur dans les deux thèmes, sans débordement ni recouvrement du texte.
- Aucun changement du texte intégral, des liens FR/EN ni des ancres existantes.
- Construction Jekyll, liens internes et tests navigateur existants.
- Le serveur local des tests peut être adapté au type MIME MP4 et aux requêtes partielles si la lecture réelle le nécessite ; ces changements restent limités au support des médias testés.
