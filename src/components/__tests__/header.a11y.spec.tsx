import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Header from '@/components/Header';

test('Header exposes a logical navigation order and has no a11y violations', async () => {
  const { container } = render(<Header />);
  expect(await axe(container)).toHaveNoViolations();
});
