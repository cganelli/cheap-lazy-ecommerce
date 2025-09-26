'use client';

import React, { useMemo, useRef, useState } from 'react';
import { ProductCardImage } from '@/components/ProductCardImage';

export type Product = {
  asin: string; title: string; category?: string;
  affiliate_url?: string; image_url: string; image_srcset?: string; image_ratio?: number;
};

export default function CategoryShelf({
  title, items, initialLimit = 6,
}: { title: string; items: Product[]; initialLimit?: number }) {
  const [expanded, setExpanded] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const shown = expanded ? items : items.slice(0, initialLimit);
  const canScroll = useMemo(() => !expanded && items.length > initialLimit, [expanded, items.length, initialLimit]);

  function scroll(dir: 'left' | 'right') {
    const el = trackRef.current;
    if (!el || typeof el.scrollBy !== 'function') return;
    const delta = (el.clientWidth - 64) * (dir === 'left' ? -1 : 1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }

  return (
    <section className="my-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-3">
          {!expanded && <span className="text-sm text-gray-600">See all {items.length} items</span>}
          {canScroll && (
            <div className="flex gap-2">
              <button aria-label="Scroll left" onClick={() => scroll('left')}
                      className="rounded border bg-white px-2 py-1 shadow-sm">‹</button>
              <button aria-label="Scroll right" onClick={() => scroll('right')}
                      className="rounded border bg-white px-2 py-1 shadow-sm">›</button>
            </div>
          )}
        </div>
      </div>

      {/* Track */}
      {!expanded ? (
        <div ref={trackRef}
             className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1"
             style={{ scrollPaddingLeft: 8, scrollSnapType: 'x mandatory' }}>
          {shown.map(p => (
            <article key={p.asin} className="snap-start shrink-0 w-44 sm:w-56">
              <ProductCardImage
                src={p.image_url} srcSet={p.image_srcset} alt={p.title}
                ratio={p.image_ratio ?? 4/5}
              />
              <h3 className="mt-2 text-sm font-medium leading-tight line-clamp-2">{p.title}</h3>
              {p.affiliate_url && (
                <a href={p.affiliate_url} target="_blank" rel="nofollow sponsored noopener noreferrer"
                   className="mt-1 block text-xs underline">View on Amazon</a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map(p => (
            <article key={p.asin}>
              <ProductCardImage src={p.image_url} srcSet={p.image_srcset}
                                alt={p.title} ratio={p.image_ratio ?? 4/5} />
              <h3 className="mt-2 text-sm font-medium leading-tight line-clamp-2">{p.title}</h3>
              {p.affiliate_url && (
                <a href={p.affiliate_url} target="_blank" rel="nofollow sponsored noopener noreferrer"
                   className="mt-1 block text-xs underline">View on Amazon</a>
              )}
            </article>
          ))}
        </div>
      )}

      {/* View all / Collapse */}
      <div className="mt-6 flex justify-center">
        {!expanded ? (
          <button onClick={() => setExpanded(true)}
                  className="rounded-2xl border px-6 py-2 text-base font-medium shadow-sm">
            View All {items.length} Items
          </button>
        ) : (
          <button onClick={() => { setExpanded(false); trackRef.current?.scrollTo({ left: 0, behavior: 'smooth' }); }}
                  className="rounded-2xl border px-6 py-2 text-base font-medium shadow-sm">
            Collapse
          </button>
        )}
      </div>
    </section>
  );
}
