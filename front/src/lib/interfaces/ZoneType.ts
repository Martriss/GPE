import type CardType from "./CardType";

export default interface ZoneType {
  id?: string;
  name: string;
  height: number;
  width: number;
  coordinates: Coordinates;
  backgroundColor: string;
  owners: string[];
  cards: CardType[];
  initializationConfig: InitializationZoneConfig;
  displayConfig: DisplayZoneConfig;
  actions: Actions;
}

export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export interface InitializationZoneConfig {
  cardSelectingConfigs: {
    nbCardsByOwner: string;
    isRandom: boolean;
    chosenBy: string;
  }[];
  cardFacePattern: string;
}

export interface DisplayZoneConfig {
  mode: string;
  cardFacePattern: string;
  areCardsVisible: boolean;
  hasSleeve: boolean;
}

export interface Actions {
  addCard: PositionAction;
  removeCard: PositionAction;
  flipCard: {
    faceUp: Right;
    faceDown: Right;
  };
  rotateCard: RightAngle;
  shuffleAllCards: Right;
  searchCards: {
    all: Right;
    xCards: PositionAction;
  };
}

export interface Right {
  enabled: boolean;
  allowedFor: string;
  allowedToPlayers: string[];
}

export interface RightAngle extends Right {
  allowedAngles: number[];
}

export interface PositionAction {
  atStart: Right;
  atEnd: Right;
  anywhere: Right;
  random: Right;
}
