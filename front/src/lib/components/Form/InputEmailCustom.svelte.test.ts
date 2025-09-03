import { render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import InputTextCustom from "./InputTextCustom.svelte";

vi.mock('./LabelCustom.svelte', () => {
  return {
    default: require('svelte').SvelteComponentDev.extend({
      $$render: () => '<div data-testid="mock-child">Mocked Child</div>'
    })
  };
});

describe(InputTextCustom.name, () => {
  it('should render an input type with the correct name', () => {
    const givenProps = {
      label: 'my label',
      name: 'my name'
    };
    render(InputTextCustom, givenProps);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('name', 'my name');
  });

  // it('should call LabelCustom', () => {
  //   const givenProps = {
  //     label: 'my label',
  //     name: 'my name'
  //   };
  //   render(InputTextCustom, givenProps);

  //   const labelCustom = screen.getByTestId('mock-label-custom');

  //   expect(labelCustom).toBeInTheDocument();
  // });

});
