import { describe, expect, it, vi } from "vitest";
import TextareaCustom from "./TextareaCustom.svelte";
import { render, screen } from "@testing-library/svelte";

vi.mock('./LabelCustom.svelte', () => {
  return {
    default: () => {
      return {
        $$render: () => '<div data-testid="mock-copy-modal"></div>'
      }
    }
  }
});

describe(TextareaCustom.name, () => {
  const defaultGivenProps = {
    label: "my label",
    name: "my name"
  };

  it("should render a textarea", () => {
    render(TextareaCustom, defaultGivenProps);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("name", "my name");
  });

  it("should render without value, placeholder, disabled, required, maxlength, readonly, rows and resize when the props aren't given ", () => {
    render(TextareaCustom, defaultGivenProps);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    expect(textarea).not.toBeDisabled();
    expect(textarea.value).toBe("");
    expect(textarea).not.toBeRequired();
    expect(textarea).not.toHaveAttribute("readonly");
    expect(textarea).not.toHaveAttribute("placeholder");
    expect(textarea).not.toHaveAttribute("maxlength");
    expect(textarea).toHaveAttribute("rows", "2");
    expect(textarea).toHaveStyle("resize: none");
  });

  it("should be disabled when disabled props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      disabled: true
    };
    render(TextareaCustom, givenProps);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toBeDisabled();
  });

  it("should be required when required props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      required: true
    };
    render(TextareaCustom, givenProps);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toBeRequired();
  });

  it("should have the correct value for value when value props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      value: "my value"
    };
    render(TextareaCustom, givenProps);

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    expect(textarea.value).toBe("my value");
  });

  it("should have placeholder attribute when placeholder props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      placeholder: "my placeholder"
    };
    render(TextareaCustom, givenProps);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveAttribute("placeholder", "my placeholder");
  });

  it("should have maxlength attribute when maxlength props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      maxlength: 500
    };
    render(TextareaCustom, givenProps);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveAttribute("maxlength", "500");
  });

  it("should have readonly attribute when readonly props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      readonly: true
    };
    render(TextareaCustom, givenProps);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveAttribute("readonly", "");
  });

  it("should have correct value for rows when rows props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      rows: 4
    }
    render(TextareaCustom, givenProps);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveAttribute("rows", "4");
  });

  it("should have correct value for resize when resize props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      resize: "vertical"
    }
    render(TextareaCustom, givenProps);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveStyle("resize: vertical");
  });
});
