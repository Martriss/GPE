import { Renderer } from '../core/Renderer';
import { Camera } from '../core/Camera';
import { Scene } from '../core/Scene';
import { Cube } from '../objects/Cube';
import { Card } from '../objects/Card';

export class SceneManager {
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private card: Card;

  constructor() {
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();

    // Initialize card
    this.card = new Card(1, 1.4, 0.01, '', '', this.camera.camera);
    this.card.mesh.position.set(0, 0, 0);
    this.scene.add(this.card.mesh);


    this.setupEventListeners();
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('dblclick', this.onDoubleClick.bind(this));
  }

  private onWindowResize(): void {
    this.camera.updateAspect();
    this.renderer.updateSize();
  }

  private onDoubleClick(): void {
    this.card.flip();
  }

  private animate(): void {
    this.renderer.render(this.scene.scene, this.camera.camera);
  }
}
