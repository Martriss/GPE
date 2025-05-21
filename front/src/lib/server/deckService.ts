import { firestore } from "$lib/firebase/client";
import { addDoc, collection } from "firebase/firestore";

export async function createUserDeck(userUuid: string) {
  // Add a new document with a generated id.
  const docRef = await addDoc(collection(firestore, `users/${userUuid}/decks`), {
    name: "Tokyo",
    country: "Japan"
  });
  console.log("Document written with ID: ", docRef.id);
}
