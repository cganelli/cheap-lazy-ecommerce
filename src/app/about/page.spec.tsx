import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutPage from './page';

it('exposes a #disclosure target and heading', () => {
  render(<AboutPage />);
  expect(document.getElementById('disclosure')).toBeTruthy();
  expect(screen.getByRole('heading', { name: /affiliate disclosure/i })).toBeInTheDocument();
});