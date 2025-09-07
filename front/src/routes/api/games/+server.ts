import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const rulesetId: string = body?.rulesetId;

  if (!rulesetId)
    return json({ error: "rulesetId is missing" }, { status: 400 });

  // appeler la fonction qui créé un lobby

  // pour l'instant la création est mocké, voir pour comment bien faire la création.
  // on fait au moins l'affichage

  return json({ status: 201, gameId: "wRZiMSFckB2tYghtEIoE" });
}
