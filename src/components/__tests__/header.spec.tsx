import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

describe('Header layout (mobile-first DOM order)', () => {
  test('renders tabs before email form and text blocks', () => {
    render(<Header />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const privacyText = screen.getByText(/we respect your privacy/i);
    const affiliateText = screen.getByText(/as an amazon associate/i);

    // DOM order: tabs -> email -> privacy/unsub -> affiliate
    expect(homeLink.compareDocumentPosition(emailInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(emailInput.compareDocumentPosition(privacyText) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(privacyText.compareDocumentPosition(affiliateText) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('nav supports horizontal overflow for mobile', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: /site/i });
    expect(nav.firstElementChild).toHaveClass('overflow-x-auto');
  });
});
