import type DeckType from "$lib/interfaces/DeckType";
import type RulesetType from "$lib/interfaces/RulesetType";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

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
    cards: data.cards,
  }

  return deck;
}

export function getRulesetTypeWithQueryDocumentSnapshot(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): RulesetType {
  const data = doc.data();
  const ruleset: RulesetType = {
    uuid: doc.id,
    name: data.name
  }

  return ruleset;
}
