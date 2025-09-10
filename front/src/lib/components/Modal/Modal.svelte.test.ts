import { render, screen } from "@testing-library/svelte";
import type { Snippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Modal from "./Modal.svelte";
import userEvent from "@testing-library/user-event";

describe(Modal.name, () => {
  let fakeDialog: HTMLDialogElement;
  let fakeChildren: () => HTMLElement;

  beforeEach(() => {
    // Fake dialogRef
    fakeDialog = document.createElement('dialog');

    // Fake children
    fakeChildren = () => {
      const el = document.createElement('div');
      el.textContent = 'Fake children content';
      return el;
    };
  });

  it("should render a dialog with a button", () => {
    const givenProps = {
      dialogRef: fakeDialog,
      onClose: vi.fn(),
      children: fakeChildren
    };
    render(Modal, givenProps);

    const dialog = screen.getByTestId("modal");
    const button = screen.getByTestId("button-close-popup");

    expect(dialog).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should call onClose when the button is clicked", async () => {
    const user = userEvent.setup();

    const onClose = vi.fn();
    const givenProps = {
      dialogRef: fakeDialog,
      onClose,
      children: fakeChildren
    };
    render(Modal, givenProps);

    const button = screen.getByTestId("button-close-popup");

    await user.click(button);

    expect(onClose).toHaveBeenCalledOnce();
  });
});
