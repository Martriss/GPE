import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateCardsInDeck } from '$lib/server/services/deckService';

export const PUT: RequestHandler = async ({ params, request }) => {
  const deck = await request.json();

  if (deck.id !== params.id)
    return json({ error: "Bad request" }, { status: 400 });

  // avoir une vérification pour les authorisation s'il a le droit de le changer. Logiquement déjà pris en compte par le sdk de firebase mais si jamais on change de solution ça sera déjà en place
  await updateCardsInDeck(deck);

  return json({ status: 204 });
}
