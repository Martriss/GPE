import { json } from "@sveltejs/kit";
import { searchCardsByName } from "$lib/server/cardService.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const rulesetId = url.searchParams.get("ruleset");
  const searchTerm = url.searchParams.get("q");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  if (!rulesetId || !searchTerm) {
    return json({ error: "Paramètres manquants" }, { status: 400 });
  }

  try {
    const cards = await searchCardsByName(rulesetId, searchTerm, limit);

    return json({
      cards,
      total: cards.length,
      searchTerm,
    });
  } catch (error) {
    console.error("Erreur API recherche cartes:", error);
    return json({ error: "Erreur lors de la recherche" }, { status: 500 });
  }
};
