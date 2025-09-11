import { getGameRoomById } from "$lib/server/services/gameService";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, cookies }) => {
  const roomId = params.roomId;
  const userCurrentId = cookies.get("user_id");

  if (!userCurrentId) {
    error(401, "Unauthorized - Please log in");
  }

  try {
    // First check if the room exists and game has started
    const room = await getGameRoomById(roomId);

    // Check if the user is part of this room (either as player or viewer)
    const isPlayer = room.ruleset.players.some((player) => {
      // PlayerType uses dynamic keys, check all properties for the userId
      return Object.values(player).includes(userCurrentId);
    });
    const isViewer = room.viewers.includes(userCurrentId);
    const isOwner = room.roomOwner === userCurrentId;

    if (!isPlayer && !isViewer && !isOwner) {
      error(403, "Forbidden - You are not part of this game room");
    }

    return {
      roomId,
      userId: userCurrentId,
      isHost: isOwner,
      room,
    };
  } catch (err) {
    error(404, "Room not found or no longer available");
  }
};
