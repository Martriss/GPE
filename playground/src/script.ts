import { ConfigurableSceneManager } from "./managers/ConfigurableSceneManager";
import { PRESET_CONFIGS, ConfigExamples } from "./examples/ConfigExamples";
import {
  DEFAULT_CARD_GAME_CONFIG,
  SOLITAIRE_CONFIG,
  POKER_CONFIG,
  BATTLESHIP_CONFIG,
} from "./configs/GameConfigs";

// Fonction pour afficher les configurations disponibles
function displayAvailableConfigs() {
  console.log("=== Configurations disponibles ===");
  console.log("1. Jeu de cartes par défaut (DEFAULT_CARD_GAME_CONFIG)");
  console.log("2. Solitaire (SOLITAIRE_CONFIG)");
  console.log("3. Poker (POKER_CONFIG)");
  console.log("4. Bataille navale (BATTLESHIP_CONFIG)");
  console.log("5. Jeu de cartes simple (SIMPLE_CARD_GAME)");
  console.log("6. Memory (MEMORY_GAME)");
  console.log("7. Dominos (DOMINO_GAME)");
  console.log("8. Plateau hexagonal (HEX_BOARD_GAME)");
}

// Fonction pour lancer un jeu avec une configuration spécifique
async function launchGameWithConfig(configName: string = "DEFAULT") {
  let config;

  switch (configName.toUpperCase()) {
    case "DEFAULT":
      config = DEFAULT_CARD_GAME_CONFIG;
      break;
    case "SOLITAIRE":
      config = SOLITAIRE_CONFIG;
      break;
    case "POKER":
      config = POKER_CONFIG;
      break;
    case "BATTLESHIP":
      config = BATTLESHIP_CONFIG;
      break;
    case "SIMPLE":
      config = PRESET_CONFIGS.SIMPLE_CARD_GAME;
      break;
    case "MEMORY":
      config = PRESET_CONFIGS.MEMORY_GAME;
      break;
    case "DOMINO":
      config = PRESET_CONFIGS.DOMINO_GAME;
      break;
    case "HEX":
      config = PRESET_CONFIGS.HEX_BOARD_GAME;
      break;
    default:
      console.warn(
        `Configuration "${configName}" non reconnue, utilisation de la configuration par défaut`,
      );
      config = DEFAULT_CARD_GAME_CONFIG;
  }

  console.log(`Lancement du jeu: ${config.metadata.name}`);

  try {
    const gameManager = new ConfigurableSceneManager(config);

    // Attendre que le jeu soit initialisé
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Afficher les statistiques
    const stats = gameManager.getGameStats();
    console.log("Statistiques du jeu:", stats);

    // Ajouter des contrôles pour changer de configuration
    setupConfigurationControls(gameManager);

    return gameManager;
  } catch (error) {
    console.error("Erreur lors du lancement du jeu:", error);
    throw error;
  }
}

// Fonction pour configurer les contrôles de changement de configuration
function setupConfigurationControls(gameManager: ConfigurableSceneManager) {
  // Créer une interface utilisateur simple
  const controlsDiv = document.createElement("div");
  controlsDiv.style.position = "fixed";
  controlsDiv.style.top = "10px";
  controlsDiv.style.right = "10px";
  controlsDiv.style.background = "rgba(0, 0, 0, 0.8)";
  controlsDiv.style.color = "white";
  controlsDiv.style.padding = "10px";
  controlsDiv.style.borderRadius = "5px";
  controlsDiv.style.fontFamily = "Arial, sans-serif";
  controlsDiv.style.fontSize = "12px";
  controlsDiv.style.zIndex = "1000";

  controlsDiv.innerHTML = `
    <h3>Configurations</h3>
    <button id="btn-default">Défaut</button>
    <button id="btn-solitaire">Solitaire</button>
    <button id="btn-poker">Poker</button>
    <button id="btn-battleship">Bataille navale</button>
    <button id="btn-simple">Simple</button>
    <button id="btn-memory">Memory</button>
    <button id="btn-domino">Dominos</button>
    <button id="btn-hex">Hexagonal</button>
    <hr>
    <button id="btn-debug">Debug</button>
    <button id="btn-shuffle">Mélanger</button>
    <button id="btn-reset">Reset</button>
  `;

  document.body.appendChild(controlsDiv);

  // Ajouter les événements
  document.getElementById("btn-default")?.addEventListener("click", () => {
    gameManager.changeConfig(DEFAULT_CARD_GAME_CONFIG);
  });

  document.getElementById("btn-solitaire")?.addEventListener("click", () => {
    gameManager.changeConfig(SOLITAIRE_CONFIG);
  });

  document.getElementById("btn-poker")?.addEventListener("click", () => {
    gameManager.changeConfig(POKER_CONFIG);
  });

  document.getElementById("btn-battleship")?.addEventListener("click", () => {
    gameManager.changeConfig(BATTLESHIP_CONFIG);
  });

  document.getElementById("btn-simple")?.addEventListener("click", () => {
    gameManager.changeConfig(PRESET_CONFIGS.SIMPLE_CARD_GAME);
  });

  document.getElementById("btn-memory")?.addEventListener("click", () => {
    gameManager.changeConfig(PRESET_CONFIGS.MEMORY_GAME);
  });

  document.getElementById("btn-domino")?.addEventListener("click", () => {
    gameManager.changeConfig(PRESET_CONFIGS.DOMINO_GAME);
  });

  document.getElementById("btn-hex")?.addEventListener("click", () => {
    gameManager.changeConfig(PRESET_CONFIGS.HEX_BOARD_GAME);
  });

  document.getElementById("btn-debug")?.addEventListener("click", () => {
    gameManager.toggleDebugMode();
  });

  document.getElementById("btn-shuffle")?.addEventListener("click", () => {
    try {
      // Essayer de mélanger les cartes dans la première zone trouvée
      const areas = gameManager.getAllGameAreas();
      if (areas.length > 0) {
        const areaName = areas[0].getName();
        gameManager.shuffleCardsInArea(areaName);
        console.log(`Cartes mélangées dans ${areaName}`);
      }
    } catch (error) {
      console.error("Erreur lors du mélange:", error);
    }
  });

  document.getElementById("btn-reset")?.addEventListener("click", () => {
    gameManager.resetToDefault();
  });
}

