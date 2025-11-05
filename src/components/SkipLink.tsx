import React from 'react';

export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 rounded bg-black px-3 py-2 text-white"
    >
      Skip to main content
    </a>
  );
}
