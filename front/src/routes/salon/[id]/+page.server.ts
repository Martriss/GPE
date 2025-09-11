import type GameType from "$lib/interfaces/GameType";
import { getWaitingRoomById } from "$lib/server/services/gameService";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  let room: GameType;
  try {
    room = await getWaitingRoomById(params.id);
  } catch (err) {
    error(404);
  }

  const userCurrentId = cookies.get("user_id");
  if (!userCurrentId) error(401);

  return {
    connectedUser: userCurrentId,
    room
  }
}
