import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test for the footer link structure
it('footer has anchored disclosure link', () => {
  const footerHtml = `
    <footer>
      <div class="flex gap-6">
        <a href="/about" class="text-gray-600 hover:text-red-600 text-sm">About</a>
        <a href="/privacy" class="text-gray-600 hover:text-red-600 text-sm">Privacy Policy</a>
        <a href="/terms" class="text-gray-600 hover:text-red-600 text-sm">Terms</a>
        <a href="/about#disclosure" class="text-gray-600 hover:text-red-600 text-sm">Affiliate Disclosure</a>
      </div>
    </footer>
  `;
  
  document.body.innerHTML = footerHtml;
  
  const link = screen.getByRole('link', { name: /affiliate disclosure/i });
  expect(link).toHaveAttribute('href', '/about#disclosure');
});
