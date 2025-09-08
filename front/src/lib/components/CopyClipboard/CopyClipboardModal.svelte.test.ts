import { beforeEach, describe, expect, it, vi } from "vitest";
import CopyClipboardModal from "./CopyClipboardModal.svelte";
import { render, screen } from "@testing-library/svelte";
describe(CopyClipboardModal.name, () => {
  const fakeDialogElement = {
    showModal: vi.fn(),
    close: vi.fn()
  } as unknown as HTMLDialogElement;

  it("should render a title, an input readonly and a button", () => {
    const givenProps = {
      dialogRef: fakeDialogElement,
      onClose: vi.fn(),
      title: "my title",
      valueToCopy: "value to copy"
    };
    render(CopyClipboardModal, givenProps);

    const title = screen.getByText("my title");
    const input = screen.getByLabelText("élément prêt à être copier");
    const button = screen.getByText("Copier");

    expect(title).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("readonly", "");
    expect(button).toBeInTheDocument();
  });
});
