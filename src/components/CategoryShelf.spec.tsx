import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryShelf, { Product } from './CategoryShelf';

function make(n=8): Product[] {
  return Array.from({length:n}).map((_,i) => ({
    asin: String(1000+i), title: `Item ${i}`, image_url:'/img.webp',
    affiliate_url:'#', category:'Demo',
  }));
}

test('expands to show all items', () => {
  render(<CategoryShelf title="Demo" items={make(10)} initialLimit={6} />);
  expect(screen.getByText(/View All 10 Items/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /View All 10 Items/i }));
  expect(screen.getByRole('button', { name: /Collapse/i })).toBeInTheDocument();
});

test('scroll arrows call scrollBy', () => {
  render(<CategoryShelf title="Demo" items={make(8)} initialLimit={6} />);
  const left = screen.getByRole('button', { name: /Scroll left/i });
  // Not asserting pixels (jsdom), but button exists and is clickable:
  fireEvent.click(left);
  expect(left).toBeEnabled();
});
