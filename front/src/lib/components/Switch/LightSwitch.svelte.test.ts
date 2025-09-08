import { describe, expect, it } from "vitest";
import LightSwitch from "./LightSwitch.svelte";
import { render, screen } from "@testing-library/svelte";

describe(LightSwitch.name, () => {
  it("should render a switch", () => {
    render(LightSwitch);

    const switchComponent = screen.getByTestId("switch");

    expect(switchComponent).toBeInTheDocument();
  });
});
