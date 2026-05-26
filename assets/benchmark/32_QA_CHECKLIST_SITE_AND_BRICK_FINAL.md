# QA locale — Sceptiques du Québec / Brick Breaqueer

**Usage :** checklist locale pour Benoit.  
**But :** tester les PR et branches en cours sans ouvrir de nouvelle PR et sans modifier le code inutilement.  
**Principe :** cocher au fur et à mesure, noter les anomalies, puis décider quoi rapporter à Maxime.

---

## Règles générales

- [X] Ne pas pousser de nouveau code pendant cette passe QA.
- [X] Ne pas ouvrir de nouvelle PR pendant cette passe QA.
- [X] Ne pas créer d’issue GitHub pendant cette passe QA.
- [X] Ne pas commenter sur GitHub pendant cette passe QA.
- [X] Ne pas merger.
- [X] Si une valeur temporaire est utilisée pour tester, la remettre avant tout commit/push.
- [X] Ne pas laisser de `console.log` temporaire.
- [X] Noter les bugs localement avant d’en parler.

---

# 0. Préparation

## 0.1 Vérifier le repo site

```powershell
cd "E:\Omni\SceptiquesDuQuebecAudit\repos\site"

git status --short --branch
git branch -vv
git log --oneline -5
```

À cocher :

- [X] Le repo `site` est sur la branche attendue.
- [X] Le working tree est propre, ou les modifications sont connues.
- [X] Aucun fichier inattendu n’est modifié.
- [X] Le dernier commit affiché correspond au travail à tester.

Notes :

```text
Repo site sur benoit/refresh-leaderboard. Arbre propre. Branche poussée sur vrai-fork. Dernier commit 9dbdbe7.
```

---

## 0.2 Vérifier le repo Brick

```powershell
cd "E:\Omni\SceptiquesDuQuebecAudit\repos\brick"

git status --short --branch
git branch -vv
git log --oneline -5
```

À cocher :

- [X] Le repo `brick` est sur la branche attendue.
- [X] Le working tree est propre, ou les modifications sont connues.
- [X] Aucun fichier inattendu n’est modifié.
- [X] Le dernier commit affiché correspond au travail à tester.

Notes :

```text
Repo Brick sur benoit/corriger-effets-brick. Arbre propre après amend. Dernier commit testé : d6880c9. Si le force-push après amend n’a pas encore été fait, repusher la branche avec --force-with-lease avant de considérer la PR à jour.
```

---

# A. QA du site principal

## A1. Build / export / audit

```powershell
cd "E:\Omni\SceptiquesDuQuebecAudit\repos\site"

npm run build
npm run export
npm audit --omit=dev
git diff --check
```

À cocher :

- [X] `npm run build` passe.
- [X] `npm run export` passe.
- [X] `npm audit --omit=dev` retourne `0 vulnerabilities`.
- [X] `git diff --check` ne retourne aucune erreur.
- [X] Les warnings LF/CRLF Windows, s’ils apparaissent, sont notés mais non bloquants.
- [X] Le dossier `dist/` existe et contient les fichiers exportés.

Notes :

```text
Build/export/audit site OK. `git diff --check` retourne seulement un warning LF/CRLF sur `src/scripts/sceptiques.core.min.js`, non bloquant.
```

---

## A2. Lancer le site localement

```powershell
cd "E:\Omni\SceptiquesDuQuebecAudit\repos\site\dist"

python -m http.server 5500
```

Ouvrir :

```text
http://127.0.0.1:5500/
```

À cocher :

- [X] La page charge.
- [X] Aucun écran blanc.
- [X] Aucun 404 visible sur la page.
- [X] Le visuel principal est correct.
- [X] Le footer est visible.
- [X] Le lien `Changelog` est visible et bien placé.
- [X] Le leaderboard est visible ou charge comme prévu.
- [X] Le jeu intégré, s’il est présent, ne bloque pas la page.

Notes :

```text
Site local testé sur http://127.0.0.1:5500/. Page OK, footer OK, lien Changelog visible, leaderboard visible/chargé, aucun 404 visible sur la page.
```

---

## A3. Console navigateur

Ouvrir DevTools :

```text
F12
```

Puis onglet **Console**.

À cocher :

