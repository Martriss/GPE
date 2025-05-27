import type { Actions, PageServerLoad } from './$types';
import { getAllRulesets } from '$lib/server/services/rulesetService';
import { createUserDeck } from '$lib/server/services/deckService';
import type DeckType from '$lib/interfaces/DeckType';
import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_USER_FIREBASE } from '$env/static/public';

export const load: PageServerLoad = async () => {
  return {
    rulesets: await getAllRulesets()
    // rulesets: [{ uuid: 'zhPZBo2kuOXpxdXMuXwk', name: "Magic The Gathering" }] // mock pour le développement afin d'éviter le nombre de lecture
  };
};

export const actions = {
  createDeck: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name")?.toString();
    const game = data.get("game")?.toString();
    const visibility = data.get("visibility")?.toString();
    // ajouter plus tard pour récupérer les "cartes" à ajouter au deck à la création
    // description is optionnel, no need to check

    if (!name) {
      return fail(400, { name, isMissing: true, isEmpty: true });
    }
    if (!game) {
      return fail(400, { name, isMissing: true, isEmpty: true });
    }
    if (!visibility) {
      return fail(400, { name, isMissing: true, isEmpty: true });
    }

    // Comportement par défaut de visibilité lors de la création d'un deck
    let isPublic: boolean = false;
    let isShared: boolean = false;
    if (visibility === "public")
      isPublic = true;
    if (visibility === "unlisted")
      isShared = true;

    const deck: DeckType = {
      name,
      description: data.get("description")?.toString(),
      isPublic,
      isShared,
      userId: PUBLIC_USER_FIREBASE, // replace later the user uuid,
      rulesetId: game,
      cards: [] // view later to add cards at the creation time
    };

    let deckId: string = "0";
    try {
      deckId = await createUserDeck(deck);
    } catch (error) {
      console.error(error);
      return fail(500, { message: "Erreur lors de la création du deck. Le deck n'a pas pu être crée", isError: true });
    }
    redirect(303, `/decks/${deckId}`);
  }
} satisfies Actions;
