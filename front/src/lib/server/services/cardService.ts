// src/lib/server/cardService.ts
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  documentId,
} from "firebase/firestore";
import { firestore } from "$lib/firebase/client";
import type CardType from "$lib/interfaces/CardType";
import { getOccurrences } from "$lib/utils/counts";

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
    // console.error("Erreur lors de la recherche de cartes:", error);
    throw new Error("Impossible de rechercher les cartes");
  }
}

/**
 * Pour obtenir les cartes d'un ruleset via leur id
 * @param rulesetId l'id du ruleset. Attend une string
 * @param cardsId les ids dont on veut les cartes. Attend un tableau de string
 * @returns un tableau avec les cartes trouvés
 */
export async function getCardsById(rulesetId: string, cardsId: string[]): Promise<CardType[]> {
  const myMap: Map<string, number> = getOccurrences(cardsId);
  const refSort: string[] = cardsId.sort();
  const chunks = [];
  while (refSort.length) chunks.push(refSort.splice(0, 10));

  const queries = chunks.map(chunk =>
    getDocs(query(collection(firestore, `rulesets/${rulesetId}/cards`), where(documentId(), 'in', chunk)))
  );

  const results = await Promise.all(queries);
  const data: CardType[] = results.flatMap(r => r.docs.map(doc => ({ id: doc.id, ...doc.data() }))) as CardType[];
  let res: CardType[] = [];
  for (let i = 0; i < data.length; i++) {
    const n: number = myMap.get(data[i].id) as number;
    for (let j = 0; j < n; j++) {
      res.push(data[i]);
    }
  }

  return res;
}