- [X] Aucune erreur rouge liée au site.
- [X] Aucun message d’erreur répétitif.
- [X] Les warnings liés à `AudioContext` ou autoplay sont notés comme non bloquants si le jeu fonctionne après interaction.
- [X] Aucun message d’erreur lié à `marked`, `changelog.md`, `leaderboard` ou `fetch`.

Notes :

```text
Console testée. Erreur rouge observée : “A listener indicated an asynchronous response...”, probablement liée à une extension navigateur, pas au site. Présence d’intégration Grammarly dans le DOM. Aucun message d’erreur lié à marked, changelog.md, leaderboard ou fetch. Phaser charge correctement.
```

---

# B. QA du modal changelog

## B1. Ouverture du modal

Sur la page locale :

1. Cliquer sur `Changelog` dans le footer.
2. Observer le modal.

À cocher :

- [X] Le modal s’ouvre au clic.
- [X] Il n’y a pas de navigation vers `/changelog.html`.
- [X] Le fond derrière le modal est calmé / assombri.
- [X] Le panneau du modal est opaque.
- [X] Le texte est lisible.
- [X] Le contenu n’est pas collé aux bords.
- [ ] La bordure arc-en-ciel diffuse ressemble au style du site.
- [X] Le bouton `X` est visible dans le coin haut droit du modal.

Notes :

```text
Le modal fonctionne et le rendu général est lisible. La bordure arc-en-ciel est présente, mais je ne coche pas encore ce point parce que le rendu exact reste subjectif par rapport au style du site. À valider visuellement avec Maxime si nécessaire.
```

---

## B2. Contenu du changelog

À cocher :

- [X] Le changelog est rendu en HTML, pas affiché comme Markdown brut.
- [X] Le titre `# Changelog` du fichier Markdown n’est pas affiché en double si le modal a déjà son titre.
- [X] Les dates sont lisibles.
- [X] Les listes sont lisibles.
- [X] Les accents français s’affichent correctement.
- [X] Les sections récentes sont présentes.

Notes :

```text
Contenu du changelog rendu correctement dans le modal. Markdown converti en HTML, pas de titre doublé, dates/listes lisibles, accents OK, sections récentes présentes.
```

---

## B3. Scroll interne

À cocher :

- [ ] Seul le contenu du changelog scrolle.
  - Non : si la souris est au-dessus de l’arrière-plan, la page derrière peut encore scroller.
- [X] Le header du modal reste visible.
- [X] Le bouton `X` reste visible pendant le scroll.
- [X] La scrollbar ne touche pas le haut du panneau.
- [X] La scrollbar ne touche pas le bas du panneau.
- [X] La scrollbar est fine/custom.
- [X] La molette de souris fonctionne.
- [X] Le trackpad fonctionne.
- [ ] Le scroll ne déplace pas la page derrière le modal de manière gênante.
  - Non : le scroll de l’arrière-plan est encore possible quand le pointeur est hors du panneau du modal.

Notes :

```text
Le modal fonctionne bien quand le pointeur est au-dessus du contenu : seul le changelog scrolle, le header et le bouton X restent visibles. Par contre, si le pointeur est au-dessus de l’arrière-plan assombri, la page derrière peut encore scroller. Probablement un petit polish UX à discuter : verrouiller le scroll du body pendant qu’un modal est ouvert, ou intercepter le wheel/touchmove sur l’overlay.
```

---

## B4. Fermeture du modal

Tester :

1. Cliquer sur `X`.
2. Rouvrir.
3. Appuyer sur `Échap`.
4. Rouvrir.
5. Cliquer à l’extérieur du panneau.

À cocher :

- [X] `X` ferme le modal.
- [X] `Échap` ferme le modal.
- [X] Le clic extérieur ferme le modal si c’est le comportement prévu par la lib existante.
- [X] Après fermeture, la page revient à l’état normal.
- [X] Le lien `Changelog` peut rouvrir le modal sans erreur.
- [X] Aucun état visuel ne reste bloqué.

Notes :

```text
Fermeture du modal OK : X, Échap et clic extérieur fonctionnent. Le modal peut être rouvert ensuite sans erreur ni état visuel bloqué.
```

---

## B5. Requête réseau du changelog

