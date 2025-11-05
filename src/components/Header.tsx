'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function Header() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const statusRef = useRef<HTMLDivElement>(null);

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Header build tag: v-mobile-grid-4');
    
    if (!email) {
      setStatus('error');
      setErrorMessage('Email is required');
      if (statusRef.current) {
        statusRef.current.textContent = 'Email is required';
      }
      return;
    }
    if (!email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      if (statusRef.current) {
        statusRef.current.textContent = 'Please enter a valid email address';
      }
      return;
    }
    
    setStatus('success');
    setErrorMessage('');
    setEmail('');
    
    if (statusRef.current) {
      statusRef.current.textContent = 'Thank you for subscribing!';
    }
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setStatus('idle');
      if (statusRef.current) {
        statusRef.current.textContent = '';
      }
    }, 3000);
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
          <div className="col-span-12 sm:order-2 sm:col-span-4 sm:justify-end">
            <form
              onSubmit={handleNewsletterSignup}
              className="flex items-center gap-2"
              aria-label="Newsletter signup"
            >
              <label htmlFor="hdr-email" className="sr-only">
                Email address
              </label>
              <input
                id="hdr-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-describedby="hdr-email-help"
                className="w-[min(420px,100%)] rounded border px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
              />
              <button
                type="submit"
                className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
              >
                Subscribe
              </button>
            </form>
            <p id="hdr-email-help" className="sr-only">
              Enter a valid email address.
            </p>
            <div ref={statusRef} id="hdr-status" role="status" aria-live="polite" className="sr-only" />
          </div>

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
