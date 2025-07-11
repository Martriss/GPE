import * as THREE from "three";
import { GameConfig, GameAreaConfig, CardConfig, CardLayoutConfig } from '../types/GameConfig';
import { Scene } from "../core/Scene";
import { Camera } from "../core/Camera";
import { Renderer } from "../core/Renderer";
import { Card } from "../objects/Card";
import { GameArea } from "../objects/GameArea";

/**
 * Gestionnaire de configuration pour initialiser le jeu
 */
export class GameConfigManager {
  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private gameAreas: Map<string, GameArea> = new Map();
  private cards: Map<string | number, Card> = new Map();
  private config: GameConfig | null = null;

  // Callbacks pour les événements
  private onCardAddedCallback?: (card: Card, area: GameArea) => void;
  private onCardRemovedCallback?: (card: Card, area: GameArea) => void;
  private onCardDropCallback?: (card: Card, worldPosition: THREE.Vector3) => void;

  constructor() {
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
  }

  /**
   * Initialise le jeu avec une configuration donnée
   */
  public async initializeGame(config: GameConfig): Promise<void> {
    this.config = config;

    // Valider la configuration
    const validation = this.validateConfig(config);
    if (!validation.isValid) {
      throw new Error(`Configuration invalide: ${validation.errors.join(', ')}`);
    }

    // Nettoyer l'état précédent
    this.cleanup();

    // Initialiser la scène
    await this.setupScene(config.scene);

    // Initialiser la caméra
    this.setupCamera(config.camera);

    // Créer les zones de jeu
    await this.createGameAreas(config.gameAreas);

    // Créer les cartes
    await this.createCards(config.cards);

    // Placer les cartes initiales
    this.placeInitialCards();

    // Configurer les événements
    this.setupEventHandlers();

    // Démarrer le rendu
    this.renderer.setAnimationLoop(this.animate.bind(this));

    console.log(`Jeu initialisé avec la configuration: ${config.metadata.name}`);
  }

  /**
   * Valide une configuration
   */
  private validateConfig(config: GameConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.metadata?.name) {
      errors.push('Le nom du jeu est obligatoire');
    }

    if (!config.scene) {
      errors.push('La configuration de la scène est obligatoire');
    }

    if (!config.camera) {
      errors.push('La configuration de la caméra est obligatoire');
    }

    if (!config.gameAreas || config.gameAreas.length === 0) {
      errors.push('Au moins une zone de jeu est nécessaire');
    }

    if (!config.cards || config.cards.length === 0) {
      errors.push('Au moins une carte est nécessaire');
    }

    // Vérifier l'unicité des IDs
    const areaIds = new Set<string>();
    const cardIds = new Set<string>();

    config.gameAreas?.forEach(area => {
      if (areaIds.has(area.id)) {
        errors.push(`ID de zone de jeu dupliqué: ${area.id}`);
      }
      areaIds.add(area.id);
    });

