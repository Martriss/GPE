import * as THREE from 'three';

export class Scene {
  public scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
  }

  public add(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  public remove(object: THREE.Object3D): void {
    this.scene.remove(object);
  }
}