import { GameConfig, GameConfigBuilder } from '../types/GameConfig';
import { ConfigurableSceneManager } from '../managers/ConfigurableSceneManager';
import { DEFAULT_CARD_GAME_CONFIG, SOLITAIRE_CONFIG, POKER_CONFIG, BATTLESHIP_CONFIG } from '../configs/GameConfigs';

/**
 * Exemples d'utilisation du système de configuration
 */
export class ConfigExamples {

  /**
   * Exemple 1: Création d'un jeu de cartes simple
   */
  public static createSimpleCardGame(): GameConfig {
    return new GameConfigBuilder('Jeu de Cartes Simple', '1.0.0')
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
        id: 'player-hand',
        name: 'Main du Joueur',
        width: 8,
        height: 2,
        position: { x: 0, y: -3, z: 0 },
        backgroundColor: 0x1a3a66,
        backgroundOpacity: 0.8,
        maxCards: 7,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'row',
          spacing: { x: 1.2, y: 0 },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      })
      .addGameArea({
        id: 'play-area',
        name: 'Zone de Jeu',
        width: 6,
        height: 4,
        position: { x: 0, y: 0, z: 0 },
        backgroundColor: 0x2d572c,
        backgroundOpacity: 0.7,
        maxCards: 10,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'custom',
          spacing: { x: 1.5, y: 1.5 },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      })
      .addGameArea({
        id: 'deck',
        name: 'Paquet',
        width: 2,
        height: 2.5,
        position: { x: 5, y: 0, z: 0 },
        backgroundColor: 0x2d2d2d,
        backgroundOpacity: 0.9,
        maxCards: 52,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'stack',
          stackOffset: { x: 0.01, y: 0.01, z: 0.01 }
        }
      })
      .setGameRules({
        gameMode: 'turn-based',
        playerCount: 1,
        cardRules: {
          allowStacking: true,
          allowRotation: false,
          allowFlipping: true,
          snapToGrid: false
        },
        areaRules: {
          highlightOnHover: true,
          highlightOnValidDrop: true
        }
      })
      .build();
  }

  /**
   * Exemple 2: Configuration pour un jeu de memory
   */
  public static createMemoryGame(): GameConfig {
    const config = new GameConfigBuilder('Memory Game', '1.0.0')
      .setScene({
        backgroundColor: 0x1a1a2e,
        ambientLight: {
          color: 0xffffff,
          intensity: 0.7
        }
      })
      .setCamera({
        position: { x: 0, y: 0, z: 15 },
        target: { x: 0, y: 0, z: 0 },
        fov: 60
      })
      .addGameArea({
        id: 'memory-grid',
        name: 'Grille Memory',
        width: 12,
        height: 8,
        position: { x: 0, y: 0, z: 0 },
        backgroundColor: 0x16213e,
        backgroundOpacity: 0.8,
        maxCards: 24,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'grid',
          spacing: { x: 1.5, y: 1.8 },
          maxPerLine: 6,
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      })
      .setGameRules({
        gameMode: 'turn-based',
        playerCount: 1,
        cardRules: {
          allowStacking: false,
          allowRotation: false,
          allowFlipping: true,
          snapToGrid: true,
          gridSize: 1.5
        },
        customRules: {
          maxFlippedCards: 2,
          autoFlipDelay: 1000,
          scoreSystem: 'time-based'
        }
      })
      .build();

    // Ajouter les cartes Memory
    for (let i = 0; i < 24; i++) {
      const pairId = Math.floor(i / 2);
      config.cards.push({
        id: `memory-card-${i}`,
        width: 1.2,
        height: 1.6,
        thickness: 0.05,
        title: `Carte ${pairId + 1}`,
        draggable: false,
        properties: {
          pairId: pairId,
          isFlipped: false,
          isMatched: false
        },
        styling: {
          backgroundColor: 0x4a4a4a,
          borderColor: 0x333333
        }
      });
    }

    return config;
  }

  /**
   * Exemple 3: Configuration pour un jeu de dominos
   */
  public static createDominoGame(): GameConfig {
    return new GameConfigBuilder('Dominos', '1.0.0')
      .setScene({
        backgroundColor: 0x2e2e2e,
        ambientLight: {
          color: 0xffffff,
          intensity: 0.8
        },
        directionalLight: {
          color: 0xffffff,
          intensity: 0.5,
          position: { x: 5, y: 10, z: 5 }
        }
      })
      .setCamera({
        position: { x: 0, y: 3, z: 12 },
        target: { x: 0, y: 0, z: 0 },
        fov: 70
      })
      .addGameArea({
        id: 'game-line',
        name: 'Ligne de Jeu',
        width: 16,
        height: 3,
        position: { x: 0, y: 0, z: 0 },
        backgroundColor: 0x8b4513,
        backgroundOpacity: 0.6,
        maxCards: 28,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'row',
          spacing: { x: 0.8, y: 0 },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      })
      .addGameArea({
        id: 'player-rack',
        name: 'Chevalet Joueur',
        width: 8,
        height: 2,
        position: { x: 0, y: -4, z: 0 },
        backgroundColor: 0x654321,
        backgroundOpacity: 0.9,
        maxCards: 7,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'row',
          spacing: { x: 1.1, y: 0 },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      })
      .addGameArea({
        id: 'ai-rack',
        name: 'Chevalet IA',
        width: 8,
        height: 2,
        position: { x: 0, y: 4, z: 0 },
        backgroundColor: 0x654321,
        backgroundOpacity: 0.9,
        maxCards: 7,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'row',
          spacing: { x: 1.1, y: 0 },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      })
      .addGameArea({
        id: 'boneyard',
        name: 'Cimetière',
        width: 3,
        height: 3,
        position: { x: -8, y: 0, z: 0 },
        backgroundColor: 0x2d2d2d,
        backgroundOpacity: 0.7,
        maxCards: 14,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'stack',
          stackOffset: { x: 0.05, y: 0.05, z: 0.02 }
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
          gridSize: 0.8
        },
        customRules: {
          dominoSet: 'double-six',
          startingTiles: 7,
          winCondition: 'empty-hand'
        }
      })
      .build();
  }

  /**
   * Exemple 4: Configuration pour un jeu de plateau hexagonal
   */
  public static createHexBoardGame(): GameConfig {
    return new GameConfigBuilder('Hex Board Game', '1.0.0')
      .setScene({
        backgroundColor: 0x0f1419,
        ambientLight: {
          color: 0xffffff,
          intensity: 0.4
        },
        directionalLight: {
          color: 0xffd700,
          intensity: 0.8,
          position: { x: 0, y: 15, z: 10 }
        }
      })
      .setCamera({
        position: { x: 0, y: 8, z: 12 },
        target: { x: 0, y: 0, z: 0 },
        fov: 65
      })
      .addGameArea({
        id: 'hex-board',
        name: 'Plateau Hexagonal',
        width: 12,
        height: 10,
        position: { x: 0, y: 0, z: 0 },
        backgroundColor: 0x2d4a2d,
        backgroundOpacity: 0.9,
        maxCards: 37,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'custom',
          customPositionFunction: 'hexagonal',
          spacing: { x: 1.5, y: 1.3 }
        }
      })
      .addGameArea({
        id: 'resource-pool',
        name: 'Réserve de Ressources',
        width: 3,
        height: 8,
        position: { x: 8, y: 0, z: 0 },
        backgroundColor: 0x4a2d2d,
        backgroundOpacity: 0.8,
        maxCards: 20,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'column',
          spacing: { x: 0, y: 1.2 },
          alignment: { horizontal: 'center', vertical: 'top' }
        }
      })
      .addGameArea({
        id: 'player-hand',
        name: 'Main du Joueur',
        width: 10,
        height: 2,
        position: { x: 0, y: -6, z: 0 },
        backgroundColor: 0x1a3a66,
        backgroundOpacity: 0.8,
        maxCards: 5,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'fan',
          fanAngle: 15,
          spacing: { x: 1.5, y: 0 },
          alignment: { horizontal: 'center', vertical: 'center' }
        }
      })
      .setGameRules({
        gameMode: 'turn-based',
        playerCount: 2,
        cardRules: {
          allowStacking: true,
          allowRotation: false,
          allowFlipping: false,
          snapToGrid: true,
          gridSize: 1.5
        },
        customRules: {
          boardType: 'hexagonal',
          hexSize: 19,
          winCondition: 'territory-control'
        }
      })
      .build();
  }

  /**
   * Exemple d'utilisation: Comment lancer un jeu avec une configuration
   */
  public static async launchGameWithConfig(config: GameConfig): Promise<ConfigurableSceneManager> {
    const gameManager = new ConfigurableSceneManager(config);

    // Attendre que le jeu soit initialisé
    await new Promise(resolve => setTimeout(resolve, 100));

    // Afficher les statistiques du jeu
    const stats = gameManager.getGameStats();
    console.log('Statistiques du jeu:', stats);

    return gameManager;
  }

  /**
   * Exemple d'utilisation: Comment modifier une configuration existante
   */
  public static async modifyExistingConfig(gameManager: ConfigurableSceneManager): Promise<void> {
    // Ajouter une nouvelle zone de jeu
    gameManager.addDynamicGameArea(
      'new-area',
      'Nouvelle Zone',
      4,
      3,
      -10,
      2,
      0,
      0x664466
    );

    // Modifier une zone existante
    gameManager.updateGameAreaProperties('player-hand', {
      width: 10,
      backgroundColor: 0x336633
    });

    // Mélanger les cartes dans une zone
    gameManager.shuffleCardsInArea('deck');
  }

  /**
   * Exemple d'utilisation: Comment sauvegarder et charger une configuration
   */
  public static async saveAndLoadExample(): Promise<void> {
    // Créer un jeu
    const originalConfig = ConfigExamples.createSimpleCardGame();
    const gameManager = new ConfigurableSceneManager(originalConfig);

    // Sauvegarder la configuration
    const savedConfig = gameManager.exportConfig();
    console.log('Configuration sauvegardée:', savedConfig);

    // Modifier le jeu
    gameManager.addDynamicGameArea('temp-area', 'Zone Temporaire', 2, 2, 0, 5);

    // Recharger la configuration originale
    await gameManager.loadFromJSON(savedConfig);
    console.log('Configuration rechargée avec succès');
  }

  /**
   * Exemple d'utilisation: Comment créer une configuration dynamique
   */
  public static createDynamicConfig(
    gameName: string,
    playerCount: number,
    boardSize: { width: number; height: number }
  ): GameConfig {
    const builder = new GameConfigBuilder(gameName, '1.0.0')
      .setScene({
        backgroundColor: 0x1a1a1a,
        ambientLight: { color: 0xffffff, intensity: 0.6 }
      })
      .setCamera({
        position: { x: 0, y: 0, z: 15 },
        target: { x: 0, y: 0, z: 0 },
        fov: 75
      })
      .setGameRules({
        gameMode: 'turn-based',
        playerCount: playerCount,
        cardRules: {
          allowStacking: true,
          allowRotation: false,
          allowFlipping: true
        }
      });

    // Ajouter le plateau principal
    builder.addGameArea({
      id: 'main-board',
      name: 'Plateau Principal',
      width: boardSize.width,
      height: boardSize.height,
      position: { x: 0, y: 0, z: 0 },
      backgroundColor: 0x2d572c,
      backgroundOpacity: 0.8,
      acceptsCards: true,
      allowsCardRemoval: true,
      cardLayout: {
        type: 'grid',
        maxPerLine: Math.floor(boardSize.width / 2),
        spacing: { x: 1.5, y: 1.5 }
      }
    });

    // Ajouter les zones des joueurs
    for (let i = 0; i < playerCount; i++) {
      const angle = (i * 2 * Math.PI) / playerCount;
      const distance = Math.max(boardSize.width, boardSize.height) / 2 + 3;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      builder.addGameArea({
        id: `player-${i + 1}-area`,
        name: `Zone Joueur ${i + 1}`,
        width: 6,
        height: 3,
        position: { x, y, z: 0 },
        backgroundColor: 0x1a3a66,
        backgroundOpacity: 0.8,
        maxCards: 10,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: 'row',
          spacing: { x: 1.2, y: 0 }
        }
      });
    }

    return builder.build();
  }

  /**
   * Exemple de configuration JSON (pour démonstration)
   */
  public static getExampleJSONConfig(): string {
    const config = ConfigExamples.createSimpleCardGame();
    return JSON.stringify(config, null, 2);
  }
}

// Export des configurations prêtes à l'emploi
export const PRESET_CONFIGS = {
  SIMPLE_CARD_GAME: ConfigExamples.createSimpleCardGame(),
  MEMORY_GAME: ConfigExamples.createMemoryGame(),
  DOMINO_GAME: ConfigExamples.createDominoGame(),
  HEX_BOARD_GAME: ConfigExamples.createHexBoardGame(),
  DEFAULT: DEFAULT_CARD_GAME_CONFIG,
  SOLITAIRE: SOLITAIRE_CONFIG,
  POKER: POKER_CONFIG,
  BATTLESHIP: BATTLESHIP_CONFIG
};
