import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import Header from '@/components/Header';

test('newsletter form has proper labels and live regions', async () => {
  const { container } = render(<Header />);

  // Check for proper label
  const label = screen.getByLabelText(/email address/i);
  expect(label).toBeInTheDocument();
  expect(label).toHaveAttribute('id', 'hdr-email');

  // Check for help text
  const helpText = screen.getByText(/enter a valid email address/i);
  expect(helpText).toBeInTheDocument();
  expect(helpText).toHaveAttribute('id', 'hdr-email-help');

  // Check for live region
  const liveRegion = screen.getByRole('status', { hidden: true });
  expect(liveRegion).toBeInTheDocument();
  expect(liveRegion).toHaveAttribute('id', 'hdr-status');
  expect(liveRegion).toHaveAttribute('aria-live', 'polite');

  // Test form submission with invalid email
  const emailInput = screen.getByRole('textbox', { name: /email address/i });
  const form = screen.getByRole('form', { name: /newsletter signup/i });

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.submit(form);

  await waitFor(() => {
    expect(liveRegion).toHaveTextContent(/please enter a valid email address/i);
  });

  // Test form submission with valid email
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.submit(form);

  await waitFor(() => {
    expect(liveRegion).toHaveTextContent(/thank you/i);
  });

  expect(await axe(container)).toHaveNoViolations();
});
