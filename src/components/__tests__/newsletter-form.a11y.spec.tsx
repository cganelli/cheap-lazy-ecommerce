import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import Header from '@/components/Header';

test('newsletter form has proper accessibility and error handling', async () => {
  const { container } = render(<Header />);
  
  const emailInput = screen.getByRole('textbox', { name: /email address/i });
  const submitButton = screen.getByRole('button', { name: /subscribe/i });
  const form = screen.getByRole('form', { name: /newsletter signup/i });
  
  expect(emailInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
  
  // Test error state - submit form with empty email
  fireEvent.submit(form);
  await waitFor(() => {
    const liveRegion = screen.getByRole('status', { hidden: true });
    expect(liveRegion).toHaveTextContent('Email is required');
  });
  
  // Test success state
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.submit(form);
  await waitFor(() => {
    const liveRegion = screen.getByRole('status', { hidden: true });
    expect(liveRegion).toHaveTextContent('Thank you for subscribing!');
  });
  
  expect(await axe(container)).toHaveNoViolations();
});
