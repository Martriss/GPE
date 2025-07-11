import { GameConfig, GameConfigBuilder } from '../types/GameConfig';

/**
 * Configuration par défaut pour un jeu de cartes classique
 */
export const DEFAULT_CARD_GAME_CONFIG: GameConfig = new GameConfigBuilder('Default Card Game', '1.0.0')
  .setScene({
    backgroundColor: 0x1a1a1a,
    ambientLight: {
      color: 0xffffff,
      intensity: 0.6
    },
    directionalLight: {
      color: 0xffffff,
      intensity: 0.8,
      position: { x: 5, y: 10, z: 5 }
    }
  })
  .setCamera({
    position: { x: 0, y: 0, z: 15 },
    target: { x: 0, y: 0, z: 0 },
    fov: 75,
    controls: {
      enabled: true,
      enableRotate: true,
      enableZoom: true,
      enablePan: true,
      minDistance: 5,
      maxDistance: 30
    }
  })
  .addGameArea({
    id: 'main-area',
    name: 'Zone principale',
    width: 10,
    height: 6,
    position: { x: 0, y: 0, z: 0 },
    backgroundColor: 0x2d572c,
    backgroundOpacity: 0.8,
    maxCards: 20,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'custom',
      spacing: { x: 2, y: 1.5 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'player-hand',
    name: 'Main du joueur',
    width: 8,
    height: 3,
    position: { x: 0, y: -4, z: 0 },
    backgroundColor: 0x1a3a66,
    backgroundOpacity: 0.8,
    maxCards: 10,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'row',
      spacing: { x: 1.5, y: 0 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'opponent-hand',
    name: 'Main de l\'adversaire',
    width: 8,
    height: 3,
    position: { x: 0, y: 4, z: 0 },
    backgroundColor: 0x661a1a,
    backgroundOpacity: 0.8,
    maxCards: 10,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'row',
      spacing: { x: 1.5, y: 0 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'draw-pile',
    name: 'Pioche',
    width: 2,
    height: 3,
    position: { x: 6, y: 0, z: 0 },
    backgroundColor: 0x2d2d2d,
    backgroundOpacity: 0.8,
    maxCards: 52,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'stack',
      stackOffset: { x: 0.01, y: 0.01, z: 0.01 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'discard-pile',
    name: 'Défausse',
    width: 2,
    height: 3,
    position: { x: -6, y: 0, z: 0 },
    backgroundColor: 0x4d2d2d,
    backgroundOpacity: 0.8,
    maxCards: 52,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'stack',
      stackOffset: { x: 0.05, y: 0.05, z: 0.02 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .setGameRules({
    gameMode: 'turn-based',
    playerCount: 2,
    cardRules: {
      allowStacking: true,
      allowRotation: false,
      allowFlipping: true,
      snapToGrid: false
    },
    areaRules: {
      allowResize: false,
      allowMove: false,
      highlightOnHover: true,
      highlightOnValidDrop: true
    }
  })
  .build();

// Ajouter les cartes par défaut
for (let i = 0; i < 15; i++) {
  DEFAULT_CARD_GAME_CONFIG.cards.push({
    id: `card-${i}`,
    width: 1,
    height: 1.4,
    thickness: 0.01,
    title: `Carte ${i + 1}`,
    description: `Description de la carte ${i + 1}`,
    draggable: true,
    properties: {
      value: i + 1,
      suit: ['hearts', 'diamonds', 'clubs', 'spades'][i % 4]
    }
  });
}

/**
 * Configuration pour un jeu de type solitaire
 */
export const SOLITAIRE_CONFIG: GameConfig = new GameConfigBuilder('Solitaire', '1.0.0')
  .setScene({
    backgroundColor: 0x0d4a2d,
    ambientLight: {
      color: 0xffffff,
      intensity: 0.7
    }
  })
  .setCamera({
    position: { x: 0, y: 0, z: 20 },
    target: { x: 0, y: 0, z: 0 },
    fov: 60,
    controls: {
      enabled: true,
      enableRotate: false,
      enableZoom: true,
      enablePan: true,
      minDistance: 15,
      maxDistance: 25
    }
  })
  .addGameArea({
    id: 'foundation-1',
    name: 'Fondation As',
    width: 1.5,
    height: 2,
    position: { x: -4.5, y: 3, z: 0 },
    backgroundColor: 0x2d572c,
    backgroundOpacity: 0.6,
    maxCards: 13,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'stack',
      stackOffset: { x: 0, y: 0, z: 0.01 }
    }
  })
  .addGameArea({
    id: 'foundation-2',
    name: 'Fondation Roi',
    width: 1.5,
    height: 2,
    position: { x: -1.5, y: 3, z: 0 },
    backgroundColor: 0x2d572c,
    backgroundOpacity: 0.6,
    maxCards: 13,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'stack',
      stackOffset: { x: 0, y: 0, z: 0.01 }
    }
  })
  .addGameArea({
    id: 'foundation-3',
    name: 'Fondation Dame',
    width: 1.5,
    height: 2,
    position: { x: 1.5, y: 3, z: 0 },
    backgroundColor: 0x2d572c,
    backgroundOpacity: 0.6,
    maxCards: 13,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'stack',
      stackOffset: { x: 0, y: 0, z: 0.01 }
    }
  })
  .addGameArea({
    id: 'foundation-4',
    name: 'Fondation Valet',
    width: 1.5,
    height: 2,
    position: { x: 4.5, y: 3, z: 0 },
    backgroundColor: 0x2d572c,
    backgroundOpacity: 0.6,
    maxCards: 13,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'stack',
      stackOffset: { x: 0, y: 0, z: 0.01 }
    }
  })
  .addGameArea({
    id: 'tableau-1',
    name: 'Tableau 1',
    width: 1.5,
    height: 8,
    position: { x: -4.5, y: -1, z: 0 },
    backgroundColor: 0x1a3a66,
    backgroundOpacity: 0.4,
    maxCards: 19,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'column',
      spacing: { x: 0, y: 0.3 },
      alignment: { horizontal: 'center', vertical: 'top' }
    }
  })
  .setGameRules({
    gameMode: 'turn-based',
    playerCount: 1,
    cardRules: {
      allowStacking: true,
      allowRotation: false,
      allowFlipping: true,
      snapToGrid: true,
      gridSize: 0.5
    },
    areaRules: {
      allowResize: false,
      allowMove: false,
      highlightOnHover: true,
      highlightOnValidDrop: true
    }
  })
  .build();

/**
 * Configuration pour un jeu de poker
 */
export const POKER_CONFIG: GameConfig = new GameConfigBuilder('Poker Table', '1.0.0')
  .setScene({
    backgroundColor: 0x0a0a0a,
    ambientLight: {
      color: 0xffffff,
      intensity: 0.4
    },
    directionalLight: {
      color: 0xffd700,
      intensity: 0.6,
      position: { x: 0, y: 10, z: 0 }
    }
  })
  .setCamera({
    position: { x: 0, y: 8, z: 12 },
    target: { x: 0, y: 0, z: 0 },
    fov: 70,
    controls: {
      enabled: true,
      enableRotate: true,
      enableZoom: true,
      enablePan: false,
      minDistance: 8,
      maxDistance: 20
    }
  })
  .addGameArea({
    id: 'poker-table',
    name: 'Table de poker',
    width: 12,
    height: 8,
    position: { x: 0, y: 0, z: 0 },
    backgroundColor: 0x1a4d1a,
    backgroundOpacity: 0.9,
    maxCards: 5,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'row',
      spacing: { x: 1.2, y: 0 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'player-cards',
    name: 'Cartes du joueur',
    width: 3,
    height: 2,
    position: { x: 0, y: -5, z: 0 },
    backgroundColor: 0x4d1a1a,
    backgroundOpacity: 0.8,
    maxCards: 2,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'row',
      spacing: { x: 1.2, y: 0 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'opponent-1-cards',
    name: 'Cartes adversaire 1',
    width: 3,
    height: 2,
    position: { x: -5, y: 0, z: 0 },
    backgroundColor: 0x4d1a1a,
    backgroundOpacity: 0.8,
    maxCards: 2,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'row',
      spacing: { x: 1.2, y: 0 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'opponent-2-cards',
    name: 'Cartes adversaire 2',
    width: 3,
    height: 2,
    position: { x: 5, y: 0, z: 0 },
    backgroundColor: 0x4d1a1a,
    backgroundOpacity: 0.8,
    maxCards: 2,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'row',
      spacing: { x: 1.2, y: 0 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'opponent-3-cards',
    name: 'Cartes adversaire 3',
    width: 3,
    height: 2,
    position: { x: 0, y: 5, z: 0 },
    backgroundColor: 0x4d1a1a,
    backgroundOpacity: 0.8,
    maxCards: 2,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'row',
      spacing: { x: 1.2, y: 0 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'deck',
    name: 'Paquet',
    width: 2,
    height: 2,
    position: { x: -8, y: 0, z: 0 },
    backgroundColor: 0x2d2d2d,
    backgroundOpacity: 0.8,
    maxCards: 52,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'stack',
      stackOffset: { x: 0.01, y: 0.01, z: 0.01 }
    }
  })
  .addGameArea({
    id: 'pot',
    name: 'Pot',
    width: 2,
    height: 2,
    position: { x: 8, y: 0, z: 0 },
    backgroundColor: 0x4d4d1a,
    backgroundOpacity: 0.8,
    maxCards: 100,
    acceptsCards: true,
    allowsCardRemoval: false,
    cardLayout: {
      type: 'stack',
      stackOffset: { x: 0.05, y: 0.05, z: 0.02 }
    }
  })
  .setGameRules({
    gameMode: 'turn-based',
    playerCount: 4,
    cardRules: {
      allowStacking: false,
      allowRotation: false,
      allowFlipping: true,
      snapToGrid: false
    },
    areaRules: {
      allowResize: false,
      allowMove: false,
      highlightOnHover: true,
      highlightOnValidDrop: true
    },
    customRules: {
      blinds: { small: 10, big: 20 },
      maxRaises: 3,
      gameVariant: 'texas-holdem'
    }
  })
  .build();

/**
 * Configuration pour un jeu de bataille navale
 */
export const BATTLESHIP_CONFIG: GameConfig = new GameConfigBuilder('Battleship', '1.0.0')
  .setScene({
    backgroundColor: 0x001122,
    ambientLight: {
      color: 0xffffff,
      intensity: 0.5
    },
    directionalLight: {
      color: 0xffffff,
      intensity: 0.8,
      position: { x: 0, y: 10, z: 5 }
    }
  })
  .setCamera({
    position: { x: 0, y: 5, z: 15 },
    target: { x: 0, y: 0, z: 0 },
    fov: 60,
    controls: {
      enabled: true,
      enableRotate: true,
      enableZoom: true,
      enablePan: true,
      minDistance: 10,
      maxDistance: 25
    }
  })
  .addGameArea({
    id: 'player-grid',
    name: 'Grille du joueur',
    width: 10,
    height: 10,
    position: { x: -6, y: 0, z: 0 },
    backgroundColor: 0x1a4d66,
    backgroundOpacity: 0.7,
    maxCards: 100,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'grid',
      spacing: { x: 1, y: 1 },
      maxPerLine: 10,
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'opponent-grid',
    name: 'Grille de l\'adversaire',
    width: 10,
    height: 10,
    position: { x: 6, y: 0, z: 0 },
    backgroundColor: 0x661a1a,
    backgroundOpacity: 0.7,
    maxCards: 100,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'grid',
      spacing: { x: 1, y: 1 },
      maxPerLine: 10,
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .addGameArea({
    id: 'ships-dock',
    name: 'Dock des navires',
    width: 3,
    height: 12,
    position: { x: 0, y: 0, z: 0 },
    backgroundColor: 0x2d2d2d,
    backgroundOpacity: 0.6,
    maxCards: 10,
    acceptsCards: true,
    allowsCardRemoval: true,
    cardLayout: {
      type: 'column',
      spacing: { x: 0, y: 1.5 },
      alignment: { horizontal: 'center', vertical: 'center' }
    }
  })
  .setGameRules({
    gameMode: 'turn-based',
    playerCount: 2,
    cardRules: {
      allowStacking: false,
      allowRotation: true,
      allowFlipping: false,
      snapToGrid: true,
      gridSize: 1
    },
    areaRules: {
      allowResize: false,
      allowMove: false,
      highlightOnHover: true,
      highlightOnValidDrop: true
    },
    customRules: {
      gridSize: 10,
      shipSizes: [5, 4, 3, 3, 2],
      maxShots: 1,
      gamePhase: 'setup'
    }
  })
  .build();

/**
 * Fonction utilitaire pour charger une configuration depuis un fichier JSON
 */
export function loadConfigFromJSON(json: string): GameConfig {
  try {
    const configData = JSON.parse(json);
    return configData as GameConfig;
  } catch (error) {
    throw new Error(`Erreur lors du chargement de la configuration: ${error}`);
  }
}

/**
 * Fonction utilitaire pour sauvegarder une configuration en JSON
 */
export function saveConfigToJSON(config: GameConfig): string {
  try {
    return JSON.stringify(config, null, 2);
  } catch (error) {
    throw new Error(`Erreur lors de la sauvegarde de la configuration: ${error}`);
  }
}

/**
 * Fonction pour valider une configuration
 */
export function validateGameConfig(config: GameConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Vérifier les champs obligatoires
  if (!config.metadata?.name) {
    errors.push('Le nom du jeu est obligatoire');
  }

  if (!config.scene) {
    errors.push('La configuration de la scène est obligatoire');
  }

  if (!config.camera) {
    errors.push('La configuration de la caméra est obligatoire');
  }

  if (!config.gameAreas || config.gameAreas.length === 0) {
    errors.push('Au moins une zone de jeu est nécessaire');
  }

  if (!config.cards || config.cards.length === 0) {
    errors.push('Au moins une carte est nécessaire');
  }

  if (!config.gameRules) {
    errors.push('Les règles du jeu sont obligatoires');
  }

  // Vérifier l'unicité des IDs
  const areaIds = new Set<string>();
  const cardIds = new Set<string>();

  config.gameAreas?.forEach(area => {
    if (areaIds.has(area.id)) {
      errors.push(`ID de zone de jeu dupliqué: ${area.id}`);
    }
    areaIds.add(area.id);
  });

  config.cards?.forEach(card => {
    if (cardIds.has(card.id.toString())) {
      errors.push(`ID de carte dupliqué: ${card.id}`);
    }
    cardIds.add(card.id.toString());
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
