import { Renderer } from "../core/Renderer";
import { Camera } from "../core/Camera";
import { Scene } from "../core/Scene";
import { Card } from "../objects/Card";

export class SceneManager {
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private cards: Card[];

  constructor() {
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();

    // Initialize card
    this.cards = Array.from(
      { length: 5 },
      () => new Card(1, 1.4, 0.01, "", "", this.camera.camera),
    );

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      card.mesh.position.set(
        i * 1.5 - ((this.cards.length - 1) * 1.5) / 2,
        0,
        0,
      );
      this.scene.add(card.mesh);
    }

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
}
