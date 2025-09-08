import { afterEach, describe, expect, it, vi } from "vitest";
import { createUserDeck, deleteDeckById, findDeckById, getDecksByUserBrut, getDecksByUserSortByGame, updateCardsInDeck } from "./deckService";
import * as firestoreModule from 'firebase/firestore';
import * as mapDataModule from "../utils/mapData";
import * as rulesetServiceModule from "./rulesetService";
import type DeckType from "$lib/interfaces/DeckType";
import type RulesetType from "$lib/interfaces/RulesetType";
import type { DecksByGame } from "$lib/interfaces/DeckType";

vi.mock('firebase/firestore', { spy: true });
vi.mock('../utils/mapData', { spy: true });
vi.mock('./rulesetService', { spy: true })

describe("createUserDeck", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return the id of the newly added document", async () => {
    const deck: DeckType = {
      name: "my name",
      isPublic: false,
      isShared: false,
      userId: "aek&oihjsq&134",
      rulesetId: "aezkld&^p",
      cards: []
    };

    const mockResultAddDoc = { id: "zkaelk&q&op,j" } as unknown as firestoreModule.DocumentReference<firestoreModule.DocumentData, firestoreModule.DocumentData>;

    const expectResult: string = "zkaelk&q&op,j";

    vi.spyOn(firestoreModule, "addDoc").mockResolvedValueOnce(mockResultAddDoc);

    const res = await createUserDeck(deck);

    expect(res).toBe(expectResult);
  });
});

describe("deleteDeckById", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call deleteDoc", async () => {
    const spyOn = vi.spyOn(firestoreModule, "deleteDoc").mockResolvedValueOnce();

    await deleteDeckById("kj&eaj&pojd12");

    expect(spyOn).toHaveBeenCalledOnce();
  });
});

describe("findDeckById", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return a DeckType based on its id", async () => {
    const mockResultGetDoc = {
      exists: () => true
    } as unknown as firestoreModule.DocumentSnapshot<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultMap: DeckType = {
      id: "zkaelk&q&op,j",
      name: "my name",
      isPublic: false,
      isShared: false,
      userId: "aek&oihjsq&134",
      rulesetId: "aezkld&^p",
      cards: []
    };

    const expectResult: DeckType = mockResultMap;

    vi.spyOn(firestoreModule, "getDoc").mockResolvedValueOnce(mockResultGetDoc);
    vi.spyOn(mapDataModule, "getDeckTypeWithQueryDocumentSnapshot").mockReturnValueOnce(mockResultMap);

    const res = await findDeckById("zkaelk&q&op,j");

    expect(res).toEqual(expectResult);
  });

  it("should return null when no Deck was found", async () => {
    const mockResultGetDoc = {
      exists: () => false
    } as unknown as firestoreModule.DocumentSnapshot<firestoreModule.DocumentData, firestoreModule.DocumentData>;

    const expectResult: null = null;

    vi.spyOn(firestoreModule, "getDoc").mockResolvedValueOnce(mockResultGetDoc);

    const res = await findDeckById("zkaelk&q&op,j");

    expect(res).toEqual(expectResult);
  });

  it("should throw an error when getDoc failed", async () => {
    vi.spyOn(firestoreModule, "getDoc").mockImplementationOnce(() => {
      throw new Error("Something got wrong");
    });

    try {
      await findDeckById("zkaelk&q&op,j");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});

describe("getDecksByUserBrut", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return an array of DeckType based on one userId", async () => {
    const mockResultQuery = {} as unknown as firestoreModule.Query<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultGetDocs = [{}, {}] as unknown as firestoreModule.QuerySnapshot<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultMapOnce: DeckType = {
      id: "zkaelk&q&op,j",
      name: "my name1",
      isPublic: false,
      isShared: false,
      userId: "aek&oihjsq&134",
      rulesetId: "aezkld&^p",
      cards: []
    };
    const mockResultMapSecond: DeckType = {
      id: "AZZKLadkl1aza",
      name: "my name2",
      isPublic: false,
      isShared: false,
      userId: "aek&oihjsq&134",
      rulesetId: "lapozkdé&",
      cards: []
    };

    const expectResult = [mockResultMapOnce, mockResultMapSecond];

    vi.spyOn(firestoreModule, "query").mockReturnValueOnce(mockResultQuery);
    vi.spyOn(firestoreModule, "getDocs").mockResolvedValueOnce(mockResultGetDocs);
    vi.spyOn(mapDataModule, "getDeckTypeWithQueryDocumentSnapshot").mockReturnValueOnce(mockResultMapOnce);
    vi.spyOn(mapDataModule, "getDeckTypeWithQueryDocumentSnapshot").mockReturnValueOnce(mockResultMapSecond);

    const res = await getDecksByUserBrut("aek&oihjsq&134");

    expect(res).toEqual(expectResult);
  });
});

