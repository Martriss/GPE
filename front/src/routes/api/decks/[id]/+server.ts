import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import { deleteDeckById } from "$lib/server/services/deckService";

export const DELETE: RequestHandler = async ({ params }) => {
  // avoir une vérification pour être sur que l'utilisateur qui demande la suppression a bien "les droits" de le faire.

  await deleteDeckById(params.id);

  return json({ status: 204 });
}
