import { describe, expect, it, vi } from "vitest";
import * as firestoreModule from 'firebase/firestore';
import * as countsModule from '$lib/utils/counts';
import type CardType from "$lib/interfaces/CardType";
import { getCardsById, searchCardsByName } from "./cardService";

vi.mock('firebase/firestore', { spy: true });
vi.mock('$lib/utils/counts', { spy: true });

describe("searchCardsByName", () => {
  it("should return an empty array when searchTerm is falsy", async () => {
    const expectResult: CardType[] = [];

    const res = await searchCardsByName("alkj,dlkn&", "");

    expect(res).toEqual(expectResult);
  });

  it("should return an empty array when searchTerm contains fewer than 2 characters ", async () => {
    const expectResult: CardType[] = [];

    const res = await searchCardsByName("alkj,dlkn&", "s");

    expect(res).toEqual(expectResult);
  });

  it("should throw an error when collection failed", async () => {
    vi.spyOn(firestoreModule, "collection").mockImplementationOnce(() => {
      throw new Error("Someting get wrong !");
    });

    try {
      await searchCardsByName("alkj,dlkn&", "so");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it("should throw an error when query failed", async () => {
    const mockResultCollection = {} as unknown as firestoreModule.CollectionReference<firestoreModule.DocumentData, firestoreModule.DocumentData>;

    vi.spyOn(firestoreModule, "collection").mockReturnValueOnce(mockResultCollection);
    vi.spyOn(firestoreModule, "query").mockImplementationOnce(() => {
      throw new Error("Someting get wrong !");
    })

    try {
      await searchCardsByName("alkj,dlkn&", "so");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it("should throw an error when getDocs failed", async () => {
    const mockResultCollection = {} as unknown as firestoreModule.CollectionReference<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultQuery = {} as unknown as firestoreModule.Query<firestoreModule.DocumentData, firestoreModule.DocumentData>

    vi.spyOn(firestoreModule, "collection").mockReturnValueOnce(mockResultCollection);
    vi.spyOn(firestoreModule, "query").mockReturnValueOnce(mockResultQuery);
    vi.spyOn(firestoreModule, "getDocs").mockImplementationOnce(() => {
      throw new Error("Someting get wrong !");
    });

    try {
      await searchCardsByName("alkj,dlkn&", "so");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it("should return an array of CardType", async () => {
    const mockResultCollection = {} as unknown as firestoreModule.CollectionReference<firestoreModule.DocumentData, firestoreModule.DocumentData>;
    const mockResultQuery = {} as unknown as firestoreModule.Query<firestoreModule.DocumentData, firestoreModule.DocumentData>
    const mockResultGetDocs = [
      {
        id: "zajedlka,z&",
        data: () => ({
          rulesetId: "alkj,dlkn&",
          name: "my name1",
          nameLower: "my name1",
          front: {
            cardTypeId: "mlskdlka&12",
            skin: "my skin1",
            properties: []
          }
        })
      },
      {
        id: "dfk,nkl,&d",
        data: () => ({
          rulesetId: "alkj,dlkn&",
          name: "my name2",
          nameLower: "my name2",
          front: {
            cardTypeId: "mlskdlka&12",
            skin: "my skin2",
            properties: []
          }
        })
      }
    ] as unknown as firestoreModule.QuerySnapshot<firestoreModule.DocumentData, firestoreModule.DocumentData>;

    const expectResult: CardType[] = [
      {
        id: "zajedlka,z&",
        rulesetId: "alkj,dlkn&",
        name: "my name1",
        nameLower: "my name1",
        front: {
          cardTypeId: "mlskdlka&12",
          skin: "my skin1",
          properties: []
        }
      },
      {
        id: "dfk,nkl,&d",
        rulesetId: "alkj,dlkn&",
        name: "my name2",
        nameLower: "my name2",
        front: {
          cardTypeId: "mlskdlka&12",
          skin: "my skin2",
          properties: []
        }
      }
    ];

    vi.spyOn(firestoreModule, "collection").mockReturnValueOnce(mockResultCollection);
    vi.spyOn(firestoreModule, "query").mockReturnValueOnce(mockResultQuery);
    vi.spyOn(firestoreModule, "getDocs").mockResolvedValueOnce(mockResultGetDocs);

    const res = await searchCardsByName("alkj,dlkn&", "so");

    expect(res).toEqual(expectResult);
  });
});

describe("getCardsById", () => {
  it("should return an array of CardType based on their id and the rulesetId", async () => {
    const mockResultGetOccurrences: Map<string, number> = new Map([['zajedlka,z&', 1], ["dfk,nkl,&d", 1]]);
    const mockResultGetDocs = {
      docs: [
        {
          id: "zajedlka,z&",
          data: () => ({
            rulesetId: "alkj,dlkn&",
            name: "my name1",
            nameLower: "my name1",
            front: {
              cardTypeId: "mlskdlka&12",
              skin: "my skin1",
              properties: []
            }
          })
        },
        {
          id: "dfk,nkl,&d",
          data: () => ({
            rulesetId: "alkj,dlkn&",
            name: "my name2",
            nameLower: "my name2",
            front: {
              cardTypeId: "mlskdlka&12",
              skin: "my skin2",
              properties: []
            }
          })
        }
      ]
    } as unknown as firestoreModule.QuerySnapshot<firestoreModule.DocumentData, firestoreModule.DocumentData>;

    const expectResult: CardType[] = [
      {
        id: "zajedlka,z&",
        rulesetId: "alkj,dlkn&",
        name: "my name1",
        nameLower: "my name1",
        front: {
          cardTypeId: "mlskdlka&12",
          skin: "my skin1",
          properties: []
        }
      },
      {
        id: "dfk,nkl,&d",
        rulesetId: "alkj,dlkn&",
        name: "my name2",
        nameLower: "my name2",
        front: {
          cardTypeId: "mlskdlka&12",
          skin: "my skin2",
          properties: []
        }
      }
    ];

    vi.spyOn(countsModule, "getOccurrences").mockReturnValueOnce(mockResultGetOccurrences);
    vi.spyOn(firestoreModule, "getDocs").mockResolvedValueOnce(mockResultGetDocs);

    const res = await getCardsById("alkj,dlkn&", ["zajedlka,z&", "dfk,nkl,&d"]);

    expect(res).toEqual(expectResult);
  });
});
