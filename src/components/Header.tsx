'use client';

// Use TDD approach and follow all CLAUDE.md best practices including proper testing,
// code quality checks, and implementation standards.

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  // build tag so you can confirm the deployed version in DevTools
  if (typeof window !== 'undefined') console.log('Header build tag: v-mobile-grid-2');

  const [email, setEmail] = useState('');

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <header className="border-b bg-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 py-3">
        {/* ROW 1: nav (left) + email form (right) — stays ONE ROW even on phones */}
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          {/* Horizontal nav with safe overflow on very small screens */}
          <nav className="min-w-0 overflow-x-auto">
            <ul className="flex items-center gap-6 whitespace-nowrap">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </nav>

          {/* Email signup pinned to right at all widths */}
          <form onSubmit={handleNewsletterSignup} className="justify-self-end flex items-center gap-2">
            <label htmlFor="hdr-news" className="sr-only">Get the Best Deals First!</label>
            <input
              id="hdr-news"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-[min(240px,48vw)] sm:w-72 rounded border px-3 py-1.5 text-sm"
            />
            <button
              type="submit"
              className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* ROW 2: affiliate sentence FIRST (left) + privacy/unsub RIGHT under input */}
        <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-3 text-[11px] sm:text-xs text-slate-700">
          <div className="truncate">
            As an Amazon Associate, I may earn commissions from qualifying purchases.
          </div>
          <div className="justify-self-end flex items-center gap-2">
            <span>We respect your privacy.</span>
            <span className="hidden sm:inline">•</span>
            <span>Unsubscribe anytime.</span>
          </div>
        </div>
      </div>
    </header>
  );
}
