import type { PlayerType } from "$lib/interfaces/PlayerType";
import { extractValueIdentityPlayer } from "./extract";

export function findUserPlayerFromPlayers(userId: string, players: PlayerType[]): PlayerType | null {
  for (let i = 0; i < players.length; i++) {
    if (userId === extractValueIdentityPlayer(players[i])) {
      return players[i];
    }
  }

  return null;
}
