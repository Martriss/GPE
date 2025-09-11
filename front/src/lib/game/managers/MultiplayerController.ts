import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type DocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "$lib/firebase/client";
import type { SceneManager } from "./SceneManager";
import type { Card } from "../objects/Card";

/**
 * Position coordinates in 3D space
 */
export interface Position3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Rotation angles in 3D space (in radians)
 */
export interface Rotation3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Represents the current state of a card in the multiplayer game
 */
export interface CardState {
  /** Unique identifier for the card */
  id: string;
  /** Current position of the card in 3D space */
  position: Position3D;
  /** Current rotation of the card in 3D space */
  rotation: Rotation3D;
  /** Whether the card is currently flipped (showing back face) */
  isFlipped: boolean;
  /** ID of the player who currently owns this card, null if unowned */
  ownerId: string | null;
  /** ID of the zone where this card is currently located, null if in free space */
  zoneId: string | null;
}

/**
 * Represents an action performed by a player in the game
 */
export interface GameAction {
  /** Document ID from Firestore (auto-generated) */
  id?: string;
  /** Type of action being performed */
  type: "MOVE_CARD" | "FLIP_CARD" | "DRAW_CARD" | "PLACE_CARD";
  /** ID of the player performing the action */
  playerId: string;
  /** ID of the card being acted upon */
  cardId: string;
  /** Additional data specific to the action type */
  data: any;
  /** Timestamp when the action was created */
  timestamp: number;
}

/**
 * Represents the overall state of the multiplayer game
 */
export interface GameState {
  /** Current state of all cards in the game */
  cards: CardState[];
  /** ID of the player whose turn it currently is */
  currentPlayer: string;
  /** Current phase of the game */
  phase: "waiting" | "playing" | "finished";
  /** Current turn number */
  turn: number;
}

/**
 * Threshold for position updates to prevent jitter from small movements
 */
const POSITION_UPDATE_THRESHOLD = 0.01;

/**
 * Controls multiplayer synchronization for the card game using Firebase Firestore.
 * Manages real-time game state synchronization, player actions, and card movements
 * across multiple connected clients.
 *
 * @example
 * ```typescript
 * const controller = new MultiplayerController(
 *   sceneManager,
 *   "room-123",
 *   "player-456",
 *   true // isHost
 * );
 *
 * // Move a card
 * await controller.moveCard("card-1", { x: 10, y: 0, z: 5 });
 *
 * // Flip a card
 * await controller.flipCard("card-1", true);
 *
 * // Clean up when done
 * controller.dispose();
 * ```
 */
export class MultiplayerController {
  private readonly sceneManager: SceneManager;
  private readonly roomId: string;
  private readonly playerId: string;
  private readonly isHost: boolean;

  private readonly gameStateRef: any;
  private readonly actionsRef: any;

  private unsubscribeGameState: (() => void) | null = null;
  private unsubscribeActions: (() => void) | null = null;

  /**
   * Creates a new MultiplayerController instance
   *
   * @param sceneManager - The scene manager handling the 3D game objects
   * @param roomId - Unique identifier for the game room
   * @param playerId - Unique identifier for this player
   * @param isHost - Whether this player is the host (responsible for game initialization)
   */
  constructor(
    sceneManager: SceneManager,
    roomId: string,
    playerId: string,
    isHost: boolean = false,
  ) {
    this.sceneManager = sceneManager;
    this.roomId = roomId;
    this.playerId = playerId;
    this.isHost = isHost;

    this.gameStateRef = doc(firestore, "gameStates", roomId);
    this.actionsRef = collection(firestore, "gameStates", roomId, "actions");

    this.initializeMultiplayer();
  }

  /**
   * Moves a card to a new position and synchronizes across all clients
   *
   * @param cardId - ID of the card to move
   * @param position - New position for the card
   * @throws Error if the card cannot be found or Firebase operation fails
   */
  public async moveCard(cardId: string, position: Position3D): Promise<void> {
    await this.sendAction({
      type: "MOVE_CARD",
      cardId,
      data: position,
    });

    await this.updateCardInGameState(cardId, { position });
  }

  /**
   * Flips a card and synchronizes the state across all clients
   *
   * @param cardId - ID of the card to flip
   * @param isFlipped - New flipped state
   * @throws Error if the card cannot be found or Firebase operation fails
   */
  public async flipCard(cardId: string, isFlipped: boolean): Promise<void> {
    await this.sendAction({
      type: "FLIP_CARD",
      cardId,
      data: { isFlipped },
    });

    await this.updateCardInGameState(cardId, { isFlipped });
  }

