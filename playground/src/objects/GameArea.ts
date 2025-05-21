import * as THREE from "three";
import { Card } from "./Card";

export class GameArea {
  public mesh: THREE.Group;
  private background: THREE.Mesh;
  private width: number;
  private height: number;
  private cards: Card[] = [];
  private onCardAddedCallback: ((card: Card, area: GameArea) => void) | null =
    null;
  private onCardRemovedCallback: ((card: Card, area: GameArea) => void) | null =
    null;
  private name: string = "GameArea";

  constructor(
    width: number = 5,
    height: number = 3,
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    backgroundColor: THREE.ColorRepresentation = 0x2d572c,
    name: string = "GameArea",
  ) {
    this.width = width;
    this.height = height;
    this.name = name;
    this.mesh = new THREE.Group();
    this.mesh.name = name;

    // Create background geometry
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      color: backgroundColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });

    this.background = new THREE.Mesh(geometry, material);
    this.background.name = `${name}-background`;

    // Add the background to the group
    this.mesh.add(this.background);

    // Position the entire group
    this.mesh.position.copy(position);
  }

  /**
   * Add a card to this game area
   */
  public addCard(card: Card, x: number = 0, y: number = 0): void {
    // Position the card relative to the center of the area
    card.mesh.position.set(x, y, 0.01); // Slightly above background

    // Add the card to our list
    this.cards.push(card);

    // Add the card mesh to our group
    this.mesh.add(card.mesh);

    // Trigger the callback if it exists
    if (this.onCardAddedCallback) {
      this.onCardAddedCallback(card, this);
    }
  }

  /**
   * Remove a card from this game area
   */
  public removeCard(card: Card): boolean {
    const index = this.cards.indexOf(card);
    if (index !== -1) {
      this.cards.splice(index, 1);
      this.mesh.remove(card.mesh);

      // Trigger the callback if it exists
      if (this.onCardRemovedCallback) {
        this.onCardRemovedCallback(card, this);
      }

      return true;
    }
    return false;
  }

  /**
   * Clear all cards from this game area
   */
  public clearCards(): void {
    // Remove all card meshes from our group
    this.cards.forEach((card) => {
      this.mesh.remove(card.mesh);
    });

    // Clear the cards array
    this.cards = [];
  }

  /**
   * Get all cards in this area
   */
  public getCards(): Card[] {
    return [...this.cards];
  }

  /**
   * Set the background color
   */
  public setBackgroundColor(color: THREE.ColorRepresentation): void {
    if (this.background.material instanceof THREE.MeshBasicMaterial) {
      this.background.material.color.set(color);
    }
  }

  /**
   * Set the background texture
   */
  public setBackgroundTexture(texturePath: string): void {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(texturePath, (texture) => {
      if (this.background.material instanceof THREE.MeshBasicMaterial) {
        this.background.material.map = texture;
        this.background.material.needsUpdate = true;
      }
    });
  }

  /**
   * Set the background opacity
   */
  public setBackgroundOpacity(opacity: number): void {
    if (this.background.material instanceof THREE.MeshBasicMaterial) {
      this.background.material.opacity = Math.max(0, Math.min(1, opacity));
    }
  }

  /**
   * Resize the game area
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    // Update geometry
    const newGeometry = new THREE.PlaneGeometry(width, height);
    this.background.geometry.dispose();
    this.background.geometry = newGeometry;
  }

  /**
   * Check if the given world coordinates are within this game area
   */
  public containsPoint(point: THREE.Vector3): boolean {
    // Convert world position to local position correctly
    const worldPoint = point.clone();

    // Get the local position by converting from world space to local space
    const localPoint = this.mesh.worldToLocal(worldPoint);

    // Check if the point is within the bounds
    return (
      Math.abs(localPoint.x) <= this.width / 2 &&
      Math.abs(localPoint.y) <= this.height / 2
    );
  }

  /**
   * Get the dimensions of this game area
   */
  public getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * Dispose of all resources
   */
  public dispose(): void {
    // Dispose of background geometry and material
    this.background.geometry.dispose();
    if (this.background.material instanceof THREE.Material) {
      this.background.material.dispose();
    }

    // Clear all cards
    this.clearCards();
  }

  /**
   * Set callback for when a card is added to this area
   */
  public setOnCardAddedCallback(
    callback: (card: Card, area: GameArea) => void,
  ): void {
    this.onCardAddedCallback = callback;
  }

  /**
   * Set callback for when a card is removed from this area
   */
  public setOnCardRemovedCallback(
    callback: (card: Card, area: GameArea) => void,
  ): void {
    this.onCardRemovedCallback = callback;
  }

  /**
   * Get the GameArea's name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Handle a card being dropped after dragging
   */
  // private handleCardDrop(card: Card, worldPosition: THREE.Vector3, dragStartPosition: THREE.Vector3): void {
  // This method is not used directly - SceneManager handles the drop coordination between areas
  // }
}
