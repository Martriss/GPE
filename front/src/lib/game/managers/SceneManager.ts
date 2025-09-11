import { Renderer } from "../core/Renderer";
import { Camera } from "../core/Camera";
import { Scene } from "../core/Scene";
import { Card } from "../objects/Card";
import { GameArea } from "../objects/GameArea";
import { MultiplayerController } from "./MultiplayerController";
import { ConfigLoader } from "./ConfigLoader";
import type { GameConfig, ZoneConfig } from "../../interfaces/Ruleset";
import * as THREE from "three";

export class SceneManager {
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  public cards: Card[];
  private gameAreas: GameArea[] = [];
  private container: HTMLElement | null = null;
  private multiplayerController: MultiplayerController | null = null;
  private gameConfig: GameConfig | null = null;

  constructor(container?: HTMLElement, rulesetData?: any) {
    this.container = container || null;
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer(container);
    this.cards = [];

    // Initialize the scene
    if (rulesetData && rulesetData.zones && rulesetData.zones.length > 0) {
      this.initializeWithRulesetData(rulesetData);
    } else {
      this.initializeWithDefaultConfig();
    }

    this.setupEventListeners();
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  /**
   * Initialize scene with ruleset data directly from lobby
   */
  private initializeWithRulesetData(rulesetData: any): void {
    try {
      // Convert ruleset data to GameConfig
      this.gameConfig = ConfigLoader.loadFromRulesetData(rulesetData);

      // Validate configuration
      if (
        !this.gameConfig ||
        !this.gameConfig.zones ||
        this.gameConfig.zones.length === 0
      ) {
        throw new Error("Invalid configuration from lobby data");
      }

      // Create game areas and cards
      this.createGameAreasFromConfig();
      this.createAndDistributeCards();
      this.initializeCardCallbacks();
    } catch (error) {
      console.error("Error loading ruleset from lobby data:", error);
      this.initializeWithDefaultConfig();
    }
  }

  /**
   * Initialize with default configuration if no ruleset or error
   */
  private initializeWithDefaultConfig(): void {
    try {
      this.gameConfig = ConfigLoader.createDefaultConfig();

      if (!this.gameConfig || !this.gameConfig.zones) {
        throw new Error("Failed to create default configuration");
      }

      this.createGameAreasFromConfig();
      this.createAndDistributeCards();
      this.initializeCardCallbacks();
    } catch (error) {
      console.error("Fatal error: cannot create default configuration", error);
      this.createMinimalFallback();
    }
  }

  /**
   * Create a minimal fallback scene if everything else fails
   */
  private createMinimalFallback(): void {
    this.gameConfig = {
      zones: [
        {
          name: "main",
          width: 10,
          height: 6,
          position: { x: 0, y: 0, z: 0 },
          backgroundColor: "#2d572c",
          owners: [],
          displayMode: "free",
          areCardsVisible: true,
        },
      ],
      players: ["player1", "player2"],
    };

    // Create just one simple area
    const mainArea = new GameArea(
      10,
      6,
      new THREE.Vector3(0, 0, 0),
      0x2d572c,
      "main",
    );
    this.gameAreas.push(mainArea);
    this.scene.add(mainArea.mesh);
    mainArea.mesh.userData.gameArea = mainArea;
    mainArea.setOnCardAddedCallback(this.handleCardAdded.bind(this));

    // Create minimal cards
    this.cards = Array.from(
      { length: 5 },
      (_, index) =>
        new Card(1, 1.4, 0.01, "", "", this.camera.camera, `card_${index}`),
    );

    // Add cards to main area
    for (let i = 0; i < this.cards.length; i++) {
      mainArea.addCard(this.cards[i], i * 2 - 4, 0);
    }

    this.initializeCardCallbacks();
  }

  /**
   * Create game areas from the loaded configuration
   */
  private createGameAreasFromConfig(): void {
    if (!this.gameConfig) return;

    for (const zoneConfig of this.gameConfig.zones) {
      this.createGameAreaFromConfig(zoneConfig);
    }
  }

  /**
   * Create a GameArea from a ZoneConfig
   */
  private createGameAreaFromConfig(config: ZoneConfig): void {
    const position = new THREE.Vector3(
      config.position.x,
      config.position.y,
      config.position.z,
    );
    const color = this.parseColor(config.backgroundColor);

    const gameArea = new GameArea(
      config.width,
      config.height,
      position,
      color,
      config.name,
    );

    this.gameAreas.push(gameArea);
    this.scene.add(gameArea.mesh);
    gameArea.mesh.userData.gameArea = gameArea;

    // Set up event handlers
    gameArea.setOnCardAddedCallback(this.handleCardAdded.bind(this));
  }

  /**
   * Parse color string to THREE.js color format
   */
  private parseColor(colorString: string): THREE.ColorRepresentation {
    if (colorString.startsWith("#")) {
      return colorString;
    } else if (colorString.startsWith("0x")) {
      return parseInt(colorString, 16);
    }
    // Default color if parsing fails
    return 0x2d572c;
  }

  /**
   * Create cards and distribute them based on initialization configuration
   */
  private createAndDistributeCards(): void {
    if (!this.gameConfig) return;

    // Calculate total cards needed
    const totalCardsNeeded = this.gameConfig.zones.reduce((total, zone) => {
      return total + (zone.initializationCards?.count || 0);
    }, 0);

    // Create cards with deterministic IDs
    const cardCount = Math.max(totalCardsNeeded, 15); // Minimum 15 cards
    this.cards = Array.from(
      { length: cardCount },
      (_, index) =>
        new Card(1, 1.4, 0.01, "", "", this.camera.camera, `card_${index}`),
    );

    // Distribute cards among the areas
    let cardIndex = 0;

    for (const zoneConfig of this.gameConfig.zones) {
      const gameArea = this.findGameAreaByName(zoneConfig.name);
      if (!gameArea || !zoneConfig.initializationCards) continue;

      const { count } = zoneConfig.initializationCards;

      // Add specified number of cards to this area
      for (let i = 0; i < count && cardIndex < this.cards.length; i++) {
        const card = this.cards[cardIndex++];

        // Position cards based on display mode
        let posX = 0,
          posY = 0;

        if (zoneConfig.displayMode === "list") {
          // Arrange in a line
          posX = (i - count / 2) * 1.5;
        } else if (zoneConfig.displayMode === "stack") {
          // Stack on top of each other
          posY = i * 0.02;
        }
        // For 'free' mode, just place at center

        gameArea.addCard(card, posX, posY);
      }
    }

    // If there are remaining cards, distribute them to battlefield or main area
    if (cardIndex < this.cards.length) {
      const mainArea =
        this.findGameAreaByName("battlefield") || this.gameAreas[0];
      if (mainArea) {
        while (cardIndex < this.cards.length) {
          const card = this.cards[cardIndex++];
          const posX = (cardIndex % 5) * 2 - 4;
          const posY = Math.floor(cardIndex / 5) * 0.5;
          mainArea.addCard(card, posX, posY);
        }
      }
    }
  }

  /**
   * Find a game area by name
   */
  private findGameAreaByName(name: string): GameArea | undefined {
    return this.gameAreas.find((area) => area.getName() === name);
  }

  private setupEventListeners(): void {
    window.addEventListener("resize", this.onWindowResize.bind(this));

    // Set up card drop handling
    for (const gameArea of this.gameAreas) {
      // Ensure callbacks are properly bound to this instance
      const boundAddedCallback = this.handleCardAdded.bind(this);
      gameArea.setOnCardAddedCallback(boundAddedCallback);
    }
  }

  /**
   * Initialize drop callbacks for all existing cards
   */
  private initializeCardCallbacks(): void {
    // Set drop callbacks for each card in each area
    for (const area of this.gameAreas) {
      const cards = area.getCards();

      for (const card of cards) {
        // Make sure we bind the callback to this SceneManager instance
        const boundDropCallback = this.handleCardDrop.bind(this);
        // Set the callback for the card
        card.setDropCallback(boundDropCallback);
      }
    }
  }

  private onWindowResize(): void {
    this.camera.updateAspect();
    this.renderer.updateSize();
  }

  private animate(): void {
    this.renderer.render(this.scene.scene, this.camera.camera);

    // Check for any cards being dragged
    this.checkDraggedCards();
  }

  /**
   * Handle when a card is added to a game area
   */
  private handleCardAdded(card: Card): void {
    // Make sure we bind the callback to this SceneManager instance
    const boundDropCallback = this.handleCardDrop.bind(this);

    // Set the callback for the card
    card.setDropCallback(boundDropCallback);
  }

  /**
   * Handle when a card is dropped after dragging
   */
  private handleCardDrop(card: Card, worldPosition: THREE.Vector3): void {
    // Find the current area that contains the card
    const sourceArea = this.findAreaContainingCard(card);

    // Find the area where the card was dropped
    const targetArea = this.findAreaAtPosition(worldPosition);

    if (sourceArea && targetArea && sourceArea !== targetArea) {
      // Remove from source area
      sourceArea.removeCard(card);

      // Add to target area
      // Calculate position relative to the new area
      const localPosition = worldPosition.clone().sub(targetArea.mesh.position);
      targetArea.addCard(card, localPosition.x, localPosition.y);
    }

    // Sync with multiplayer if enabled
    if (this.multiplayerController) {
      this.multiplayerController.moveCard(card.getId(), {
        x: card.mesh.position.x,
        y: card.mesh.position.y,
        z: card.mesh.position.z,
      });
    }
  }

  /**
   * Find which game area contains the specified card
   */
  private findAreaContainingCard(card: Card): GameArea | null {
    for (const area of this.gameAreas) {
      const areaCards = area.getCards();

      if (areaCards.includes(card)) {
        return area;
      }
    }
    return null;
  }

  /**
   * Find which game area is at the specified world position
   */
  private findAreaAtPosition(worldPosition: THREE.Vector3): GameArea | null {
    for (const area of this.gameAreas) {
      if (area.containsPoint(worldPosition)) {
        return area;
      }
    }
    return null;
  }

  /**
   * Check for any cards being dragged over areas
   */
  private checkDraggedCards(): void {
    // Highlight areas when cards are being dragged over them
    let anyCardDragging = false;

    // Check all cards to see if any are being dragged
    for (const area of this.gameAreas) {
      for (const card of area.getCards()) {
        if (card.isDraggingCard()) {
          anyCardDragging = true;

          // Get card's current world position
          const cardPosition = card.getWorldPosition();

          // Highlight areas that the card is over
          for (const targetArea of this.gameAreas) {
            if (targetArea.containsPoint(cardPosition)) {
              // Highlight this area as a potential drop target
              if (targetArea !== area) {
                targetArea.setBackgroundOpacity(0.9);
              }
            } else {
              // Reset opacity
              targetArea.setBackgroundOpacity(0.8);
            }
          }

          break;
        }
      }
    }

    if (!anyCardDragging) {
      // Reset all areas to default opacity
      for (const targetArea of this.gameAreas) {
        targetArea.setBackgroundOpacity(0.8);
      }
    }
  }

  /**
   * Get all game areas
   */
  public getGameAreas(): GameArea[] {
    return [...this.gameAreas];
  }

  /**
   * Get a specific game area by index
   */
  public getGameArea(index: number): GameArea | undefined {
    return this.gameAreas[index];
  }

  /**
   * Add a new game area to the scene
   */
  public addGameArea(
    width: number,
    height: number,
    position: THREE.Vector3,
    color: THREE.ColorRepresentation = 0x2d572c,
    name: string = `GameArea${this.gameAreas.length}`,
  ): GameArea {
    const gameArea = new GameArea(width, height, position, color, name);
    this.gameAreas.push(gameArea);
    this.scene.add(gameArea.mesh);
    gameArea.mesh.userData.gameArea = gameArea;

    // Set up event handlers
    gameArea.setOnCardAddedCallback(this.handleCardAdded.bind(this));

    return gameArea;
  }

  /**
   * Remove a game area from the scene
   */
  public removeGameArea(gameArea: GameArea): boolean {
    const index = this.gameAreas.indexOf(gameArea);
    if (index !== -1) {
      this.gameAreas.splice(index, 1);
      this.scene.remove(gameArea.mesh);
      gameArea.dispose();
      return true;
    }
    return false;
  }

  /**
   * Get the renderer's DOM element for mounting in Svelte
   */
  public getDomElement(): HTMLCanvasElement {
    return this.renderer.getDomElement();
  }

  /**
   * Initialize multiplayer synchronization for the game
   */
  public initializeMultiplayer(
    roomId: string,
    playerId: string,
    isHost: boolean = false,
  ): void {
    try {
      this.multiplayerController = new MultiplayerController(
        this,
        roomId,
        playerId,
        isHost,
      );
    } catch (error) {
      console.error("Failed to initialize multiplayer controller:", error);
    }
  }

  /**
   * Disable multiplayer synchronization
   */
  public disableMultiplayer(): void {
    if (this.multiplayerController) {
      this.multiplayerController.dispose();
      this.multiplayerController = null;
    }
  }

  /**
   * Handle card flip with multiplayer sync
   */
  public flipCard(card: Card): void {
    card.flip();

    // Sync with multiplayer if enabled
    if (this.multiplayerController) {
      // Use a timeout to let the flip animation complete
      setTimeout(() => {
        this.multiplayerController!.flipCard(card.getId(), card.isFlipped());
      }, 100);
    }
  }

  /**
   * Get all cards in the scene
   */
  public getAllCards(): Card[] {
    return [...this.cards];
  }

  /**
   * Find a card by its ID
   */
  public getCardById(cardId: string): Card | undefined {
    return this.cards.find((card) => card.getId() === cardId);
  }

  /**
   * Get the current game configuration
   */
  public getGameConfiguration(): GameConfig | null {
    return this.gameConfig;
  }

  /**
   * Cleanup method for component unmounting
   */
  public dispose(): void {
    // Stop animation loop
    this.renderer.setAnimationLoop(() => {});

    // Dispose multiplayer controller
    if (this.multiplayerController) {
      this.multiplayerController.dispose();
    }

    // Dispose of all cards
    this.cards.forEach((card) => card.dispose());

    // Dispose of all game areas
    this.gameAreas.forEach((area) => area.dispose());

    // Remove event listeners
    window.removeEventListener("resize", this.onWindowResize.bind(this));

    // Dispose of renderer
    this.renderer.dispose();
  }
}
