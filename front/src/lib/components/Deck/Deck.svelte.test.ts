import type DeckType from "$lib/interfaces/DeckType";
import { render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import Deck from "./Deck.svelte";

vi.mock('../Modal/CopyClipboardModal.svelte', () => {
  return {
    default: () => {
      return {
        $$render: () => '<div data-testid="mock-copy-modal"></div>'
      }
    }
  }
})

describe('Deck', () => {
  it('should render the deck with name and description', () => {
    const deckGiven: DeckType = {
      id: "RANDOMID",
      name: "My super deck",
      description: "my best to beat my friends",
      isPublic: false,
      isShared: false,
      userId: "RANDOMID",
      rulesetId: "RANDOMID",
      cards: []
    };
    const givenProps = { deck: deckGiven }

    render(Deck, givenProps);

    const title = screen.getByText(deckGiven.name);
    const description = screen.getByText(deckGiven.description ?? '');

    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('should ', () => {

  });
});
