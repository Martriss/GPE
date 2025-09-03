import { firestore } from "$lib/firebase/client";
import type ZoneType from "$lib/interfaces/ZoneType";
import { addDoc, collection } from "firebase/firestore";

export async function addZoneToRuleset(zone: ZoneType, rulesetId: string) {
  await addDoc(collection(firestore, "rulesets"), { name: "TEST", createdBy: "lwI2AkazCybXQYspiuREQootJBf2" });
}
