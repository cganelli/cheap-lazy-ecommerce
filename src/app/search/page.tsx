'use client';
import { Suspense, useMemo } from 'react';
import Fuse from 'fuse.js';
import { useSearchParams } from 'next/navigation';
import { products } from '@/lib/static-products';
import { ProductCardImage } from '@/components/ProductCardImage';

function SearchContent() {
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const fuse = useMemo(() => new Fuse(products, {
    keys: ['title', 'category', 'asin'],
    threshold: 0.35,
    ignoreLocation: true,
  }), []);
  const results = q ? fuse.search(q).map(r => r.item) : products;

  return (
    <main id="main" className="mx-auto max-w-6xl p-4">
      <h1 className="mb-3 text-lg font-semibold">Search</h1>
      <p className="mb-6 text-sm text-gray-600">Results for "{q}" — {results.length} items</p>
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {results.map(p => (
          <article key={p.asin} className="flex flex-col">
            <ProductCardImage
              src={p.image_url}
              srcSet={p.image_srcset}
              alt={p.title}
              ratio={p.image_ratio ?? 4/5}
            />
            <h3 className="mt-2 text-sm font-medium leading-tight">{p.title}</h3>
            {p.affiliate_url && (
              <a
                href={p.affiliate_url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="mt-1 text-xs underline"
              >
                View on Amazon
              </a>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}
