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
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" style={{color: '#1D3557'}}>Home</Link>
          <Link href="/about" style={{color: '#1D3557'}}>About</Link>
          <Link href="/privacy" style={{color: '#1D3557'}}>Privacy</Link>
          <Link href="/terms" style={{color: '#1D3557'}}>Terms</Link>
        </div>

        <div className="flex-1 flex items-center justify-end">
          <div className="text-right">
            <h3 className="text-sm font-semibold mb-1" style={{color: '#1D3557'}}>Get the Best Deals First!</h3>
            <form onSubmit={handleNewsletterSignup} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-[min(220px,50vw)] sm:w-64 rounded border px-2 py-1 text-sm"
              />
              <button type="submit" className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white">Subscribe</button>
            </form>
          </div>
        </div>
      </nav>
      
      {/* Amazon Affiliate Copy - full width on mobile */}
      <div className="mx-auto max-w-6xl px-4 pb-1">
        <p className="w-full text-xs text-slate-700 sm:text-sm">
          As an Amazon Associate, I may earn commissions from qualifying purchases.
        </p>
      </div>
    </header>
  );
}
