import { PUBLIC_USER_FIREBASE } from "$env/static/public";
import { getDecksByUserSortByGame } from "$lib/server/services/deckService";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { DecksByGame } from "$lib/interfaces/DeckType";

export const load: PageServerLoad = async () => {
  // Récupérer l'utilisateur authentifié
  const userId = PUBLIC_USER_FIREBASE;
  let userDecksByGame: DecksByGame[] = [];
  try {
    userDecksByGame = await getDecksByUserSortByGame(userId);
  } catch (err) {
    // Erreur probablement du à un manque de droit
    error(500);
  }

  return {
    userDecksByGame
  }
}
