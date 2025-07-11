import { GameConfigManager } from './GameConfigManager';
import { GameConfig } from '../types/GameConfig';
import { DEFAULT_CARD_GAME_CONFIG } from '../configs/GameConfigs';

/**
 * Scene Manager configurable qui utilise le système de configuration
 */
export class ConfigurableSceneManager extends GameConfigManager {
  private isInitialized: boolean = false;

  constructor(config?: GameConfig) {
    super();

    // Initialiser avec la configuration fournie ou la configuration par défaut
    const gameConfig = config || DEFAULT_CARD_GAME_CONFIG;
    this.initializeWithConfig(gameConfig);
  }

  /**
   * Initialise le jeu avec une configuration
   */
  private async initializeWithConfig(config: GameConfig): Promise<void> {
    try {
      await this.initializeGame(config);
      this.isInitialized = true;
      console.log(`Jeu initialisé avec succès: ${config.metadata.name}`);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du jeu:', error);
      throw error;
    }
  }

  /**
   * Change la configuration du jeu
   */
  public async changeConfig(config: GameConfig): Promise<void> {
    await this.initializeGame(config);
    this.isInitialized = true;
  }

  /**
   * Charge une configuration depuis un fichier JSON
   */
  public async loadFromJSON(jsonString: string): Promise<void> {
    await this.loadConfigFromJSON(jsonString);
    this.isInitialized = true;
  }

  /**
   * Charge une configuration depuis un objet
   */
  public async loadFromObject(configObject: any): Promise<void> {
    await this.loadConfigFromObject(configObject);
    this.isInitialized = true;
  }

  /**
   * Vérifie si le jeu est initialisé
   */
  public isGameInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Obtient les statistiques du jeu
   */
  public getGameStats(): {
    totalAreas: number;
    totalCards: number;
    configName: string;
    configVersion: string;
  } {
    const config = this.getCurrentConfig();
    if (!config) {
      return {
        totalAreas: 0,
        totalCards: 0,
        configName: 'Aucune configuration',
        configVersion: '0.0.0'
      };
    }

    return {
      totalAreas: this.getAllGameAreas().length,
      totalCards: this.getAllCards().length,
      configName: config.metadata.name,
      configVersion: config.metadata.version
    };
  }

  /**
   * Réinitialise le jeu avec la configuration par défaut
   */
  public async resetToDefault(): Promise<void> {
    await this.initializeGame(DEFAULT_CARD_GAME_CONFIG);
    this.isInitialized = true;
  }

  /**
   * Exporte la configuration actuelle
   */
  public exportConfig(): string {
    return this.saveConfigToJSON();
  }

  /**
   * Ajoute une zone de jeu dynamiquement
   */
  public addDynamicGameArea(
    id: string,
    name: string,
    width: number,
    height: number,
    x: number,
    y: number,
    z: number = 0,
    backgroundColor: number = 0x2d572c
  ): void {
    const config = this.getCurrentConfig();
    if (!config) {
      throw new Error('Aucune configuration active');
    }

    // Vérifier que l'ID n'existe pas déjà
    if (this.getGameArea(id)) {
      throw new Error(`Une zone avec l'ID ${id} existe déjà`);
    }

    // Ajouter la zone à la configuration
    config.gameAreas.push({
      id,
      name,
      width,
      height,
      position: { x, y, z },
      backgroundColor,
      backgroundOpacity: 0.8,
      acceptsCards: true,
      allowsCardRemoval: true,
      cardLayout: {
        type: 'custom',
        spacing: { x: 1.5, y: 1.5 },
        alignment: { horizontal: 'center', vertical: 'center' }
      }
    });

    // Recharger la configuration
    this.initializeGame(config);
  }

  /**
   * Supprime une zone de jeu dynamiquement
   */
  public removeDynamicGameArea(id: string): void {
    const config = this.getCurrentConfig();
    if (!config) {
      throw new Error('Aucune configuration active');
    }

    // Supprimer la zone de la configuration
    const index = config.gameAreas.findIndex(area => area.id === id);
    if (index === -1) {
      throw new Error(`Zone avec l'ID ${id} non trouvée`);
    }

    config.gameAreas.splice(index, 1);

    // Recharger la configuration
    this.initializeGame(config);
  }

  /**
   * Modifie les propriétés d'une zone de jeu
   */
  public updateGameAreaProperties(
    id: string,
    properties: Partial<{
      name: string;
      width: number;
      height: number;
      position: { x: number; y: number; z: number };
      backgroundColor: number;
      backgroundOpacity: number;
    }>
  ): void {
    const config = this.getCurrentConfig();
    if (!config) {
      throw new Error('Aucune configuration active');
    }

    const areaConfig = config.gameAreas.find(area => area.id === id);
    if (!areaConfig) {
      throw new Error(`Zone avec l'ID ${id} non trouvée`);
    }

    // Mettre à jour les propriétés
    Object.assign(areaConfig, properties);

    // Recharger la configuration
    this.initializeGame(config);
  }

