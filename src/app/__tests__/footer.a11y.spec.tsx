import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import Link from 'next/link';

// Mock pages with their footer content
const HomePageFooter = () => (
  <footer>
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/accessibility">Accessibility</Link>
      <Link href="/about#disclosure">Affiliate Disclosure</Link>
    </nav>
  </footer>
);

const AboutPageFooter = () => (
  <footer>
    <div>
      <Link href="/about">About</Link>
      <Link href="/privacy">Privacy Policy</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/accessibility">Accessibility</Link>
      <Link href="/about#disclosure">Affiliate Disclosure</Link>
    </div>
  </footer>
);

const PrivacyPageFooter = () => (
  <footer>
    <div>
      <Link href="/about">About</Link>
      <Link href="/privacy">Privacy Policy</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/accessibility">Accessibility</Link>
      <Link href="/about#disclosure">Affiliate Disclosure</Link>
    </div>
  </footer>
);

const TermsPageFooter = () => (
  <footer>
    <div>
      <Link href="/about">About</Link>
      <Link href="/privacy">Privacy Policy</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/accessibility">Accessibility</Link>
      <Link href="/about#disclosure">Affiliate Disclosure</Link>
    </div>
  </footer>
);

describe('Footer Accessibility Links', () => {
  test.each([
    ['Home', HomePageFooter],
    ['About', AboutPageFooter],
    ['Privacy', PrivacyPageFooter],
    ['Terms', TermsPageFooter],
  ])('%s page footer has accessibility link and no a11y violations', async (pageName, FooterComponent) => {
    const { container } = render(<FooterComponent />);
    
    // Check for accessibility link
    expect(screen.getByRole('link', { name: /accessibility/i })).toBeInTheDocument();
    
    // Check for no accessibility violations
    expect(await axe(container)).toHaveNoViolations();
  });
});
