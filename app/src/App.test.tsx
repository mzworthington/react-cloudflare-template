import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./pages/HomePage', () => ({
  HomePage: () => <div data-testid="home" />,
}));

vi.mock('./pages/DocsPage', () => ({
  DocsPage: () => <div data-testid="docs" />,
}));

vi.mock('./pages/DesignSystemPage', () => ({
  DesignSystemPage: () => <div data-testid="design-system" />,
}));

import { App } from './App';

afterEach(() => {
  cleanup();
  window.history.replaceState({}, '', '/');
});

describe('App docs routing', () => {
  it('routes nested ADR docs paths to DocsPage', () => {
    window.history.replaceState({}, '', '/docs/adrs/0001-cloudflare-pages-pulumi-wrangler');
    render(<App />);
    expect(screen.getByTestId('docs')).toBeTruthy();
    expect(screen.queryByText(/not found/i)).toBeNull();
  });

  it('routes the ADR index to DocsPage', () => {
    window.history.replaceState({}, '', '/docs/adrs');
    render(<App />);
    expect(screen.getByTestId('docs')).toBeTruthy();
  });
});
