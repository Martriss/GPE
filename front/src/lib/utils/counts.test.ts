import { describe, it, expect } from "vitest";
import { getOccurrences } from "./counts";

describe('getOccurrences', () => {
  it('should return an empty map for an empty list', () => {
    const givenList: string[] = [];

    const expectResult: Map<string, number> = new Map();

    const result = getOccurrences(givenList);

    expect(result).toEqual(expectResult);
  });

  it('should return count 1 for a single-element list', () => {
    const givenList: string[] = ['PALMER'];
    const expectResult: Map<string, number> = new Map([['PALMER', 1]]);

    const result = getOccurrences(givenList);

    expect(result).toEqual(expectResult);
  });

  it('should count correctly when all elements are identical', () => {
    const givenList: string[] = ['Orio', 'Orio', 'Orio'];
    const expectResult: Map<string, number> = new Map([['Orio', 3]]);

    const result = getOccurrences(givenList);

    expect(result).toEqual(expectResult);
  });

  it('should assign count 1 to each unique element', () => {
    const givenList: string[] = ['Orio', 'PALMER', 'Panam', 'palmer'];
    const expectResult: Map<string, number> = new Map([
      ['Orio', 1],
      ['PALMER', 1],
      ['Panam', 1],
      ['palmer', 1],
    ]);

    const result = getOccurrences(givenList);

    expect(result).toEqual(expectResult);
  });

  it('should return correct counts for a normal list', () => {
    const givenList: string[] = ['Orio', 'PALMER', 'Panam', 'PALMER'];
    const expectResult: Map<string, number> = new Map([
      ['Orio', 1],
      ['PALMER', 2],
      ['Panam', 1],
    ]);

    const result = getOccurrences(givenList);

    expect(result).toEqual(expectResult);
  });
});
