export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export interface Player {
  [playerKey: string]: string | number | undefined;
  minSizeDeck?: number;
  maxSizeDeck?: number;
  lifePoint?: number;
}

export interface CardSelectingConfig {
  nbCardsByOwner: string; // "7 cartes" ou "20%"
  isRandom: boolean;
  chosenBy: string;
}

export interface InitializationConfig {
  cardSelectingConfigs: CardSelectingConfig[];
  cardFacePattern: string; // "F", "B", "FFFB", etc.
}

export interface DisplayConfig {
  mode: "free" | "stack" | "list";
  cardFacePattern: string;
  areCardsVisible: boolean;
  hasSleeve: boolean;
}

export interface ActionPermission {
  enabled: boolean;
  allowedFor: "everyone" | "ownerOnly" | "ownerExclude" | "specific";
  allowedToPlayers: string[];
}

export interface CardActions {
  addCard: {
    atStart: ActionPermission;
    atEnd: ActionPermission;
    anywhere: ActionPermission;
    random: ActionPermission;
  };
  removeCard: {
    atStart: ActionPermission;
    atEnd: ActionPermission;
    anywhere: ActionPermission;
    random: ActionPermission;
  };
  flipCard: {
    faceUp: ActionPermission;
    faceDown: ActionPermission;
  };
  rotateCard: ActionPermission & {
    allowedAngles: number[];
  };
  shuffleAllCards: ActionPermission;
  searchCards: {
    all: ActionPermission;
    xCards: {
      atStart: ActionPermission;
      atEnd: ActionPermission;
      anywhere: ActionPermission;
      random: ActionPermission;
    };
  };
}

export interface GameZone {
  name: string;
  height: number; // -1 pour taille automatique
  width: number; // -1 pour taille automatique
  coordinates: Coordinates;
  backgroundColor: string;
  owners: string[]; // clés des joueurs propriétaires
  cards: any[]; // Pour l'instant on ne s'en occupe pas
  initializationConfig: InitializationConfig;
  displayConfig: DisplayConfig;
  actions: CardActions;
}

export interface Tool {
  toolType: "piece" | "dice";
  nbFace: number;
  visibleBy: "everyone" | "ownerOnly" | "ownerExclude" | "specific";
  visibleToPlayers: string[];
}

export interface Ruleset {
  id: string;
  name: string;
  description: string;
  isDraft: boolean;
  isPublic: boolean;
  players: Player[];
  cardTypes: any[]; // Pour l'instant on ne s'en occupe pas
  cards: any[]; // Pour l'instant on ne s'en occupe pas
  tools: Tool[]; // Pour l'instant on ne s'en occupe pas
  zones: GameZone[];
}

export interface RulesetFile {
  ruleset: Ruleset;
}

// Interface pour la configuration de zone simplifiée pour le SceneManager
export interface ZoneConfig {
  name: string;
  width: number;
  height: number;
  position: Coordinates;
  backgroundColor: string; // Couleur hexadécimale
  owners: string[];
  displayMode: "free" | "stack" | "list";
  areCardsVisible: boolean;
  initializationCards?: {
    count: number;
    isRandom: boolean;
    facePattern: string;
  };
}

export interface GameConfig {
  zones: ZoneConfig[];
  players: string[]; // Liste des clés de joueurs
}
