'use client';

import { useEffect } from 'react';

/**
 * HashAnchor Component
 * 
 * A client-side component that handles precise scroll offset for hash anchors.
 * Measures header height dynamically and scrolls to the target element with proper offset.
 * 
 * Location: src/components/HashAnchor.tsx
 * Purpose: Provide precise scroll positioning for hash anchors on mobile
 */
export default function HashAnchor({ id }: { id: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash !== `#${id}`) return;

    // measure header height (and any sticky banners) dynamically
    const header = document.querySelector('header');
    const headerH = header ? (header as HTMLElement).getBoundingClientRect().height : 0;

    // optional: account for your hero ribbon on About (116px)
    const heroH = window.location.pathname.startsWith('/about') ? 116 : 0;

    // scroll to the element with a safe offset
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - (headerH + heroH + 16);
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    }
  }, [id]);

  return null;
}
