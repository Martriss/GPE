import { getDecksByUserSortByGame } from "$lib/server/services/deckService";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { DecksByGame } from "$lib/interfaces/DeckType";

export const load: PageServerLoad = async ({ cookies }) => {
  // Récupérer l'utilisateur authentifié
  const userId = cookies.get('user_id');
  if (!userId) error(401);

  let userDecksByGame: DecksByGame[] = [];
  try {
    userDecksByGame = await getDecksByUserSortByGame(userId);
  } catch (err) {
    // Erreur probablement du à un manque de droit
    // Mais logiquement nous ne sommes pas sensé rentrer ici. Puisque tous le monde à le droit de voir ses decks. Hormis ce qui ne sont pas connecté mais ils sont sensé être attrapé plus haut avec une 401
    error(500);
  }

  return {
    userDecksByGame
  }
}
