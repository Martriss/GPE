export default interface DeckType {
  id?: string; // Expect an uuid
  name: string;
  description?: string;
  isPublic: boolean;
  isShared: boolean;
  userId: string; // Refer to a user, expect an uuid.
  ruleSetId: string; // Refer to a ruleset, expect an uuid.
  cards: string[];
}
