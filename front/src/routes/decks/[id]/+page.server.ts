import type { PageServerLoad } from "./$types";
import { findDeckById } from '$lib/server/services/deckService';
import { getRulesetById } from "$lib/server/services/rulesetService";
import { error } from "@sveltejs/kit";
import type RulesetType from "$lib/interfaces/RulesetType";
import { getCardsById } from "$lib/server/services/cardService";
import type CardType from "$lib/interfaces/CardType";

export const load: PageServerLoad = async ({ params }) => {
  const deck = await findDeckById(params.id);

  if (!deck) error(404);

  // Lorsque l'authentification sera faite changer deck.userId !== 'f2ECMFu1RYXMLEFvrnyFSHnkRth1'
  // Error 404 pour ne pas laisser paraitre qu'il y a une ressource à cet "endroit" là
  if (!deck.isPublic && !deck.isShared && deck.userId !== 'f2ECMFu1RYXMLEFvrnyFSHnkRth1') error(404);

  let ruleset: RulesetType;
  let cards: CardType[];
  try {
    ruleset = await getRulesetById(deck.rulesetId);
    cards = await getCardsById(deck.rulesetId, deck.cards);
  } catch (err) {
    // Voir pour comment faire si l'id du ruleset n'existe plus.
    error(500);
  }

  return {
    deck,
    rulesetName: ruleset.name,
    cards
  }
}