    config.cards?.forEach(card => {
      if (cardIds.has(card.id.toString())) {
        errors.push(`ID de carte dupliqué: ${card.id}`);
      }
      cardIds.add(card.id.toString());
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Configure la scène
   */
  private async setupScene(sceneConfig: any): Promise<void> {
    if (sceneConfig.backgroundColor !== undefined) {
      this.scene.scene.background = new THREE.Color(sceneConfig.backgroundColor);
    }

    // Lumière ambiante
    if (sceneConfig.ambientLight) {
      const ambientLight = new THREE.AmbientLight(
        sceneConfig.ambientLight.color,
        sceneConfig.ambientLight.intensity
      );
      this.scene.add(ambientLight);
    }

    // Lumière directionnelle
    if (sceneConfig.directionalLight) {
      const directionalLight = new THREE.DirectionalLight(
        sceneConfig.directionalLight.color,
        sceneConfig.directionalLight.intensity
      );
      directionalLight.position.set(
        sceneConfig.directionalLight.position.x,
        sceneConfig.directionalLight.position.y,
        sceneConfig.directionalLight.position.z
      );
      this.scene.add(directionalLight);
    }

    // Lumières supplémentaires
    if (sceneConfig.additionalLights) {
      sceneConfig.additionalLights.forEach((lightConfig: any) => {
        let light: THREE.Light;

        switch (lightConfig.type) {
          case 'point':
            light = new THREE.PointLight(lightConfig.color, lightConfig.intensity);
            break;
          case 'spot':
            light = new THREE.SpotLight(lightConfig.color, lightConfig.intensity);
            break;
          case 'directional':
            light = new THREE.DirectionalLight(lightConfig.color, lightConfig.intensity);
            break;
          default:
            return;
        }

        light.position.set(
          lightConfig.position.x,
          lightConfig.position.y,
          lightConfig.position.z
        );
        this.scene.add(light);
      });
    }
  }

  /**
   * Configure la caméra
   */
  private setupCamera(cameraConfig: any): void {
    // Position de la caméra
    this.camera.camera.position.set(
      cameraConfig.position.x,
      cameraConfig.position.y,
      cameraConfig.position.z
    );

    // Cible de la caméra
    if (cameraConfig.target) {
      this.camera.camera.lookAt(
        cameraConfig.target.x,
        cameraConfig.target.y,
        cameraConfig.target.z
      );
    }

    // Paramètres de la caméra
    if (cameraConfig.fov) {
      this.camera.camera.fov = cameraConfig.fov;
    }
    if (cameraConfig.near) {
      this.camera.camera.near = cameraConfig.near;
    }
    if (cameraConfig.far) {
      this.camera.camera.far = cameraConfig.far;
    }

    this.camera.camera.updateProjectionMatrix();
  }

  /**
   * Crée les zones de jeu
   */
  private async createGameAreas(areaConfigs: GameAreaConfig[]): Promise<void> {
    for (const areaConfig of areaConfigs) {
      const gameArea = new GameArea(
        areaConfig.width,
        areaConfig.height,
        new THREE.Vector3(
          areaConfig.position.x,
          areaConfig.position.y,
          areaConfig.position.z
        ),
        areaConfig.backgroundColor,
        areaConfig.name
      );

      // Configurer l'opacité
      if (areaConfig.backgroundOpacity !== undefined) {
        gameArea.setBackgroundOpacity(areaConfig.backgroundOpacity);
      }

      // Configurer la texture si définie
      if (areaConfig.backgroundTexture) {
        gameArea.setBackgroundTexture(areaConfig.backgroundTexture);
      }

      // Stocker la zone avec son ID
      this.gameAreas.set(areaConfig.id, gameArea);

      // Ajouter à la scène
      this.scene.add(gameArea.mesh);
      gameArea.mesh.userData.gameArea = gameArea;
      gameArea.mesh.userData.config = areaConfig;

      // Configurer les callbacks
      if (this.onCardAddedCallback) {
        gameArea.setOnCardAddedCallback(this.onCardAddedCallback);
      }
      if (this.onCardRemovedCallback) {
        gameArea.setOnCardRemovedCallback(this.onCardRemovedCallback);
      }
    }
  }

  /**
   * Crée les cartes
   */
  private async createCards(cardConfigs: CardConfig[]): Promise<void> {
    for (const cardConfig of cardConfigs) {
      const card = new Card(
        cardConfig.width,
        cardConfig.height,
        cardConfig.thickness,
        cardConfig.title || '',
        cardConfig.description || '',
        this.camera.camera
      );

      // Configurer les propriétés de la carte
      if (cardConfig.properties) {
        card.mesh.userData.properties = cardConfig.properties;
      }

      // Configurer le style si défini
      if (cardConfig.styling) {
        // Ici, vous pouvez ajouter la logique pour appliquer le style
        // Par exemple, changer la couleur, la texture, etc.
      }

      // Stocker la carte avec son ID
      this.cards.set(cardConfig.id, card);

      // Configurer le callback de drop
      if (this.onCardDropCallback) {
        card.setDropCallback(this.onCardDropCallback);
      }
    }
  }

  /**
   * Place les cartes initiales selon la configuration
   */
  private placeInitialCards(): void {
    if (!this.config) return;

    // Parcourir chaque zone de jeu
    this.config.gameAreas.forEach(areaConfig => {
      const gameArea = this.gameAreas.get(areaConfig.id);
      if (!gameArea) return;

      // Placer les cartes spécifiées pour cette zone
      if (areaConfig.initialCards) {
        areaConfig.initialCards.forEach(cardPlacement => {
          const card = this.cards.get(cardPlacement.cardId);
          if (card) {
            gameArea.addCard(
              card,
              cardPlacement.position.x,
              cardPlacement.position.y
            );
          }
        });
      }
    });

    // Placer les cartes selon la configuration par défaut du jeu
    this.placeDefaultCards();
  }

  /**
   * Place les cartes selon une logique par défaut
   */
  private placeDefaultCards(): void {
    if (!this.config) return;

    // Logique pour placer les cartes non spécifiées
    // Par exemple, distribuer les cartes restantes dans certaines zones
    const unplacedCards = Array.from(this.cards.values()).filter(card => {
      // Vérifier si la carte n'est pas déjà placée
      return !card.mesh.parent || card.mesh.parent === this.scene.scene;
    });

    // Exemple: placer les cartes non placées dans la première zone disponible
    if (unplacedCards.length > 0) {
      const firstArea = Array.from(this.gameAreas.values())[0];
      if (firstArea) {
        unplacedCards.forEach((card, index) => {
          const spacing = 1.5;
          const x = (index % 5) * spacing - 2 * spacing;
          const y = Math.floor(index / 5) * spacing - spacing;
          firstArea.addCard(card, x, y);
        });
      }
    }
  }

  /**
   * Configure les gestionnaires d'événements
   */
  private setupEventHandlers(): void {
    // Redimensionnement de la fenêtre
    window.addEventListener("resize", this.onWindowResize.bind(this));

    // Callbacks pour les cartes
    this.onCardAddedCallback = this.handleCardAdded.bind(this);
    this.onCardRemovedCallback = this.handleCardRemoved.bind(this);
    this.onCardDropCallback = this.handleCardDrop.bind(this);

    // Appliquer les callbacks aux zones existantes
    this.gameAreas.forEach(gameArea => {
      gameArea.setOnCardAddedCallback(this.onCardAddedCallback!);
      gameArea.setOnCardRemovedCallback(this.onCardRemovedCallback!);
    });

    // Appliquer les callbacks aux cartes existantes
    this.cards.forEach(card => {
      card.setDropCallback(this.onCardDropCallback!);
    });
  }

  /**
   * Gère l'ajout d'une carte à une zone
   */
  private handleCardAdded(card: Card, area: GameArea): void {
    // Configurer le callback de drop pour la carte
    if (this.onCardDropCallback) {
      card.setDropCallback(this.onCardDropCallback);
    }

    // Émettre un événement personnalisé si configuré
    if (this.config?.eventHandlers?.onCardMoved) {
      // Ici, vous pouvez implémenter la logique d'événement personnalisé
      console.log(`Carte ajoutée à la zone: ${area.getName()}`);
    }
  }

  /**
   * Gère la suppression d'une carte d'une zone
   */
  private handleCardRemoved(card: Card, area: GameArea): void {
    // Logique pour la suppression de carte
    console.log(`Carte supprimée de la zone: ${area.getName()}`);
  }

  /**
   * Gère le drop d'une carte
   */
  private handleCardDrop(card: Card, worldPosition: THREE.Vector3): void {
    // Trouver la zone source
    const sourceArea = this.findAreaContainingCard(card);

    // Trouver la zone cible
    const targetArea = this.findAreaAtPosition(worldPosition);

    if (sourceArea && targetArea && sourceArea !== targetArea) {
      // Vérifier si le déplacement est autorisé
      const sourceConfig = sourceArea.mesh.userData.config as GameAreaConfig;
      const targetConfig = targetArea.mesh.userData.config as GameAreaConfig;

      if (sourceConfig.allowsCardRemoval !== false && targetConfig.acceptsCards !== false) {
        // Vérifier la limite de cartes
        if (!targetConfig.maxCards || targetArea.getCards().length < targetConfig.maxCards) {
          // Effectuer le déplacement
          sourceArea.removeCard(card);

          const localPosition = worldPosition.clone().sub(targetArea.mesh.position);
          targetArea.addCard(card, localPosition.x, localPosition.y);
        }
      }
    }
  }

  /**
   * Trouve la zone contenant une carte
   */
  private findAreaContainingCard(card: Card): GameArea | null {
    for (const area of this.gameAreas.values()) {
      if (area.getCards().includes(card)) {
        return area;
      }
    }
    return null;
  }

  /**
   * Trouve la zone à une position donnée
   */
  private findAreaAtPosition(worldPosition: THREE.Vector3): GameArea | null {
    for (const area of this.gameAreas.values()) {
      if (area.containsPoint(worldPosition)) {
        return area;
      }
    }
    return null;
  }

  /**
   * Gère le redimensionnement de la fenêtre
   */
  private onWindowResize(): void {
    this.camera.updateAspect();
    this.renderer.updateSize();
  }

  /**
   * Boucle d'animation
   */
  private animate(): void {
    this.renderer.render(this.scene.scene, this.camera.camera);
    this.checkDraggedCards();
  }

  /**
   * Vérifie les cartes en cours de glissement
   */
  private checkDraggedCards(): void {
    let anyCardDragging = false;

    // Vérifier toutes les cartes
    this.cards.forEach(card => {
      if (card.isDraggingCard()) {
        anyCardDragging = true;
        const cardPosition = card.getWorldPosition();

        // Mettre en surbrillance les zones valides
        this.gameAreas.forEach(targetArea => {
          if (targetArea.containsPoint(cardPosition)) {
            const currentArea = this.findAreaContainingCard(card);
            if (targetArea !== currentArea) {
              targetArea.setBackgroundOpacity(0.9);
            }
          } else {
            targetArea.setBackgroundOpacity(0.8);
          }
        });
      }
    });

    if (!anyCardDragging) {
      // Remettre toutes les zones à l'opacité par défaut
      this.gameAreas.forEach(area => {
        area.setBackgroundOpacity(0.8);
      });
    }
  }

  /**
   * Nettoie les ressources
   */
  private cleanup(): void {
    // Supprimer les zones de jeu
    this.gameAreas.forEach(area => {
      this.scene.remove(area.mesh);
      area.dispose();
    });
    this.gameAreas.clear();

    // Supprimer les cartes
    this.cards.forEach(card => {
      if (card.mesh.parent) {
        card.mesh.parent.remove(card.mesh);
      }
      // Ici, vous pouvez ajouter la logique de nettoyage pour les cartes
    });
    this.cards.clear();

    // Nettoyer la scène
    const objectsToRemove: THREE.Object3D[] = [];
    this.scene.scene.traverse((child) => {
      if (child instanceof THREE.Light && child !== this.scene.scene) {
        objectsToRemove.push(child);
      }
    });
    objectsToRemove.forEach(obj => this.scene.remove(obj));
  }

  /**
   * Obtient une zone de jeu par son ID
   */
  public getGameArea(id: string): GameArea | undefined {
    return this.gameAreas.get(id);
  }

  /**
   * Obtient une carte par son ID
   */
  public getCard(id: string | number): Card | undefined {
    return this.cards.get(id);
  }

  /**
   * Obtient toutes les zones de jeu
   */
  public getAllGameAreas(): GameArea[] {
    return Array.from(this.gameAreas.values());
  }

  /**
   * Obtient toutes les cartes
   */
  public getAllCards(): Card[] {
    return Array.from(this.cards.values());
  }

  /**
   * Obtient la configuration actuelle
   */
  public getCurrentConfig(): GameConfig | null {
    return this.config;
  }

  /**
   * Charge une configuration depuis un objet JSON
   */
  public async loadConfigFromObject(configObject: any): Promise<void> {
    const config = configObject as GameConfig;
    await this.initializeGame(config);
  }

  /**
   * Charge une configuration depuis un fichier JSON
   */
  public async loadConfigFromJSON(jsonString: string): Promise<void> {
    try {
      const config = JSON.parse(jsonString) as GameConfig;
      await this.initializeGame(config);
    } catch (error) {
      throw new Error(`Erreur lors du chargement de la configuration JSON: ${error}`);
    }
  }

  /**
   * Sauvegarde la configuration actuelle en JSON
   */
  public saveConfigToJSON(): string {
    if (!this.config) {
      throw new Error('Aucune configuration à sauvegarder');
    }
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Applique une configuration partielle (mise à jour)
   */
  public async updateConfig(partialConfig: Partial<GameConfig>): Promise<void> {
    if (!this.config) {
      throw new Error('Aucune configuration active à mettre à jour');
    }

    // Fusionner les configurations
    const updatedConfig = { ...this.config, ...partialConfig };
    await this.initializeGame(updatedConfig);
  }

  /**
   * Libère toutes les ressources
   */
  public dispose(): void {
    this.cleanup();
    this.renderer.dispose();
  }
}
