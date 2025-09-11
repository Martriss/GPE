import type DeckType from "./DeckType";
import type RulesetType from "./RulesetType";

export default interface GameType {
  id?: string;
  roomName: string;
  roomOwner: string;
  code: string;
  isPlaying: boolean;
  ruleset: SubRulesetTypeForGame;
  decks: SubDeckTypeForGame[];
  viewers: string[];
}

// Pour rendre les champs players et zones obligatoire dans un ruleset
export type SubRulesetTypeForGame = Omit<RulesetType, "players" | "zones"> &
  Required<Pick<RulesetType, "players" | "zones">>;

export interface SubDeckTypeForGame extends DeckType {
  playerId: string;
}
