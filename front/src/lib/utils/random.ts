import { PLANS_MTG } from "$lib/constants/name";

/**
 * Pour générer un nom aléatoire parmis les plans de Magic the Gathering
 * @returns le nom d'un plan
 */
export function generateRandomName(): string {
  const index = Math.floor(Math.random() * PLANS_MTG.length);
  return PLANS_MTG[index];
}
