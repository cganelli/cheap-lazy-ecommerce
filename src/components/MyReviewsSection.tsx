'use client';

import React, { useRef, useMemo } from 'react';
import { ReviewVideoCover } from './ReviewVideoCover';

type ReviewProduct = {
  asin: string;
  title: string;
  reviewUrl: string;
  amazonUrl?: string;
};

/**
 * MyReviewsSection Component
 * 
 * Displays a section showing video covers for products with review videos.
 * Uses the MY_REVIEWS_RED_TOUCHING_FIXED.png title image.
 * On mobile, shows 2 items at a time with horizontal scrolling and arrow buttons.
 * On larger screens, uses a grid layout.
 * 
 * Location: src/components/MyReviewsSection.tsx
 * Purpose: Display review video covers in a dedicated section
 */
export default function MyReviewsSection({ items }: { items: ReviewProduct[] }) {
  // All hooks must be called at the top level, before any early returns
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Check if scrolling is needed on mobile (more than 2 items)
  const canScroll = useMemo(() => items.length > 2, [items.length]);

  // Early return AFTER all hooks
  if (items.length === 0) return null;

  function scroll(dir: 'left' | 'right') {
    const el = trackRef.current;
    if (!el || typeof el.scrollBy !== 'function') return;
    // Scroll by approximately one item width (50% of container minus gap)
    const delta = (el.clientWidth - 64) * (dir === 'left' ? -1 : 1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }

  return (
    <section id="my-reviews" className="my-8 scroll-mt-20" aria-labelledby="my-reviews-heading">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 id="my-reviews-heading" className="sr-only">My Reviews</h2>
          <img 
            src="/MY_REVIEWS_RED_TOUCHING_FIXED.png" 
            alt=""
            aria-hidden="true"
            className="h-12 object-contain"
          />
        </div>

        {/* Mobile: Horizontal scrolling with arrows, Desktop: Grid layout */}
        <div className="flex items-center gap-2 sm:block">
          {/* Left arrow - only show on mobile when scrolling is possible */}
          {canScroll && (
            <button 
              aria-label="Scroll left to see more reviews"
              onClick={() => scroll('left')}
              className="shrink-0 rounded border bg-white px-2 py-1 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600 sm:hidden"
            >
              ‹
            </button>
          )}
          
          {/* Scrollable container on mobile, grid on desktop */}
          <div 
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible sm:snap-none"
            style={{ scrollPaddingLeft: 8, scrollSnapType: 'x mandatory' }}
          >
            {items.map((item) => (
              <article 
                key={item.asin} 
                className="snap-start shrink-0 w-[calc(50%-0.5rem)] sm:w-auto flex flex-col" 
                aria-labelledby={`${item.asin}-title`}
              >
                <ReviewVideoCover
                  key={`cover-${item.asin}`}
                  reviewUrl={item.reviewUrl}
                  title={item.title}
                  amazonUrl={item.amazonUrl}
                  ratio={9 / 16}
                />
                <h3 id={`${item.asin}-title`} className="mt-2 text-sm font-medium leading-tight line-clamp-2">
                  {item.title}
                </h3>
              </article>
            ))}
          </div>

          {/* Right arrow - only show on mobile when scrolling is possible */}
          {canScroll && (
            <button 
              aria-label="Scroll right to see more reviews"
              onClick={() => scroll('right')}
              className="shrink-0 rounded border bg-white px-2 py-1 shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600 sm:hidden"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

