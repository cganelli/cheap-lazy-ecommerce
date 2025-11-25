'use client';

import React, { useState } from 'react';
import ReviewDialog from './ReviewDialog';

/**
 * ProductCardImage Component
 * 
 * Displays product images with overlay buttons for "Buy on Amazon" and "See my review" (if reviewUrl is provided).
 * The entire image area is clickable to go to Amazon, with a review button overlay for products that have reviews.
 * 
 * Location: src/components/ProductCardImage.tsx
 * Purpose: Render product thumbnails with affiliate links and optional review modal trigger
 */
export function ProductCardImage({
  src, srcSet, alt, blur, ratio = 4 / 5, affiliateUrl, reviewUrl
}: {
  src: string; srcSet?: string; alt: string; blur?: string; ratio?: number; affiliateUrl?: string; reviewUrl?: string;
}) {
  const [showReview, setShowReview] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden rounded-md bg-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      style={{ aspectRatio: String(ratio) }}
    >
      {/* Base image */}
      {!imageError ? (
        <img
          src={src}
          srcSet={srcSet}
          sizes="(min-width:1024px) 220px, (min-width:640px) 33vw, 50vw"
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full object-contain transition-transform duration-300 hover:scale-110"
          width={800}
          height={1000}
          style={blur ? { backgroundImage: `url(${blur})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } : undefined}
          onError={() => {
            console.error('Image failed to load:', src);
            setImageError(true);
          }}
        />
      ) : (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-gray-100">
          <span className="text-xs text-gray-400">Image not available</span>
        </div>
      )}

      {/* Full-card Amazon link layer */}
      {affiliateUrl ? (
        <a
          href={affiliateUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          aria-label={`Buy ${alt} on Amazon (opens in a new tab)`}
          className="absolute inset-0 z-10 pointer-events-auto"
          style={{ backgroundColor: 'transparent' }}
        >
          <span className="sr-only">Buy on Amazon</span>
        </a>
      ) : null}

      {/* Buy flag (kept) */}
      {affiliateUrl ? (
        <a
          href={affiliateUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="absolute right-2 top-2 z-30 inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-white text-xs font-bold shadow-lg transition-transform duration-300 hover:scale-110"
          aria-label={`Buy ${alt} on Amazon (opens in a new tab)`}
        >
          Buy on Amazon
        </a>
      ) : null}

      {/* Review button */}
      {reviewUrl ? (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowReview(true); }}
          className="absolute left-2 bottom-2 z-30 inline-flex items-center rounded-md bg-white/90 backdrop-blur px-3 py-1 text-sm font-bold shadow ring-4 ring-red-600 text-red-600 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
          aria-label={`See my review of ${alt}. Opens a modal`}
        >
          See my review
        </button>
      ) : null}

      {/* Modal - only render when open to avoid layout interference */}
      {reviewUrl && showReview ? (
        <ReviewDialog
          open={showReview}
          onClose={() => setShowReview(false)}
          title={alt}
          reviewUrl={reviewUrl}
          amazonUrl={affiliateUrl}
        />
      ) : null}
    </div>
  );
}
