import { firestore } from "$lib/firebase/client";
import type DeckType from "$lib/interfaces/DeckType";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDeckTypeWithQueryDocumentSnapshot } from "../utils/mapData";
import type { DecksByGame } from "$lib/interfaces/DeckType";
import { getRulesetsByIds } from "./rulesetService";
import type { PlayerType } from "$lib/interfaces/PlayerType";
import { currentUser } from "$lib/firebase/auth";

/**
 * Pour créer un deck
 * @param deck deck avec ses informations. Attend un DeckType
 * @returns l'id du deck nouvellement créé
 */
export async function createUserDeck(deck: DeckType): Promise<string> {
  const docRef = await addDoc(collection(firestore, "decks"), {
    ...deck
  });

  return docRef.id;
}

/**
 * Pour supprimer DEFINITIVEMENT un deck
 * @param id l'id du deck que l'on veut supprimer. Attend une string
 */
export async function deleteDeckById(id: string): Promise<void> {
  // https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=fr
  // Attention, la suppression d'une document ne supprime pas ses sous collections
  // Normalement ça ne devrait pas poser de problème puisque nous ne créons pas de sous collections à partir des decks. Mais à garder en tête.

  await deleteDoc(doc(firestore, "decks", id));
}

/**
 * Pour récupérer un deck par son id
 * @param id id du deck que le veut récupérer. Attend une string
 * @returns le deck si le deck est bien dans la db, sinon renvoie null
 */
export async function findDeckById(id: string): Promise<DeckType | null> {
  let docSnap;
  try {
    docSnap = await getDoc(doc(firestore, "decks", id));
  } catch (error) {
    throw new Error("failure to access to firestore"); // Si l'on rentre ici c'est probablement que l'utilisateur n'a pas accès au deck. En renvoyant une erreur, permet de mieux controller la valeur de retour derrière. (exemple : renvoyer une 404 afin d'éviter de donner trop d'information)
  }

  if (!docSnap.exists())
    return null;

  const deck: DeckType = getDeckTypeWithQueryDocumentSnapshot(docSnap);

  return deck;
}

/**
 * Pour obtenir les decks d'un utilisateur en "données brutes" (sans faire de trie)
 * @param userId id de l'utilisateur. Attend un string
 * @returns les decks d'un utilisateur en "données brutes" (sans faire de trie)
 */
export async function getDecksByUserBrut(userId: string): Promise<DeckType[]> {
  const q = query(collection(firestore, "decks"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const userDecks: DeckType[] = [];
  querySnapshot.forEach((doc) => {
    userDecks.push(getDeckTypeWithQueryDocumentSnapshot(doc));
  });

  return userDecks;
}

/**
 * Pour obtenir les decks d'un utilisateur trié par jeu
 * @param userId id de l'utilisateur. Attend une string
 * @returns les decks d'un utilisateur trié par jeu
 */
export async function getDecksByUserSortByGame(userId: string): Promise<DecksByGame[]> {
  const q = query(collection(firestore, "decks"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const myMap: Map<string, DeckType[]> = new Map<string, DeckType[]>();
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const tab: DeckType[] = myMap.get(data.rulesetId) || [];
    tab.push(getDeckTypeWithQueryDocumentSnapshot(doc));
    myMap.set(data.rulesetId, tab);
  });

  const userDecks: DecksByGame[] = [];

  const rulesets = await getRulesetsByIds(Array.from(myMap.keys()));
  for (let i = 0; i < rulesets.length; i++) {
    const decks = myMap.get(rulesets[i].id);
    if (!decks) continue; // logiquement ce n'est jamais sensé rentré ici

    userDecks.push({
      gameName: rulesets[i].name,
      decks
    });
  }

  return userDecks;
}

/**
 * Pour obtenir les decks d'un ruleset et qui respectent les contraintes d'un joueur
 * @param player pour connaitre les contraintes qu'a le joueur
 * @param rulesetId pour savoir de quel jeu doit provenir les decks
 * @param userId optionnel, pour savoir à qui doit appartenir les decks
 * @returns les decks trouvés
 */
export async function getDecksForGame(rulesetId: string, userId?: string, minSizeDeck?: number, maxSizeDeck?: number) {
  const usersId: string[] = []; // mettre l'id du compte officiel pour que les personnes puissent utiliser les decks mise à la disposition de tous le monde
  if (userId) usersId.push(userId);

  const q = query(collection(firestore, "decks"), where("rulesetId", "==", rulesetId), where("userId", "in", usersId));
  const querySnapshot = await getDocs(q);

  const deckAvailable: DeckType[] = [];
  querySnapshot.forEach((doc) => {
    const deck: DeckType = getDeckTypeWithQueryDocumentSnapshot(doc);
    if (minSizeDeck && deck.cards.length < minSizeDeck) return;
    if (maxSizeDeck && deck.cards.length > maxSizeDeck) return;
    deckAvailable.push(deck);
  });

  return deckAvailable;
}

/**
 * Pour mettre à jour les cartes d'un deck
 * @param deck deck avec les données à jour. Attend un DeckType
 */
export async function updateCardsInDeck(deck: DeckType): Promise<void> {
  if (!deck.id)
    throw new Error("id deck must be present");

  await updateDoc(doc(firestore, "decks", deck.id), {
    cards: deck.cards
  });
}
