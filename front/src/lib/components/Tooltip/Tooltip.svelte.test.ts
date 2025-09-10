import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it } from "vitest";
import Tooltip from "./Tooltip.svelte";

describe(Tooltip.name, () => {
  let fakeChildren: () => HTMLElement;

  beforeEach(() => {
    fakeChildren = () => {
      const el = document.createElement('div');
      el.textContent = "Fake children content";
      return el;
    }
  });

  it("should render info", () => {
    const givenProps = {
      infoOnHoven: "info",
      children: fakeChildren
    };
    render(Tooltip, givenProps);

    const info = screen.getByTestId("tooltip-info");

    expect(info).toBeInTheDocument();
  });
});
