import type CardType from "./CardType";
import type CardTypeType from "./CardTypeType";
import type { PlayerType } from "./PlayerType";
import type ZoneType from "./ZoneType";

export default interface RulesetType {
  id: string;
  name: string;
  description?: string;
  isDraft: boolean;
  isPublic: boolean;
  createdBy: string;
  cards?: CardType[];
  cardTypes?: CardTypeType[];
  players?: PlayerType[];
  zones?: ZoneType[];
}
