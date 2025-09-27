'use client';
// Use TDD approach and follow all CLAUDE.md best practices including proper testing,
// code quality checks, and implementation standards.

import { useEffect } from 'react';

export default function HashAnchor({ id, extraOffset = 0 }: { id: string; extraOffset?: number }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash !== `#${id}`) return;

    const target = document.getElementById(id);
    if (!target) return;

    // Measure header
    const header = document.querySelector('header') as HTMLElement | null;
    const headerH = header ? header.getBoundingClientRect().height : 0;

    // Your About hero banner is 116px tall; include it when on /about
    const heroH = window.location.pathname.startsWith('/about') ? 116 : 0;

    const y = target.getBoundingClientRect().top + window.scrollY - (headerH + heroH + extraOffset);
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
  }, [id, extraOffset]);

  return null;
}
