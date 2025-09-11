import { firestore } from "$lib/firebase/client";
import type RulesetType from "$lib/interfaces/RulesetType";
import { collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore";
import { getRulesetTypeWithQueryDocumentSnapshot } from "../utils/mapData";
import type ZoneType from "$lib/interfaces/ZoneType";

/**
 * Pour récupérer tous les rulesets publics, autrement dit, ceux jouables
 * @returns tous les rulesets publics
 */
export async function getAllPlayableRulesets(): Promise<RulesetType[]> {
  const q = query(collection(firestore, "rulesets"), where("isPublic", "==", true));
  const rulesets = await getDocs(q);
  let data: RulesetType[] = [];

  rulesets.forEach((doc) => {
    data.push(getRulesetTypeWithQueryDocumentSnapshot(doc));
  });

  return data;
}

/**
 * Pour récupérer tous les rulesets
 * @returns tous les rulesets
 */
export async function getAllRulesets(): Promise<RulesetType[]> {
  const rulesets = await getDocs(collection(firestore, "rulesets"));
  let data: RulesetType[] = [];

  rulesets.forEach((doc) => {
    data.push(getRulesetTypeWithQueryDocumentSnapshot(doc));
  });

  return data;
}

/**
 * Pour obtenir un ruleset via son id. Jette une erreur si l'id ne corresponds à aucun ruleset
 * @param id id du ruleset. Attend une string
 * @returns le ruleset
 */
export async function getRulesetById(id: string): Promise<RulesetType> {
  const docSnap = await getDoc(doc(firestore, "rulesets", id));

  if (!docSnap.exists())
    throw new Error("There are no ruletset with this id");

  const ruleset = getRulesetTypeWithQueryDocumentSnapshot(docSnap);

  return ruleset;
}

/**
 * Pour obtenir les rulesets à partir de leur id
 * @param ids tableau d'id de rulesets: Attend un tableau de string
 * @returns les rulesets trouvés
 */
export async function getRulesetsByIds(ids: string[]): Promise<RulesetType[]> {
  // Dans firestore, pour la condition "where", l'opérateur "in" prend au maximum 30 éléments
  const max: number = 30;
  const rulesets: RulesetType[] = [];

  for (let i = 0; i < ids.length; i += max) {
    const batchIds: string[] = ids.slice(i, i + max);
    const q = query(collection(firestore, "rulesets"), where(documentId(), "in", batchIds));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => rulesets.push(getRulesetTypeWithQueryDocumentSnapshot(doc)));
  }

  return rulesets;
}
