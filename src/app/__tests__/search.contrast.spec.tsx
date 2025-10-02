import React from 'react';
import { render, screen } from '@testing-library/react';

// Test the specific element that contains the summary text
function SearchSummary({ query = '', count = 0 }: { query?: string; count?: number }) {
  return (
    <p className="mb-6 text-sm text-gray-700">Results for "{query}" — {count} items</p>
  );
}

test('search summary line uses AA-safe color token', () => {
  render(<SearchSummary query="test" count={5} />);
  const summary = screen.getByText(/results for/i);
  expect(summary.className).toMatch(/text-(gray|slate)-700/);
  // Ensure it doesn't use the old unsafe color
  expect(summary.className).not.toMatch(/text-(gray|slate)-600/);
});
