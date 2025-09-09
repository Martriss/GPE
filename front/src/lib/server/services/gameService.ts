import type { SubRulesetTypeForGame } from "$lib/interfaces/GameType";
import type GameType from "$lib/interfaces/GameType";
import { generateRandomName } from "$lib/utils/random";
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAllRulesetPlayers } from "./playerService";
import { getRulesetById } from "./rulesetService";
import { getAllRulesetZones } from "./zoneService";
import { firestore } from "$lib/firebase/client";
import { getGameTypeWithQueryDocumentSnapshot } from "../utils/mapData";

/**
 * Pour créer une salle d'attente.
 * @param rulesetId l'id du jeu choisi
 * @param userId propriétaire de la salle d'attente
 * @returns l'id de la salle d'attente nouvellement créée
 */
export async function createWaitingRoom(rulesetId: string, userId: string): Promise<string> {
  // Récupération des données d'un ruleset
  const ruleset = await getRulesetById(rulesetId);
  ruleset.zones = await getAllRulesetZones(rulesetId);
  ruleset.players = await getAllRulesetPlayers(rulesetId);

  // Créer la room avec les bonnes informations
  const game: GameType = {
    ruleset: ruleset as SubRulesetTypeForGame,
    roomName: generateRandomName(),
    roomOwner: userId,
    code: "", // temporaire, voir plus tard pour aussi avoir un generateur de code
    decks: [],
    isPlaying: false,
    viewers: []
  };

  const docRef = await addDoc(collection(firestore, "games"), {
    ...game
  });

  await updateDoc(doc(firestore, "games", docRef.id), {
    ...game,
    code: docRef.id
  });

  return docRef.id;
}

/**
 * Pour supprimer définitevement un jeu. Si l'on veut supprimer une salle d'attente on appelle aussi cette fonction. Une salle d'attente est un jeu mais qui n'a pas démarré
 * @param roomId l'id de la salle que l'on veut supprimer. Attend une string
 */
export async function deleteGameById(roomId: string): Promise<void> {
  await deleteDoc(doc(firestore, "games", roomId));
}

/**
 * Pour récupérer une salle d'attente via son id
 * @param roomId id de salle. Attend une string
 * @returns la salle d'attente
 * @throws Si aucune salle n'a été trouvé à partir de l'id ou Si la salle n'existe plus parce que la partie est en cours
 */
export async function getWaitingRoomById(roomId: string): Promise<GameType> {
  const docSnap = await getDoc(doc(firestore, "games", roomId));

  if (!docSnap.exists())
    throw new Error("There are no room with this id");

  const room: GameType = getGameTypeWithQueryDocumentSnapshot(docSnap);

  if (room.isPlaying)
    throw new Error("Game in progress, waiting room is unavailable");

  return room;
}

/**
 * Pour mettre à jour tout un objet GameType 
 * @param game la partie avec ses les nouvelles valeurs
 */
export async function updateGame(game: GameType): Promise<void> {
  if (!game.id)
    throw new Error("id game must be present");

  await updateDoc(doc(firestore, "games", game.id), {
    ...game
  });
}
