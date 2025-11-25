'use client';

import React, { useMemo, useRef, useState } from 'react';
import { ProductCardImage } from '@/components/ProductCardImage';

export type Product = {
  asin: string; title: string; category?: string;
  affiliate_url?: string; image_url: string; image_srcset?: string; image_ratio?: number; reviewUrl?: string;
};

// Map category names to their stylized image files
const categoryImageMap: Record<string, string> = {
  'My Reviews': '/MY_REVIEWS_RED_TOUCHING_FIXED.png',
  'Beauty': '/BEAUTY_RED_TOUCHING.png',
  'Electronics': '/ELECTRONICS_RED_TOUCHING.png',
  'Hair Care': '/HAIR_CARE_RED_TOUCHING.png',
  'Health': '/HEALTH_RED_TOUCHING.png',
  'Household': '/HOUSEHOLD_RED_TOUCHING.png',
  'Kitchen': '/KITCHEN_RED_TOUCHING.png',
  'Pet Care': '/PET_CARE_RED_TOUCHING.png',
  'Auto': '/AUTO_RED_TOUCHING.png',
  'Child and Baby': '/CHILD_AND_BABY_RED_TOUCHING.png',
  'Dorm Essentials': '/DORM_ESSENTIALS_RED_TOUCHING.png',
  'Games and Entertainment': '/GAMES_AND_ENTERTAINMENT_RED_TOUCHING.png',
  'Garden': '/GARDEN_RED_TOUCHING.png',
  'Special Occasions': '/SPECIAL_OCCASIONS_RED_TOUCHING.png',
  'Sports and Outdoor': '/SPORTS_AND_OUTDOOR_RED_TOUCHING.png',
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

  // Convert category name to kebab-case for ID
  const sectionId = title.toLowerCase().replace(/\s+/g, '-');

  return (
    <section id={sectionId} className="my-8 scroll-mt-20" aria-labelledby={`${sectionId}-heading`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          {categoryImageMap[title] ? (
            <>
              <h2 id={`${sectionId}-heading`} className="sr-only">{title}</h2>
              <img 
                src={categoryImageMap[title]} 
                alt=""
                aria-hidden="true"
                className="h-12 object-contain"
              />
            </>
          ) : (
            <h2 id={`${sectionId}-heading`} className="text-xl font-semibold">{title}</h2>
          )}
        </div>

      {/* Track */}
      {!expanded ? (
        <div className="flex items-center gap-2">
          {canScroll && (
            <button 
              aria-label="Scroll left"
              onClick={() => scroll('left')}
              className="shrink-0 rounded border bg-white px-2 py-1 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
            >
              ‹
            </button>
          )}
          <div ref={trackRef}
               className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1"
               style={{ scrollPaddingLeft: 8, scrollSnapType: 'x mandatory' }}>
            {shown.map(p => (
              <article key={p.asin} className="snap-start shrink-0 w-44 sm:w-56" aria-labelledby={`${p.asin}-title`}>
                <ProductCardImage
                  src={p.image_url} srcSet={p.image_srcset} alt={p.title}
                  ratio={p.image_ratio ?? 4/5} affiliateUrl={p.affiliate_url} reviewUrl={p.reviewUrl}
                />
                <h3 id={`${p.asin}-title`} className="mt-2 text-sm font-medium leading-tight line-clamp-2">{p.title}</h3>
              </article>
            ))}
          </div>
          {canScroll && (
            <button 
              aria-label="Scroll right"
              onClick={() => scroll('right')}
              className="shrink-0 rounded border bg-white px-2 py-1 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
            >
              ›
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map(p => (
            <article key={p.asin} aria-labelledby={`${p.asin}-title`}>
              <ProductCardImage src={p.image_url} srcSet={p.image_srcset}
                                alt={p.title} ratio={p.image_ratio ?? 4/5} affiliateUrl={p.affiliate_url} reviewUrl={p.reviewUrl} />
              <h3 id={`${p.asin}-title`} className="mt-2 text-sm font-medium leading-tight line-clamp-2">{p.title}</h3>
            </article>
          ))}
        </div>
      )}

      {/* View all / Collapse */}
      <div className="mt-6 flex flex-col items-center">
        {!expanded ? (
          <button onClick={() => setExpanded(true)}
                  className="rounded-2xl bg-white px-6 py-2 text-base font-bold shadow-sm ring-4 ring-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-600">
            View All {items.length} Items
          </button>
        ) : (
          <button onClick={() => { setExpanded(false); trackRef.current?.scrollTo({ left: 0, behavior: 'smooth' }); }}
                  className="rounded-2xl bg-white px-6 py-2 text-base font-bold shadow-sm ring-4 ring-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-600">
            Collapse
          </button>
        )}
        <p className="mt-2 text-xs text-red-600 text-center">
          As an Amazon Associate, I may earn commissions from qualifying purchases.
        </p>
      </div>
      </div>
    </section>
  );
}
