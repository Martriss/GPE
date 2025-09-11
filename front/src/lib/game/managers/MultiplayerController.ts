import {
  doc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  query,
  onSnapshot as onCollectionSnapshot,
  orderBy,
  getDoc,
  type DocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "$lib/firebase/client";
import type { SceneManager } from "./SceneManager";
import type { Card } from "../objects/Card";

export interface CardState {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  isFlipped: boolean;
  ownerId: string | null;
  zoneId: string | null;
}

export interface GameAction {
  id?: string;
  type: "MOVE_CARD" | "FLIP_CARD" | "DRAW_CARD" | "PLACE_CARD";
  playerId: string;
  cardId: string;
  data: any;
  timestamp: number;
}

export interface GameState {
  cards: CardState[];
  currentPlayer: string;
  phase: "waiting" | "playing" | "finished";
  turn: number;
}

export class MultiplayerController {
  private sceneManager: SceneManager;
  private roomId: string;
  private playerId: string;
  private gameStateRef: any;
  private actionsRef: any;
  private unsubscribeGameState: (() => void) | null = null;
  private unsubscribeActions: (() => void) | null = null;
  private isHost: boolean = false;

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

  private async initializeMultiplayer(): Promise<void> {
    console.log("Initializing multiplayer for room:", this.roomId);

    // Subscribe to game state changes
    this.unsubscribeGameState = onSnapshot(
      this.gameStateRef,
      (doc: DocumentSnapshot) => {
        if (doc.exists()) {
          const gameState: GameState = doc.data() as GameState;
          this.handleGameStateUpdate(gameState);
        } else if (this.isHost) {
          // Initialize game state if it doesn't exist and we're the host
          this.initializeGameState();
        }
      },
      (error) => {
        console.error("Error listening to game state:", error);
      },
    );

    // Subscribe to game actions
    const actionsQuery = query(this.actionsRef, orderBy("timestamp", "desc"));
    this.unsubscribeActions = onCollectionSnapshot(
      actionsQuery,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const docData = change.doc.data() as {
              type: string;
              playerId: string;
              cardId: string;
              data: any;
              timestamp: number;
            };
            const action: GameAction = {
              id: change.doc.id,
              type: docData.type as GameAction["type"],
              playerId: docData.playerId,
              cardId: docData.cardId,
              data: docData.data,
              timestamp: docData.timestamp,
            };
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

  private async initializeGameState(): Promise<void> {
    const initialGameState: GameState = {
      cards: this.getInitialCardStates(),
      currentPlayer: this.playerId,
      phase: "playing",
      turn: 1,
    };

    try {
      // Use setDoc instead of updateDoc to create the document if it doesn't exist
      const { setDoc } = await import("firebase/firestore");
      await setDoc(this.gameStateRef, initialGameState);
    } catch (error) {
      console.error("Error initializing game state:", error);
    }
  }

  private getInitialCardStates(): CardState[] {
    return this.sceneManager.cards.map((card, index) => ({
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
    }));
  }

  private handleGameStateUpdate(gameState: GameState): void {
    // Update card positions and states based on the game state
    gameState.cards.forEach((cardState) => {
      const card = this.sceneManager.cards.find(
        (c) => c.getId() === cardState.id,
      );
      if (card) {
        // Only update if the position is significantly different to avoid jitter
        const currentPos = card.mesh.position;
        const targetPos = cardState.position;

        if (
          Math.abs(currentPos.x - targetPos.x) > 0.01 ||
          Math.abs(currentPos.y - targetPos.y) > 0.01 ||
          Math.abs(currentPos.z - targetPos.z) > 0.01
        ) {
          card.mesh.position.set(targetPos.x, targetPos.y, targetPos.z);
        }

        card.mesh.rotation.set(
          cardState.rotation.x,
          cardState.rotation.y,
          cardState.rotation.z,
        );

        if (card.isFlipped() !== cardState.isFlipped) {
          card.flip();
        }
      }
    });
  }

  private handleRemoteAction(action: GameAction): void {
    const card = this.sceneManager.cards.find(
      (c) => c.getId() === action.cardId,
    );
    if (!card) return;

    switch (action.type) {
      case "MOVE_CARD":
        card.mesh.position.set(action.data.x, action.data.y, action.data.z);
        break;
      case "FLIP_CARD":
        if (card.isFlipped() !== action.data.isFlipped) {
          card.flip();
        }
        break;
      case "DRAW_CARD":
        // Handle draw card action
        break;
      case "PLACE_CARD":
        // Handle place card action
        break;
    }
  }

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
    }
  }

  public async moveCard(
    cardId: string,
    position: { x: number; y: number; z: number },
  ): Promise<void> {
    await this.sendAction({
      type: "MOVE_CARD",
      cardId,
      data: position,
    });

    // Also update the game state
    await this.updateCardInGameState(cardId, { position });
  }

  public async flipCard(cardId: string, isFlipped: boolean): Promise<void> {
    await this.sendAction({
      type: "FLIP_CARD",
      cardId,
      data: { isFlipped },
    });

    // Also update the game state
    await this.updateCardInGameState(cardId, { isFlipped });
  }

  private async updateCardInGameState(
    cardId: string,
    updates: Partial<CardState>,
  ): Promise<void> {
    try {
      const docSnap = await getDoc(this.gameStateRef);
      if (docSnap.exists()) {
        const gameState: GameState = docSnap.data() as GameState;
        const cardIndex = gameState.cards.findIndex((c) => c.id === cardId);

        if (cardIndex !== -1) {
          gameState.cards[cardIndex] = {
            ...gameState.cards[cardIndex],
            ...updates,
          };
          await updateDoc(this.gameStateRef, { cards: gameState.cards });
        }
      }
    } catch (error) {
      console.error("Error updating card in game state:", error);
    }
  }

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
}
