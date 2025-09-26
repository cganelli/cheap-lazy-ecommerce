import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBox from './SearchBox';

const demo = [
  { asin: 'ABC1234567', title: 'Vitamin C Serum', category: 'Beauty', affiliate_url:'#', image_url:'/x.webp' },
  { asin: 'XYZ1234567', title: 'Dog Shampoo', category: 'Pet Care', affiliate_url:'#', image_url:'/y.webp' },
];

test('shows dropdown results for a query', async () => {
  render(<SearchBox items={demo} />);
  const input = screen.getByRole('combobox', { name: /search products/i });
  fireEvent.change(input, { target: { value: 'sham' } });

  const list = await screen.findByRole('listbox');
  const options = within(list).getAllByRole('option');
  expect(options.length).toBeGreaterThan(0);
  expect(list).toBeVisible();
  expect(options[0]).toHaveTextContent(/Dog Shampoo/i);
});

test('result item links have affiliate rel/target', async () => {
  render(<SearchBox items={demo} />);
  const input = screen.getByRole('combobox', { name: /search products/i });
  fireEvent.change(input, { target: { value: 'vit' } });

  const list = await screen.findByRole('listbox');
  const link = within(list).getAllByRole('link')[0] as HTMLAnchorElement;
  expect(link).toHaveAttribute('target', '_blank');
  expect(link.getAttribute('rel')).toMatch(/nofollow/);
  expect(link.getAttribute('rel')).toMatch(/sponsored/);
  expect(link.getAttribute('rel')).toMatch(/noopener/);
});
