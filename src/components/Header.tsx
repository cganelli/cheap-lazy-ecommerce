'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export default function Header() {
  const router = useRouter();
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
        {/* Row 1: nav on left, email form on right */}
        <div className="flex items-center gap-4">
          <nav className="flex flex-wrap items-center gap-6 text-base">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>

          {/* Right-aligned email box */}
          <form onSubmit={handleNewsletterSignup} className="ml-auto flex items-center gap-2">
            <label htmlFor="newsletter" className="sr-only">Get the Best Deals First!</label>
            <input
              id="newsletter"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[min(240px,48vw)] sm:w-72 rounded border px-3 py-1.5 text-sm"
              required
            />
            <button
              type="submit"
              className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Row 2: small copy on one line (wraps gracefully on tiny screens) */}
        <div className="mt-2 flex flex-wrap items-center gap-x-2 text-[11px] sm:text-xs text-slate-700">
          <span>We respect your privacy.</span>
          <span className="hidden sm:inline">•</span>
          <span>Unsubscribe anytime.</span>
          <span className="hidden sm:inline">•</span>
          <span>As an Amazon Associate, I may earn commissions from qualifying purchases.</span>
        </div>
      </div>
    </header>
  );
}
