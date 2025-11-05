import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

// Mock pages with their footer newsletter forms
const HomePageFooter = () => (
  <footer>
    <form className="flex items-center gap-2">
      <label htmlFor="footer-email" className="sr-only">Email address</label>
      <input
        id="footer-email"
        name="email"
        type="email"
        required
        aria-describedby="footer-email-help"
        className="w-[min(220px,50vw)] sm:w-64 rounded border px-3 py-2 text-sm"
        placeholder="Enter your email"
      />
      <p id="footer-email-help" className="sr-only">
        Enter a valid email address.
      </p>
      <button
        type="submit"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        Subscribe
      </button>
      <div id="footer-email-status" aria-live="polite" className="sr-only" />
    </form>
  </footer>
);

const AboutPageFooter = () => (
  <footer>
    <form className="flex items-center gap-2">
      <label htmlFor="about-footer-email" className="sr-only">Email address</label>
      <input
        id="about-footer-email"
        name="email"
        type="email"
        required
        aria-describedby="about-footer-email-help"
        className="w-[min(220px,50vw)] sm:w-64 rounded border px-3 py-2 text-sm"
        placeholder="Enter your email"
      />
      <p id="about-footer-email-help" className="sr-only">
        Enter a valid email address.
      </p>
      <button
        type="submit"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        Subscribe
      </button>
      <div id="about-footer-email-status" aria-live="polite" className="sr-only" />
    </form>
  </footer>
);

describe('Footer Newsletter Forms', () => {
  test('homepage footer newsletter input has an accessible name', async () => {
    const { container } = render(<HomePageFooter />);
    // This ensures the input is name-able via its label
    const email = screen.getByRole('textbox', { name: /email address/i });
    expect(email).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  test('about page footer newsletter input has an accessible name', async () => {
    const { container } = render(<AboutPageFooter />);
    // This ensures the input is name-able via its label
    const email = screen.getByRole('textbox', { name: /email address/i });
    expect(email).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