  /**
   * Sends a game action to all connected clients
   *
   * @param action - The action to send (without ID, playerId, and timestamp)
   * @throws Error if Firebase operation fails
   */
  public async sendAction(
    action: Omit<GameAction, "id" | "playerId" | "timestamp">,
  ): Promise<void> {
    const fullAction: GameAction = {
      ...action,
      playerId: this.playerId,
      timestamp: Date.now(),
    };

    try {
      await addDoc(this.actionsRef, fullAction);
    } catch (error) {
      console.error("Error sending action:", error);
      throw new Error(`Failed to send action: ${error}`);
    }
  }

  /**
   * Cleans up all Firebase listeners and resources
   * Should be called when the controller is no longer needed
   */
  public dispose(): void {
    if (this.unsubscribeGameState) {
      this.unsubscribeGameState();
      this.unsubscribeGameState = null;
    }

    if (this.unsubscribeActions) {
      this.unsubscribeActions();
      this.unsubscribeActions = null;
    }
  }

  /**
   * Initializes Firebase listeners for real-time multiplayer synchronization
   * Sets up listeners for both game state changes and player actions
   *
   * @private
   */
  private async initializeMultiplayer(): Promise<void> {
    console.log("Initializing multiplayer for room:", this.roomId);

    this.setupGameStateListener();
    this.setupActionsListener();
  }

  /**
   * Sets up the listener for game state changes
   *
   * @private
   */
  private setupGameStateListener(): void {
    this.unsubscribeGameState = onSnapshot(
      this.gameStateRef,
      (doc: DocumentSnapshot) => {
        if (doc.exists()) {
          const gameState: GameState = doc.data() as GameState;
          this.handleGameStateUpdate(gameState);
        } else if (this.isHost) {
          this.initializeGameState();
        }
      },
      (error) => {
        console.error("Error listening to game state:", error);
      },
    );
  }

