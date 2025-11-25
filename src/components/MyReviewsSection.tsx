'use client';

import React from 'react';
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
 * 
 * Location: src/components/MyReviewsSection.tsx
 * Purpose: Display review video covers in a dedicated section
 */
export default function MyReviewsSection({ items }: { items: ReviewProduct[] }) {
  if (items.length === 0) return null;

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

        {/* Video covers grid - 6 columns to maintain 9:16 aspect ratio */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <article key={item.asin} className="flex flex-col" aria-labelledby={`${item.asin}-title`}>
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
      </div>
    </section>
  );
}

