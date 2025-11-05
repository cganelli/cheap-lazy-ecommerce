'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { products as defaultProducts } from '@/lib/static-products';

type Item = {
  asin: string;
  title: string;
  category?: string;
  affiliate_url?: string;
  image_url: string;
  image_srcset?: string;
  image_ratio?: number;
};

export default function SearchBox({
  items = defaultProducts,
  maxResults = 8,
}: { items?: Item[]; maxResults?: number }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = 'searchbox-listbox';

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ['title', 'category', 'asin'],
        threshold: 0.35,
        ignoreLocation: true,
        includeScore: false,
      }),
    [items]
  );

  const results = q
    ? fuse.search(q).map(r => r.item).filter(i => !!i.affiliate_url).slice(0, maxResults)
    : [];

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) setOpen(true);
    if (!results.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const sel = results[active];
      if (sel?.affiliate_url) window.open(sel.affiliate_url, '_blank', 'noopener,noreferrer');
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative w-full max-w-xl">
      <label htmlFor="site-search" className="sr-only">Search products</label>
      <input
        id="site-search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => q && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search products…"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open}
        role="combobox"
        className="w-full rounded-md border px-3 py-2 shadow-sm outline-none focus:ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
      />

      {open && results.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-96 w-full overflow-auto rounded-lg border bg-white shadow-xl"
        >
          {results.map((p, i) => (
            <li
              key={p.asin}
              role="option"
              aria-selected={i === active}
              className={`flex items-center gap-3 p-2 hover:bg-gray-50 ${i === active ? 'bg-gray-100' : ''}`}
              onMouseEnter={() => setActive(i)}
            >
              <a
                href={p.affiliate_url}
                target="_blank"
                rel="sponsored noopener noreferrer"
                aria-label={`Buy ${p.title} on Amazon (opens in a new tab)`}
                className="flex w-full items-center gap-3"
              >
                {/* Thumbnail (portrait ~4/5, 64x80) */}
                <div className="shrink-0 overflow-hidden rounded-md bg-white" style={{ width: 64, height: 80 }}>
                  <img
                    src={p.image_url}
                    srcSet={p.image_srcset}
                    sizes="80px"
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                    width={64}
                    height={80}
                  />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium leading-tight">{p.title}</div>
                  {p.category ? <div className="truncate text-xs text-gray-700">{p.category}</div> : null}
                </div>
              </a>
            </li>
          ))}

          {/* Optional link to a full results page */}
          <li className="border-t p-2 text-right text-xs">
            <a href={`/search?q=${encodeURIComponent(q)}`} className="underline">View all results</a>
          </li>
        </ul>
      )}
    </div>
  );
}
