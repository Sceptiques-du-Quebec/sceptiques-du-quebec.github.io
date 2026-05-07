# Changelog

Tous les changements notables du projet Sceptiques du Québec seront documentés dans ce fichier.



## [2026-05-03]

### Ajouts
- Chansons midi random


### Changements
- Boutons audios plus gros
- Slowmotion passe de 0.5 à 0.7
- GameOver recommence la partie au lieu du homescreen
- MaxSpeed passe de 1000 à 1200


## [2026-05-03]

### Ajouts
- Effet de bump sur le score et les vies
- Effets sonores et musique

### Changements
- Configuration YAML
- 

## [2026-05-02]

### Ajouts
- Ajout de bump et de particules sur le score
- Ajout de bonus tombants (coeur, licorne, arc-en-ciel)
  - Coeur: +1 vie
  - Licorne: +500pts
  - Arc-en-ciel: Ralenti

### Changements
- 1000pts par niveau
- 50pts par brique
- Augmentation de la vitesse maximale
- Meilleur callback onLoadComplete

### Corrections
- Utilisation des bonnes textures


## [2026-05-01]

### Ajouts

- Ajout de deux nouvelles ressources pour les jeunes
- Double-clique souris pour pause
- Bonus 500pts par niveau réussi
- Support mobile extérieur du canva
- Support touch 2 doits pour pause
- Effet de "bump" sur le reveal d'un drapeau
- Ajout d'un countdown lors du reset de la boule
- Augmentation du timeout de combo
- Espace/Entrée pour mettre en pause

### Changements

- Désactivation du viewport scale
- Simplification du modal d'entrée de nom d'utilisateur
- Refactorisation de la configuration du jeu
- Augmentation de la vélocité de la souris
- Traînée de la boule plus fluide

### Corrections

- Reset combo quand boule touche paddle
- Continuité du combo
- Glitch ball visible une fraction de seconde


## [2026-04-30]

### Ajouts

- Ajout du fb:app_id dans le header
- Validation du hashing de sauvegarde de score

### Changements

- Ajout de 8 nouveaux drapeaux