DevTools → **Network**.

1. Cocher **Preserve log**.
2. Filtrer avec :

```text
changelog
```

3. Cliquer sur `Changelog`.

À cocher :

- [X] Une requête vers `/changelog.md` apparaît.
- [X] La requête retourne `200`.
- [X] Aucune requête vers `/changelog.html`.
- [X] Aucun 404 lié au changelog.
- [X] Aucune erreur console après le fetch.

Notes :

```text
B5 OK : clic sur Changelog déclenche une requête `/changelog.md` avec status 200. Aucune requête vers `/changelog.html`, aucun 404, aucune erreur console liée au fetch.
```

---

# C. QA du leaderboard refresh

## C1. Préparer Network

DevTools → **Network**.

À faire :

1. Cocher **Preserve log**.
2. Sélectionner le filtre **Fetch/XHR** si disponible.
3. Dans le champ de filtre, écrire :

```text
exec
```

ou :

```text
script.google
```

À cocher :

- [X] Network est ouvert.
- [X] Preserve log est coché.
- [X] Le filtre `exec` ou `script.google` est actif.
- [X] La liste Network est vidée avec **Clear** avant le test.

Notes :

```text
C1 OK : Network ouvert, Preserve log coché, filtre exec/script.google actif, liste vidée avant test.
```

---

## C2. Chargement initial

1. Avec Network ouvert, faire `F5`.
2. Observer les requêtes.

À cocher :

- [X] Une requête `exec` apparaît au chargement.
- [X] Le leaderboard s’affiche.
- [X] Le chargement initial fonctionne.
- [X] Aucune erreur console.
- [X] Le refresh initial peut afficher un état de chargement visuel, ce qui est acceptable.

Notes :

```text
C2 OK : après F5, une requête exec apparaît, le leaderboard s’affiche, le chargement initial fonctionne, aucune erreur console liée au leaderboard. L’état de chargement initial est acceptable.
```

---

## C3. Refresh automatique aux 60 secondes

1. Cliquer **Clear** dans Network.
2. Garder le filtre `exec`.
3. Attendre 60 secondes sans toucher à la page.

À cocher :

- [X] Une nouvelle requête `exec` apparaît après environ 60 secondes.
- [X] Le refresh est silencieux.
- [X] Aucun message `chargement` visible n’est requis.
- [X] Aucune erreur console.
- [X] Il n’y a pas plusieurs requêtes en rafale.
- [X] Il y a environ une requête par minute quand l’onglet reste visible.

Notes :

```text
C3 OK : après Clear + filtre exec, une nouvelle requête apparaît après environ 60 secondes. Refresh silencieux, aucun message chargement requis, aucune erreur console, pas de rafale, cadence environ 1 requête/minute.
```

---

## C4. Pause quand l’onglet est caché

1. Cliquer **Clear** dans Network.
2. Aller dans un autre onglet navigateur.
3. Attendre au moins 60 secondes.
4. Revenir sur l’onglet du site.

À cocher :

- [ ] Pendant que l’onglet est caché, aucun refresh visible ne s’empile inutilement.
  - Réserve : une requête `exec` était visible en statut `pending` pendant que l’onglet était caché.
  - Aucun empilement ou rafale de requêtes observé.
- [X] Au retour sur l’onglet, une requête `exec` apparaît.
- [X] Le refresh au retour est silencieux.
- [X] Aucun message `chargement` visible n’est requis.
- [X] Aucune erreur console.

Notes :

```text
Le retour sur l’onglet déclenche bien une requête `exec` silencieuse. Une requête était visible en `pending` pendant le test d’onglet caché, mais aucune rafale ni empilement de requêtes n’a été observé. À surveiller, mais pas bloquant pour cette PR.
```

---

## C5. Pas de fetch concurrent visible

1. Laisser la page ouverte 2 à 3 minutes.
2. Garder Network filtré sur `exec`.

À cocher :

- [X] Les requêtes ne s’empilent pas en double.
- [X] Pas de rafales inattendues.
- [X] Pas de requêtes concurrentes visibles.
- [X] Le site reste réactif.
- [X] Aucune erreur console.

Notes :

