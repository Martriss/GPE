# Le Grimoire Infini - Module de Jeu

Ce dépôt contient la partie interactive (module de jeu) de la plateforme **Le Grimoire Infini**, une solution complète de gestion de jeux de cartes à collectionner (TCG) qui vous permet non seulement de gérer votre collection, mais aussi de jouer directement en ligne.

## 📋 Présentation

Le module de jeu du Grimoire Infini est développé avec Three.js et TypeScript pour offrir une expérience de jeu 3D fluide et réactive dans le navigateur. Cette partie du projet se concentre exclusivement sur l'interface de jeu, permettant aux utilisateurs de manipuler leurs cartes dans un environnement virtuel.

## ✨ Fonctionnalités

- Rendu 3D des cartes avec support pour les faces avant/arrière
- Manipulation intuitive des cartes (glisser-déposer)
- Animation de retournement de carte
- Adaptation automatique à différentes tailles d'écran
- Interface réactive fonctionnant sur desktop et appareils tactiles

## 🛠️ Technologies utilisées

- **Three.js** - Bibliothèque 3D pour le rendu graphique
- **TypeScript** - Pour un code typé et maintenable
- **Vite** - Outil de build et serveur de développement

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation

1. Clonez ce dépôt
2. Installez les dépendances :
   ```
   npm install
   ```

### Exécution en mode développement

```
npm run start
```

Le serveur Vite démarrera et l'application sera accessible à l'adresse http://localhost:5173

### Construction pour la production

```
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist`.

## 🏗️ Structure du projet

```
playground/
├── src/
│   ├── core/        # Classes fondamentales (Scene, Camera, Renderer)
│   ├── managers/    # Gestionnaires (SceneManager)
│   ├── objects/     # Objets du jeu (Card, etc.)
│   └── script.ts    # Point d'entrée de l'application
├── index.html       # Page HTML principale
├── package.json     # Configuration npm
└── tsconfig.json    # Configuration TypeScript
```

## 🖱️ Commandes de jeu

- **Double-clic** sur une carte pour la retourner
- **Glisser-déposer** pour déplacer les cartes sur le terrain de jeu
