import { getRulesetById } from "./rulesetService";

export async function createWaitingRoom(rulesetId: string, userId: string): Promise<string> {
  // Récupérer les informations du ruleset
  const ruleset = getRulesetById(rulesetId);
  // Créer la room avec les bonnes informations

  return "wRZiMSFckB2tYghtEIoE";
}
