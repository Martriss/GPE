import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createWaitingRoom } from '$lib/server/services/gameService';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();
  const rulesetId: string = body?.rulesetId;

  if (!rulesetId)
    return json({ error: "rulesetId is missing" }, { status: 400 });

  const userConnected = cookies.get("user_id");
  if (!userConnected)
    return json({ status: 401 });

  const gameId = await createWaitingRoom(rulesetId, userConnected);

  return json({ gameId }, { status: 201 });
}
