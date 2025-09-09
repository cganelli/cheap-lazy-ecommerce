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

    const fetchAmazonItems = async () => {
      try {
        const res = await fetch("/.netlify/functions/amazon-items", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-site-key": process.env.NEXT_PUBLIC_SITE_KEY as string,
          },
          body: JSON.stringify({ asins }),
        });
        
        if (!res.ok) {
          throw new Error(`Request failed ${res.status}`);
        }
        
        const data = await res.json();
        if (cancelled) return;
        if (data?.items) setItems(data.items);
        if (data?.errors?.length) console.warn('PA-API Errors', data.errors);
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAmazonItems();
    return () => { cancelled = true; };
  }, [asins]);

  return { items, loading, error };
}
