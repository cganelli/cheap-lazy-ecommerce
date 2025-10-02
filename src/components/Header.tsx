'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [email, setEmail] = useState('');

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Header build tag: v-mobile-grid-4');
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <header className="border-b bg-slate-200/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        {/* 
          MOBILE-FIRST STACK (DOM order == mobile order):
          1) Tabs (nav)
          2) Email form
          3) Privacy/Unsubscribe
          4) Amazon affiliate
          
          On desktop (≥sm), we use grid columns + order classes to place:
          - Row 1: Tabs (left, col-span-8), Email (right, col-span-4)
          - Row 2: Affiliate (left, col-span-8), Privacy/Unsub (right, col-span-4)
        */}
        <div className="grid grid-cols-12 gap-x-3 gap-y-2">
          {/* TABS — mobile: first; desktop: row 1 left */}
          <nav
            aria-label="Site"
            className="
              col-span-12
              sm:order-1 sm:col-span-8
            "
          >
            <ul
              className="
                flex items-center gap-x-6
                overflow-x-auto whitespace-nowrap
                [-webkit-overflow-scrolling:touch]
                pr-1
              "
            >
              <li><Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600">Home</Link></li>
              <li><Link href="/about" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600">About</Link></li>
              <li><Link href="/privacy" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600">Privacy</Link></li>
              <li><Link href="/terms" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600">Terms</Link></li>
            </ul>
          </nav>

          {/* EMAIL — mobile: second; desktop: row 1 right */}
          <form
            onSubmit={handleNewsletterSignup}
            className="
              col-span-12 flex items-center gap-2
              sm:order-2 sm:col-span-4 sm:justify-end
            "
            aria-label="Newsletter signup"
          >
            <label htmlFor="hdr-email" className="sr-only">
              Get the Best Deals First!
            </label>
            <input
              id="hdr-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-[min(420px,100%)] rounded border px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
            />
            <button
              type="submit"
              className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
            >
              Subscribe
            </button>
          </form>

          {/* PRIVACY/UNSUB — mobile: third; desktop: row 2 right */}
          <div
            className="
              col-span-12 text-xs text-slate-700
              sm:order-4 sm:col-span-4 sm:flex sm:justify-end
            "
          >
            <div className="flex items-center gap-2">
              <span>We respect your privacy.</span>
              <span className="hidden sm:inline">•</span>
              <span>Unsubscribe anytime.</span>
            </div>
          </div>

          {/* AFFILIATE — mobile: fourth; desktop: row 2 left */}
          <div
            className="
              col-span-12 text-xs text-slate-700
              sm:order-3 sm:col-span-8
            "
          >
            As an Amazon Associate, I may earn commissions from qualifying purchases.
          </div>
        </div>
      </div>
    </header>
  );
}
