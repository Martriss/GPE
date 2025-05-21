import { firestore } from "$lib/firebase/client";
import { addDoc, collection } from "firebase/firestore";

export async function createUserDeck(userUuid: string) {
  // Add a new document with a generated id.
  // Savoir si addDoc permet de le générer même si ${userUuid} n'est pas encore créé
  const docRef = await addDoc(collection(firestore, `users/${userUuid}/decks`), {
    name: "Tokyo",
    country: "Japan"
  });
  console.log("Document written with ID: ", docRef.id);
}
