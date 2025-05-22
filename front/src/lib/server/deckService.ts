import { firestore } from "$lib/firebase/client";
import type DeckType from "$lib/interface/DeckType";
import { addDoc, collection } from "firebase/firestore";

export async function createUserDeck(deck: DeckType) {
  const docRef = await addDoc(collection(firestore, `users/${deck.userId}/decks`), {
    ...deck
  });
  console.log("Document written with ID: ", docRef.id);
}