// Fonction pour créer une configuration personnalisée
function createCustomConfig(): void {
  const customConfig = ConfigExamples.createDynamicConfig(
    "Mon Jeu Personnalisé",
    3, // 3 joueurs
    { width: 8, height: 6 }, // taille du plateau
  );

  console.log("Configuration personnalisée créée:", customConfig);

  // Lancer le jeu avec cette configuration
  launchGameWithConfig("DEFAULT").then((gameManager) => {
    gameManager.changeConfig(customConfig);
  });
}

// Configuration depuis un objet personnalisé
function launchWithCustomObject() {
  const customGameConfig = {
    metadata: {
      name: "Configuration Personnalisée",
      version: "1.0.0",
      description:
        "Un jeu créé à partir d'un objet de configuration personnalisé",
    },
    scene: {
      backgroundColor: 0x2a2a2a,
      ambientLight: {
        color: 0xffffff,
        intensity: 0.7,
      },
    },
    camera: {
      position: { x: 0, y: 0, z: 10 },
      target: { x: 0, y: 0, z: 0 },
      fov: 80,
    },
    gameAreas: [
      {
        id: "custom-area",
        name: "Zone Personnalisée",
        width: 8,
        height: 5,
        position: { x: 0, y: 0, z: 0 },
        backgroundColor: 0x4a4a4a,
        backgroundOpacity: 0.9,
        acceptsCards: true,
        allowsCardRemoval: true,
        cardLayout: {
          type: "row",
          spacing: { x: 1.5, y: 0 },
          alignment: { horizontal: "center", vertical: "center" },
        },
      },
    ],
    cards: [
      {
        id: "custom-card-1",
        width: 1,
        height: 1.4,
        thickness: 0.02,
        title: "Carte Personnalisée 1",
        draggable: true,
      },
      {
        id: "custom-card-2",
        width: 1,
        height: 1.4,
        thickness: 0.02,
        title: "Carte Personnalisée 2",
        draggable: true,
      },
    ],
    gameRules: {
      gameMode: "turn-based" as const,
      playerCount: 1,
      cardRules: {
        allowStacking: true,
        allowRotation: false,
        allowFlipping: true,
        snapToGrid: false,
      },
    },
  };

  const gameManager = new ConfigurableSceneManager(customGameConfig);
  console.log("Jeu lancé avec configuration personnalisée");
}

// Afficher les configurations disponibles
displayAvailableConfigs();

// Lancer l'application avec la configuration par défaut
launchGameWithConfig("DEFAULT")
  .then((gameManager) => {
    console.log("Jeu initialisé avec succès!");

    // Exposer les fonctions utiles globalement pour les tests
    (window as any).gameManager = gameManager;
    (window as any).launchGameWithConfig = launchGameWithConfig;
    (window as any).createCustomConfig = createCustomConfig;
    (window as any).launchWithCustomObject = launchWithCustomObject;
    (window as any).ConfigExamples = ConfigExamples;

    console.log("=== Fonctions disponibles dans la console ===");
    console.log("gameManager - Instance du gestionnaire de jeu");
    console.log("launchGameWithConfig(configName) - Lancer avec une config");
    console.log("createCustomConfig() - Créer une config personnalisée");
    console.log("launchWithCustomObject() - Lancer avec un objet personnalisé");
    console.log("ConfigExamples - Exemples de configurations");
  })
  .catch((error) => {
    console.error("Erreur lors de l'initialisation:", error);
  });
