import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisclosureSection from '@/components/DisclosureSection';

/**
 * About Page Tests
 * 
 * Tests for the About page disclosure section functionality.
 * Location: src/app/about/page.spec.tsx
 */
it('renders the disclosure anchor on About', () => {
  render(<DisclosureSection />);
  const h = screen.getByRole('heading', { name: /affiliate disclosure/i });
  expect(h).toBeInTheDocument();
  expect(h.closest('section')).toHaveAttribute('id', 'disclosure');
});