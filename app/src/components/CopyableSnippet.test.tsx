import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CopyableSnippet } from './CopyableSnippet';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CopyableSnippet', () => {
  it('copies code and shows Copied feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<CopyableSnippet code="echo hi" label="Copy demo" />);
    fireEvent.click(screen.getByRole('button', { name: /copy demo/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('echo hi');
      expect(screen.getByRole('button', { name: /copied/i })).toBeTruthy();
    });
  });
});
