import React from 'react';

export const metadata = { title: 'Accessibility | Cheap & Lazy Stuff' };

export default function AccessibilityPage() {
  return (
    <main id="main" className="prose max-w-3xl mx-auto px-4 py-10" style={{ color: '#1D3557' }}>
      <h1>Accessibility Statement</h1>
      <p>We're committed to making this site accessible and usable for everyone.</p>
      <h2>Standards</h2>
      <p>We aim to conform to WCAG 2.0 Level AA across key pages and user flows.</p>
      <h2>Feedback</h2>
      <p>
        If you encounter a barrier, please email us at
        {' '}<a href="mailto:hello@cheapandlazystuff.com">hello@cheapandlazystuff.com</a>.
        We'll do our best to help and address the issue.
      </p>
      <h2>Known issues</h2>
      <ul>
        <li>We're continuously improving keyboard focus order and announcements.</li>
      </ul>
      <h2>Third-party content</h2>
      <p>Some product pages link to Amazon; accessibility on third-party sites may vary.</p>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </main>
  );
}
