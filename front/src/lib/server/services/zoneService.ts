import { firestore } from "$lib/firebase/client";
import type ZoneType from "$lib/interfaces/ZoneType";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getZoneTypeWithQueryDocumentSnapshot } from "../utils/mapData";

/**
 * Pour ajouter une zone à une ruleset
 * @param zone zone avec ses informations. Attend un ZoneType
 * @param rulesetId l'id du ruleset dans lequel on veut ajouter la zone
 * @returns l'id de la zone nouvellement crééé
 */
export async function addZoneToRuleset(zone: ZoneType, rulesetId: string): Promise<string> {
  const docRef = await addDoc(collection(firestore, "rulesets", rulesetId, "zones"), zone);

  return docRef.id;
}

/**
 * Pour récupérer toutes les zones présents dans un ruleset
 * @param rulesetId l'id du ruleset dont on veut récupérer les zones
 * @returns toutes le zones d'un ruleset
 */
export async function getAllRulesetZones(rulesetId: string): Promise<ZoneType[]> {
  const zones = await getDocs(collection(firestore, "rulesets", rulesetId, "zones"));
  let data: ZoneType[] = [];

  zones.forEach((doc) => {
    data.push(getZoneTypeWithQueryDocumentSnapshot(doc));
  });

  return data;
}
