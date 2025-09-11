import * as THREE from "three";

export class Renderer {
  private renderer: THREE.WebGLRenderer;

  constructor(container?: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  }

  public setAnimationLoop(callback: () => void): void {
    this.renderer.setAnimationLoop(callback);
  }

  public render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.renderer.render(scene, camera);
  }

  public updateSize(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public getDomElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  public dispose(): void {
    this.renderer.dispose();
  }
}
