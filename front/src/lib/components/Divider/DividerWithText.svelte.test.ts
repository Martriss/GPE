import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import DividerWithText from "./DividerWithText.svelte";

describe('DividerWithTextProps', () => {
  it('should render the title text correctly', () => {
    const givenProps = {
      title: 'my title'
    };
    render(DividerWithText, givenProps);

    const title = screen.getByText(givenProps.title);

    expect(title).toBeInTheDocument();
  });

  it('should render exaclty two horizontal dividers', () => {
    const givenProps = {
      title: 'my title'
    };
    render(DividerWithText, givenProps);

    const hrs = screen.getAllByRole('separator');

    expect(hrs).toHaveLength(2);
  });
});
