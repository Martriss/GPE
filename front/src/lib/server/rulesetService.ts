import { firestore } from "$lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";

export async function getAllRulesets() {
  const rulesets = await getDocs(collection(firestore, "rulesets"));
  // console.log(rulesets);

  // const querySnapshot = await getDocs(collection(firestore, "rulesets"));
  rulesets.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}
