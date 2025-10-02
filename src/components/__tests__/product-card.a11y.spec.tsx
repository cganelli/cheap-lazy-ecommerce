import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

function Card() {
  return (
    <article aria-labelledby="p-asin-title">
      <h3 id="p-asin-title" className="sr-only">Great Budget Electric Kettle</h3>
      <img src="/products/B0XXX-800.webp" alt="Great Budget Electric Kettle" />
    </article>
  );
}

test('product card announces a title and alt text and has no a11y violations', async () => {
  const { container } = render(<Card />);
  expect(screen.getByRole('img', { name: /great budget electric kettle/i})).toBeInTheDocument();
  expect(await axe(container)).toHaveNoViolations();
});
