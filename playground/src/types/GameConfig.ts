import * as THREE from "three";

/**
 * Configuration for a single game area
 */
export interface GameAreaConfig {
  /** Unique identifier for the game area */
  id: string;

  /** Display name for the game area */
  name: string;

  /** Width of the game area */
  width: number;

  /** Height of the game area */
  height: number;

  /** Position of the game area in 3D space */
  position: {
    x: number;
    y: number;
    z: number;
  };

  /** Background color (hex string or number) */
  backgroundColor: string | number;

  /** Background opacity (0-1) */
  backgroundOpacity?: number;

  /** Background texture path (optional) */
  backgroundTexture?: string;

  /** Maximum number of cards this area can hold */
  maxCards?: number;

  /** Initial cards configuration */
  initialCards?: CardPlacementConfig[];

  /** Card layout configuration */
  cardLayout?: CardLayoutConfig;

  /** Whether cards can be dragged into this area */
  acceptsCards?: boolean;

  /** Whether cards can be dragged out of this area */
  allowsCardRemoval?: boolean;

  /** Area-specific properties */
  properties?: Record<string, any>;
}

/**
 * Configuration for card placement within an area
 */
export interface CardPlacementConfig {
  /** Card identifier or index */
  cardId: string | number;

  /** Position within the area */
  position: {
    x: number;
    y: number;
    z?: number;
  };

  /** Card-specific properties */
  properties?: Record<string, any>;
}

/**
 * Configuration for card layout within an area
 */
export interface CardLayoutConfig {
  /** Layout type */
  type: 'grid' | 'row' | 'column' | 'stack' | 'fan' | 'custom';

  /** Spacing between cards */
  spacing?: {
    x: number;
    y: number;
  };

  /** Alignment within the area */
  alignment?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
  };

  /** Maximum cards per row/column (for grid layout) */
  maxPerLine?: number;

  /** Stack offset for stacked cards */
  stackOffset?: {
    x: number;
    y: number;
    z: number;
  };

  /** Fan angle for fan layout (in degrees) */
  fanAngle?: number;

  /** Custom positioning function name */
  customPositionFunction?: string;
}

/**
 * Configuration for card appearance and behavior
 */
export interface CardConfig {
  /** Card identifier */
  id: string | number;

  /** Card dimensions */
  width: number;
  height: number;
  thickness: number;

  /** Card content */
  title?: string;
  description?: string;
  imageUrl?: string;

  /** Card properties */
  properties?: Record<string, any>;

  /** Whether this card can be dragged */
  draggable?: boolean;

  /** Card-specific styling */
  styling?: {
    backgroundColor?: string | number;
    borderColor?: string | number;
    textColor?: string | number;
    texture?: string;
  };
}

/**
 * Camera configuration
 */
export interface CameraConfig {
  /** Camera position */
  position: {
    x: number;
    y: number;
    z: number;
  };

  /** Camera target (look at) */
  target?: {
    x: number;
    y: number;
    z: number;
  };

  /** Field of view */
  fov?: number;

  /** Near clipping plane */
  near?: number;

  /** Far clipping plane */
  far?: number;

  /** Camera controls configuration */
  controls?: {
    enabled: boolean;
    enableRotate?: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
    minDistance?: number;
    maxDistance?: number;
  };
}

/**
 * Scene configuration
 */
export interface SceneConfig {
  /** Background color */
  backgroundColor?: string | number;

  /** Background texture */
  backgroundTexture?: string;

  /** Ambient light configuration */
  ambientLight?: {
    color: string | number;
    intensity: number;
  };

  /** Directional light configuration */
  directionalLight?: {
    color: string | number;
    intensity: number;
    position: {
      x: number;
      y: number;
      z: number;
    };
  };

  /** Additional lights */
  additionalLights?: Array<{
    type: 'point' | 'spot' | 'directional';
    color: string | number;
    intensity: number;
    position: {
      x: number;
      y: number;
      z: number;
    };
    [key: string]: any;
  }>;
}

/**
 * Game rules and behavior configuration
 */
export interface GameRulesConfig {
  /** Turn-based or real-time */
  gameMode: 'turn-based' | 'real-time';

  /** Number of players */
  playerCount: number;

  /** Card interaction rules */
  cardRules?: {
    /** Can cards be stacked */
    allowStacking?: boolean;

    /** Can cards be rotated */
    allowRotation?: boolean;

    /** Can cards be flipped */
    allowFlipping?: boolean;

    /** Snap to grid */
    snapToGrid?: boolean;

    /** Grid size for snapping */
    gridSize?: number;
  };

  /** Area interaction rules */
  areaRules?: {
    /** Can areas be resized */
    allowResize?: boolean;

    /** Can areas be moved */
    allowMove?: boolean;

    /** Highlight on hover */
    highlightOnHover?: boolean;

    /** Highlight on valid drop */
    highlightOnValidDrop?: boolean;
  };

  /** Custom game rules */
  customRules?: Record<string, any>;
}

/**
 * Main game configuration interface
 */
export interface GameConfig {
  /** Game metadata */
  metadata: {
    name: string;
    version: string;
    description?: string;
    author?: string;
    createdAt?: string;
  };

  /** Scene configuration */
  scene: SceneConfig;

  /** Camera configuration */
  camera: CameraConfig;

  /** Game areas configuration */
  gameAreas: GameAreaConfig[];

  /** Cards configuration */
  cards: CardConfig[];

  /** Game rules and behavior */
  gameRules: GameRulesConfig;

  /** Custom event handlers */
  eventHandlers?: {
    onGameStart?: string;
    onGameEnd?: string;
    onCardMoved?: string;
    onAreaChanged?: string;
    onTurnChange?: string;
    [key: string]: string | undefined;
  };

  /** Custom properties */
  customProperties?: Record<string, any>;
}

/**
 * Utility type for partial game configuration (for updates)
 */
export type PartialGameConfig = Partial<GameConfig> & {
  metadata: GameConfig['metadata'];
};

/**
 * Validation result for game configuration
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Game configuration builder utility
 */
export class GameConfigBuilder {
  private config: Partial<GameConfig> = {};

  constructor(name: string, version: string = '1.0.0') {
    this.config.metadata = {
      name,
      version,
      createdAt: new Date().toISOString()
    };
  }

  setScene(scene: SceneConfig): GameConfigBuilder {
    this.config.scene = scene;
    return this;
  }

  setCamera(camera: CameraConfig): GameConfigBuilder {
    this.config.camera = camera;
    return this;
  }

  addGameArea(area: GameAreaConfig): GameConfigBuilder {
    if (!this.config.gameAreas) {
      this.config.gameAreas = [];
    }
    this.config.gameAreas.push(area);
    return this;
  }

  addCard(card: CardConfig): GameConfigBuilder {
    if (!this.config.cards) {
      this.config.cards = [];
    }
    this.config.cards.push(card);
    return this;
  }

  setGameRules(rules: GameRulesConfig): GameConfigBuilder {
    this.config.gameRules = rules;
    return this;
  }

  build(): GameConfig {
    // Validate required fields
    if (!this.config.scene) {
      throw new Error('Scene configuration is required');
    }
    if (!this.config.camera) {
      throw new Error('Camera configuration is required');
    }
    if (!this.config.gameAreas) {
      throw new Error('At least one game area is required');
    }
    if (!this.config.cards) {
      throw new Error('At least one card configuration is required');
    }
    if (!this.config.gameRules) {
      throw new Error('Game rules configuration is required');
    }

    return this.config as GameConfig;
  }
}
