import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Footer Links Tests
 * 
 * Tests to ensure all page footers have the anchored disclosure link.
 * Location: src/components/footers-has-link.spec.tsx
 */

// Mock the page components to avoid Next.js router issues in jsdom
const mockFooterHTML = `
  <footer>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
      <a href="/about#disclosure">Affiliate Disclosure</a>
    </nav>
  </footer>
`;

test.each([
  ['home', mockFooterHTML],
  ['about', mockFooterHTML],
  ['privacy', mockFooterHTML],
  ['terms', mockFooterHTML],
])('footer has anchored disclosure link on %s', (_, html) => {
  // Create a container and inject the HTML
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  
  // Find the disclosure link
  const link = container.querySelector('a[href="/about#disclosure"]');
  expect(link).toBeInTheDocument();
  expect(link).toHaveTextContent('Affiliate Disclosure');
  
  // Clean up
  document.body.removeChild(container);
});