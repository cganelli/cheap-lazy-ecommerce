'use client';

import React, { useState } from 'react';
import ReviewDialog from './ReviewDialog';

/**
 * ReviewVideoCover Component
 * 
 * Displays a video cover/thumbnail for review videos. When clicked, opens the review modal.
 * Extracts video ID from Google Drive URLs to generate thumbnail images.
 * 
 * Location: src/components/ReviewVideoCover.tsx
 * Purpose: Display video covers for review videos in the My Reviews section
 */
export function ReviewVideoCover({
  reviewUrl,
  title,
  amazonUrl,
  ratio = 9 / 16
}: {
  reviewUrl: string;
  title: string;
  amazonUrl?: string;
  ratio?: number;
}) {
  const [showReview, setShowReview] = useState(false);

  // Extract video ID from Google Drive URL and generate thumbnail
  const getVideoThumbnail = (url: string): string => {
    // Handle both /file/d/ and /preview formats
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      // Try multiple Google Drive thumbnail URL formats
      // Format 1: uc?export=view (often works for public files)
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    // Fallback: return placeholder
    return '/placeholder-product.png';
  };

  const thumbnailUrl = getVideoThumbnail(reviewUrl);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowReview(true);
        }}
        className="relative w-full overflow-hidden rounded-md bg-transparent transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
        style={{ aspectRatio: String(ratio) }}
        aria-label={`Watch review video for ${title}`}
      >
        {/* Wrapper to scale and center the iframe content - scale adjusted to show 25% wider iframe */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-transparent"
          style={{
            transform: 'scale(0.59375)', // 0.475 * 1.25 = 0.59375 to show 25% wider content
            transformOrigin: 'center center'
          }}
        >
          {/* Iframe sized to match modal dimensions - width increased by 25%, height unchanged */}
          <iframe
            src={`${reviewUrl}?rm=minimal&embedded=true`}
            className="pointer-events-none"
            style={{ 
              border: 'none',
              width: '500px', // 400px * 1.25 = 500px (25% wider)
              height: '711px' // Height unchanged
            }}
            title={`${title} - Review video thumbnail`}
            aria-label={`Video thumbnail preview for ${title}`}
            allow="autoplay; encrypted-media"
          />
        </div>
      </button>

      {/* Modal - only render when open */}
      {showReview && (
        <ReviewDialog
          key={`review-${title}-${reviewUrl}`}
          open={showReview}
          onClose={() => setShowReview(false)}
          title={title}
          reviewUrl={reviewUrl}
          amazonUrl={amazonUrl}
        />
      )}
    </>
  );
}

