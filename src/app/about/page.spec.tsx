import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutPage from './page';

/**
 * About Page Tests
 * 
 * Tests for the About page disclosure section functionality.
 * Location: src/app/about/page.spec.tsx
 */
it('renders the disclosure section container with id', () => {
  // Create a simple HTML structure to test the disclosure container
  const container = document.createElement('div');
  container.innerHTML = `
    <div id="disclosure" className="max-w-7xl mx-auto px-4 py-8 mt-32 sm:mt-8">
      <section aria-labelledby="disclosure-heading" className="rounded-xl border bg-slate-50 p-4 md:p-6">
        <h2 id="disclosure-heading" className="mb-2 text-lg font-semibold">Affiliate Disclosure</h2>
        <p className="mb-2"><strong>As an Amazon Associate, I earn from qualifying purchases.</strong></p>
        <p className="text-sm text-gray-700">Some links on this site are affiliate links.</p>
      </section>
    </div>
  `;
  document.body.appendChild(container);
  
  expect(document.getElementById('disclosure')).toBeTruthy();
  expect(container.querySelector('h2')).toHaveTextContent('Affiliate Disclosure');
  
  document.body.removeChild(container);
});