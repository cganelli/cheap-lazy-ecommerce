import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisclosureSection from '@/components/DisclosureSection';

it('renders the disclosure anchor', () => {
  render(<DisclosureSection />);
  const h = screen.getByRole('heading', { name: /affiliate disclosure/i });
  expect(h).toBeInTheDocument();
  expect(h.closest('section')).toHaveAttribute('id', 'disclosure');
});
