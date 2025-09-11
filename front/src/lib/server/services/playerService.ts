import { firestore } from "$lib/firebase/client";
import type { PlayerType } from "$lib/interfaces/PlayerType";
import { collection, getDocs } from "firebase/firestore";
import { getPlayerTypeWithQueryDocumentSnapshot } from "../utils/mapData";

/**
 * Pour récupérer toutes les joueurs présents dans un ruleset
 * @param rulesetId l'id du ruleset dont on veut récupérer les joueurs
 * @returns tous les joueurs d'un ruleset
 */
export async function getAllRulesetPlayers(rulesetId: string): Promise<PlayerType[]> {
  const players = await getDocs(collection(firestore, "rulesets", rulesetId, "players"));
  let data: PlayerType[] = [];

  players.forEach((doc) => {
    data.push(getPlayerTypeWithQueryDocumentSnapshot(doc));
  });

  return data;
}
