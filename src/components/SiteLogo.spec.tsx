import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SiteLogo from './SiteLogo';

/**
 * SiteLogo Component Tests
 * 
 * Tests for the SiteLogo component functionality and accessibility.
 * Location: src/components/SiteLogo.spec.tsx
 */
it('renders site logo with accessible alt text', () => {
  render(<SiteLogo />);
  expect(screen.getByAltText(/cheap & lazy stuff/i)).toBeInTheDocument();
});

it('renders with custom alt text when provided', () => {
  render(<SiteLogo alt="Custom Logo Text" />);
  expect(screen.getByAltText('Custom Logo Text')).toBeInTheDocument();
});

it('applies custom className when provided', () => {
  render(<SiteLogo className="custom-class" />);
  const img = screen.getByAltText(/cheap & lazy stuff/i);
  expect(img).toHaveClass('custom-class');
});

it('uses default src when not provided', () => {
  render(<SiteLogo />);
  const img = screen.getByAltText(/cheap & lazy stuff/i);
  expect(img).toHaveAttribute('src', '/Cheap-Lazy-Hero-2.png');
});

it('uses custom src when provided', () => {
  render(<SiteLogo src="/custom-logo.png" />);
  const img = screen.getByAltText(/cheap & lazy stuff/i);
  expect(img).toHaveAttribute('src', '/custom-logo.png');
});
