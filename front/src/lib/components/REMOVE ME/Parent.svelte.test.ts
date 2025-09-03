import { render, screen } from '@testing-library/svelte';
import Parent from './Parent.svelte';
import { describe, expect, it, vi } from 'vitest';
import { SvelteComponent } from 'svelte';

// Mock du composant enfant
vi.mock('./Child.svelte', () => {
  return {
    default: class MockChild extends (SvelteComponent as any) {
      // options.target contient le DOM
      constructor(options: any) {
        super();
        options.target.innerHTML = '<div data-testid="mock-child">Mocked Child</div>';
      }
    }
  };
});

describe('Parent', () => {
  it('rend le parent avec le child mocké', () => {
    render(Parent);

    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
  });
});
