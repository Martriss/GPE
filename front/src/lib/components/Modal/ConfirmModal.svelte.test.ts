import { describe, expect, it, vi } from "vitest";
import ConfirmModal from "./ConfirmModal.svelte";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

describe(ConfirmModal.name, () => {
  const fakeDialogElement = {
    showModal: vi.fn(),
    close: vi.fn()
  } as unknown as HTMLDialogElement;

  it("should render a title, question and two buttons", () => {
    const givenProps = {
      dialogRef: fakeDialogElement,
      title: "my title",
      question: "my question",
      onCloseTrue: vi.fn(),
      onCloseFalse: vi.fn()
    };
    render(ConfirmModal, givenProps);

    const title = screen.getByText("my title");
    const question = screen.getByText("my question");
    const button1 = screen.getByText("Je confirme");
    const button2 = screen.getByText("Annuler");

    expect(title).toBeInTheDocument();
    expect(question).toBeInTheDocument();
    expect(button1).toBeInTheDocument();
    expect(button2).toBeInTheDocument();
  });

  it("should have correct button name when buttons props are given", () => {
    const givenProps = {
      dialogRef: fakeDialogElement,
      title: "my title",
      question: "my question",
      onCloseTrue: vi.fn(),
      onCloseFalse: vi.fn(),
      buttoname1: "my button1",
      buttoname2: "my button2"
    };
    render(ConfirmModal, givenProps);

    const button1 = screen.getByText("my button1");
    const button2 = screen.getByText("my button2");

    expect(button1).toBeInTheDocument();
    expect(button2).toBeInTheDocument();
  });

  it("should call onCloseTrue after click on buttoname1", async () => {
    const user = userEvent.setup();

    const onCloseTrue = vi.fn();
    const givenProps = {
      dialogRef: fakeDialogElement,
      title: "my title",
      question: "my question",
      onCloseTrue,
      onCloseFalse: vi.fn()
    };
    render(ConfirmModal, givenProps);

    const button1 = screen.getByText("Je confirme");

    await user.click(button1);

    expect(onCloseTrue).toHaveBeenCalledTimes(1);
  });

  it("should call onCloseFalse after click on buttoname2", async () => {
    const user = userEvent.setup();

    const onCloseFalse = vi.fn();
    const givenProps = {
      dialogRef: fakeDialogElement,
      title: "my title",
      question: "my question",
      onCloseTrue: vi.fn(),
      onCloseFalse
    };
    render(ConfirmModal, givenProps);

    const button2 = screen.getByText("Annuler");

    await user.click(button2);

    expect(onCloseFalse).toHaveBeenCalledTimes(1);
  });
});
