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
      <nav className="max-w-5xl mx-auto flex items-center gap-4 p-1">
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
                className="border rounded px-2 py-1 text-sm"
              />
              <button type="submit" className="border rounded px-2 py-1 text-sm bg-red-600 text-white hover:bg-red-700">Subscribe</button>
            </form>
          </div>
        </div>
      </nav>
      
      {/* Amazon Affiliate Copy - aligned with privacy text */}
      <div className="max-w-5xl mx-auto px-4 pb-1 flex justify-between items-start">
        <div className="flex items-start">
          <p className="text-lg font-bold whitespace-nowrap" style={{color: '#1D3557', opacity: 0.7}}>
            As an Amazon Associate, I may earn commissions from qualifying purchases.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm" style={{color: '#1D3557'}}>We respect your privacy.</p>
          <p className="text-sm" style={{color: '#1D3557'}}>Unsubscribe anytime.</p>
        </div>
      </div>
    </header>
  );
}
