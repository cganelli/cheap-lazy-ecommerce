'use client';
// Use TDD approach and follow all CLAUDE.md best practices including proper testing,
// code quality checks, and implementation standards.

import { useEffect } from 'react';

function scrollToId(id: string, extraOffset = 0) {
  const target = document.getElementById(id);
  if (!target) return;

  const header = document.querySelector('header') as HTMLElement | null;
  const headerH = header ? header.getBoundingClientRect().height : 0;

  // If About has a hero with id="about-hero", measure it dynamically
  const hero = document.getElementById('about-hero') as HTMLElement | null;
  const heroH = hero ? hero.getBoundingClientRect().height : 0;

  const y = target.getBoundingClientRect().top + window.scrollY - (headerH + heroH + extraOffset);
  window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
}

export default function HashAnchor({ id, extraOffset = 16 }: { id: string; extraOffset?: number }) {
  useEffect(() => {
    const apply = () => {
      if (window.location.hash === `#${id}`) scrollToId(id, extraOffset);
    };
    // on mount
    apply();
    // on hash change
    window.addEventListener('hashchange', apply);
    // after late layout settles
    window.addEventListener('load', apply);
    return () => {
      window.removeEventListener('hashchange', apply);
      window.removeEventListener('load', apply);
    };
  }, [id, extraOffset]);

  if (typeof window !== 'undefined') console.log('HashAnchor tag: v-hash-anchor-2 for', id);
  return null;
}
