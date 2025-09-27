import React from 'react';

/**
 * SiteLogo Component
 * 
 * A shared logo component that provides consistent sizing and responsive behavior
 * across all pages. Used in headers, hero sections, and other branding areas.
 * 
 * Location: src/components/SiteLogo.tsx
 * Purpose: Provide consistent logo display with responsive sizing
 */
type Props = { 
  className?: string; 
  src?: string; 
  alt?: string; 
};

export default function SiteLogo({
  className = '',
  src = '/Cheap-Lazy-Hero-2.png',         // <- use the same asset your other pages use
  alt = 'Cheap & Lazy Stuff',
}: Props) {
  return (
    <img
      src={src}
      alt={alt}
      width={1600}
      height={400}
      decoding="async"
      loading="eager"
      className={`h-auto w-[min(92vw,980px)] md:w-[min(88vw,1100px)] ${className}`}
    />
  );
}
