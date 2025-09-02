import type CardType from "$lib/interfaces/CardType";
import { describe, expect, it } from "vitest";
import { sortCardNameAsc } from "./sorts";

describe('sortCardNameAsc', () => {

  const cartType1: CardType = {
    rulesetId: '5mGyO6S2CQ9X6kybyrVH',
    name: 'Instant',
    nameLower: 'instant',
    front: {
      cardTypeId: 'LBc22vxs9gd22W2cTLUG',
      skin: '',
      properties: []
    }
  };

  const cartType2: CardType = {
    rulesetId: '5mGyO6S2CQ9X6kybyrVH',
    name: 'Creature',
    nameLower: 'creature',
    front: {
      cardTypeId: 'LBc22vxs9gd22W2cTLUG',
      skin: '',
      properties: []
    }
  };

  it('should return 1 when the first name is alphabetically after the second', () => {
    const expectResult: number = 1;

    const result = sortCardNameAsc(cartType1, cartType2);

    expect(result).toEqual(expectResult);
  });

  it('should return -1 when the first name is alphabetically before the second', () => {
    const expectResult: number = -1;

    const result = sortCardNameAsc(cartType2, cartType1);

    expect(result).toEqual(expectResult);
  });

  it('should return 0 when both names are identical', () => {
    const expectResult: number = 0;

    const result = sortCardNameAsc(cartType1, cartType1);

    expect(result).toEqual(expectResult);
  });
});
