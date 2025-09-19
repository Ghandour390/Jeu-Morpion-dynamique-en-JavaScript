# Jeu Morpion dynamique en JavaScript

Petit projet de morpion (tic-tac-toe) dynamique écrit en HTML/CSS/JavaScript. La grille est entièrement dynamique : vous pouvez choisir la taille `n` de la grille (n x n) et le nombre `k` de symboles alignés nécessaires pour gagner. Le jeu conserve les scores localement via `localStorage`.

## Caractéristiques
- Choix dynamique de la taille de la grille (`n`) et de la condition de victoire (`k`)
- Choix du symbole du joueur (X ou O) avant de démarrer
- Scoreboard persistant (X, O, Draws) sauvegardé dans `localStorage`
- Bouton `Rejouer` pour recommencer la partie
- Bouton `Retour` pour annuler le dernier coup
- Messages utilisateurs affichés via une modal personnalisée

## Fichiers principaux
- `index.html` : structure de la page et contrôles
- `style.css` : styles et mise en page responsive
- `main.js` : logique du jeu, génération dynamique de la grille, détection des victoires et stockage des scores

## Installation / Utilisation
1. Cloner ou télécharger le dépôt dans un dossier local.
2. Ouvrir `index.html` dans votre navigateur (double-cliquer ou servir via un petit serveur local).

## Détail : logique de la fonction `checkWinDynamic()`

La fonction `checkWinDynamic()` détecte automatiquement si un joueur a remporté la partie sur une grille `n x n` pour une condition de victoire `k` (k symboles alignés). Elle est écrite pour être générique et fonctionne quel que soit `n` et `k` (avec `k <= n`). Voici une explication pas-à-pas de son fonctionnement :

1. Récupération des paramètres
   - `size` = taille de la grille (n).
   - `k` = nombre de symboles alignés requis pour gagner (valeur du champ `#winSieze`).

2. Construction d'une représentation 2D du plateau (`board`)
   - On lit le contenu textuel de chaque cellule DOM et on remplit un tableau 2D `board[i][j]` où `i` est la ligne et `j` la colonne.
   - Exemple pour `n=3` :
     ```
     board = [
       [cells[0], cells[1], cells[2]],
       [cells[3], cells[4], cells[5]],
       [cells[6], cells[7], cells[8]]
     ]
     ```

3. Définition des directions à vérifier
   - L'algorithme vérifie les 4 directions essentielles :
     - horizontal : `[0, 1]`
     - vertical : `[1, 0]`
     - diagonale descendant  : `[1, 1]`
     - diagonale montant : `[1, -1]`

4. Parcours du plateau
   - Pour chaque position `(i, j)` du plateau :
     - Si la case est vide (`''`), on l'ignore.
     - Sinon, on prend la valeur du joueur (`'X'` ou `'O'`) et on vérifie, pour chacune des 4 directions, combien de symboles identiques sont alignés en partant de `(i, j)`.

5. Vérification le long d'une direction
   - Pour une direction donnée `(dx, dy)`, on fait une boucle `step = 1..k-1` et on calcule la position suivante `(x = i + dx*step, y = j + dy*step)`.
   - Si `(x, y)` est hors de la grille, on arrête la vérification de cette direction.
   - Si `board[x][y]` est égal au `player` initial, on incrémente un compteur `count`.
   - Si `count` atteint `k`, cela signifie que `k` symboles consécutifs appartiennent au même joueur : la fonction renvoie ce symbole (`'X'` ou `'O'`).

6. Aucun gagnant trouvé
   - Si après avoir vérifié toutes les positions et toutes les directions on n'a jamais atteint `count === k`, la fonction renvoie `null` (aucun gagnant pour l'instant).

Complexité
- Temps : O(n^2 * k) dans le pire cas — pour chaque cellule (n^2) on vérifie jusqu'à `k` positions dans chacune des 4 directions.
- Espace : O(n^2) pour construire le tableau `board` (on pourrait lire directement depuis `cells` sans tableau supplémentaire mais la structure 2D rend la logique plus claire).

Exemple concret
- Pour une grille 3x3 (`n=3`) et `k=3` : si `board[0][0] === board[0][1] === board[0][2] === 'X'`, la fonction retournera `'X'` dès la vérification de la ligne 0.

Remarques et améliorations possibles
- On peut optimiser en évitant de repartir de positions qui ne pourront pas produire `k` éléments (par exemple, ignorer les départs trop proches du bord selon la direction), mais l'implémentation actuelle est déjà simple et suffisante pour des valeurs raisonnables de `n` (par ex. n ≤ 15).
- Pour de très grandes grilles ou des exigences de performance strictes, on peut maintenir des compteurs cumulés (approche dynamique) ou effectuer des vérifications incrémentales seulement autour du dernier coup joué (seulement vérifier les lignes/colonnes/diagonales passant par la cellule jouée).

