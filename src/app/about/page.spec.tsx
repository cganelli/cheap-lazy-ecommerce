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
it('renders disclosure heading and anchor exists for deep link', () => {
  render(<DisclosureSection />);
  const heading = screen.getByRole('heading', { name: /affiliate disclosure/i });
  expect(heading).toBeInTheDocument();
  // sentinel anchor present:
  expect(document.getElementById('disclosure')).toBeTruthy();
});