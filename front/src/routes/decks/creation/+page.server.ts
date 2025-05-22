import type { Actions, PageServerLoad } from './$types';
import * as rulesetService from '$lib/server/rulesetService';
import * as deckService from '$lib/server/deckService';

export const load: PageServerLoad = async () => {
	return {
		rulesets: await rulesetService.getAllRulesets()
	};
};

export const actions = {
	createDeck: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
		deckService.createUserDeck("f2ECMFu1RYXMLEFvrnyFSHnkRth1"); // replace later the user uuid
	}
} satisfies Actions;
