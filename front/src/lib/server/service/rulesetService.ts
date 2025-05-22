import { firestore } from "$lib/firebase/client";
import type RulesetType from "$lib/interfaces/RulesetType";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";


export async function getAllRulesets() {
  const rulesets = await getDocs(collection(firestore, "rulesets"));
  let data: RulesetType[] = [];

  rulesets.forEach((doc) => {
    data.push({
      uuid: doc.id,
      name: doc.data().name
    });
  });

  return data;
}

export async function getRulesetById(id: string): Promise<RulesetType> {
  const docSnap = await getDoc(doc(firestore, "rulesets", id));

  if (!docSnap.exists())
    throw new Error("There are no ruletset with this id");

  const data = docSnap.data();

  const ruleset: RulesetType = {
    uuid: id,
    name: data.name
  }

  return ruleset;
}
