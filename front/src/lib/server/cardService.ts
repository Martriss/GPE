// src/lib/server/cardService.ts
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { firestore } from "$lib/firebase/client";

export interface SearchableCard {
  id: string;
  name: string;
  imageUrl?: string;
  rarity: string;
  set: string;
  manaCost: string;
  typeLine: string;
  power?: string;
  toughness?: string;
}

/**
 * Recherche des cartes par préfixe de nom en utilisant le champ nameLower
 * @param rulesetId ID du ruleset à rechercher
 * @param searchTerm Terme de recherche (minimum 2 caractères)
 * @param maxResults Nombre maximum de résultats (défaut: 10)
 */
export async function searchCardsByName(
  rulesetId: string,
  searchTerm: string,
  maxResults: number = 10,
): Promise<SearchableCard[]> {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  try {
    const cardsRef = collection(firestore, "rulesets", rulesetId, "cards");
    const searchLower = searchTerm.toLowerCase();

    // Recherche par préfixe avec range query sur nameLower
    const q = query(
      cardsRef,
      where("nameLower", ">=", searchLower),
      where("nameLower", "<=", searchLower + "\uf8ff"),
      orderBy("nameLower"),
      limit(maxResults),
    );

    const querySnapshot = await getDocs(q);
    const results: SearchableCard[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Extraire les propriétés depuis le tableau front.properties
      const properties = data.front?.properties || [];
      const rarity =
        properties.find((p: any) => p.name === "rarity")?.value || "";
      const set = properties.find((p: any) => p.name === "set")?.value || "";
      const manaCost =
        properties.find((p: any) => p.name === "mana_cost")?.value || "";
      const typeLine =
        properties.find((p: any) => p.name === "type_line")?.value || "";
      const power =
        properties.find((p: any) => p.name === "power")?.value || "";
      const toughness =
        properties.find((p: any) => p.name === "toughness")?.value || "";

      results.push({
        id: doc.id,
        name: data.name,
        imageUrl: data.imageUrl,
        rarity,
        set,
        manaCost,
        typeLine,
        power: power || undefined,
        toughness: toughness || undefined,
      });
    });

    return results;
  } catch (error) {
    console.error("Erreur lors de la recherche de cartes:", error);
    throw new Error("Impossible de rechercher les cartes");
  }
}
