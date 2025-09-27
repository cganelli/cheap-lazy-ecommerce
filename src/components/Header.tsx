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
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-1.5">
        <div className="flex items-center gap-4">
          <Link href="/" style={{color: '#1D3557'}}>Home</Link>
          <Link href="/about" style={{color: '#1D3557'}}>About</Link>
          <Link href="/privacy" style={{color: '#1D3557'}}>Privacy</Link>
          <Link href="/terms" style={{color: '#1D3557'}}>Terms</Link>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
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
          
          {/* one single row for the small copy (wraps as needed on tiny screens) */}
          <div className="flex flex-wrap items-center gap-x-2 text-[11px] sm:text-xs text-slate-700">
            <span>We respect your privacy.</span>
            <span className="hidden sm:inline">•</span>
            <span>Unsubscribe anytime.</span>
            <span className="hidden sm:inline">•</span>
            <span>As an Amazon Associate, I may earn commissions from qualifying purchases.</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
