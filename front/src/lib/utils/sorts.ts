import type CardType from "$lib/interfaces/CardType";

export const sortCardNameAsc = (a: CardType, b: CardType) => {
  if (a.nameLower < b.nameLower) return -1;
  if (a.nameLower > b.nameLower) return 1;
  return 0;
}
