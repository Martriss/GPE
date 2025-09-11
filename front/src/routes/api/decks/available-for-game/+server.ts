import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getDecksForGame } from "$lib/server/services/deckService";
import type DeckType from "$lib/interfaces/DeckType";


export const GET: RequestHandler = async ({ url, cookies }) => {
  const rulesetId = url.searchParams.get("rulesetId");
  const userId = cookies.get("user_id");
  const minSizeDeck = parseInt(url.searchParams.get("minSizeDeck") ?? "null", 10);
  const maxSizeDeck = parseInt(url.searchParams.get("maxSizeDeck") ?? "null", 10);

  if (!rulesetId) {
    return json({ error: "Paramètres manquants" }, { status: 400 })
  }

  const decks: DeckType[] = await getDecksForGame(rulesetId, userId ?? undefined, minSizeDeck ?? undefined, maxSizeDeck ?? undefined);


  return json({ decks }, { status: 200 });
}
