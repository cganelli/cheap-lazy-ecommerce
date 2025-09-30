'use client';

// Use TDD approach and follow all CLAUDE.md best practices including proper testing,
// code quality checks, and implementation standards.

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  // Build tag so you can verify in DevTools this header shipped
  if (typeof window !== 'undefined') console.log('Header build tag: v-mobile-grid-3');

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
        {/* ROW 1 (mobile stacked): email top, nav below. Desktop: nav left + email right */}
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-3">
          {/* Email */}
          <form
            onSubmit={handleNewsletterSignup}
            className="order-1 sm:order-none justify-self-end flex items-center gap-2"
          >
            <label htmlFor="hdr-news" className="sr-only">Get the Best Deals First!</label>
            <input
              id="hdr-news"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-[min(240px,70vw)] sm:w-72 rounded border px-3 py-1.5 text-sm"
            />
            <button
              type="submit"
              className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
            >
              Subscribe
            </button>
          </form>

          {/* Horizontal nav */}
          <nav className="order-2 sm:order-none min-w-0 overflow-x-auto [-webkit-overflow-scrolling:touch]">
            <ul className="flex items-center gap-6 whitespace-nowrap snap-x snap-mandatory">
              <li className="snap-start"><Link href="/">Home</Link></li>
              <li className="snap-start"><Link href="/about">About</Link></li>
              <li className="snap-start"><Link href="/privacy">Privacy</Link></li>
              <li className="snap-start"><Link href="/terms">Terms</Link></li>
            </ul>
          </nav>
        </div>

        {/* ROW 2: affiliate sentence left + privacy/unsub right */}
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
