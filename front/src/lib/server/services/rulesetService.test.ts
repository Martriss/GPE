import type RulesetType from "$lib/interfaces/RulesetType";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as mapDataModule from "../utils/mapData";
import * as firestoreModule from 'firebase/firestore';
import { getAllRulesets, getRulesetById, getRulesetsByIds } from "./rulesetService";

vi.mock('firebase/firestore', { spy: true });
vi.mock('../utils/mapData', { spy: true });

describe("getAllRulesets", async () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return an array of RulesetType", async () => {
    const mockResultGetDocs = [{}, {}] as unknown as firestoreModule.QuerySnapshot<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultMapOnce: RulesetType = {
      id: "aezkld&^p",
      name: "mtg",
      isDraft: false,
      isPublic: true,
      createdBy: "created by"
    };
    const mockResultMapSecond: RulesetType = {
      id: "zaeqdzaq&^p",
      name: "pokemon",
      isDraft: false,
      isPublic: true,
      createdBy: "created by"
    };

    const expectResult: RulesetType[] = [mockResultMapOnce, mockResultMapSecond];

    vi.spyOn(firestoreModule, "getDocs").mockResolvedValueOnce(mockResultGetDocs);
    vi.spyOn(mapDataModule, "getRulesetTypeWithQueryDocumentSnapshot").mockReturnValueOnce(mockResultMapOnce);
    vi.spyOn(mapDataModule, "getRulesetTypeWithQueryDocumentSnapshot").mockReturnValueOnce(mockResultMapSecond);

    const res = await getAllRulesets();

    expect(res).toEqual(expectResult);
  });
});

describe("getRulesetById", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return a RulesetType based on its id", async () => {
    const mockResultGetDoc = {
      exists: () => true
    } as unknown as firestoreModule.DocumentSnapshot<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultMap: RulesetType = {
      id: "aezkld&^p",
      name: "mtg",
      isDraft: false,
      isPublic: true,
      createdBy: "created by"
    };

    const expectResult: RulesetType = mockResultMap;

    vi.spyOn(firestoreModule, "getDoc").mockResolvedValueOnce(mockResultGetDoc);
    vi.spyOn(mapDataModule, "getRulesetTypeWithQueryDocumentSnapshot").mockReturnValueOnce(mockResultMap);

    const res = await getRulesetById("aezkld&^p");

    expect(res).toEqual(expectResult);
  });

  it("should throw an error when a ruleset isn't found based on its id", async () => {
    const mockResultGetDoc = {
      exists: () => false
    } as unknown as firestoreModule.DocumentSnapshot<firestoreModule.DocumentData, firestoreModule.DocumentData>;

    vi.spyOn(firestoreModule, "getDoc").mockResolvedValueOnce(mockResultGetDoc);

    try {
      await getRulesetById("aezkld&^p");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});

describe("getRulesetsByIds", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return an array of RulesetType based on their id", async () => {
    const mockResultQuery = {} as unknown as firestoreModule.Query<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultGetDocs = [{}, {}] as unknown as firestoreModule.QuerySnapshot<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultMapOnce: RulesetType = {
      id: "aezkld&^p",
      name: "mtg",
      isDraft: false,
      isPublic: true,
      createdBy: "created by"
    };
    const mockResultMapSecond: RulesetType = {
      id: "zaeqdzaq&^p",
      name: "pokemon",
      isDraft: false,
      isPublic: true,
      createdBy: "created by"
    };

    const expectResult: RulesetType[] = [mockResultMapOnce, mockResultMapSecond];

    vi.spyOn(firestoreModule, "query").mockReturnValueOnce(mockResultQuery);
    vi.spyOn(firestoreModule, "getDocs").mockResolvedValueOnce(mockResultGetDocs);
    vi.spyOn(mapDataModule, "getRulesetTypeWithQueryDocumentSnapshot").mockReturnValueOnce(mockResultMapOnce);
    vi.spyOn(mapDataModule, "getRulesetTypeWithQueryDocumentSnapshot").mockReturnValueOnce(mockResultMapSecond);

    const res = await getRulesetsByIds(["aezkld&^p", "zaeqdzaq&^p"]);

    expect(res).toEqual(expectResult);
  });
});
