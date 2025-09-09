import type { InteractiveListItem } from "$lib/interfaces/InteractiveListType";
import type { PlayerType } from "$lib/interfaces/PlayerType";

/**
 * Pour extraire la key d'identifiant d'un joueur
 * @param player joueur dont l'on veut connaitre la clef d'identifiant
 * @returns la key
 */
export function extractKeyIdentityPlayer(player: PlayerType): string {
  const knowProperty: string[] = ["minSizeDeck", "maxSizeDeck", "lifePoint"];
  const keys: string[] = Object.keys(player);
  let keyToFind: string = "";
  // en théorie il n'y a qu'une seule clef que l'on ne connait pas à l'avance dans PlayerType

  for (let i = 0; i < keys.length; i++) {
    if (!knowProperty.includes(keys[i]))
      keyToFind = keys[i];
  }

  if (keyToFind === "")
    throw new Error("Aucune clef n'a été trouvé");

  return keyToFind;
}

export function extractPlayersFromInteractiveListItem(items: InteractiveListItem[], base: PlayerType[]): PlayerType[] {
  if (items.length > base.length) {
    throw new Error("Impossible d'extraire les joueurs depuis les items. Les items sont plus nombreux que le nombre de joueurs demandé");
  }

  let extracts: PlayerType[] = base;
  let j: number = 0;

  for (let i = 0; i < items.length; i++) {
    const playerNameBeingProcessed: string = items[i].key;

    for (j; j < base.length; j++) {
      const keyIdentity: string = extractKeyIdentityPlayer(base[j]);
      if (base[j][keyIdentity] === playerNameBeingProcessed) {
        j++;
        break;
      }
      if (base[j][keyIdentity] === "") {
        const copyPlayer: PlayerType = base[j];
        copyPlayer[keyIdentity] = playerNameBeingProcessed;
        extracts[j] = copyPlayer;
        j++;
        break;
      }
    }
  }

  while (j < base.length) {
    const keyIdentity: string = extractKeyIdentityPlayer(base[j]);
    const copyPlayer: PlayerType = base[j];
    copyPlayer[keyIdentity] = "";
    extracts[j] = copyPlayer;

    j++;
  }

  return extracts;
}

/**
 * Pour extraire la valeur de l'identifiant d'un joueur
 * @param player joueur dont l'on veut connaitre la valeur à la clef d'identifiant
 * @returns la valeur
 */
export function extractValueIdentityPlayer(player: PlayerType): string {
  const key = extractKeyIdentityPlayer(player);

  return player[key];
}

export function extractValueFromInteractiveListItem(items: InteractiveListItem[]): string[] {
  const extract: string[] = [];

  for (let i = 0; i < items.length; i++) {
    extract.push(items[i].key)
  }

  return extract;
}
