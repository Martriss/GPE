import type DeckType from "$lib/interfaces/DeckType";
import type RulesetType from "$lib/interfaces/RulesetType";
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
