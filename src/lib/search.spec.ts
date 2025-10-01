/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, test } from 'vitest';
import Fuse from 'fuse.js';
import catalog from '../../data/products.optimized.json';

const items: unknown[] = (catalog as any).items ?? [];

describe('client-side search (static catalog)', () => {
  test('finds items by title substring', () => {
    expect(items.length).toBeGreaterThan(0);
    const fuse = new Fuse(items, { keys: ['title', 'category', 'asin'], threshold: 0.35 });
    const q = String((items[0] as { title: string }).title).slice(0, 4);
    const hits = fuse.search(q).map(r => r.item);
    const firstItem = items[0] as { asin: string };
    expect(hits.some(x => (x as { asin: string }).asin === firstItem.asin)).toBe(true);
  });
});
