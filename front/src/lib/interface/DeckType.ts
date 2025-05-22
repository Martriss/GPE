export default interface DeckType {
  id?: string; // Expect an id like an uuid
  name: string;
  description?: string;
  isPublic: boolean;
  isShared: boolean;
  userId: string; // Refer to a user, expect an id like an uuid
  rulesetId: string; // Refer to a ruleset, expect an id like an uuid
  cards: string[];
}
