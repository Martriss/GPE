import type { Actions, PageServerLoad } from './$types';
import * as rulesetService from '$lib/server/rulesetService';
import * as deckService from '$lib/server/deckService';
import type DeckType from '$lib/interface/DeckType';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		rulesets: await rulesetService.getAllRulesets()
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
			userId: "f2ECMFu1RYXMLEFvrnyFSHnkRth1", // replace later the user uuid,
			rulesetId: game,
			cards: [] // view later to add cards at the creation time
		};

		deckService.createUserDeck(deck);
	}
} satisfies Actions;
