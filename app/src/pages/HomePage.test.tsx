import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SITE_NAME } from '../siteConfig';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('renders the product name', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: SITE_NAME })).toBeTruthy();
  });
});
