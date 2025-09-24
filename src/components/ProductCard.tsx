'use client';

import React from 'react';
import ProductJsonLd from '@/components/ProductJsonLd';
import type { ProductForLd } from '@/lib/productJsonLd';

type Props = ProductForLd & {
  ugcBlurb?: string;
};

export default function ProductCard(p: Props) {
  return (
    <article className="rounded-2xl border p-4 shadow-sm overflow-hidden bg-white">
      <a href={p.affiliateUrl} rel="nofollow sponsored" target="_blank">
        <div className="w-full bg-gray-100 overflow-hidden rounded-xl" style={{aspectRatio: '1/2', height: '300px'}}>
          <img
            src={p.imageUrl}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      </a>

      <h3 className="text-base font-semibold leading-snug mt-3 mb-1">{p.title}</h3>

      {p.ugcBlurb && <p className="text-sm text-gray-700 mb-3">{p.ugcBlurb}</p>}

      <div className="flex items-center gap-3 text-sm text-gray-800 mb-3">
        {p.showPrice && p.price && p.currency && (
          <span className="font-medium">{p.price} {p.currency}</span>
        )}
        {p.showRating && typeof p.ratingValue === 'number' && typeof p.reviewCount === 'number' && (
          <span aria-label={`Rating ${p.ratingValue} out of 5`}>
            ★ {p.ratingValue} ({p.reviewCount})
          </span>
        )}
      </div>

      <a
        href={p.affiliateUrl}
        rel="nofollow sponsored"
        target="_blank"
        className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 active:scale-[.99]"
      >
        View on Amazon
      </a>

      <p className="mt-3 text-[11px] leading-tight text-gray-500">
        As an Amazon Associate, I earn from qualifying purchases.
      </p>

      {/* Structured data must mirror what's visible */}
      <ProductJsonLd {...p} />
    </article>
  );
}
