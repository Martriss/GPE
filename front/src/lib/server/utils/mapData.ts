import type DeckType from "$lib/interfaces/DeckType";
import type GameType from "$lib/interfaces/GameType";
import type { PlayerType } from "$lib/interfaces/PlayerType";
import type RulesetType from "$lib/interfaces/RulesetType";
import type ZoneType from "$lib/interfaces/ZoneType";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

/**
 * Pour mapper le retour de firebase avec un DeckType
 * @param doc document de firebase correspondant à un deck
 * @returns le DeckType formé à partir de doc
 */
export function getDeckTypeWithQueryDocumentSnapshot(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): DeckType {
  const data = doc.data();

  const deck: DeckType = {
    id: doc.id,
    name: data.name,
    description: data.description,
    isPublic: data.isPublic,
    isShared: data.isShared,
    userId: data.userId,
    rulesetId: data.rulesetId,
    cards: data.cards
  }

  return deck;
}

export function getGameTypeWithQueryDocumentSnapshot(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): GameType {
  const data = doc.data();
  const game: GameType = {
    id: doc.id,
    roomName: data.roomName,
    roomOwner: data.roomOwner,
    code: data.code,
    isPlaying: data.isPlaying,
    ruleset: data.ruleset,
    decks: data.decks,
    viewers: data.viewers
  };

  return game;
}

/**
 * Pour mapper le retour de firebase avec un PlayerType
 * @param doc document de firebase correspondant à un joueur
 * @returns le PlayerType formé à partir de doc
 */
export function getPlayerTypeWithQueryDocumentSnapshot(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): PlayerType {
  const data = doc.data();
  const player: PlayerType = {
    ...data
  }

  return player;
}

/**
 * Pour mapper le retour de firebase avec un RulesetType
 * @param doc document de firebase correspondant à un ruleset
 * @returns le RulesetType formé à partir de doc
 */
export function getRulesetTypeWithQueryDocumentSnapshot(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): RulesetType {
  const data = doc.data();
  const ruleset: RulesetType = {
    id: doc.id,
    name: data.name,
    isDraft: data.isDraft,
    isPublic: data.isPublic,
    createdBy: data.createdBy,
    ...(data.description ? { description: data.description } : {})
  }

  return ruleset;
}

/**
 * Pour mapper le retour de firebase avec un ZoneType
 * @param doc document de firebase correspondant à une zone
 * @returns le ZoneType formé à partir de doc
 */
export function getZoneTypeWithQueryDocumentSnapshot(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): ZoneType {
  const data = doc.data();
  const zone: ZoneType = {
    id: doc.id,
    name: data.name,
    height: data.height,
    width: data.width,
    coordinates: data.coordinates,
    backgroundColor: data.backgroundColor,
    owners: data.owners,
    cards: data.cards,
    initializationConfig: data.initializationConfig,
    displayConfig: data.displayConfig,
    actions: data.actions
  };

  return zone;
}
