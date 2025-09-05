import { describe, expect, it, vi } from "vitest";
import InputPasswordCustom from "./InputPasswordCustom.svelte";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import type { FullAutoFill } from "svelte/elements";

describe(InputPasswordCustom.name, () => {
  const defaultGivenProps = {
    label: "my label",
    name: "my name"
  };

  it("should render an input type password with the correct name, an button and a label", () => {
    render(InputPasswordCustom, defaultGivenProps);

    const input = screen.getByTestId("input-password-custom");
    const button = screen.getByRole('button');
    const label = screen.getByText("my label");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', "my name");
    expect(input).toHaveAttribute("type", "password");
    expect(button).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it("should render without value, pattern, placeholder, readonly, required, autocomplete, disabled and maxlength when the props aren't given", () => {
    render(InputPasswordCustom, defaultGivenProps);

    const input = screen.getByTestId("input-password-custom");

    expect(input).not.toHaveAttribute("value");
    expect(input).not.toBeDisabled();
    expect(input).not.toBeRequired();
    expect(input).not.toHaveAttribute("pattern");
    expect(input).not.toHaveAttribute("placeholder");
    expect(input).not.toHaveAttribute("readonly");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).not.toHaveAttribute("maxlength");
  });

  it("should change the input type when the user click on the button", async () => {
    const user = userEvent.setup();

    render(InputPasswordCustom, defaultGivenProps);

    const input = screen.getByTestId("input-password-custom");
    const button = screen.getByRole('button');

    expect(input).toHaveAttribute("type", "password");

    await user.click(button);

    expect(input).toHaveAttribute("type", "text");

    await user.click(button);

    expect(input).toHaveAttribute("type", "password");
  });

  it("should be required when required props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      required: true
    };
    render(InputPasswordCustom, givenProps);

    const input = screen.getByTestId("input-password-custom");

    expect(input).toBeRequired();
  });

  it("should be disabled when disabled props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      disabled: true
    };
    render(InputPasswordCustom, givenProps);

    const input = screen.getByTestId("input-password-custom");

    expect(input).toBeDisabled();
  });

  it("should have pattern attribute when pattern props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      pattern: "^0[1-9]\d{8}$"
    };
    render(InputPasswordCustom, givenProps);

    const input = screen.getByTestId("input-password-custom");

    expect(input).toHaveAttribute("pattern", "^0[1-9]\d{8}$");
  });

  it("should have placeholder attribute when placeholder props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      placeholder: "0612345678"
    };
    render(InputPasswordCustom, givenProps);

    const input = screen.getByTestId("input-password-custom");

    expect(input).toHaveAttribute("placeholder", "0612345678");
  });

  it("should have readonly attribute when readonly props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      readonly: true
    };
    render(InputPasswordCustom, givenProps);

    const input = screen.getByTestId("input-password-custom");

    expect(input).toHaveAttribute("readonly", "");
  });

  it("should have maxlength attribute when  maxlength props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      maxlength: 4
    };
    render(InputPasswordCustom, givenProps);

    const input = screen.getByTestId("input-password-custom");

    expect(input).toHaveAttribute("maxlength", "4");
  });

  it("should have the correct value autocomplete  when autocomplete props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      autocomplete: "name" as FullAutoFill
    };
    render(InputPasswordCustom, givenProps);

    const input = screen.getByTestId("input-password-custom");

    expect(input).toHaveAttribute("autocomplete", "name");
  });

  it("should have the correct value for value attribute when value props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      value: "MDSqs24@azeA"
    };
    render(InputPasswordCustom, givenProps);

    const input = screen.getByTestId("input-password-custom") as HTMLInputElement;

    expect(input.value).toBe("MDSqs24@azeA");
  });

  it("should have the correct icon after a click on the button", async () => {
    const user = userEvent.setup();

    render(InputPasswordCustom, defaultGivenProps);

    const button = screen.getByRole('button');

    expect(screen.getByTestId("eye")).toBeInTheDocument();
    expect(screen.queryByTestId("eye-off")).not.toBeInTheDocument();

    await user.click(button);

    expect(screen.queryByTestId("eye")).not.toBeInTheDocument();
    expect(screen.getByTestId("eye-off")).toBeInTheDocument();

    await user.click(button);

    expect(screen.getByTestId("eye")).toBeInTheDocument();
    expect(screen.queryByTestId("eye-off")).not.toBeInTheDocument();
  });
});
