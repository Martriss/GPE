import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import { deleteGameById, updateGame } from "$lib/server/services/gameService";

export const DELETE: RequestHandler = async ({ params }) => {
  // avoir une vérification pour être sur que l'utilisateur qui demande la suppression a bien "les droits" de le faire.

  await deleteGameById(params.id);

  return json({ status: 204 });
}

export const PUT: RequestHandler = async ({ params, request }) => {
  const game = await request.json();

  if (game.id !== params.id)
    return json({ error: "Bad request" }, { status: 400 });

  await updateGame(game);

  return json({ status: 204 });
}
