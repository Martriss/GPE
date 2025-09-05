import { describe, expect, it, vi } from "vitest";
import TooltipButton from "./TooltipButton.svelte";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

describe(TooltipButton.name, () => {
  it("should render a button", () => {
    const givenProps = {
      infoOnHover: 'info on hover',
      infoOnClick: 'info on click',
      nameButton: 'name button',
      handleClickButton: vi.fn()
    }
    render(TooltipButton, givenProps);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
  });

  it("should call handleClickButton, and display an info when the button is clicked", async () => {
    const user = await userEvent.setup();
    const handleClickButton = vi.fn();
    const givenProps = {
      infoOnHover: 'info on hover',
      infoOnClick: 'info on click',
      nameButton: 'name button',
      handleClickButton
    };
    render(TooltipButton, givenProps);

    const button = screen.getByRole("button");

    await user.click(button);

    const infoClick = screen.getByText("info on click");

    expect(handleClickButton).toHaveBeenCalledOnce();
    expect(infoClick).toBeInTheDocument();
  });

  it("should display info on hover the button", async () => {
    const user = await userEvent.setup();
    const givenProps = {
      infoOnHover: 'info on hover',
      infoOnClick: 'info on click',
      nameButton: 'name button',
      handleClickButton: vi.fn()
    };
    render(TooltipButton, givenProps);

    const button = screen.getByRole("button");

    await user.hover(button);

    const infoHover = screen.getByText("info on hover");

    expect(infoHover).toBeInTheDocument();

    await user.unhover(button);

    const infoUnhover = screen.queryByText("info on hover");

    expect(infoUnhover).not.toBeInTheDocument();
  });
});
