'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type HeaderProps = { showSearch?: boolean }; // no onSearch prop

export default function Header({ showSearch = true }: HeaderProps) {
  const router = useRouter();
  const [q, setQ] = useState(''); // ✅ no useSearchParams here

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = q.trim();
    router.push(next ? '/?q=' + encodeURIComponent(next) : '/');
  }, [q, router]);

  return (
    <header className="border-b">
      <nav className="max-w-5xl mx-auto flex items-center gap-4 p-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>

        {showSearch && (
          <form onSubmit={onSubmit} className="ml-auto flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="border rounded px-2 py-1"
            />
            <button type="submit" className="border rounded px-3 py-1">Search</button>
          </form>
        )}
      </nav>
    </header>
  );
}
