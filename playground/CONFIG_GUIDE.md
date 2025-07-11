# Guide du Système de Configuration

## Vue d'ensemble

Ce système de configuration permet de créer et lancer des jeux de cartes avec des configurations flexibles et réutilisables. Vous pouvez définir les zones de jeu, les cartes, les règles et l'apparence de votre jeu via des objets de configuration.

## Utilisation de base

### Lancer un jeu avec une configuration prédéfinie

```typescript
import { ConfigurableSceneManager } from './managers/ConfigurableSceneManager';
import { DEFAULT_CARD_GAME_CONFIG } from './configs/GameConfigs';

// Créer un gestionnaire de jeu avec une configuration
const gameManager = new ConfigurableSceneManager(DEFAULT_CARD_GAME_CONFIG);
```

### Configurations prédéfinies disponibles

- `DEFAULT_CARD_GAME_CONFIG` - Jeu de cartes classique
- `SOLITAIRE_CONFIG` - Solitaire
- `POKER_CONFIG` - Table de poker
- `BATTLESHIP_CONFIG` - Bataille navale
- `SIMPLE_CARD_GAME` - Jeu de cartes simple
- `MEMORY_GAME` - Jeu de memory
- `DOMINO_GAME` - Jeu de dominos
- `HEX_BOARD_GAME` - Jeu sur plateau hexagonal

## Créer une configuration personnalisée

### Utilisation du GameConfigBuilder

```typescript
import { GameConfigBuilder } from './types/GameConfig';

const config = new GameConfigBuilder('Mon Jeu', '1.0.0')
  .setScene({
    backgroundColor: 0x2a4d3a,
    ambientLight: {
      color: 0xffffff,
      intensity: 0.6
    }
  })
  .setCamera({
    position: { x: 0, y: 0, z: 12 },
    target: { x: 0, y: 0, z: 0 },
    fov: 75
  })
  .addGameArea({
    id: 'main-area',
    name: 'Zone Principale',
    width: 8,
    height: 6,
    position: { x: 0, y: 0, z: 0 },
    backgroundColor: 0x2d572c,
    backgroundOpacity: 0.8,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'row',
      spacing: { x: 1.5, y: 0 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addCard({
    id: 'card-1',
    width: 1,
    height: 1.4,
    thickness: 0.01,
    title: 'Ma Carte',
    draggable: true
  })
  .setGameRules({
    gameMode: 'turn-based',
    playerCount: 2,
    cardRules: {
      allowStacking: true,
      allowRotation: false,
      allowFlipping: true
    }
  })
  .build();

// Lancer le jeu
const gameManager = new ConfigurableSceneManager(config);
```

### Création d'une configuration via un objet

```typescript
const customConfig = {
  metadata: {
    name: "Mon Jeu Personnalisé",
    version: "1.0.0",
    description: "Description de mon jeu"
  },
  scene: {
    backgroundColor: 0x1a1a1a,
    ambientLight: {
      color: 0xffffff,
      intensity: 0.6
    }
  },
  camera: {
    position: { x: 0, y: 0, z: 15 },
    target: { x: 0, y: 0, z: 0 },
    fov: 75
  },
  gameAreas: [
    {
      id: 'play-area',
      name: 'Zone de Jeu',
      width: 10,
      height: 6,
      position: { x: 0, y: 0, z: 0 },
      backgroundColor: 0x2d572c,
      backgroundOpacity: 0.8,
      acceptsCards: true,
      allowsCardRemoval: true,
      cardLayout: {
        type: 'grid',
        spacing: { x: 1.5, y: 1.5 },
        maxPerLine: 5,
        alignment: { horizontal: 'center', vertical: 'center' }
      }
    }
  ],
  cards: [
    {
      id: 'card-1',
      width: 1,
      height: 1.4,
      thickness: 0.01,
      title: 'Carte 1',
      draggable: true,
      properties: {
        value: 1,
        suit: 'hearts'
      }
    }
  ],
  gameRules: {
    gameMode: 'turn-based',
    playerCount: 1,
    cardRules: {
      allowStacking: true,
      allowRotation: false,
      allowFlipping: true,
      snapToGrid: false
    }
  }
};

const gameManager = new ConfigurableSceneManager(customConfig);
```

## Structure de configuration

