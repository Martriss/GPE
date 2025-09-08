import type { PositionAction, Right } from "$lib/interfaces/ZoneType";
import type ZoneType from "$lib/interfaces/ZoneType";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as firestoreModule from 'firebase/firestore';
import { addZoneToRuleset } from "./zoneService";

vi.mock('firebase/firestore', { spy: true });

describe("addZoneToRuleset", () => {
  const fakeRight: Right = {
    enabled: false,
    allowedFor: "specific",
    allowedToPlayers: []
  };
  const fakePositionAction: PositionAction = {
    atStart: fakeRight,
    atEnd: fakeRight,
    anywhere: fakeRight,
    random: fakeRight
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return the id of the newly added document", async () => {
    const mockZone: ZoneType = {
      name: "my zone",
      height: -1,
      width: -1,
      coordinates: {
        x: -1,
        y: -1,
        z: -1
      },
      backgroundColor: "rgba(255, 0, 0, 1)",
      owners: [],
      cards: [],
      initializationConfig: {
        cardSelectingConfigs: [],
        cardFacePattern: ""
      },
      displayConfig: {
        mode: "free",
        cardFacePattern: "",
        areCardsVisible: true,
        hasSleeve: false
      },
      actions: {
        addCard: fakePositionAction,
        removeCard: fakePositionAction,
        flipCard: {
          faceUp: fakeRight,
          faceDown: fakeRight
        },
        rotateCard: { ...fakeRight, allowedAngles: [] },
        shuffleAllCards: fakeRight,
        searchCards: {
          all: fakeRight,
          xCards: fakePositionAction
        }
      }
    };
    const mockRulesetId: string = "azeA1MlASDQAq";

    const expectResult: string = "ajzeldkazd&aed";

    const spyOn = vi.spyOn(firestoreModule, "addDoc").mockResolvedValueOnce({ id: "ajzeldkazd&aed" } as unknown as firestoreModule.DocumentReference<firestoreModule.DocumentData, firestoreModule.DocumentData>);

    const res = await addZoneToRuleset(mockZone, mockRulesetId);

    expect(res).toBe(expectResult);
  });
});
