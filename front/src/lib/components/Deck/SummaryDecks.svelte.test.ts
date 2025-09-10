import { describe, expect, it } from "vitest";
import SummaryDecks from "./SummaryDecks.svelte";
import { render, screen } from "@testing-library/svelte";
import type DeckType from "$lib/interfaces/DeckType";


describe(SummaryDecks.name, () => {
  const mockDeckType1: DeckType = {
    id: "RANDOMID1",
    name: "My super deck",
    description: "my best deck to beat my friends",
    isPublic: false,
    isShared: false,
    userId: "RANDOMID",
    rulesetId: "RANDOMID",
    cards: []
  };

  const mockDeckType2: DeckType = {
    id: "RANDOMID2",
    name: "My super deck",
    description: "my best deck to beat my friends",
    isPublic: false,
    isShared: false,
    userId: "RANDOMID",
    rulesetId: "RANDOMID",
    cards: []
  }

  it("should render a game name", () => {
    const givenProps = {
      gameName: "Magic The Gathering",
      decks: []
    };
    render(SummaryDecks, givenProps);

    const gameName = screen.getByText("Magic The Gathering");

    expect(gameName).toBeInTheDocument();
  });

  it("should render the total of number of deck", () => {
    const givenProps = {
      gameName: "Magic The Gathering",
      decks: [mockDeckType1, mockDeckType2]
    };
    render(SummaryDecks, givenProps);

    const nbDecks = screen.getByText("nombre de decks : 2");

    expect(nbDecks).toBeInTheDocument();
  });

  it("should render a button to change the vue and be disabled", () => {
    const givenProps = {
      gameName: "Magic The Gathering",
      decks: []
    };
    render(SummaryDecks, givenProps);

    const button = screen.getByRole("button", { name: "changer la vue de la liste" });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("should render 0 Decks", () => {
    const givenProps = {
      gameName: "Magic The Gathering",
      decks: []
    };
    render(SummaryDecks, givenProps);

    const decks = screen.queryAllByTestId("deck");

    expect(decks).toHaveLength(0);
  });

  it("should render 2 Decks", () => {
    const givenProps = {
      gameName: "Magic The Gathering",
      decks: [mockDeckType1, mockDeckType2]
    };
    render(SummaryDecks, givenProps);

    const decks = screen.queryAllByTestId("deck");

    expect(decks).toHaveLength(2);
  });

  it("should render a dialog when decks props isn't empty", () => {
    const givenProps = {
      gameName: "Magic The Gathering",
      decks: [mockDeckType1, mockDeckType2]
    };
    render(SummaryDecks, givenProps);

    const dialog = screen.getByTestId("modal");

    expect(dialog).toBeInTheDocument();
  });

  it("should not render a dialog when decks props is empty", () => {
    const givenProps = {
      gameName: "Magic The Gathering",
      decks: []
    };
    render(SummaryDecks, givenProps);

    const dialog = screen.queryByTestId("modal");

    expect(dialog).not.toBeInTheDocument();
  });
});
