import type {
  RulesetFile,
  Ruleset,
  GameZone,
  ZoneConfig,
  GameConfig,
  Coordinates,
} from "../../interfaces/Ruleset";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "$lib/firebase/client";
import * as THREE from "three";

export class ConfigLoader {
  private static readonly DEFAULT_ZONE_WIDTH = 4;
  private static readonly DEFAULT_ZONE_HEIGHT = 3;
  private static readonly DEFAULT_SPACING = 1.5;

  /**
   * Convertit directement des données de ruleset en GameConfig (depuis lobby)
   */
  public static loadFromRulesetData(rulesetData: any): GameConfig {
    // Extraire les clés des joueurs
    const players = this.extractPlayerKeys(
      this.normalizePlayers(rulesetData.players),
    );

    // Traiter les zones
    const zones = this.processZones(rulesetData.zones || [], players);

    return {
      zones,
      players,
    };
  }

  /**
   * Charge une configuration de jeu depuis Firebase par l'ID du ruleset
   */
  public static async loadFromFirebase(rulesetId: string): Promise<GameConfig> {
    try {
      const rulesetRef = doc(firestore, "rulesets", rulesetId);
      const docSnap = await getDoc(rulesetRef);

      if (!docSnap.exists()) {
        throw new Error(`Ruleset with ID ${rulesetId} not found in Firebase`);
      }

      const rawData = docSnap.data();

      // Convertir vers notre format Ruleset
      const convertedRuleset: Ruleset = {
        id: rulesetId,
        name: rawData?.name || "Unknown Ruleset",
        description: rawData?.description || "",
        isDraft: rawData?.isDraft || false,
        isPublic: rawData?.isPublic || false,
        players: this.normalizePlayers(rawData?.players),
        cardTypes: rawData?.cardTypes || [],
        cards: rawData?.cards || [],
        tools: rawData?.tools || [],
        zones: (rawData?.zones || []) as GameZone[],
      };

      const normalizedData: RulesetFile = {
        ruleset: convertedRuleset,
      };

      return this.loadFromRuleset(normalizedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Charge une configuration de jeu à partir d'un fichier ruleset JSON
   */
  public static async loadFromRuleset(
    rulesetData: RulesetFile,
  ): Promise<GameConfig> {
    const ruleset = rulesetData.ruleset;

    // Extraire les clés des joueurs
    const players = this.extractPlayerKeys(ruleset.players);

    // Traiter les zones
    const zones = this.processZones(ruleset.zones, players);

    return {
      zones,
      players,
    };
  }

  /**
   * Charge une configuration depuis une URL JSON
   */
  public static async loadFromUrl(url: string): Promise<GameConfig> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ruleset: ${response.statusText}`);
      }

      const rulesetData: RulesetFile = await response.json();
      return this.loadFromRuleset(rulesetData);
    } catch (error) {
      console.error("Error loading ruleset from URL:", error);
      throw error;
    }
  }

  /**
   * Normalise les données des joueurs pour s'adapter aux différents formats
   */
  private static normalizePlayers(playersData: any): any[] {
    // Si c'est déjà un array, le retourner tel quel
    if (Array.isArray(playersData)) {
      return playersData;
    }

    // Si c'est undefined ou null, retourner un array par défaut
    if (!playersData) {
      return [
        { albert: "", minSizeDeck: 60, lifePoint: 20 },
        { lea: "", minSizeDeck: 60, lifePoint: 20 },
      ];
    }

    // Si c'est un objet, essayer de le convertir en array
    if (typeof playersData === "object") {
      return Object.values(playersData);
    }

    // Fallback: créer un array par défaut
    return [
      { albert: "", minSizeDeck: 60, lifePoint: 20 },
      { lea: "", minSizeDeck: 60, lifePoint: 20 },
    ];
  }

  /**
   * Extrait les clés des joueurs depuis la configuration
   */
  private static extractPlayerKeys(players: any[]): string[] {
    const playerKeys: string[] = [];

    // Vérifier que players est un array
    if (!Array.isArray(players)) {
      return ["player1", "player2"]; // Fallback
    }

    for (const player of players) {
      // Trouve la première clé qui n'est pas une propriété spéciale
      for (const key in player) {
        if (
          key !== "minSizeDeck" &&
          key !== "maxSizeDeck" &&
          key !== "lifePoint"
        ) {
          playerKeys.push(key);
          break;
        }
      }
    }

    return playerKeys.length > 0 ? playerKeys : ["player1", "player2"];
  }

  /**
   * Traite les zones du ruleset et les convertit en ZoneConfig
   */
  private static processZones(
    zones: GameZone[],
    players: string[],
  ): ZoneConfig[] {
    const processedZones: ZoneConfig[] = [];

    // Grouper les zones par type et par joueur
    const zonesByType = this.groupZonesByType(zones);

    // Calculer les positions automatiquement si nécessaires
    this.calculateZonePositions(zonesByType, players);

    // Convertir chaque zone
    for (const zone of zones) {
      const config = this.convertZoneToConfig(zone);
      processedZones.push(config);
    }

    return processedZones;
  }

  /**
   * Groupe les zones par type (hand, library, battlefield, etc.)
   */
  private static groupZonesByType(zones: GameZone[]): Map<string, GameZone[]> {
    const grouped = new Map<string, GameZone[]>();

    for (const zone of zones) {
      if (!grouped.has(zone.name)) {
        grouped.set(zone.name, []);
      }
      grouped.get(zone.name)!.push(zone);
    }

    return grouped;
  }

  /**
   * Calcule automatiquement les positions des zones si elles sont à -1
   */
  private static calculateZonePositions(
    zonesByType: Map<string, GameZone[]>,
    players: string[],
  ): void {
    // Positions prédéfinies pour les types de zones MTG
    const positionTemplates = {
      hand: this.getHandPositions(players),
      library: this.getLibraryPositions(players),
      graveyard: this.getGraveyardPositions(players),
      battlefield: this.getBattlefieldPositions(players),
      exile: this.getExilePositions(players),
      stack: this.getStackPosition(),
    };

    for (const [zoneType, zones] of zonesByType) {
      const template =
        positionTemplates[zoneType as keyof typeof positionTemplates];

      if (template) {
        zones.forEach((zone, index) => {
          if (zone.coordinates.x === -1 || zone.coordinates.y === -1) {
            const position = Array.isArray(template)
              ? template[index] || template[0]
              : template;
            zone.coordinates.x = position.x;
            zone.coordinates.y = position.y;
            if (zone.coordinates.z === -1) zone.coordinates.z = position.z;
          }

          if (zone.width === -1) zone.width = this.DEFAULT_ZONE_WIDTH;
          if (zone.height === -1) zone.height = this.DEFAULT_ZONE_HEIGHT;
        });
      }
    }
  }

  /**
   * Positions pour les mains des joueurs
   */
  private static getHandPositions(players: string[]): Coordinates[] {
    const positions: Coordinates[] = [];
    const playerCount = players.length;

    if (playerCount === 2) {
      positions.push({ x: 0, y: -4, z: 0.1 }); // Joueur 1 en bas
      positions.push({ x: 0, y: 4, z: 0.1 }); // Joueur 2 en haut
    } else {
      // Pour plus de joueurs, les disposer en cercle
      for (let i = 0; i < playerCount; i++) {
        const angle = (i * 2 * Math.PI) / playerCount;
        const radius = 5;
        positions.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: 0.1,
        });
      }
    }

    return positions;
  }

  /**
   * Positions pour les bibliothèques
   */
  private static getLibraryPositions(players: string[]): Coordinates[] {
    const positions: Coordinates[] = [];

    if (players.length === 2) {
      positions.push({ x: 4, y: -3, z: 0 }); // Joueur 1
      positions.push({ x: -4, y: 3, z: 0 }); // Joueur 2
    } else {
      // Adapter pour plus de joueurs
      for (let i = 0; i < players.length; i++) {
        const angle = (i * 2 * Math.PI) / players.length;
        const radius = 6;
        positions.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: 0,
        });
      }
    }

    return positions;
  }

  /**
   * Positions pour les cimetières
   */
  private static getGraveyardPositions(players: string[]): Coordinates[] {
    const positions: Coordinates[] = [];

    if (players.length === 2) {
      positions.push({ x: -4, y: -3, z: 0 }); // Joueur 1
      positions.push({ x: 4, y: 3, z: 0 }); // Joueur 2
    } else {
      for (let i = 0; i < players.length; i++) {
        const angle = (i * 2 * Math.PI) / players.length + Math.PI / 4;
        const radius = 6;
        positions.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: 0,
        });
      }
    }

    return positions;
  }

  /**
   * Positions pour les champs de bataille
   */
  private static getBattlefieldPositions(players: string[]): Coordinates[] {
    const positions: Coordinates[] = [];

    if (players.length === 2) {
      positions.push({ x: 0, y: -1, z: 0 }); // Joueur 1
      positions.push({ x: 0, y: 1, z: 0 }); // Joueur 2
    } else {
      // Zone centrale partagée pour plus de joueurs
      for (let i = 0; i < players.length; i++) {
        positions.push({ x: 0, y: 0, z: 0 });
      }
    }

    return positions;
  }

  /**
   * Positions pour les zones d'exil
   */
  private static getExilePositions(players: string[]): Coordinates[] {
    const positions: Coordinates[] = [];

    if (players.length === 2) {
      positions.push({ x: 6, y: -2, z: 0 }); // Joueur 1
      positions.push({ x: -6, y: 2, z: 0 }); // Joueur 2
    } else {
      for (let i = 0; i < players.length; i++) {
        const angle = (i * 2 * Math.PI) / players.length - Math.PI / 4;
        const radius = 7;
        positions.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: 0,
        });
      }
    }

    return positions;
  }

  /**
   * Position pour la pile (zone partagée)
   */
  private static getStackPosition(): Coordinates {
    return { x: 0, y: 0, z: 0.5 }; // Centre, légèrement élevé
  }

  /**
   * Convertit une GameZone en ZoneConfig
   */
  private static convertZoneToConfig(zone: GameZone): ZoneConfig {
    return {
      name: zone.name,
      width: zone.width,
      height: zone.height,
      position: { ...zone.coordinates },
      backgroundColor: this.parseBackgroundColor(zone.backgroundColor),
      owners: [...zone.owners],
      displayMode: zone.displayConfig.mode,
      areCardsVisible: zone.displayConfig.areCardsVisible,
      initializationCards: this.parseInitializationCards(
        zone.initializationConfig,
      ),
    };
  }

  /**
   * Parse la couleur de fond depuis le format string vers hexadécimal
   */
  private static parseBackgroundColor(colorString: string): string {
    // Si c'est déjà une couleur hex, la retourner
    if (colorString.startsWith("#") || colorString.startsWith("0x")) {
      return colorString;
    }

    // Couleurs par défaut selon le nom de la zone
    const defaultColors: Record<string, string> = {
      hand: "#1a3a66",
      library: "#2d2d2d",
      graveyard: "#4d2d2d",
      battlefield: "#2d572c",
      exile: "#5d2d5d",
      stack: "#3d3d3d",
    };

    // Extraire le nom de la zone depuis la chaîne si nécessaire
    for (const [zoneName, color] of Object.entries(defaultColors)) {
      if (colorString.toLowerCase().includes(zoneName)) {
        return color;
      }
    }

    // Couleur par défaut
    return "#2d572c";
  }

  /**
   * Parse la configuration d'initialisation des cartes
   */
  private static parseInitializationCards(
    config: any,
  ): { count: number; isRandom: boolean; facePattern: string } | undefined {
    if (
      !config.cardSelectingConfigs ||
      config.cardSelectingConfigs.length === 0
    ) {
      return undefined;
    }

    const firstConfig = config.cardSelectingConfigs[0];
    const countStr = firstConfig.nbCardsByOwner;

    // Parser le nombre de cartes
    let count = 0;
    if (countStr.includes("cartes")) {
      count = parseInt(countStr.match(/\d+/)?.[0] || "0");
    } else if (countStr.includes("%")) {
      // Pour les pourcentages, on peut définir une logique plus tard
      count = 0;
    }

    return {
      count,
      isRandom: firstConfig.isRandom,
      facePattern: config.cardFacePattern || "F",
    };
  }

  /**
   * Crée une configuration par défaut pour les tests
   */
  public static createDefaultConfig(): GameConfig {
    return {
      zones: [
        {
          name: "battlefield",
          width: 8,
          height: 4,
          position: { x: 0, y: 0, z: 0 },
          backgroundColor: "#2d572c",
          owners: [],
          displayMode: "free",
          areCardsVisible: true,
        },
        {
          name: "hand_player1",
          width: 6,
          height: 2,
          position: { x: 0, y: -3, z: 0.1 },
          backgroundColor: "#1a3a66",
          owners: ["player1"],
          displayMode: "list",
          areCardsVisible: false,
        },
        {
          name: "hand_player2",
          width: 6,
          height: 2,
          position: { x: 0, y: 3, z: 0.1 },
          backgroundColor: "#661a1a",
          owners: ["player2"],
          displayMode: "list",
          areCardsVisible: false,
        },
      ],
      players: ["player1", "player2"],
    };
  }
}
