import type DeckType from "$lib/interfaces/DeckType";
import { render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import Deck from "./Deck.svelte";
import userEvent from "@testing-library/user-event";

describe(Deck.name, () => {
  it("should render the deck with name, description", () => {
    const deckGiven: DeckType = {
      id: "RANDOMID",
      name: "My super deck",
      description: "my best deck to beat my friends",
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

  it("should render 3 buttons when onDelete props isn't given", () => {
    const givenProps = {
      deck: {
        id: "RANDOMID",
        name: "My super deck",
        description: "my best deck to beat my friends",
        isPublic: false,
        isShared: false,
        userId: "RANDOMID",
        rulesetId: "RANDOMID",
        cards: []
      }
    };
    render(Deck, givenProps);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(3);
  });

  it("should render 4 buttons when onDelete props is given", () => {
    const givenProps = {
      deck: {
        id: "RANDOMID",
        name: "My super deck",
        description: "my best deck to beat my friends",
        isPublic: false,
        isShared: false,
        userId: "RANDOMID",
        rulesetId: "RANDOMID",
        cards: []
      },
      onDelete: vi.fn()
    };
    render(Deck, givenProps);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(4);
  });

  it("should call onDelete when the delete button is clicked", async () => {
    const user = userEvent.setup();

    const onDelete = vi.fn();
    const givenProps = {
      deck: {
        id: "RANDOMID",
        name: "My super deck",
        description: "my best deck to beat my friends",
        isPublic: false,
        isShared: false,
        userId: "RANDOMID",
        rulesetId: "RANDOMID",
        cards: []
      },
      onDelete
    };
    render(Deck, givenProps);

    const deleteButton = screen.getByRole("button", { name: "supprimer definitivement" });

    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("should have a button 'voir' when onDelete props isn't given", () => {
    const givenProps = {
      deck: {
        id: "RANDOMID",
        name: "My super deck",
        description: "my best deck to beat my friends",
        isPublic: false,
        isShared: false,
        userId: "RANDOMID",
        rulesetId: "RANDOMID",
        cards: []
      }
    };
    render(Deck, givenProps);

    const seeButton = screen.getByRole("button", { name: "voir" });
    const eyeIcon = screen.getByTestId("eye-icon");

    expect(seeButton).toContainElement(eyeIcon);
  });

  it("should have a button 'modifier' when onDelete props is given", () => {
    const givenProps = {
      deck: {
        id: "RANDOMID",
        name: "My super deck",
        description: "my best deck to beat my friends",
        isPublic: false,
        isShared: false,
        userId: "RANDOMID",
        rulesetId: "RANDOMID",
        cards: []
      },
      onDelete: vi.fn()
    };
    render(Deck, givenProps);

    const updateButton = screen.getByRole("button", { name: "modifier" });
    const squarePenIcon = screen.getByTestId("square-pen-icon");

    expect(updateButton).toContainElement(squarePenIcon);
  });

  it("should render 'dupliquer' button disabled when onDelete props isn't given", () => {
    const givenProps = {
      deck: {
        id: "RANDOMID",
        name: "My super deck",
        description: "my best deck to beat my friends",
        isPublic: false,
        isShared: false,
        userId: "RANDOMID",
        rulesetId: "RANDOMID",
        cards: []
      }
    };
    render(Deck, givenProps);

    const button = screen.getByRole("button", { name: "dupliquer" });

    expect(button).toBeDisabled();
  });

  it("should render 'dupliquer' button disabled when onDelete props is given", () => {
    const givenProps = {
      deck: {
        id: "RANDOMID",
        name: "My super deck",
        description: "my best deck to beat my friends",
        isPublic: false,
        isShared: false,
        userId: "RANDOMID",
        rulesetId: "RANDOMID",
        cards: []
      },
      onDelete: vi.fn()
    };
    render(Deck, givenProps);

    const button = screen.getByRole("button", { name: "dupliquer" });

    expect(button).toBeDisabled();
  });

  it("should render 'partager' button disabled when the deck is not shareable", () => {
    const givenProps = {
      deck: {
        id: "RANDOMID",
        name: "My super deck",
        description: "my best deck to beat my friends",
        isPublic: false,
        isShared: false,
        userId: "RANDOMID",
        rulesetId: "RANDOMID",
        cards: []
      }
    };
    render(Deck, givenProps);

    const button = screen.getByRole("button", { name: "partager" });
    const dialog = screen.queryByTestId("modal");

    expect(button).toBeDisabled();
    expect(dialog).not.toBeInTheDocument();
  });

  it("should render a dialog when 'partager' button is enabled with deck is Public true", () => {
    const givenProps = {
      deck: {
        id: "RANDOMID",
        name: "My super deck",
        description: "my best deck to beat my friends",
        isPublic: true,
        isShared: false,
        userId: "RANDOMID",
        rulesetId: "RANDOMID",
        cards: []
      }
    };
    render(Deck, givenProps);

    const button = screen.getByRole("button", { name: "partager" });
    const dialog = screen.getByTestId("modal");

    expect(button).not.toBeDisabled();
    expect(dialog).toBeInTheDocument();
  });

  it("should render a dialog when 'partager' button is enabled with deck isShared true", () => {
    const givenProps = {
      deck: {
        id: "RANDOMID",
        name: "My super deck",
        description: "my best deck to beat my friends",
        isPublic: false,
        isShared: true,
        userId: "RANDOMID",
        rulesetId: "RANDOMID",
        cards: []
      }
    };
    render(Deck, givenProps);

    const button = screen.getByRole("button", { name: "partager" });
    const dialog = screen.getByTestId("modal");

    expect(button).not.toBeDisabled();
    expect(dialog).toBeInTheDocument();
  });
});
