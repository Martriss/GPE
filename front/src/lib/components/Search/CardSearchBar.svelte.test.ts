import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CardSearchBar from "./CardSearchBar.svelte";
import { render, screen } from '@testing-library/svelte';

describe(CardSearchBar.name, () => {
  beforeEach(() => {
    vi.useFakeTimers();

    const fakeCards = [
      { id: '1', name: 'Card 1', imageUrl: '' },
      { id: '2', name: 'Card 2', imageUrl: '' },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cards: fakeCards }),
      } as Response)
    );
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it("should render an input", () => {
    const givenProps = {
      rulesetId: "sddKAdl3ms1qdqps14k"
    };
    render(CardSearchBar, givenProps);

    const input = screen.getByRole("combobox");

    expect(input).toBeInTheDocument();
  });

  it("should render default placehoder when placeholder props isn't given", () => {
    const givenProps = {
      rulesetId: "sddKAdl3ms1qdqps14k"
    };
    render(CardSearchBar, givenProps);

    const input = screen.getByRole("combobox");

    expect(input).toHaveAttribute("placeholder", "Rechercher une carte...");
  });

  it("should have a correct placeholder when placeholder props is given", () => {
    const givenProps = {
      rulesetId: "sddKAdl3ms1qdqps14k",
      placeholder: "my placeholder"
    };
    render(CardSearchBar, givenProps);

    const input = screen.getByRole("combobox");

    expect(input).toHaveAttribute("placeholder", "my placeholder");
  });
});
