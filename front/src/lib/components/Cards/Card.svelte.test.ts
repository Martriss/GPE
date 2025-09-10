import type CardType from "$lib/interfaces/CardType";
import { render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import Card from "./Card.svelte";
import userEvent from "@testing-library/user-event";

describe('Card', () => {
  const cardOnlyFrontFace: CardType = {
    id: "02DVr3je4OhSe0gIw64R",
    rulesetId: "zhPZBo2kuOXpxdXMuXwk",
    name: "Marrow-Gnawer",
    nameLower: "marrow-gnawer",
    front: {
      cardTypeId: "09IbEkMadT6nTbUAEDzO",
      skin: "https://cards.scryfall.io/normal/front/0/7/073a04e9-7c18-469d-ac3b-941eb50a6f01.jpg?1722384767",
      properties: []
    }
  };

  it('should render the card without a delete button when onDelete is not provided', () => {
    const givenProps = {
      card: cardOnlyFrontFace,
      imageUrl: 'https://cards.scryfall.io/normal/front/0/7/073a04e9-7c18-469d-ac3b-941eb50a6f01.jpg?1722384767'
    };
    render(Card, givenProps);

    const img = screen.getByRole('img');
    const deleteButton = screen.queryByRole('button');

    expect(img).toBeInTheDocument();
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('should render the delete button when onDelete is provided', () => {
    const givenProps = {
      card: cardOnlyFrontFace,
      imageUrl: cardOnlyFrontFace.front.skin,
      onDelete: vi.fn()
    };
    render(Card, givenProps);

    const img = screen.getByRole('img');
    const deleteButton = screen.getByRole('button');

    expect(img).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when the delete button is clicked', async () => {
    const user = userEvent.setup();

    const onDelete = vi.fn();
    const givenProps = {
      card: cardOnlyFrontFace,
      imageUrl: cardOnlyFrontFace.front.skin,
      onDelete
    };
    render(Card, givenProps);

    const deleteButton = screen.getByRole('button');

    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('should set aria-label to "supprimer" on the delete button', () => {
    const givenProps = {
      card: cardOnlyFrontFace,
      imageUrl: cardOnlyFrontFace.front.skin,
      onDelete: vi.fn()
    };
    render(Card, givenProps);

    const deleteButton = screen.getByRole('button');

    expect(deleteButton).toHaveAttribute('aria-label', 'supprimer');
  });

  it('should set the correct alt test for the image', () => {
    const givenProps = {
      card: cardOnlyFrontFace,
      imageUrl: cardOnlyFrontFace.front.skin
    };
    const expectAltValue = `image de la carte ${cardOnlyFrontFace.name}`
    render(Card, givenProps);

    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('alt', expectAltValue);
  });
});
