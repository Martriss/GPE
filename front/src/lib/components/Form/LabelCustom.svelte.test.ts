import { describe, expect, it } from "vitest";
import LabelCustom from "./LabelCustom.svelte";
import { render, screen } from "@testing-library/svelte";

describe(LabelCustom.name, () => {
  it("should render the correct label", () => {
    const givenProps = {
      label: "my label"
    };
    render(LabelCustom, givenProps);

    const label = screen.getByText("my label");

    expect(label).toBeInTheDocument();
  });

  it("should not render the require character when required props isn't given", () => {
    const givenProps = {
      label: "my label"
    };
    render(LabelCustom, givenProps);

    const requireCharacter = screen.queryByText("*");

    expect(requireCharacter).not.toBeInTheDocument();
  });

  it("should render the require character without color style when required props is given and colorRequired is not given", () => {
    const givenProps = {
      label: "my label",
      required: true
    };
    render(LabelCustom, givenProps);

    const requireCharacter = screen.getByText("*");
    const style = getComputedStyle(requireCharacter);

    expect(requireCharacter).toBeInTheDocument();
    expect(style.color).toBe("");
  });

  it("should render the require character with the color given", () => {
    const givenProps = {
      label: "my label",
      required: true,
      colorRequired: "red"
    };
    render(LabelCustom, givenProps);

    const requireCharacter = screen.getByText("*");
    const style = getComputedStyle(requireCharacter);

    expect(requireCharacter).toBeInTheDocument();
    expect(style.color).toBe("rgb(255, 0, 0)");
  });
});
