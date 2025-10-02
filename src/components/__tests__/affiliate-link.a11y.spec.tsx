import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

function AffiliateLink() {
  return (
    <a
      href="https://amazon.com/...tag=yourtag-20"
      target="_blank"
      rel="sponsored noopener noreferrer"
      aria-label="Buy XYZ on Amazon (opens in a new tab)"
    >
      Buy on Amazon
    </a>
  );
}

test('affiliate link discloses behavior and has no a11y violations', async () => {
  const { container } = render(<AffiliateLink />);
  expect(screen.getByRole('link', { name: /buy xyz on amazon.*opens in a new tab/i })).toBeInTheDocument();
  expect(await axe(container)).toHaveNoViolations();
});