  /**
   * Déplace toutes les cartes d'une zone vers une autre
   */
  public moveAllCardsToArea(fromAreaId: string, toAreaId: string): void {
    const fromArea = this.getGameArea(fromAreaId);
    const toArea = this.getGameArea(toAreaId);

    if (!fromArea || !toArea) {
      throw new Error('Zone source ou destination introuvable');
    }

    const cards = fromArea.getCards();
    cards.forEach((card, index) => {
      fromArea.removeCard(card);
      const spacing = 1.5;
      const x = (index % 5) * spacing - 2 * spacing;
      const y = Math.floor(index / 5) * spacing;
      toArea.addCard(card, x, y);
    });
  }

  /**
   * Mélange les cartes dans une zone
   */
  public shuffleCardsInArea(areaId: string): void {
    const area = this.getGameArea(areaId);
    if (!area) {
      throw new Error(`Zone avec l'ID ${areaId} non trouvée`);
    }

    const cards = area.getCards();
    if (cards.length === 0) return;

    // Supprimer toutes les cartes
    cards.forEach(card => area.removeCard(card));

    // Mélanger l'ordre des cartes
    const shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

    // Remettre les cartes dans un ordre mélangé
    shuffledCards.forEach((card, index) => {
      const spacing = 1.5;
      const x = (index % 5) * spacing - 2 * spacing;
      const y = Math.floor(index / 5) * spacing;
      area.addCard(card, x, y);
    });
  }

  /**
   * Distribue les cartes de manière équitable entre plusieurs zones
   */
  public distributeCards(fromAreaId: string, toAreaIds: string[]): void {
    const fromArea = this.getGameArea(fromAreaId);
    if (!fromArea) {
      throw new Error(`Zone source ${fromAreaId} non trouvée`);
    }

    const toAreas = toAreaIds.map(id => this.getGameArea(id)).filter(area => area !== undefined);
    if (toAreas.length === 0) {
      throw new Error('Aucune zone de destination valide');
    }

    const cards = fromArea.getCards();
    cards.forEach(card => fromArea.removeCard(card));

    // Distribuer les cartes
    cards.forEach((card, index) => {
      const targetArea = toAreas[index % toAreas.length];
      const cardsInArea = targetArea.getCards().length;
      const spacing = 1.5;
      const x = (cardsInArea % 5) * spacing - 2 * spacing;
      const y = Math.floor(cardsInArea / 5) * spacing;
      targetArea.addCard(card, x, y);
    });
  }

  /**
   * Sauvegarde l'état actuel du jeu
   */
  public saveGameState(): any {
    const config = this.getCurrentConfig();
    if (!config) {
      throw new Error('Aucune configuration active');
    }

    const gameState = {
      config: config,
      timestamp: new Date().toISOString(),
      areaStates: {} as any
    };

    // Sauvegarder l'état de chaque zone
    this.getAllGameAreas().forEach(area => {
      const areaId = area.getName(); // Assuming getName returns the ID
      gameState.areaStates[areaId] = {
        cardCount: area.getCards().length,
        cardPositions: area.getCards().map(card => ({
          id: card.mesh.userData.id || 'unknown',
          position: {
            x: card.mesh.position.x,
            y: card.mesh.position.y,
            z: card.mesh.position.z
          }
        }))
      };
    });

    return gameState;
  }

  /**
   * Charge un état de jeu sauvegardé
   */
  public async loadGameState(gameState: any): Promise<void> {
    if (!gameState.config) {
      throw new Error('État de jeu invalide: configuration manquante');
    }

    await this.initializeGame(gameState.config);
    this.isInitialized = true;

    // Ici, vous pourriez ajouter la logique pour restaurer les positions exactes des cartes
    // basée sur gameState.areaStates
  }

  /**
   * Active/désactive le mode debug
   */
  public toggleDebugMode(): void {
    // Ajouter des informations de debug à la scène
    const config = this.getCurrentConfig();
    if (!config) return;

    console.log('=== MODE DEBUG ===');
    console.log('Configuration:', config.metadata.name);
    console.log('Zones de jeu:', this.getAllGameAreas().length);
    console.log('Cartes totales:', this.getAllCards().length);

    this.getAllGameAreas().forEach((area, index) => {
      console.log(`Zone ${index + 1}:`, {
        nom: area.getName(),
        cartes: area.getCards().length,
        position: area.mesh.position
      });
    });
  }
}
