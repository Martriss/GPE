import type DeckType from "$lib/interfaces/DeckType";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore/lite";
import { describe, expect, it } from "vitest";
import { getDeckTypeWithQueryDocumentSnapshot, getRulesetTypeWithQueryDocumentSnapshot } from "./mapData";
import type RulesetType from "$lib/interfaces/RulesetType";

describe("getDeckTypeWithQueryDocumentSnapshot", () => {
  it("should return a DeckType from a QueryDocumentSnapshot<DocumentData, DocumentData>", () => {
    const data = {
      name: "my name deck",
      description: "my description",
      isPublic: true,
      isShared: false,
      userId: "zaezjkkQ1DSkakz",
      rulesetId: "zaezjkkQ1DSkakz",
      cards: []
    };
    const doc = {
      id: "my id",
      data: () => data
    } as unknown as QueryDocumentSnapshot<DocumentData, DocumentData>;
    const expectResult: DeckType = {
      id: "my id",
      name: "my name deck",
      description: "my description",
      isPublic: true,
      isShared: false,
      userId: "zaezjkkQ1DSkakz",
      rulesetId: "zaezjkkQ1DSkakz",
      cards: []
    };

    const result = getDeckTypeWithQueryDocumentSnapshot(doc);

    expect(result).toEqual(expectResult);
  });
});

describe("getRulesetTypeWithQueryDocumentSnapshot", () => {
  it("should return a RulesetType from a QueryDocumentSnapshot<DocumentData, DocumentData>", () => {
    const data = {
      name: "my name ruleset"
    };
    const doc = {
      id: "my id",
      data: () => data
    } as unknown as QueryDocumentSnapshot<DocumentData, DocumentData>;
    const expectResult: RulesetType = {
      uuid: "my id",
      name: "my name ruleset"
    };

    const result = getRulesetTypeWithQueryDocumentSnapshot(doc);

    expect(result).toEqual(expectResult);
  });
});
