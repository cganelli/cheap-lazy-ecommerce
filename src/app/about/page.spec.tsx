import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisclosureSection from '@/components/DisclosureSection';

it('renders the disclosure section anchor', () => {
  render(<DisclosureSection />);
  const section = screen.getByRole('heading', { name: /affiliate disclosure/i });
  expect(section).toBeInTheDocument();
  // Check the parent section has the correct id for anchoring
  const disclosure = screen.getByText(/As an Amazon Associate/i).closest('section');
  expect(disclosure).toHaveAttribute('id', 'disclosure');
});
