import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SITE_CREATE_COMMAND, SITE_NAME, SITE_REPO_URL } from '../siteConfig';
import { HomePage } from './HomePage';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('HomePage', () => {
  it('renders the product name', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: SITE_NAME })).toBeTruthy();
  });

  it('links to the GitHub repository', () => {
    render(<HomePage />);
    const link = screen.getByRole('link', { name: /view on github/i });
    expect(link.getAttribute('href')).toBe(SITE_REPO_URL);
  });

  it('shows the create-script one-liner', () => {
    render(<HomePage />);
    const snippet = screen.getByTestId('template-snippet');
    expect(snippet.textContent).toContain(SITE_CREATE_COMMAND);
    expect(snippet.textContent).toContain('scripts/create.sh');
  });

  it('copies the create command when the copy button is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<HomePage />);
    fireEvent.click(screen.getByRole('button', { name: /copy create command/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(SITE_CREATE_COMMAND);
      expect(screen.getByRole('button', { name: /copied/i })).toBeTruthy();
    });
  });

  it('shows a hosting bootstrap teaser linked to custom-domains docs', () => {
    render(<HomePage />);
    const snippet = screen.getByTestId('hosting-snippet');
    expect(snippet.textContent).toContain('bin/setup-cloudflare-hosting.sh');
    expect(snippet.textContent).toContain('.env.example');
    expect(screen.getByRole('button', { name: /copy hosting commands/i })).toBeTruthy();
    const link = screen.getByRole('link', { name: /custom domains/i });
    expect(link.getAttribute('href')).toBe('/docs/custom-domains');
  });
});
