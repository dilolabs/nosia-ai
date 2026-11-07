# Redesign Nosia — plan d’implémentation

**Objectif :** un site produit bilingue, accueillant et apparenté à Dilolabs, sans modifier l’application Nosia.

**Architecture :** conserver Jekyll/Liquid, les données YAML, CSS et JavaScript progressif existants. Ajouter une couche de tokens et de composants du site public ; pas de framework, de dépendance ou de changement de déploiement.

## Décisions issues du brief

- Implémentation directe après audit, sans validation intermédiaire ni commit automatique.
- Raleway locale, papier ivoire, rythme 4/8 px, Heroicons outline, contrôles 14 px, cartes 24 px et panneaux 28–36 px : parenté Dilolabs vérifiée.
- Vert Nosia conservé ; le vert sombre interactif existant assure le contraste. Logo inchangé.
- Capture authentique extraite du tutoriel Mac v0.6.1 ; aucune conversation ou capacité fabriquée. Les exemples de questions sont explicitement illustratifs.
- Mac natif prioritaire, Linux/Windows et serveur documentés ; aucune installation lancée automatiquement.
- Toutes les URL et ancres publiques conservées ; contenus de l’engagement et films inchangés.
- Confidentialité conditionnelle et coûts d’exploitation explicités dans les deux langues.
- Retour en haut intégré au pied de page plutôt que flottant : ne plus réserver une bande vide ni recouvrir les textes à 320 px.

## Exécution

- [x] Auditer le dépôt, les pages, les assets, la release et Dilolabs desktop/mobile ; lancer les 96 tests existants (96 réussis).
- [x] Exécuter les recherches du skill ; vérifier les résultats, rejeter palette violette, polices et animations génériques.
- [x] Ajouter `test/redesign.test.mjs` : preuve produit, liens Dilolabs, tokens, pieds de page, confidentialité, tableaux et responsive ; constater les échecs.
- [x] Créer `docs/design-system/nosia.md` : audit sourcé, tableau de parenté, tokens et décisions de sélection.
- [x] Ajouter police locale licenciée et captures WebP/PNG dérivées du film existant ; documenter leur provenance.
- [x] Composer l’accueil FR/EN via `_data/home.yml`, `_data/product.yml`, les includes d’accueil, produit et fonctionnement.
- [x] Ajouter `assets/css/marketing.css`, partager pied de page, navigation active et lien d’entreprise ; garder menu, thème, copie, vidéo et langue.
- [x] Corriger les contenus conditionnels dans cas d’usage, FAQ et comparaisons FR/EN ; rendre les tableaux navigables au clavier.
- [x] Actualiser les tests d’ancienne composition seulement pour les décisions modifiées ; garder les contrôles de comportement, langues, films, copie et SEO.
- [x] Exécuter `bin/verify`, `node --test test/*.test.mjs`, un build avec sous-chemin, inspection Chromium 320/375/768/1440 px, paysage, sombre, mouvement réduit et zoom 200 % (viewport équivalent).
- [x] Publier la prévisualisation locale et consigner résultats, captures et limites dans `docs/redesign-verification.md`.
