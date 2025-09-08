import { firestore } from "$lib/firebase/client";
import type ZoneType from "$lib/interfaces/ZoneType";
import { addDoc, collection } from "firebase/firestore";

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
