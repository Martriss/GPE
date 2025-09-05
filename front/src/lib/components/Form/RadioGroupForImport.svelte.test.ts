import { describe, expect, it } from "vitest";
import RadioGroupForImport from "./RadioGroupForImport.svelte";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

describe(RadioGroupForImport.name, () => {
  it("should render a title and 3 radio buttons", () => {
    const givenProps = {
      title: "my title"
    };
    render(RadioGroupForImport, givenProps);

    const title = screen.getByText("my title");
    const radioButtons = screen.getAllByRole("radio");
    const textarea = screen.queryByRole("textbox");
    const inputfile = screen.queryByTestId('input-file-custom');

    expect(title).toBeInTheDocument();
    expect(radioButtons).toHaveLength(3);
    expect(textarea).not.toBeInTheDocument();
    expect(inputfile).not.toBeInTheDocument();
  });

  it("should have the correct name for all radio buttons", () => {
    const givenProps = {
      title: "my title"
    };
    render(RadioGroupForImport, givenProps);

    const radioButton1 = screen.getByText("Aucune");
    const radioButton2 = screen.getByText("Coller dans une liste");
    const radioButton3 = screen.getByText("Depuis un fichier");

    expect(radioButton1).toBeInTheDocument();
    expect(radioButton2).toBeInTheDocument();
    expect(radioButton3).toBeInTheDocument();
  });

  it("should display a Textarea when the correct radio button is clicked", async () => {
    const user = userEvent.setup();

    const givenProps = {
      title: "my title"
    };
    render(RadioGroupForImport, givenProps);

    const radioButtons = screen.getAllByRole("radio");

    await user.click(radioButtons[1]);

    const textarea = screen.getByRole("textbox");

    expect(textarea).toBeInTheDocument();

    await user.click(radioButtons[0]);

    expect(textarea).not.toBeInTheDocument();
  });
});
