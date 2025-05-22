import { firestore } from "$lib/firebase/client";
import type DeckType from "$lib/interfaces/DeckType";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

export async function createUserDeck(deck: DeckType): Promise<string> {
  const docRef = await addDoc(collection(firestore, "decks"), {
    ...deck
  });

  return docRef.id;
}

export async function findDeckById(id: string): Promise<DeckType | null> {
  const docSnap = await getDoc(doc(firestore, "decks", id));

  if (!docSnap.exists())
    return null;

  const data = docSnap.data();

  const deck: DeckType = {
    id: docSnap.id,
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