describe("getDecksByUserSortByGame", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return an array of DecksByGame based on one userId", async () => {
    const mockResultQuery = {} as unknown as firestoreModule.Query<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultGetDocs = [
      {
        data: () => ({
          rulesetId: "aezkld&^p"
        })
      },
      {
        data: () => ({
          rulesetId: "aezkld&^p"
        })
      }
    ] as unknown as firestoreModule.QuerySnapshot<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultMapOnce: DeckType = {
      id: "zkaelk&q&op,j",
      name: "my name1",
      isPublic: false,
      isShared: false,
      userId: "aek&oihjsq&134",
      rulesetId: "aezkld&^p",
      cards: []
    };
    const mockResultMapSecond: DeckType = {
      id: "AZZKLadkl1aza",
      name: "my name2",
      isPublic: false,
      isShared: false,
      userId: "aek&oihjsq&134",
      rulesetId: "aezkld&^p",
      cards: []
    };
    const mockResultRulesetsByIds: RulesetType[] = [
      {
        id: "aezkld&^p",
        name: "mtg",
        isDraft: false,
        isPublic: true,
        createdBy: "created by"
      }
    ];

    const expectResult: DecksByGame[] = [
      {
        gameName: "mtg",
        decks: [mockResultMapOnce, mockResultMapSecond]
      }
    ];

    vi.spyOn(firestoreModule, "query").mockReturnValueOnce(mockResultQuery);
    vi.spyOn(firestoreModule, "getDocs").mockResolvedValueOnce(mockResultGetDocs);
    vi.spyOn(mapDataModule, "getDeckTypeWithQueryDocumentSnapshot").mockReturnValueOnce(mockResultMapOnce);
    vi.spyOn(mapDataModule, "getDeckTypeWithQueryDocumentSnapshot").mockReturnValueOnce(mockResultMapSecond);
    vi.spyOn(rulesetServiceModule, "getRulesetsByIds").mockResolvedValueOnce(mockResultRulesetsByIds);

    const res = await getDecksByUserSortByGame("aek&oihjsq&134");

    expect(res).toEqual(expectResult);
  });
});

describe("updateCardsInDeck", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call updateDoc", async () => {
    const deck: DeckType = {
      id: "zkaelk&q&op,j",
      name: "my name1",
      isPublic: false,
      isShared: false,
      userId: "aek&oihjsq&134",
      rulesetId: "aezkld&^p",
      cards: []
    };

    const spyOn = vi.spyOn(firestoreModule, "updateDoc").mockResolvedValueOnce();

    await updateCardsInDeck(deck);

    expect(spyOn).toHaveBeenCalledOnce();
  });

  it("should throw an error when id is missing in the deck given", async () => {
    const deck: DeckType = {
      name: "my name1",
      isPublic: false,
      isShared: false,
      userId: "aek&oihjsq&134",
      rulesetId: "aezkld&^p",
      cards: []
    };

    try {
      await updateCardsInDeck(deck);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});
