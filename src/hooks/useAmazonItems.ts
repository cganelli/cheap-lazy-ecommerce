'use client';

import { useEffect, useState } from 'react';

export type AmazonCardItem = {
  asin: string;
  title: string;
  imageUrl: string;
  affiliateUrl: string;
  brand?: string;
  price?: string;
  currency?: string;
  inStock?: boolean;
  ratingValue?: number;
  reviewCount?: number;
  showPrice?: boolean;
  showRating?: boolean;
};

export function useAmazonItems(asins: string[]) {
  const [items, setItems] = useState<AmazonCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!asins?.length) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = '/.netlify/functions/amazon-items?asins=' + encodeURIComponent(asins.join(','));

    fetch(url)
      .then(r => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.items) setItems(data.items);
        if (data?.errors?.length) console.warn('PA-API Errors', data.errors);
      })
      .catch((e) => !cancelled && setError(String(e)))
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [asins]);

  return { items, loading, error };
}
