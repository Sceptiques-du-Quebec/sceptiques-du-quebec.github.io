# Contribuer au projet

Merci de votre intérêt pour le projet Sceptiques du Québec !

## Comment contribuer

### Signaler un problème

Ouvrez une [issue](https://github.com/Sceptiques-du-Quebec/sceptiques-du-quebec.github.io/issues) en décrivant :
- Ce que vous avez observé
- Ce que vous attendiez
- Les étapes pour reproduire le problème (si applicable)

### Proposer une modification

1. Forkez le dépôt
2. Créez une branche descriptive : `git checkout -b fix/description-courte`
3. Faites vos modifications
4. Vérifiez que le build fonctionne : `npm ci && npm run build && npm run export`
5. Ouvrez une Pull Request en expliquant vos changements

### Environnement de développement

```bash
npm ci          # installer les dépendances
npm run build   # compiler JS et CSS
npm run export  # générer le répertoire dist/
npm run watch   # surveiller les fichiers pendant le développement
```

## Exemples de contributions possibles

Les contributions utiles peuvent inclure :

- corrections de fautes de frappe ou d'erreurs dans le contenu ;
- améliorations d'accessibilité ;
- corrections de bugs ;
- améliorations de performance ;
- clarification de la documentation.

Les mainteneurs restent responsables de prioriser, accepter ou refuser les contributions proposées.

## Questions

Pour toute question générale sur le projet, ouvrez une issue ou contactez les mainteneurs.
