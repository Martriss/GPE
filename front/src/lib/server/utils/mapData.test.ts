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
  it("should return a RulesetType without description from a QueryDocumentSnapshot<DocumentData, DocumentData>", () => {
    const data = {
      name: "my name ruleset",
      isPublic: true,
      isDraft: false,
      createdBy: "created by"
    };
    const doc = {
      id: "my id",
      data: () => data
    } as unknown as QueryDocumentSnapshot<DocumentData, DocumentData>;
    const expectResult: RulesetType = {
      id: "my id",
      name: "my name ruleset",
      isDraft: false,
      isPublic: true,
      createdBy: "created by"
    };

    const result = getRulesetTypeWithQueryDocumentSnapshot(doc);

    expect(result).toEqual(expectResult);
  });

  it("should return a RulesetType with description from a QueryDocumentSnapshot<DocumentData, DocumentData>", () => {
    const data = {
      name: "my name ruleset",
      isPublic: true,
      isDraft: false,
      createdBy: "created by",
      description: "my description"
    };
    const doc = {
      id: "my id",
      data: () => data
    } as unknown as QueryDocumentSnapshot<DocumentData, DocumentData>;
    const expectResult: RulesetType = {
      id: "my id",
      name: "my name ruleset",
      isDraft: false,
      isPublic: true,
      createdBy: "created by",
      description: "my description"
    };

    const result = getRulesetTypeWithQueryDocumentSnapshot(doc);

    expect(result).toEqual(expectResult);
  });
});
