import { describe, expect, it } from "vitest";
import InputRadioCustom from "./InputRadioCustom.svelte";
import { render, screen } from "@testing-library/svelte";

describe(InputRadioCustom.name, () => {
  const defaultGivenProps = {
    label: "my label",
    name: "my name",
    value: "my value",
  }

  it("should render input radio with the correct name, value and label", () => {
    render(InputRadioCustom, defaultGivenProps);

    const input = screen.getByRole("radio") as HTMLInputElement;
    const label = screen.getByText("my label");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "my name");
    expect(input.value).toBe("my value");

    expect(label).toBeInTheDocument();
  });

  it("should render without checked when the props isn't given", () => {
    render(InputRadioCustom, defaultGivenProps);

    const input = screen.getByRole("radio");

    expect(input).not.toBeChecked();
  });

  it("should be checked when checked props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      checked: true
    };
    render(InputRadioCustom, givenProps);

    const input = screen.getByRole("radio");

    expect(input).toBeChecked();
  });
});
