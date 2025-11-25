import reviewUrls from '@/data/reviewUrls.json';

type Product = {
  id?: string;
  title: string;
  asin?: string;
  reviewUrl?: string;
  [k: string]: unknown;
};

/**
 * mergeReviewUrls Function
 * 
 * Merges review URLs from reviewUrls.json into product arrays based on ASIN matching.
 * This allows review URLs to be managed separately from the main product data.
 * 
 * Location: src/lib/mergeReviewUrls.ts
 * Purpose: Merge review URLs into product objects at runtime
 */
export function mergeReviewUrls<T extends Product>(products: T[]): T[] {
  return products.map(p => {
    const key = p.asin?.trim();
    const url = key ? (reviewUrls as Record<string, string>)[key] : undefined;
    return url ? { ...p, reviewUrl: url } as T : p;
  });
}

