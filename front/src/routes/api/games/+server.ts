import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const rulesetId: string = await request.json();

  // appeler la fonction qui créé un lobby

  return json({ status: 201 });
}
