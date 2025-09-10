import { describe, expect, it, vi } from "vitest";
import InputFileCustom from "./InputFileCustom.svelte";
import { render, screen } from "@testing-library/svelte";

describe(InputFileCustom.name, () => {
  const defaultGivenProps = {
    label: "my label",
    name: "my name"
  };

  it('should render an input type file with the correct name and default accept, and a label', () => {
    render(InputFileCustom, defaultGivenProps);

    const input = screen.getByTestId('input-file-custom');
    const label = screen.getByText("my label");

    expect(input).toHaveAttribute('name', "my name");
    expect(input).toHaveAttribute('accept', "image/*");
    expect(label).toBeInTheDocument();
  });

  it('should render without disabled, required attributes when the props are not given', () => {
    render(InputFileCustom, defaultGivenProps);

    const input = screen.getByTestId('input-file-custom');

    expect(input).not.toBeDisabled();
    expect(input).not.toBeRequired();
  });

  it("should be disabled when disabled props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      disabled: true
    }

    render(InputFileCustom, givenProps);

    const input = screen.getByTestId('input-file-custom');

    expect(input).toBeDisabled();
  });

  it("should be required when required props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      required: true
    }

    render(InputFileCustom, givenProps);

    const input = screen.getByTestId('input-file-custom');

    expect(input).toBeRequired();
  });

  it("should have the correct value accept when accept props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      accept: "application/pdf"
    }

    render(InputFileCustom, givenProps);

    const input = screen.getByTestId('input-file-custom');

    expect(input).toHaveAttribute('accept', "application/pdf");
  });
});
