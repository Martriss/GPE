import { Renderer } from '../core/Renderer';
import { Camera } from '../core/Camera';
import { Scene } from '../core/Scene';
import { Cube } from '../objects/Cube';

export class SceneManager {
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private cube: Cube;

  constructor() {
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.cube = new Cube();
    
    this.scene.add(this.cube.mesh);
    this.setupEventListeners();
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private onWindowResize(): void {
    this.camera.updateAspect();
    this.renderer.updateSize();
  }

  private animate(): void {
    this.cube.rotate();
    this.renderer.render(this.scene.scene, this.camera.camera);
  }
}