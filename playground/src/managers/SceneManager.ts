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

  constructor() {
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();

    // Create game areas
    // Main area in the center
    const mainArea = new GameArea(10, 6, new THREE.Vector3(0, 0, 0), 0x2d572c);
    this.gameAreas.push(mainArea);
    this.scene.add(mainArea.mesh);

    // Player hand area at the bottom
    const playerArea = new GameArea(
      8,
      3,
      new THREE.Vector3(0, -4, 0),
      0x1a3a66,
    );
    this.gameAreas.push(playerArea);
    this.scene.add(playerArea.mesh);

    // Opponent area at the top
    const opponentArea = new GameArea(
      8,
      3,
      new THREE.Vector3(0, 4, 0),
      0x661a1a,
    );
    this.gameAreas.push(opponentArea);
    this.scene.add(opponentArea.mesh);

    // Draw pile on the right
    const drawPileArea = new GameArea(
      2,
      3,
      new THREE.Vector3(6, 0, 0),
      0x2d2d2d,
    );
    this.gameAreas.push(drawPileArea);
    this.scene.add(drawPileArea.mesh);

    // Discard pile on the left
    const discardPileArea = new GameArea(
      2,
      3,
      new THREE.Vector3(-6, 0, 0),
      0x4d2d2d,
    );
    this.gameAreas.push(discardPileArea);
    this.scene.add(discardPileArea.mesh);

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
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private setupEventListeners(): void {
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  private onWindowResize(): void {
    this.camera.updateAspect();
    this.renderer.updateSize();
  }

  private animate(): void {
    this.renderer.render(this.scene.scene, this.camera.camera);
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
  ): GameArea {
    const gameArea = new GameArea(width, height, position, color);
    this.gameAreas.push(gameArea);
    this.scene.add(gameArea.mesh);
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
}
