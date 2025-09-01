import { describe, it, expect } from "vitest";
import { getOccurrences } from "./counts";

describe('getOccurrences', () => {
  it('get a empty array and return an empty Map', () => {
    const array: string[] = [];

    const result = getOccurrences(array);


  });
});
