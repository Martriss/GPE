import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import ButtonSubmitCustom from "./ButtonSubmitCustom.svelte";

describe('ButtonSubmitCustom', () => {
  it('should render the button with the correct name', () => {
    const givenProps = {
      name: "test"
    };
    render(ButtonSubmitCustom, givenProps);

    const button = screen.getByRole('button', { name: givenProps.name });

    expect(button).toBeInTheDocument();
  });

  it('should not be disabled when the disabled prop is absent', () => {
    const givenProps = {
      name: "test"
    };
    render(ButtonSubmitCustom, givenProps);

    const button = screen.getByRole('button');

    expect(button).not.toHaveAttribute('disabled');
  });

  it('should be disabled when the disabled prop is true', () => {
    const givenProps = {
      name: "test",
      disabled: true
    };
    render(ButtonSubmitCustom, givenProps);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });
});
