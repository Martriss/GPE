import * as THREE from "three";
import { Card } from "./Card";

export class GameArea {
  public mesh: THREE.Group;
  private background: THREE.Mesh;
  private width: number;
  private height: number;
  private cards: Card[] = [];

  constructor(
    width: number = 5,
    height: number = 3,
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    backgroundColor: THREE.ColorRepresentation = 0x2d572c,
  ) {
    this.width = width;
    this.height = height;
    this.mesh = new THREE.Group();

    // Create background geometry
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      color: backgroundColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });

    this.background = new THREE.Mesh(geometry, material);
    this.background.position.copy(position);

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
  }

  /**
   * Remove a card from this game area
   */
  public removeCard(card: Card): boolean {
    const index = this.cards.indexOf(card);
    if (index !== -1) {
      this.cards.splice(index, 1);
      this.mesh.remove(card.mesh);
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
    // Convert world position to local position
    const localPoint = point.clone().sub(this.mesh.position);

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
}
