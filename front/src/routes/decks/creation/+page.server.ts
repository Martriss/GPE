import type { Actions, PageServerLoad } from './$types';
import { getAllRulesets } from '$lib/server/services/rulesetService';
import { createUserDeck } from '$lib/server/services/deckService';
import type DeckType from '$lib/interfaces/DeckType';
import { fail, redirect } from '@sveltejs/kit';
import { error } from 'console';

export const load: PageServerLoad = async () => {
  return {
    rulesets: await getAllRulesets()
    // rulesets: [{ uuid: 'zhPZBo2kuOXpxdXMuXwk', name: "Magic The Gathering" }] // mock pour le développement afin d'éviter le nombre de lecture
  };
};

export const actions = {
  createDeck: async ({ request, cookies }) => {
    const data = await request.formData();
    const name = data.get("name")?.toString();
    const game = data.get("game")?.toString();
    const description = data.get("description")?.toString();
    const visibility = data.get("visibility")?.toString();
    // ajouter plus tard pour récupérer les "cartes" à ajouter au deck à la création

    // Test les variables obligatoires ensemble parce que dans le message d'erreur côté front le message sera identique
    // description is optionnel, no need to check
    if (!name || !game || !visibility) {
      return fail(400, { name, game, description, visibility, isMissing: true });
    }

    const userCurrentId = cookies.get('user_id');
    if (!userCurrentId) {
      // Normalement nous ne sommes jamais sensé arrivé dedans, parce que l'utilisateur doit être connecté pour accéder à la page de création
      // Essayer de voir pour afficher un message d'erreur si jamais l'on rentre ici
      // Voir une redirection ? Error 401 ?
      error(500);
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
      description,
      isPublic,
      isShared,
      userId: userCurrentId || '', // Plus haut il y a une vérification afin de s'assurer que le cookie ne soit pas vide
      rulesetId: game,
      cards: [] // view later to add cards at the creation time
    };

    let deckId: string = "0";
    try {
      deckId = await createUserDeck(deck);
    } catch (error) {
      console.error(error);
      return fail(500, { message: "Erreur lors de la création du deck. Le deck n'a pas pu être crée", isError: true, name, game, description, visibility });
    }
    redirect(303, `/decks/${deckId}`);
  }
} satisfies Actions;