### Métadonnées (metadata)
```typescript
metadata: {
  name: string;           // Nom du jeu
  version: string;        // Version
  description?: string;   // Description
  author?: string;        // Auteur
  createdAt?: string;     // Date de création
}
```

### Configuration de scène (scene)
```typescript
scene: {
  backgroundColor?: number;           // Couleur de fond
  backgroundTexture?: string;         // Texture de fond
  ambientLight?: {                   // Lumière ambiante
    color: number;
    intensity: number;
  };
  directionalLight?: {               // Lumière directionnelle
    color: number;
    intensity: number;
    position: { x: number; y: number; z: number };
  };
  additionalLights?: Array<{         // Lumières supplémentaires
    type: 'point' | 'spot' | 'directional';
    color: number;
    intensity: number;
    position: { x: number; y: number; z: number };
  }>;
}
```

### Configuration de caméra (camera)
```typescript
camera: {
  position: { x: number; y: number; z: number };  // Position
  target?: { x: number; y: number; z: number };   // Cible
  fov?: number;                                   // Champ de vision
  near?: number;                                  // Plan proche
  far?: number;                                   // Plan lointain
  controls?: {                                    // Contrôles
    enabled: boolean;
    enableRotate?: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
    minDistance?: number;
    maxDistance?: number;
  };
}
```

### Configuration de zones de jeu (gameAreas)
```typescript
gameAreas: [{
  id: string;                        // Identifiant unique
  name: string;                      // Nom d'affichage
  width: number;                     // Largeur
  height: number;                    // Hauteur
  position: { x: number; y: number; z: number };  // Position
  backgroundColor: number;           // Couleur de fond
  backgroundOpacity?: number;        // Opacité (0-1)
  backgroundTexture?: string;        // Texture de fond
  maxCards?: number;                 // Nombre max de cartes
  acceptsCards?: boolean;            // Accepte les cartes
  allowsCardRemoval?: boolean;       // Permet le retrait
  initialCards?: [{                  // Cartes initiales
    cardId: string | number;
    position: { x: number; y: number; z?: number };
  }];
  cardLayout?: {                     // Disposition des cartes
    type: 'grid' | 'row' | 'column' | 'stack' | 'fan' | 'custom';
    spacing?: { x: number; y: number };
    alignment?: {
      horizontal: 'left' | 'center' | 'right';
      vertical: 'top' | 'center' | 'bottom';
    };
    maxPerLine?: number;             // Pour type 'grid'
    stackOffset?: { x: number; y: number; z: number };  // Pour type 'stack'
    fanAngle?: number;               // Pour type 'fan'
  };
}]
```

### Configuration de cartes (cards)
```typescript
cards: [{
  id: string | number;               // Identifiant unique
  width: number;                     // Largeur
  height: number;                    // Hauteur
  thickness: number;                 // Épaisseur
  title?: string;                    // Titre
  description?: string;              // Description
  imageUrl?: string;                 // Image
  draggable?: boolean;               // Peut être déplacée
  properties?: Record<string, any>;  // Propriétés personnalisées
  styling?: {                        // Style
    backgroundColor?: number;
    borderColor?: number;
    textColor?: number;
    texture?: string;
  };
}]
```

### Configuration des règles (gameRules)
```typescript
gameRules: {
  gameMode: 'turn-based' | 'real-time';  // Mode de jeu
  playerCount: number;                   // Nombre de joueurs
  cardRules?: {                          // Règles des cartes
    allowStacking?: boolean;             // Empilage autorisé
    allowRotation?: boolean;             // Rotation autorisée
    allowFlipping?: boolean;             // Retournement autorisé
    snapToGrid?: boolean;                // Alignement sur grille
    gridSize?: number;                   // Taille de la grille
  };
  areaRules?: {                          // Règles des zones
    allowResize?: boolean;               // Redimensionnement
    allowMove?: boolean;                 // Déplacement
    highlightOnHover?: boolean;          // Surbrillance au survol
    highlightOnValidDrop?: boolean;      // Surbrillance lors du drop
  };
  customRules?: Record<string, any>;     // Règles personnalisées
}
```

## Fonctionnalités avancées

### Gestion dynamique des zones