```text
C5 OK : observation sur 2-3 minutes. Les requêtes `exec` restent espacées, pas de double requête visible, pas de rafale, pas de fetch concurrent apparent. Le site reste réactif et aucune erreur console liée au leaderboard.
```

---

# D. QA Brick Breaqueer

## D1. Build / export / audit

```powershell
cd "E:\Omni\SceptiquesDuQuebecAudit\repos\brick"

npm run conf
npm run build
npm run export
npm audit --omit=dev
git diff --check
```

À cocher :

- [X] `npm run conf` passe.
- [X] `rainbowbreaker.json` est généré.
- [X] `npm run build` passe.
- [X] `brickbreaqueer.core.min.js` est généré.
- [X] `npm run export` passe.
- [X] `npm audit --omit=dev` retourne `0 vulnerabilities`.
- [X] `git diff --check` ne retourne aucune erreur.
- [X] Les warnings LF/CRLF Windows, s’ils apparaissent, sont notés mais non bloquants.

Notes :

```text
D1 OK : conf/build/export/audit passent. `git diff --check` retourne seulement des warnings LF/CRLF Windows sur `brickbreaqueer.core.min.js` et `rainbowbreaker.json`, non bloquants.
```

---

## D2. Lancer Brick localement

```powershell
cd "E:\Omni\SceptiquesDuQuebecAudit\repos\brick\dist"

python -m http.server 5501
```

Ouvrir :

```text
http://127.0.0.1:5501/
```

À cocher :

- [X] La page charge.
- [X] Pas d’écran blanc.
- [X] Pas de flash jaune évident au chargement.
- [X] Le fond est clair/neutre.
- [X] Le jeu apparaît dans le conteneur.
- [X] Pas d’erreur console critique.

Notes :

```text
Brick local testé sur http://127.0.0.1:5501/. Page OK, fond clair/neutre `#f5f5f5`, pas de flash jaune observé, jeu visible dans le conteneur. Console : warnings AudioContext/autoplay observés, non bloquants puisqu’ils sont liés au démarrage audio sans geste utilisateur.
```

---

## D3. Démarrage du jeu

À cocher :

- [X] Le jeu se charge complètement.
- [X] Le canvas est visible.
- [X] Le score est visible.
- [X] Les vies sont visibles.
- [X] La balle apparaît.
- [X] Le paddle apparaît.
- [X] Le jeu répond à la souris.
- [X] Le jeu répond au clavier si prévu.
- [X] Aucun crash au démarrage.

Notes :

```text
Observation initiale : après le remplacement du fond jaune par un fond trop sombre, le paddle et certains éléments du HUD étaient trop peu visibles.

Correction : la couleur de fond a été ajustée après ce test.

Revalidation : après changement de couleur vers `#f5f5f5`, le paddle est visible, le HUD reste lisible, le jeu démarre correctement et aucun flash jaune n’est observé. Point considéré corrigé.
```

---

## D4. Effets visuels ON/OFF

But : vérifier la correction `gameEffets` → `gameEffects`.

Procédure à refaire avant validation finale :

1. Ouvrir `http://127.0.0.1:5501/`.
2. Ouvrir DevTools.
3. Aller dans **Application** → **Local Storage**.
4. Sélectionner `http://127.0.0.1:5501`.
5. Supprimer les clés `gameEffets` et `gameEffects` si elles existent.
6. Recharger la page.
7. Cliquer le bouton effets.
8. Vérifier quelle clé est créée.

À cocher après revalidation :

- [x] Le bouton effets est identifiable.
- [x] Désactiver les effets fonctionne.
- [x] Rafraîchir la page conserve le choix.
- [x] Réactiver les effets fonctionne.
- [x] Rafraîchir la page conserve le choix.
- [x] La clé `gameEffects` existe dans Local Storage.
- [x] La clé `gameEffets` n’est pas recréée.
- [x] Aucune erreur console liée aux effets.

Notes :

```text
Premier test invalide/incomplet : la clé observée était `gameEffets`, pas `gameEffects`. Le test avait été fait sur `127.0.0.1:5500`, qui correspond au site complet et peut charger un ancien bundle Brick. Refaire le test proprement sur `127.0.0.1:5501` après suppression de `gameEffets` et `gameEffects` du Local Storage.
```

