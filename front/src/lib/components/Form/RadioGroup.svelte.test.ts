import { describe, expect, it } from "vitest";
import RadioGroup from "./RadioGroup.svelte";
import { render, screen } from "@testing-library/svelte";

describe(RadioGroup.name, () => {
  it("should render a title and a group of radio button", () => {
    const givenProps = {
      title: "my title",
      name: "my name",
      checkboxes: [
        {
          label: "box1",
          value: "box1"
        },
        {
          label: "box2",
          value: "box2"
        }
      ]
    };
    render(RadioGroup, givenProps);

    const title = screen.getByText("my title");
    const radioButtons = screen.getAllByRole("radio");

    expect(title).toBeInTheDocument();
    expect(radioButtons).toHaveLength(2);
  });
});
