'use client';
import React, { Suspense, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useSearchParams } from 'next/navigation';
import { products } from '@/lib/static-products';
import { ProductCardImage } from '@/components/ProductCardImage';
import { mergeReviewUrls } from '@/lib/mergeReviewUrls';

function SearchContent() {
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  // Merge review URLs once at load
  const productsWithReviews = useMemo(() => mergeReviewUrls(products), []);
  const fuse = useMemo(() => new Fuse(productsWithReviews, {
    keys: ['title', 'category', 'asin'],
    threshold: 0.35,
    ignoreLocation: true,
  }), [productsWithReviews]);
  const results = q ? fuse.search(q).map(r => r.item) : productsWithReviews;

  return (
    <main id="main" className="mx-auto max-w-6xl p-4">
      <h1 className="mb-3 text-lg font-semibold">Search</h1>
      <p className="mb-6 text-sm text-gray-700">Results for "{q}" — {results.length} items</p>
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {results.map(p => (
          <article key={p.asin} className="flex flex-col" aria-labelledby={`${p.asin}-title`}>
            <ProductCardImage
              src={p.image_url}
              srcSet={p.image_srcset}
              alt={p.title}
              ratio={p.image_ratio ?? 4/5}
              affiliateUrl={p.affiliate_url}
              reviewUrl={'reviewUrl' in p ? (p as { reviewUrl?: string }).reviewUrl : undefined}
            />
            <h3 id={`${p.asin}-title`} className="mt-2 text-sm font-medium leading-tight">{p.title}</h3>
            {p.affiliate_url && (
              <a
                href={p.affiliate_url}
                target="_blank"
                rel="sponsored noopener noreferrer"
                aria-label={`Buy ${p.title} on Amazon (opens in a new tab)`}
                className="mt-1 text-xs underline"
              >
                View on Amazon
              </a>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
