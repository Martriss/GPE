import * as THREE from 'three';

export class Card {
  public mesh: THREE.Group;
  private card: THREE.Mesh;
  private isDragging: boolean = false;
  private dragPlane: THREE.Plane = new THREE.Plane();
  private dragOffset: THREE.Vector3 = new THREE.Vector3();
  private intersection: THREE.Vector3 = new THREE.Vector3();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private camera: THREE.Camera;

  constructor(
    width: number = 1, 
    height: number = 1.4, 
    thickness: number = 0.01,
    frontTexture: string = '',
    backTexture: string = '',
    camera: THREE.Camera
  ) {
    this.camera = camera;
    this.mesh = new THREE.Group();
    
    // Create card geometry
    const geometry = new THREE.BoxGeometry(width, height, thickness);
    
    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const defaultFrontMaterial = new THREE.MeshBasicMaterial({ color: 0xf0f0f0 });
    const defaultBackMaterial = new THREE.MeshBasicMaterial({ color: 0x2080ff });
    
    // Create materials array for the cube
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xcccccc }), // right side
      new THREE.MeshBasicMaterial({ color: 0xcccccc }), // left side
      new THREE.MeshBasicMaterial({ color: 0xcccccc }), // top
      new THREE.MeshBasicMaterial({ color: 0xcccccc }), // bottom
      defaultFrontMaterial, // front
      defaultBackMaterial  // back
    ];
    
    // If textures are provided, load them
    if (frontTexture) {
      textureLoader.load(frontTexture, (texture) => {
        materials[4] = new THREE.MeshBasicMaterial({ map: texture });
        this.card.material = materials;
      });
    }
    
    if (backTexture) {
      textureLoader.load(backTexture, (texture) => {
        materials[5] = new THREE.MeshBasicMaterial({ map: texture });
        this.card.material = materials;
      });
    }
    
    // Create the card mesh
    this.card = new THREE.Mesh(geometry, materials);
    this.mesh.add(this.card);
    
    // Setup drag interaction
    this.setupDragInteraction();
  }
  
  private setupDragInteraction(): void {
    // Add event listeners
    document.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.onTouchEnd.bind(this));
  }
  
  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    
    // Calculate mouse position
    this.updateMousePosition(event.clientX, event.clientY);
    
    // Check if we're hitting the card
    if (this.checkIntersection()) {
      this.startDrag();
    }
  }
  
  private onMouseMove(event: MouseEvent): void {
    event.preventDefault();
    
    if (this.isDragging) {
      this.updateMousePosition(event.clientX, event.clientY);
      this.updateDragPosition();
    }
  }
  
  private onMouseUp(event: MouseEvent): void {
    event.preventDefault();
    this.stopDrag();
  }
  
  private onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.updateMousePosition(touch.clientX, touch.clientY);
      
      if (this.checkIntersection()) {
        this.startDrag();
      }
    }
  }
  
  private onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    
    if (this.isDragging && event.touches.length === 1) {
      const touch = event.touches[0];
      this.updateMousePosition(touch.clientX, touch.clientY);
      this.updateDragPosition();
    }
  }
  
  private onTouchEnd(): void {
    this.stopDrag();
  }
  
  private updateMousePosition(clientX: number, clientY: number): void {
    const rect = document.body.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / window.innerWidth) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / window.innerHeight) * 2 + 1;
  }
  
  private checkIntersection(): boolean {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.card);
    
    if (intersects.length > 0) {
      // Calculate the drag plane perpendicular to the camera
      const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);
      this.dragPlane.setFromNormalAndCoplanarPoint(normal, this.mesh.position);
      
      // Calculate the offset between intersection point and object position
      this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection);
      this.dragOffset.copy(this.mesh.position).sub(this.intersection);
      
      return true;
    }
    
    return false;
  }
  
  private startDrag(): void {
    this.isDragging = true;
    document.body.style.cursor = 'grabbing';
  }
  
  private updateDragPosition(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection)) {
      this.mesh.position.copy(this.intersection.add(this.dragOffset));
    }
  }
  
  private stopDrag(): void {
    this.isDragging = false;
    document.body.style.cursor = 'auto';
  }
  
  // Cleanup method to remove event listeners
  public dispose(): void {
    document.removeEventListener('mousedown', this.onMouseDown.bind(this));
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    document.removeEventListener('touchstart', this.onTouchStart.bind(this));
    document.removeEventListener('touchmove', this.onTouchMove.bind(this));
    document.removeEventListener('touchend', this.onTouchEnd.bind(this));
  }
  
  // Method to flip the card
  public flip(): void {
    const targetRotation = this.mesh.rotation.y === 0 ? Math.PI : 0;
    
    // Animate the flip (you can replace with your preferred animation library)
    const startRotation = this.mesh.rotation.y;
    const duration = 500; // milliseconds
    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      this.mesh.rotation.y = startRotation + (targetRotation - startRotation) * easeProgress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
}