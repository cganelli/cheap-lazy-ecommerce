import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

/**
 * Header Component Tests
 * 
 * Tests for the Header component functionality and layout.
 * Location: src/components/__tests__/header.spec.tsx
 */
it('renders nav items and an email input', () => {
  render(<Header />);
  ['Home', 'About', 'Privacy', 'Terms'].forEach((t) => {
    expect(screen.getByRole('link', { name: t })).toBeInTheDocument();
  });
  expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
});

it('renders affiliate disclosure text', () => {
  render(<Header />);
  expect(screen.getByText(/as an amazon associate/i)).toBeInTheDocument();
});

it('renders privacy and unsubscribe text', () => {
  render(<Header />);
  expect(screen.getByText(/we respect your privacy/i)).toBeInTheDocument();
  expect(screen.getByText(/unsubscribe anytime/i)).toBeInTheDocument();
});

it('has proper form structure with label and input', () => {
  render(<Header />);
  const input = screen.getByLabelText(/get the best deals first/i);
  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('type', 'email');
  expect(input).toHaveAttribute('required');
});
