import { describe, expect, it, vi } from "vitest";
import SelectCustom from "./SelectCustom.svelte";
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

describe(SelectCustom.name, () => {
  const defaultOptions = [
    {
      name: "my name1",
      uuid: "my uuid1"
    },
    {
      name: "my name2",
      uuid: "my uuid2"
    }
  ];
  const defaultGivenProps = {
    label: "my label",
    name: "my name",
    options: defaultOptions,
  };

  it("should render a select with his options", () => {
    render(SelectCustom, defaultGivenProps);

    const select = screen.getByRole("combobox");
    const options = screen.getAllByRole("option");

    expect(select).toBeInTheDocument();
    expect(options).toHaveLength(2);
  });

  it("should render with correct value and without attributes: disabled, requized, size and value when the props isn't given", () => {
    render(SelectCustom, defaultGivenProps);


    const select = screen.getByRole("combobox") as HTMLSelectElement;
    const options = screen.getAllByRole("option");

    const option1 = options[0] as HTMLOptionElement;
    const option2 = options[1] as HTMLOptionElement;

    expect(select).toHaveAttribute("name", "my name");
    expect(select.value).toBe("my uuid1");
    expect(select).not.toBeDisabled();
    expect(select).not.toBeRequired();
    expect(select).not.toHaveAttribute("size");

    expect(options[0].textContent).toBe("my name1");
    expect(option1.value).toBe("my uuid1");
    expect(options[1].textContent).toBe("my name2");
    expect(option2.value).toBe("my uuid2");
  });

  it("should be disabled when disabled props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      disabled: true
    };
    render(SelectCustom, givenProps);

    const select = screen.getByRole("combobox");

    expect(select).toBeDisabled();
  });

  it("should be required when required props is given at true", () => {
    const givenProps = {
      ...defaultGivenProps,
      required: true
    };
    render(SelectCustom, givenProps);

    const select = screen.getByRole("combobox");

    expect(select).toBeRequired();
  });

  it("should have size attribute when size props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      size: 3
    };
    render(SelectCustom, givenProps);

    const select = screen.getByRole("listbox");

    expect(select).toHaveAttribute("size", "3");
  });

  it("should have a the correct value when value props is given", () => {
    const givenProps = {
      ...defaultGivenProps,
      value: "my uuid2"
    };
    render(SelectCustom, givenProps);

    const select = screen.getByRole("combobox") as HTMLSelectElement;

    expect(select.value).toBe("my uuid2");
  });
});
