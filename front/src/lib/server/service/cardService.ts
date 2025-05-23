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
import type CardType from "$lib/interfaces/CardType";

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
): Promise<CardType[]> {
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
    const results: CardType[] = [];

    querySnapshot.forEach((doc) => {
      let data = doc.data() as CardType;
      data.id = doc.id;
      results.push(data);
    });

    return results;
  } catch (error) {
    console.error("Erreur lors de la recherche de cartes:", error);
    throw new Error("Impossible de rechercher les cartes");
  }
}
