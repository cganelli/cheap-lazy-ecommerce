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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
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
                ratio={p.image_ratio ?? 4/5} affiliateUrl={p.affiliate_url}
              />
              <h3 className="mt-2 text-sm font-medium leading-tight line-clamp-2">{p.title}</h3>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map(p => (
            <article key={p.asin}>
              <ProductCardImage src={p.image_url} srcSet={p.image_srcset}
                                alt={p.title} ratio={p.image_ratio ?? 4/5} affiliateUrl={p.affiliate_url} />
              <h3 className="mt-2 text-sm font-medium leading-tight line-clamp-2">{p.title}</h3>
            </article>
          ))}
        </div>
      )}

      {/* View all / Collapse */}
      <div className="mt-6 flex flex-col items-center">
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
        <p className="mt-2 text-xs text-gray-500 text-center">
          As an Amazon Associate, I may earn commissions from qualifying purchases.
        </p>
      </div>
      </div>
    </section>
  );
}
