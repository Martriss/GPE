import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
  test('should render h1', () => {
    const props = { data: { rulesets: [{ uuid: 'zhPZBo2kuOXpxdXMuXwk', name: "Magic The Gathering" }] } }
    render(Page, props);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
