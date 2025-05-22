import type { PageServerLoad } from "./$types";
import { findDeckById } from '$lib/server/service/deckService';
import { getRulesetById } from "$lib/server/service/rulesetService";
import { error } from "@sveltejs/kit";
import type RulesetType from "$lib/interfaces/RulesetType";

export const load: PageServerLoad = async ({ params }) => {
  const deck = await findDeckById(params.id);

  // console.log(deck);
  if (!deck) error(404);

  // Mettre un bon message d'erreur lorsque l'authentification sera présente + changer l'userid
  if (!deck.isPublic && !deck.isShared && deck.userId !== 'f2ECMFu1RYXMLEFvrnyFSHnkRth1') error(401);

  let ruleset: RulesetType;
  try {
    ruleset = await getRulesetById(deck.rulesetId);
  } catch (err) {
    // Voir pour comment faire si l'id du ruleset n'existe plus.
    error(500);
  }

  return {
    deck,
    rulesetName: ruleset.name
  }
}