---

## D5. Musique / audio

À cocher :

- [X] Le bouton musique fonctionne si présent.
- [X] L’audio démarre après une interaction utilisateur si le navigateur l’exige.
- [X] Aucun crash lié à l’audio.
- [X] Les warnings browser sur autoplay sont notés mais non bloquants si le jeu fonctionne après interaction.

Notes :

```text
Le contrôle musique fonctionne après interaction utilisateur. Des warnings `AudioContext` / autoplay apparaissent dans la console, mais ils sont attendus dans les navigateurs modernes lorsque l’audio est initialisé avant un geste utilisateur. Aucun crash audio observé.
```

---

## D6. Gameplay minimal

Jouer au moins 1 minute.

À cocher :

- [X] Le paddle bouge.
- [X] La balle rebondit.
- [X] Des briques se cassent.
- [X] Le score augmente.
- [X] Les vies diminuent si la balle tombe.
- [X] Le jeu continue après perte d’une vie.
- [X] Aucun crash après 1 minute de jeu.
- [X] Aucun blocage clavier/souris.

Notes :

```text
Gameplay minimal OK. Le paddle semble parfois coller très brièvement aux parois, probablement lié au clamp des limites du canvas. Aucun blocage durable observé : le contrôle reprend immédiatement et le jeu reste jouable. Observation mineure, non bloquante.
```

---

## D7. Bonus

Si les bonus apparaissent pendant le test :

- [X] Le cœur fonctionne.
- [X] La licorne fonctionne.
- [X] L’arc-en-ciel / ralenti fonctionne.
- [X] Aucun bonus ne bloque le jeu.
- [X] Aucun bug console pendant les bonus.

Si les bonus n’apparaissent pas pendant le test :

- [ ] Noter : bonus non observés pendant cette passe.

Notes :

```text
D7 OK : bonus observés pendant la passe. Le cœur, la licorne et l’arc-en-ciel/ralenti fonctionnent. Aucun bonus ne bloque le jeu et aucun bug console lié aux bonus n’a été observé.
```

---

# E. Responsive rapide

## E1. Site principal

Dans DevTools :

1. Cliquer **Toggle device toolbar**.
2. Tester quelques tailles.

À cocher :

- [X] Desktop large : OK.
- [X] 1366px : OK.
- [X] Mobile approximatif : OK.
- [X] Le footer reste lisible.
- [X] Le lien `Changelog` reste visible.
- [X] Le modal changelog reste dans l’écran.
- [X] Le modal changelog scrolle correctement sur petite largeur.

Notes :

```text
E1 OK : site testé en desktop large, 1366px et mobile approximatif. Footer et lien Changelog restent lisibles. Le modal changelog reste dans l’écran et son scroll interne fonctionne sur petite largeur.
```

---

## E2. Brick

À cocher :

- [X] Desktop : jeu visible.
- [X] Mobile approximatif : canvas visible ou comportement existant acceptable.
  - OK sur les presets mobiles de base testés.
  - Réserve : sur Samsung Galaxy A51/A71, le canvas est partiellement coupé horizontalement.
- [X] Pas de débordement visuel majeur.
  - Pas observé sur les presets de base, sauf Galaxy A51/A71.
- [X] Pas de fond jaune visible.
- [X] Les contrôles tactiles répondent si testables.

Notes :

```text
Responsive Brick globalement acceptable pendant cette passe. Les presets mobiles de base testés sont corrects. Sur Samsung Galaxy A51/A71, le canvas est partiellement cropé horizontalement, probablement lié à la largeur fixe du jeu. À noter comme piste responsive future, mais non bloquant pour la PR `gameEffects` / fond jaune.
```

---

# F. Vérification Git finale

## F1. Site

```powershell
cd "E:\Omni\SceptiquesDuQuebecAudit\repos\site"

git status --short --branch
git log --oneline -3
git grep -n "5 \* 1000\|console.log" -- src/scripts/sceptiques.core.js
git grep -n "LEADERBOARD_REFRESH_INTERVAL" -- src/scripts/sceptiques.core.js
```

À cocher :

