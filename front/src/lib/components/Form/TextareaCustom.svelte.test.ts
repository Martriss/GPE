import { describe, it, vi } from "vitest";
import TextareaCustom from "./TextareaCustom.svelte";

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
  }

  it("should render a textarea", () => {

  })
});
