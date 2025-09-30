import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';

it('renders horizontal nav and email input', () => {
  render(<Header />);
  ['Home', 'About', 'Privacy', 'Terms'].forEach(t =>
    expect(screen.getByRole('link', { name: t })).toBeInTheDocument()
  );
  expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
});
