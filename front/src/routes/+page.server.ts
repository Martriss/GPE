import { logout } from "$lib/firebase/auth";
import type ZoneType from "$lib/interfaces/ZoneType";
import { addZoneToRuleset } from "$lib/server/services/zoneService";
import type { Actions } from "./$types";

export const actions = {
  createZones: async () => {
    const data: ZoneType = {
      "name": "hand",
      "height": -1,
      "width": -1,
      "coordinates": {
        "x": -1,
        "y": -1,
        "z": 2
      },
      "backgroundColor": "trouver une couleur",
      "owners": [
        "lea"
      ],
      "cards": [],
      "initializationConfig": {
        "cardSelectingConfigs": [
          {
            "nbCardsByOwner": "7 cartes",
            "isRandom": true,
            "chosenBy": ""
          }
        ],
        "cardFacePattern": "F"
      },
      "displayConfig": {
        "mode": "list",
        "cardFacePattern": "F",
        "areCardsVisible": false,
        "hasSleeve": false
      },
      "actions": {
        "addCard": {
          "atStart": {
            "enabled": true,
            "allowedFor": "everyone",
            "allowedToPlayers": []
          },
          "atEnd": {
            "enabled": true,
            "allowedFor": "everyone",
            "allowedToPlayers": []
          },
          "anywhere": {
            "enabled": true,
            "allowedFor": "everyone",
            "allowedToPlayers": []
          },
          "random": {
            "enabled": true,
            "allowedFor": "everyone",
            "allowedToPlayers": []
          }
        },
        "removeCard": {
          "atStart": {
            "enabled": true,
            "allowedFor": "everyone",
            "allowedToPlayers": []
          },
          "atEnd": {
            "enabled": true,
            "allowedFor": "everyone",
            "allowedToPlayers": []
          },
          "anywhere": {
            "enabled": true,
            "allowedFor": "everyone",
            "allowedToPlayers": []
          },
          "random": {
            "enabled": true,
            "allowedFor": "everyone",
            "allowedToPlayers": []
          }
        },
        "flipCard": {
          "faceUp": {
            "enabled": true,
            "allowedFor": "ownerOnly",
            "allowedToPlayers": []
          },
          "faceDown": {
            "enabled": true,
            "allowedFor": "ownerOnly",
            "allowedToPlayers": []
          }
        },
        "rotateCard": {
          "enabled": true,
          "allowedFor": "ownerOnly",
          "allowedToPlayers": [],
          "allowedAngles": [
            90
          ]
        },
        "shuffleAllCards": {
          "enabled": true,
          "allowedFor": "ownerOnly",
          "allowedToPlayers": []
        },
        "searchCards": {
          "all": {
            "enabled": true,
            "allowedFor": "everyone",
            "allowedToPlayers": []
          },
          "xCards": {
            "atStart": {
              "enabled": true,
              "allowedFor": "everyone",
              "allowedToPlayers": []
            },
            "atEnd": {
              "enabled": true,
              "allowedFor": "everyone",
              "allowedToPlayers": []
            },
            "anywhere": {
              "enabled": true,
              "allowedFor": "everyone",
              "allowedToPlayers": []
            },
            "random": {
              "enabled": true,
              "allowedFor": "everyone",
              "allowedToPlayers": []
            }
          }
        }
      }
    };

    try {
      await addZoneToRuleset(data, 'zhPZBo2kuOXpxdXMuXwk');
      console.log("I'm Here !");
    } catch (err) {
      console.error(err);
    }
  },
  logout: async ({ cookies }) => {
    await logout(cookies);
  }
} satisfies Actions;
