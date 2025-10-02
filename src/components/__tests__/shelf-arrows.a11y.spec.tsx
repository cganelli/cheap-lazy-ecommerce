import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';

function ShelfWithArrows() {
  const items = Array.from({ length: 8 }, (_, i) => ({
    asin: `TEST${i}`,
    title: `Product ${i + 1}`,
    image_url: '/test.webp',
    affiliate_url: '#'
  }));

  return (
    <section>
      <h2>Test Category</h2>
      <div className="flex gap-2">
        <button aria-label="Scroll left">‹</button>
        <div className="flex overflow-x-auto">
          {items.map(item => (
            <article key={item.asin} className="w-44">
              <img src={item.image_url} alt={item.title} />
              <h3>{item.title}</h3>
            </article>
          ))}
        </div>
        <button aria-label="Scroll right">›</button>
      </div>
    </section>
  );
}

test('shelf arrows are keyboardable and have no a11y violations', async () => {
  const { container } = render(<ShelfWithArrows />);
  
  const leftButton = screen.getByRole('button', { name: /scroll left/i });
  const rightButton = screen.getByRole('button', { name: /scroll right/i });
  
  expect(leftButton).toBeInTheDocument();
  expect(rightButton).toBeInTheDocument();
  
  // Test keyboard interaction
  leftButton.focus();
  expect(leftButton).toHaveFocus();
  
  rightButton.focus();
  expect(rightButton).toHaveFocus();
  
  expect(await axe(container)).toHaveNoViolations();
});