  /**
   * Sets up the listener for player actions
   *
   * @private
   */
  private setupActionsListener(): void {
    const actionsQuery = query(this.actionsRef, orderBy("timestamp", "desc"));

    this.unsubscribeActions = onSnapshot(
      actionsQuery,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const action = this.parseActionFromSnapshot(change.doc);

            // Only handle actions from other players
            if (action.playerId !== this.playerId) {
              this.handleRemoteAction(action);
            }
          }
        });
      },
      (error) => {
        console.error("Error listening to game actions:", error);
      },
    );
  }

  /**
   * Parses a Firestore document snapshot into a GameAction
   *
   * @private
   */
  private parseActionFromSnapshot(doc: any): GameAction {
    const docData = doc.data() as {
      type: string;
      playerId: string;
      cardId: string;
      data: any;
      timestamp: number;
    };

    return {
      id: doc.id,
      type: docData.type as GameAction["type"],
      playerId: docData.playerId,
      cardId: docData.cardId,
      data: docData.data,
      timestamp: docData.timestamp,
    };
  }

  /**
   * Initializes the game state in Firestore (called by host only)
   *
   * @private
   */
  private async initializeGameState(): Promise<void> {
    const initialGameState: GameState = {
      cards: this.getInitialCardStates(),
      currentPlayer: this.playerId,
      phase: "playing",
      turn: 1,
    };

    try {
      await setDoc(this.gameStateRef, initialGameState);
      console.log("Game state initialized successfully");
    } catch (error) {
      console.error("Error initializing game state:", error);
      throw new Error(`Failed to initialize game state: ${error}`);
    }
  }

  /**
   * Creates initial card states from the current scene
   *
   * @private
   * @returns Array of CardState objects representing the initial card positions
   */
  private getInitialCardStates(): CardState[] {
    return this.sceneManager.cards.map(
      (card: Card): CardState => ({
        id: card.getId(),
        position: {
          x: card.mesh.position.x,
          y: card.mesh.position.y,
          z: card.mesh.position.z,
        },
        rotation: {
          x: card.mesh.rotation.x,
          y: card.mesh.rotation.y,
          z: card.mesh.rotation.z,
        },
        isFlipped: card.isFlipped(),
        ownerId: null,
        zoneId: null,
      }),
    );
  }

  /**
   * Handles updates to the game state from Firestore
   * Updates local card positions and states based on remote changes
   *
   * @private
   * @param gameState - The updated game state from Firestore
   */
  private handleGameStateUpdate(gameState: GameState): void {
    gameState.cards.forEach((cardState) => {
      const card = this.sceneManager.cards.find(
        (c: Card) => c.getId() === cardState.id,
      );

      if (card) {
        this.updateCardFromState(card, cardState);
      }
    });
  }

  /**
   * Updates a single card's visual state based on CardState data
   *
   * @private
   * @param card - The card object to update
   * @param cardState - The new state data for the card
   */
  private updateCardFromState(card: Card, cardState: CardState): void {
    // Update position only if significantly different to avoid jitter
    const currentPos = card.mesh.position;
    const targetPos = cardState.position;

    if (this.shouldUpdatePosition(currentPos, targetPos)) {
      card.mesh.position.set(targetPos.x, targetPos.y, targetPos.z);
    }

    // Update rotation
    card.mesh.rotation.set(
      cardState.rotation.x,
      cardState.rotation.y,
      cardState.rotation.z,
    );

    // Update flip state
    if (card.isFlipped() !== cardState.isFlipped) {
      card.flip();
    }
  }

  /**
   * Determines if a card position should be updated based on distance threshold
   *
   * @private
   * @param currentPos - Current position of the card
   * @param targetPos - Target position from game state
   * @returns True if position should be updated
   */
  private shouldUpdatePosition(
    currentPos: any,
    targetPos: Position3D,
  ): boolean {
    return (
      Math.abs(currentPos.x - targetPos.x) > POSITION_UPDATE_THRESHOLD ||
      Math.abs(currentPos.y - targetPos.y) > POSITION_UPDATE_THRESHOLD ||
      Math.abs(currentPos.z - targetPos.z) > POSITION_UPDATE_THRESHOLD
    );
  }

  /**
   * Handles actions received from other players
   *
   * @private
   * @param action - The action to handle
   */
  private handleRemoteAction(action: GameAction): void {
    const card = this.sceneManager.cards.find(
      (c: Card) => c.getId() === action.cardId,
    );

    if (!card) {
      console.warn(`Card not found for action: ${action.cardId}`);
      return;
    }

    switch (action.type) {
      case "MOVE_CARD":
        this.handleMoveCardAction(card, action.data);
        break;
      case "FLIP_CARD":
        this.handleFlipCardAction(card, action.data);
        break;
      case "DRAW_CARD":
        this.handleDrawCardAction(card, action.data);
        break;
      case "PLACE_CARD":
        this.handlePlaceCardAction(card, action.data);
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Handles move card actions from remote players
   *
   * @private
   * @param card - The card to move
   * @param data - Position data
   */
  private handleMoveCardAction(card: Card, data: Position3D): void {
    card.mesh.position.set(data.x, data.y, data.z);
  }

  /**
   * Handles flip card actions from remote players
   *
   * @private
   * @param card - The card to flip
   * @param data - Flip state data
   */
  private handleFlipCardAction(card: Card, data: { isFlipped: boolean }): void {
    if (card.isFlipped() !== data.isFlipped) {
      card.flip();
    }
  }

  /**
   * Handles draw card actions from remote players
   *
   * @private
   * @param card - The card being drawn
   * @param data - Draw action data
   */
  private handleDrawCardAction(card: Card, data: any): void {
    // TODO: Implement draw card logic
    console.log("Draw card action received:", card.getId(), data);
  }

  /**
   * Handles place card actions from remote players
   *
   * @private
   * @param card - The card being placed
   * @param data - Place action data
   */
  private handlePlaceCardAction(card: Card, data: any): void {
    // TODO: Implement place card logic
    console.log("Place card action received:", card.getId(), data);
  }

  /**
   * Updates a specific card's data in the Firestore game state
   *
   * @private
   * @param cardId - ID of the card to update
   * @param updates - Partial updates to apply to the card state
   * @throws Error if Firestore operation fails
   */
  private async updateCardInGameState(
    cardId: string,
    updates: Partial<CardState>,
  ): Promise<void> {
    try {
      const docSnap = await getDoc(this.gameStateRef);

      if (!docSnap.exists()) {
        throw new Error("Game state document does not exist");
      }

      const gameState: GameState = docSnap.data() as GameState;
      const cardIndex = gameState.cards.findIndex((c) => c.id === cardId);

      if (cardIndex === -1) {
        throw new Error(`Card with ID ${cardId} not found in game state`);
      }

      gameState.cards[cardIndex] = {
        ...gameState.cards[cardIndex],
        ...updates,
      };

      await updateDoc(this.gameStateRef, { cards: gameState.cards });
    } catch (error) {
      console.error("Error updating card in game state:", error);
      throw new Error(`Failed to update card state: ${error}`);
    }
  }
}
