import { render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import type { FullAutoFill } from "svelte/elements";
import InputTextCustom from "./InputTextCustom.svelte";

vi.mock('./LabelCustom.svelte', () => {
  return {
    default: () => {
      return {
        $$render: () => '<div data-testid="mock-copy-modal"></div>'
      }
    }
  }
});

describe(InputTextCustom.name, () => {
  const defaultGivenProps = {
    label: 'my label',
    name: 'my name'
  };

  it('should render an input type text with the correct name', () => {
    const givenProps = {
      label: 'my label',
      name: 'my name'
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('name', 'my name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it("should render without value, placeholder, disabled, maxlength, readonly, required and autocomplete when the props aren't given", () => {
    const givenProps = {
      label: 'my label',
      name: 'my name'
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole('textbox');

    expect(input).not.toBeDisabled();
    expect(input).not.toBeRequired();
    expect(input).not.toHaveAttribute('readonly');
    expect(input).not.toHaveAttribute('placeholder');
    expect(input).not.toHaveAttribute('pattern');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).not.toHaveAttribute('maxlength');
  });

  it("should be required when required props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      required: true
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole('textbox');

    expect(input).toBeRequired();
  });

  it("should be disabled when disabled props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      disabled: true
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
  });

  it("should be readonly when readonly props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      readonly: true
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('readonly', "");
  });

  it("should have pattern attribute when pattern props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      pattern: "^0[1-9]\d{8}$"
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('pattern', '^0[1-9]\d{8}$');
  });

  it("should have placeholder attribute when placeholder props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      placeholder: '0612345678'
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('placeholder', '0612345678');
  });

  it("should have maxlength attribute when maxlength props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      maxlength: 4,
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('maxlength', "4");
  });

  it("should have the correct value autocomplete when autocomplete props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      autocomplete: "name" as FullAutoFill
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('autocomplete', 'name');
  });

  it("should have the correct value for value attribute when value props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      value: "MDSqs24@azeA"
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input.value).toBe("MDSqs24@azeA");
  });
});
