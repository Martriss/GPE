import { Renderer } from "../core/Renderer";
import { Camera } from "../core/Camera";
import { Scene } from "../core/Scene";
import { Card } from "../objects/Card";
import { GameArea } from "../objects/GameArea";
import * as THREE from "three";

export class SceneManager {
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private cards: Card[];
  private gameAreas: GameArea[] = [];
  private container: HTMLElement | null = null;

  constructor(container?: HTMLElement) {
    this.container = container || null;
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer(container);

    // Create game areas
    // Main area in the center
    const mainArea = new GameArea(
      10,
      6,
      new THREE.Vector3(0, 0, 0),
      0x2d572c,
      "MainArea",
    );
    this.gameAreas.push(mainArea);
    this.scene.add(mainArea.mesh);
    mainArea.mesh.userData.gameArea = mainArea;

    // Player hand area at the bottom
    const playerArea = new GameArea(
      8,
      3,
      new THREE.Vector3(0, -4, 0),
      0x1a3a66,
      "PlayerArea",
    );
    this.gameAreas.push(playerArea);
    this.scene.add(playerArea.mesh);
    playerArea.mesh.userData.gameArea = playerArea;

    // Opponent area at the top
    const opponentArea = new GameArea(
      8,
      3,
      new THREE.Vector3(0, 4, 0),
      0x661a1a,
      "OpponentArea",
    );
    this.gameAreas.push(opponentArea);
    this.scene.add(opponentArea.mesh);
    opponentArea.mesh.userData.gameArea = opponentArea;

    // Draw pile on the right
    const drawPileArea = new GameArea(
      2,
      3,
      new THREE.Vector3(6, 0, 0),
      0x2d2d2d,
      "DrawPileArea",
    );
    this.gameAreas.push(drawPileArea);
    this.scene.add(drawPileArea.mesh);
    drawPileArea.mesh.userData.gameArea = drawPileArea;

    // Discard pile on the left
    const discardPileArea = new GameArea(
      2,
      3,
      new THREE.Vector3(-6, 0, 0),
      0x4d2d2d,
      "DiscardPileArea",
    );
    this.gameAreas.push(discardPileArea);
    this.scene.add(discardPileArea.mesh);
    discardPileArea.mesh.userData.gameArea = discardPileArea;

    // Initialize cards
    this.cards = Array.from(
      { length: 15 },
      () => new Card(1, 1.4, 0.01, "", "", this.camera.camera),
    );

    // Distribute cards among the areas
    // Add cards to player area
    for (let i = 0; i < 5; i++) {
      const card = this.cards[i];
      const posX = i * 1.5 - 3;
      playerArea.addCard(card, posX, 0);
    }

    // Add cards to main area
    for (let i = 5; i < 8; i++) {
      const card = this.cards[i];
      const posX = (i - 5) * 2 - 2;
      mainArea.addCard(card, posX, 0);
    }

    // Add cards to opponent area
    for (let i = 8; i < 12; i++) {
      const card = this.cards[i];
      const posX = (i - 8) * 1.5 - 2;
      opponentArea.addCard(card, posX, 0);
    }

    // Add cards to draw pile
    drawPileArea.addCard(this.cards[12], 0, 0);

    // Add cards to discard pile
    discardPileArea.addCard(this.cards[13], 0, 0.1);
    discardPileArea.addCard(this.cards[14], 0.1, 0.2);

    this.setupEventListeners();
    this.initializeCardCallbacks(); // Initialize callbacks for all existing cards
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private setupEventListeners(): void {
    window.addEventListener("resize", this.onWindowResize.bind(this));

    // Set up card drop handling
    for (const gameArea of this.gameAreas) {
      // Ensure callbacks are properly bound to this instance
      const boundAddedCallback = this.handleCardAdded.bind(this);
      // const boundRemovedCallback = this.handleCardRemoved.bind(this);

      gameArea.setOnCardAddedCallback(boundAddedCallback);
      // gameArea.setOnCardRemovedCallback(boundRemovedCallback);
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
   * Handle when a card is removed from a game area
   */
  // private handleCardRemoved(card: Card, area: GameArea): void {
  //   // This can be extended in the future to handle card removal logic
  // }

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
    // gameArea.setOnCardRemovedCallback(this.handleCardRemoved.bind(this));

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
   * Cleanup method for component unmounting
   */
  public dispose(): void {
    // Stop animation loop
    this.renderer.setAnimationLoop(() => {});

    // Dispose of all cards
    this.cards.forEach(card => card.dispose());

    // Dispose of all game areas
    this.gameAreas.forEach(area => area.dispose());

    // Remove event listeners
    window.removeEventListener("resize", this.onWindowResize.bind(this));

    // Dispose of renderer
    this.renderer.dispose();
  }
}