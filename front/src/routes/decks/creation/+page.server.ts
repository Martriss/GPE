import type { Actions, PageServerLoad } from './$types';
import * as rulesetService from '$lib/server/rulesetService';

export const load: PageServerLoad = () => {
	rulesetService.getAllRulesets();
};

export const actions = {
	createDeck: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
} satisfies Actions;
