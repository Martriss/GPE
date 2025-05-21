import type { Actions } from './$types';

export const actions = {
	createDeck: async ({ request }) => {
		const data = await request.formData();
		console.log(data);
	}
} satisfies Actions;
