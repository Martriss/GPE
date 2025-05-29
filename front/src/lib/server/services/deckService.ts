import { firestore } from "$lib/firebase/client";
import type DeckType from "$lib/interfaces/DeckType";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";

export async function createUserDeck(deck: DeckType): Promise<string> {
  const docRef = await addDoc(collection(firestore, "decks"), {
    ...deck
  });

  return docRef.id;
}

export async function findDeckById(id: string): Promise<DeckType | null> {
  let docSnap;
  try {
    docSnap = await getDoc(doc(firestore, "decks", id));
  } catch (error) {
    throw new Error("failure to access to firestore"); // Si l'on rentre ici c'est probablement que l'utilisateur n'a pas accès au deck. En renvoyant une erreur, permet de mieux controller la valeur de retour derrière. (exemple : renvoyer une 404 afin d'éviter de donner trop d'information)
  }

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

export async function getDecksByUser(user_id: string): Promise<DeckType | null> {

}

export async function updateCardsInDeck(deck: DeckType) {
  if (!deck.id)
    throw new Error("id deck must be present");

  await updateDoc(doc(firestore, "decks", deck.id), {
    cards: deck.cards
  });
}