- [X] La branche attendue est active.
- [X] Aucun fichier modifié involontaire.
- [X] Aucun `console.log` temporaire.
- [X] Aucun intervalle temporaire `5 * 1000`.
- [X] `LEADERBOARD_REFRESH_INTERVAL` vaut `60 * 1000`.

Notes :

```text
Site sur `benoit/refresh-leaderboard`, branche poussée sur `vrai-fork`. Dernier commit `9dbdbe7`. Aucun changement involontaire visible. Aucun `console.log` temporaire ni intervalle `5 * 1000`. Intervalle final confirmé à `60 * 1000`.
```

---

## F2. Brick

```powershell
cd "E:\Omni\SceptiquesDuQuebecAudit\repos\brick"

git status --short --branch
git log --oneline -3
git grep -n "console.log" -- src/scripts/libraries/rainbowbreaker.js src/index.html
git grep -n "gameEffets\|gameEffects" -- src/scripts/libraries/rainbowbreaker.js
```

À cocher :

- [X] La branche attendue est active.
- [X] Aucun fichier modifié involontaire.
- [X] Aucun `console.log` temporaire.
  - Note : `console.log("Stats de fin de partie :", stats)` existe dans `src/index.html`, mais c’est le callback demo existant, pas un log temporaire QA.
- [X] Les occurrences de `gameEffects` sont cohérentes.
- [X] Aucune occurrence involontaire de `gameEffets` ne reste dans le code actif.

Notes :

```text
Branche `benoit/corriger-effets-brick` propre après amend. Le commit corrige `gameEffets` vers `gameEffects` et remplace le fond jaune par `#f5f5f5` pour éviter le flash jaune sans masquer le paddle.
```

---

# G. Résumé final

## Résultat QA

**Date :** 2026-05-25  
**Testeur :** Benoit  
**Environnement :** Windows / navigateur local / Python HTTP server / Chrome DevTools

---

## Site

| Test | Résultat | Notes |
|---|---|---|
| Build/export/audit | PASS | Build OK, export OK, audit 0 vulnérabilité, `git diff --check` OK avec warning LF/CRLF non bloquant. |
| Chargement local | PASS | Site testé sur `http://127.0.0.1:5500/`. Page OK, footer OK, leaderboard visible/chargé. |
| Console | PASS avec note | Erreur rouge probablement liée à une extension navigateur. Aucun message lié à `marked`, `changelog.md`, `leaderboard` ou `fetch`. |
| Changelog modal ouverture | PASS avec réserve visuelle | Modal fonctionnel et lisible. Bordure arc-en-ciel présente, mais rendu visuel subjectif à valider avec Maxime si nécessaire. |
| Changelog modal contenu | PASS | Markdown rendu en HTML, pas de titre doublé, dates/listes lisibles, accents OK. |
| Changelog modal scroll/fermeture | PASS partiel | Header et bouton X restent visibles. Bug UX mineur : la page derrière peut scroller si la souris est sur l’arrière-plan du modal. |
| Changelog fetch `/changelog.md` | PASS | Requête `/changelog.md` observée en Network avec status 200. Aucune requête vers `/changelog.html`. |
| Leaderboard initial | PASS | Requête `exec` au chargement, leaderboard affiché, aucune erreur console. |
| Leaderboard refresh 60s | PASS | Refresh silencieux observé après environ 60 secondes. Pas de rafale. |
| Leaderboard retour onglet | PASS avec réserve | Refresh silencieux au retour sur l’onglet. Une requête `pending` observée pendant l’onglet caché, sans empilement ni rafale. |
| Responsive rapide | PASS | Desktop, 1366px et mobile approximatif OK. Footer et modal changelog restent lisibles. |

Notes site :

```text
QA site globalement positive. Les PR site peuvent rester en review telles quelles.

Points à noter pour plus tard :
- petit polish UX possible : empêcher le scroll de la page derrière quand un modal est ouvert ;
- observation mineure : requête pending pendant test onglet caché, sans effet négatif visible.
```

---

## Brick

