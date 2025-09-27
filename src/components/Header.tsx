'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
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
        {/* ROW 1: nav (left) + email form (right) */}
        <div className="grid grid-cols-12 items-center gap-3">
          {/* Nav stays horizontal on mobile; wraps only if truly necessary */}
          <nav className="col-span-12 sm:col-span-8">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </nav>

          {/* Email signup pinned to right */}
          <form onSubmit={handleNewsletterSignup} className="col-span-12 sm:col-span-4 ml-auto flex items-center justify-start sm:justify-end gap-2">
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

        {/* ROW 2: affiliate sentence (left) + privacy/unsub (right, aligned under input) */}
        <div className="mt-2 grid grid-cols-12 items-center gap-3 text-[11px] sm:text-xs text-slate-700">
          {/* Affiliate sentence FIRST per your request */}
          <div className="col-span-12 sm:col-span-8">
            As an Amazon Associate, I may earn commissions from qualifying purchases.
          </div>

          {/* This block lines up under the email input above */}
          <div className="col-span-12 sm:col-span-4 flex justify-start sm:justify-end gap-2">
            <span>We respect your privacy.</span>
            <span className="hidden sm:inline">•</span>
            <span>Unsubscribe anytime.</span>
          </div>
        </div>
      </div>
    </header>
  );
}
