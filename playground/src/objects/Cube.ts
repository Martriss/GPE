import * as THREE from 'three';

export class Cube {
  public mesh: THREE.Mesh;

  constructor() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  public rotate(): void {
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
  }
}