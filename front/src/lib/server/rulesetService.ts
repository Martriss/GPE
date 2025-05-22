import { firestore } from "$lib/firebase/client";
import type RulesetType from "$lib/interfaces/RulesetType";
import { collection, getDocs } from "firebase/firestore";


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
