import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "$lib/firebase/client";
import { getGameTypeWithQueryDocumentSnapshot } from "$lib/server/utils/mapData";

export const GET: RequestHandler = async ({ params, cookies }) => {
  const roomId = params.id;
  const userCurrentId = cookies.get("user_id");

  if (!userCurrentId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the room data from Firestore
    const docSnap = await getDoc(doc(firestore, "games", roomId));

    if (!docSnap.exists()) {
      return json({ error: "Room not found" }, { status: 404 });
    }

    const room = getGameTypeWithQueryDocumentSnapshot(docSnap);

    // Check if user has access to this room
    const isOwner = room.roomOwner === userCurrentId;
    const isViewer = room.viewers.includes(userCurrentId);
    const isPlayer = room.ruleset.players.some((player) => {
      // PlayerType uses dynamic keys, check all properties for the userId
      return Object.values(player).includes(userCurrentId);
    });

    if (!isOwner && !isViewer && !isPlayer) {
      return json({ error: "Forbidden" }, { status: 403 });
    }

    // Return the room data
    return json(room);

  } catch (error) {
    console.error("Error fetching room status:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
