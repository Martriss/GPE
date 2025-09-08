import { beforeEach, describe, expect, it } from "vitest";
import DropListNav from "./DropListNav.svelte";
import { render, screen } from "@testing-library/svelte";

describe(DropListNav.name, () => {
  const link1 = {
    display: "link 1",
    href: "href link 1"
  };
  const link2 = {
    display: "link 2",
    href: "href link 2"
  };
  let fakeChildren: () => HTMLElement;

  beforeEach(() => {
    // Fake children
    fakeChildren = () => {
      const el = document.createElement('div');
      el.textContent = 'Fake children content';
      return el;
    };
  });

  it("should render a button and a hide 'list'", () => {
    const givenProps = {
      linkList: [],
      children: fakeChildren
    };
    render(DropListNav, givenProps);

    const button = screen.getByRole("button");
    const list = screen.getByTestId("drop-list-nav-child");

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).not.toHaveAttribute("aria-label");
    expect(list).toBeInTheDocument();
  });

  it("should render 2 anchor when linkList.length props equal 2", () => {
    const givenProps = {
      linkList: [link1, link2],
      children: fakeChildren
    };
    render(DropListNav, givenProps);

    const anchors = screen.getAllByRole("link");

    expect(anchors).toHaveLength(2);
  });

  it("should render 0 anchor when linkList is empty", () => {
    const givenProps = {
      linkList: [],
      children: fakeChildren
    };
    render(DropListNav, givenProps);

    const anchors = screen.queryAllByRole("link");

    expect(anchors).toHaveLength(0);
  });

  it("should disabled the button when disabled props is given at true", () => {
    const givenProps = {
      linkList: [],
      children: fakeChildren,
      disabled: true
    };
    render(DropListNav, givenProps);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
  });

  it("should add an aria-label on the button when ariaLabel props is given", () => {
    const givenProps = {
      linkList: [],
      children: fakeChildren,
      ariaLabel: "my aria-label"
    };
    render(DropListNav, givenProps);

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("aria-label", "my aria-label");
  });
});
