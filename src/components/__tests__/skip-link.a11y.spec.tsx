import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import SkipLink from '@/components/SkipLink';

test('renders a skip link and has no a11y violations', async () => {
  const { container } = render(<SkipLink />);
  expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
  expect(await axe(container)).toHaveNoViolations();
});
