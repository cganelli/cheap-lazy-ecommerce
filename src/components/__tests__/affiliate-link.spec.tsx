import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

test('affiliate link is descriptive and accessible', async () => {
  const { container } = render(
    <a 
      href="https://amzn.to/..." 
      target="_blank" 
      rel="sponsored noopener noreferrer"
      aria-label="Buy Sample Product on Amazon (opens in a new tab)"
    >
      Buy on Amazon
    </a>
  );
  
  expect(screen.getByRole('link', { name: /buy sample product on amazon/i })).toBeInTheDocument();
  expect(await axe(container)).toHaveNoViolations();
});