```typescript
// Ajouter une zone
gameManager.addDynamicGameArea(
  'new-area',
  'Nouvelle Zone',
  4, 3,           // width, height
  -10, 2, 0,      // x, y, z
  0x664466        // backgroundColor
);

// Modifier une zone
gameManager.updateGameAreaProperties('player-hand', {
  width: 10,
  backgroundColor: 0x336633
});

// Supprimer une zone
gameManager.removeDynamicGameArea('new-area');
```

### Manipulation des cartes

```typescript
// Mélanger les cartes dans une zone
gameManager.shuffleCardsInArea('deck');

// Déplacer toutes les cartes d'une zone vers une autre
gameManager.moveAllCardsToArea('from-area', 'to-area');

// Distribuer les cartes équitablement
gameManager.distributeCards('deck', ['player-1', 'player-2']);
```

### Sauvegarde et chargement

```typescript
// Sauvegarder la configuration
const configJSON = gameManager.exportConfig();
localStorage.setItem('gameConfig', configJSON);

// Charger une configuration
const savedConfig = localStorage.getItem('gameConfig');
if (savedConfig) {
  await gameManager.loadFromJSON(savedConfig);
}

// Sauvegarder l'état du jeu
const gameState = gameManager.saveGameState();
localStorage.setItem('gameState', JSON.stringify(gameState));

// Charger un état de jeu
const savedState = localStorage.getItem('gameState');
if (savedState) {
  await gameManager.loadGameState(JSON.parse(savedState));
}
```

## Événements et callbacks

Vous pouvez définir des gestionnaires d'événements personnalisés :

```typescript
const config = {
  // ... autres propriétés
  eventHandlers: {
    onGameStart: 'handleGameStart',
    onGameEnd: 'handleGameEnd',
    onCardMoved: 'handleCardMoved',
    onAreaChanged: 'handleAreaChanged',
    onTurnChange: 'handleTurnChange'
  }
};
```

## Exemples d'utilisation

### Dans la console du navigateur

```javascript
// Changer de configuration
launchGameWithConfig('POKER');

// Créer une configuration dynamique
const customConfig = ConfigExamples.createDynamicConfig('Mon Jeu', 4, {width: 10, height: 8});
gameManager.changeConfig(customConfig);

// Mode debug
gameManager.toggleDebugMode();

// Statistiques
console.log(gameManager.getGameStats());
```

### Intégration dans une application

```typescript
import { ConfigurableSceneManager } from './managers/ConfigurableSceneManager';
import { POKER_CONFIG } from './configs/GameConfigs';

class MyGameApp {
  private gameManager: ConfigurableSceneManager;

  constructor() {
    this.gameManager = new ConfigurableSceneManager(POKER_CONFIG);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Écouter les événements du jeu
    document.addEventListener('keydown', (event) => {
      if (event.key === 'r') {
        this.gameManager.resetToDefault();
      }
    });
  }

  public changeGameType(configName: string) {
    // Logique pour changer de type de jeu
    // ...
  }
}
```

## Conseils et bonnes pratiques

1. **Validation** : Toujours valider vos configurations avec `validateGameConfig()`
2. **IDs uniques** : Assurez-vous que tous les IDs sont uniques
3. **Nommage** : Utilisez des noms descriptifs pour les zones et cartes
4. **Performance** : Limitez le nombre de cartes et zones pour maintenir de bonnes performances
5. **Sauvegarde** : Sauvegardez régulièrement les configurations fonctionnelles
6. **Test** : Testez vos configurations avec différents nombres de joueurs

## Dépannage

### Erreurs communes

- **"Configuration invalide"** : Vérifiez que tous les champs obligatoires sont présents
- **"ID dupliqué"** : Assurez-vous que tous les IDs sont uniques
- **"Zone non trouvée"** : Vérifiez que l'ID de la zone existe
- **"Carte non trouvée"** : Vérifiez que l'ID de la carte existe

### Debug

Utilisez le mode debug pour obtenir des informations détaillées :

```typescript
gameManager.toggleDebugMode();
console.log(gameManager.getGameStats());
```

## API complète

Consultez les fichiers TypeScript pour la documentation complète des interfaces :

- `types/GameConfig.ts` - Définitions des types
- `managers/GameConfigManager.ts` - Gestionnaire principal
- `managers/ConfigurableSceneManager.ts` - Gestionnaire configurable
- `configs/GameConfigs.ts` - Configurations prédéfinies
- `examples/ConfigExamples.ts` - Exemples d'utilisation