| Test | Résultat | Notes |
|---|---|---|
| Build/export/audit | PASS | `npm run conf`, `npm run build`, `npm run export`, `npm audit --omit=dev` OK. Warnings LF/CRLF Windows non bloquants. |
| Chargement local | PASS | Brick testé sur `http://127.0.0.1:5501/`. Page OK, jeu visible, pas de flash jaune observé après correction couleur. |
| Fond jaune corrigé | PASS après correction | Le remplacement initial par `#000` rendait le paddle/HUD trop peu visibles. Couleur ajustée à `#f5f5f5`, revalidation OK. |
| Effets `gameEffects` | À REVALIDER | Le code source utilise bien `gameEffects`, mais le test Local Storage observé sur `5500` montrait encore `gameEffets`. Refaire le test proprement sur `5501` après nettoyage du Local Storage. |
| Musique/audio | PASS avec note | Contrôle musique OK après interaction utilisateur. Warnings AudioContext/autoplay non bloquants. |
| Gameplay minimal | PASS avec observation mineure | Paddle, balle, briques, score et vies OK. Le paddle peut sembler coller brièvement aux parois, non bloquant. |
| Bonus | PASS | Cœur, licorne et arc-en-ciel/ralenti observés et fonctionnels. Aucun blocage ni bug console lié aux bonus. |
| Responsive rapide | PASS avec réserve | OK sur les presets de base. Crop horizontal observé seulement sur Samsung Galaxy A51/A71 ; piste future, non bloquante pour cette PR. |

Notes Brick :

```text
QA Brick globalement positive après correction couleur.

Point restant à revalider :
- refaire D4 sur `http://127.0.0.1:5501/` :
  1. supprimer `gameEffets` et `gameEffects` du Local Storage ;
  2. recharger la page ;
  3. cliquer le bouton effets ;
  4. confirmer que la clé créée est `gameEffects`, pas `gameEffets`.

Correction couleur effectuée :
- `background: yellow` remplacé par `background: #f5f5f5`.
- Cette couleur évite le flash jaune sans masquer le paddle/HUD.

Vérification Git Brick :
- branche `benoit/corriger-effets-brick` propre après amend ;
- commit final testé `d6880c9` ;
- commit corrige `gameEffets` vers `gameEffects` ;
- commit remplace le fond jaune par `#f5f5f5`.
```

---

## Décision

- [ ] Les PR en review peuvent rester telles quelles.
- [ ] Une correction locale est nécessaire avant de pousser / mettre à jour une PR.
- [X] Un point doit être demandé à Maxime.
- [X] Un bug/polish doit être noté pour plus tard.
- [ ] Rien à signaler.

Décision détaillée :

```text
Site :
- PR leaderboard validée localement.
- Peut rester en review.
- Réserves mineures non bloquantes : scroll arrière-plan du modal, requête pending pendant test onglet caché.

Brick :
- PR fix Brick corrigée avec `#f5f5f5`.
- Le code source confirme `gameEffects` dans `rainbowbreaker.js`.
- Avant de considérer la validation Brick entièrement terminée, refaire D4 sur `5501` pour confirmer la clé Local Storage réellement créée.
- Si le commit corrigé `d6880c9` n’a pas encore été repush après amend, faire :
  git push --force-with-lease fork-brick benoit/corriger-effets-brick

À noter pour plus tard :
- modal changelog : empêcher le scroll de la page arrière-plan quand le modal est ouvert ;
- Brick responsive : crop horizontal sur Samsung Galaxy A51/A71 ;
- bouton effets : icône probablement fonctionnelle, mais pas immédiatement explicite pour un nouvel utilisateur.
```

---

# H. Métadonnées temps / coût / attribution

| Champ | Valeur |
|---|---|
| Projet | Sceptiques du Québec |
| Repos testés | `sceptiques-du-quebec.github.io`, `brick-breaqueer` |
| Testeur | Benoit |
| Date | 2026-05-25 |
| Durée humaine approximative | À compléter |
| Outil IA utilisé | ChatGPT + Claude Code, selon usage |
| Coût exact IA | non disponible si non affiché |
| Coût API direct | 0 |
| Coût imputé à Sceptiques du Québec | 0 |
| Attribution | Benoit — temps bénévole |
| Services payants externes appelés | aucun observé |
| Secrets/tokens exposés | non |

Notes coût :

```text
QA effectuée localement avec serveur Python local et navigateur. Aucun service payant externe appelé pour les tests. Aucun coût imputé à Sceptiques du Québec.
```
