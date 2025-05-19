import * as THREE from "three";

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

  private boundMouseDown!: (event: MouseEvent) => void;
  private boundMouseMove!: (event: MouseEvent) => void;
  private boundMouseUp!: (event: MouseEvent) => void;
  private boundTouchStart!: (event: TouchEvent) => void;
  private boundTouchMove!: (event: TouchEvent) => void;
  private boundTouchEnd!: (event: TouchEvent) => void;
  private boundDoubleClick!: (event: MouseEvent) => void;

  constructor(
    width: number = 1,
    height: number = 1.4,
    thickness: number = 0.01,
    frontTexture: string = "",
    backTexture: string = "",
    camera: THREE.Camera,
  ) {
    this.camera = camera;
    this.mesh = new THREE.Group();

    // Create card geometry
    const geometry = new THREE.BoxGeometry(width, height, thickness);

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const defaultFrontMaterial = new THREE.MeshBasicMaterial({
      color: 0xf0f0f0,
    });
    const defaultBackMaterial = new THREE.MeshBasicMaterial({
      color: 0x2080ff,
    });

    // Create materials array for the cube
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xcccccc }), // right side
      new THREE.MeshBasicMaterial({ color: 0xcccccc }), // left side
      new THREE.MeshBasicMaterial({ color: 0xcccccc }), // top
      new THREE.MeshBasicMaterial({ color: 0xcccccc }), // bottom
      defaultFrontMaterial, // front
      defaultBackMaterial, // back
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
    // Create bound functions once to avoid recreating them with each bind
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseUp = this.onMouseUp.bind(this);
    this.boundTouchStart = this.onTouchStart.bind(this);
    this.boundTouchMove = this.onTouchMove.bind(this);
    this.boundTouchEnd = this.onTouchEnd.bind(this);
    this.boundDoubleClick = this.onDoubleClick.bind(this);

    // Add event listeners
    document.addEventListener("mousedown", this.boundMouseDown);
    document.addEventListener("mousemove", this.boundMouseMove);
    document.addEventListener("mouseup", this.boundMouseUp);
    document.addEventListener("touchstart", this.boundTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", this.boundTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", this.boundTouchEnd);
    document.addEventListener("dblclick", this.boundDoubleClick);
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
        this.bringToFront(); // Ensure we bring to front for touch events too
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
      // We have an intersection with this card, now check if it's the closest

      // To find the closest object, we need to check all objects in the scene
      // Get the scene object (which should be the root of all objects)
      let sceneObject: THREE.Object3D = this.mesh;
      while (sceneObject.parent) {
        sceneObject = sceneObject.parent;
      }

      // Get all meshes in the scene
      const allMeshes: THREE.Mesh[] = [];
      sceneObject.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          allMeshes.push(object);
        }
      });

      // Find all intersections with all meshes
      const allIntersects = this.raycaster.intersectObjects(allMeshes);

      // If this card's intersection is the first (closest) one
      if (allIntersects.length > 0 && allIntersects[0].object === this.card) {
        // Calculate the drag plane perpendicular to the camera
        const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(
          this.camera.quaternion,
        );
        this.dragPlane.setFromNormalAndCoplanarPoint(
          normal,
          this.mesh.position,
        );

        // Calculate the offset between intersection point and object position
        this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection);
        this.dragOffset.copy(this.mesh.position).sub(this.intersection);

        return true;
      }
    }

    return false;
  }

  private startDrag(): void {
    this.bringToFront();
    this.isDragging = true;
    document.body.style.cursor = "grabbing";
  }

  private updateDragPosition(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection)) {
      // Preserve the Z position when moving
      const zPosition = this.mesh.position.z;
      this.mesh.position.copy(this.intersection.add(this.dragOffset));
      this.mesh.position.z = zPosition; // Restore Z position to maintain card order
    }
  }

  private stopDrag(): void {
    this.isDragging = false;
    document.body.style.cursor = "auto";
  }

  private onDoubleClick(event: MouseEvent): void {
    event.preventDefault();

    // Calculate mouse position
    this.updateMousePosition(event.clientX, event.clientY);

    // Check if we're hitting the card
    if (this.checkIntersection()) {
      this.bringToFront();
      this.flip();
    }
  }

  // Cleanup method to remove event listeners
  public dispose(): void {
    document.removeEventListener("mousedown", this.boundMouseDown);
    document.removeEventListener("mousemove", this.boundMouseMove);
    document.removeEventListener("mouseup", this.boundMouseUp);
    document.removeEventListener("touchstart", this.boundTouchStart);
    document.removeEventListener("touchmove", this.boundTouchMove);
    document.removeEventListener("touchend", this.boundTouchEnd);
    document.removeEventListener("dblclick", this.boundDoubleClick);
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
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      this.mesh.rotation.y =
        startRotation + (targetRotation - startRotation) * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  // Method to bring the card to the front (above other cards)
  public bringToFront(): void {
    // Find all other cards in the scene
    if (!this.mesh.parent) return;

    const zOffset = 0.01; // Small offset to ensure this card is in front
    let maxZ = 0;

    // Find the maximum Z position among all siblings
    this.mesh.parent.children.forEach((child) => {
      if (child !== this.mesh && child instanceof THREE.Group) {
        maxZ = Math.max(maxZ, child.position.z);
      }
    });

    // Set this card's Z position to be higher than any other card
    this.mesh.position.z = maxZ + zOffset;

    // Ensure the Z position persists in future interactions
    this.dragPlane.constant = this.mesh.position.z;
  }
}
