import { firestore } from "$lib/firebase/client";
import type RulesetType from "$lib/interface/RulesetType";
import { collection, getDocs } from "firebase/firestore";


export async function getAllRulesets() {
  const rulesets = await getDocs(collection(firestore, "rulesets"));
  let data: RulesetType[] = [];

  rulesets.forEach((doc) => {
    // console.log(`${doc.id} => ${doc.data()}`);
    data.push({
      uuid: doc.id,
      name: doc.data().name
    });
  });

  return data;
}
