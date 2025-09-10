import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ButtonFilled from "./ButtonFilled.svelte";

describe('ButtonFilled', () => {
  it('should render the button with the correct name', () => {
    const givenProps = {
      name: 'Play',
      handleClick: vi.fn()
    }
    render(ButtonFilled, givenProps);

    const button = screen.getByRole('button', { name: 'Play' });

    expect(button).toBeInTheDocument();
  });

  it('should call handleClick when the button is clicked', async () => {
    const user = userEvent.setup();

    const handleClick = vi.fn();
    const givenProps = {
      name: 'Play',
      handleClick
    }
    render(ButtonFilled, givenProps);

    const button = screen.getByRole('button', { name: 'Play' });

    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when the disabled prop is true', () => {
    const givenProps = {
      name: 'Play',
      handleClick: vi.fn(),
      disabled: true
    }
    render(ButtonFilled, givenProps);

    const button = screen.getByRole('button', { name: 'Play' });

    expect(button).toBeDisabled();
  });
});
