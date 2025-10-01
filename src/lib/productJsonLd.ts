/* eslint-disable @typescript-eslint/no-explicit-any */
export type ProductForLd = {
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

export function buildProductJsonLd(p: ProductForLd) {
  const ld: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    image: [p.imageUrl],
    sku: p.asin,
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    offers:
      p.showPrice && p.price && p.currency
        ? {
            '@type': 'Offer',
            priceCurrency: p.currency,
            price: p.price.replace(/[^0-9.]/g, '') || p.price, // best effort
            availability:
              p.inStock === false
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
            url: p.affiliateUrl,
          }
        : undefined,
    aggregateRating:
      p.showRating &&
      typeof p.ratingValue === 'number' &&
      typeof p.reviewCount === 'number'
        ? {
            '@type': 'AggregateRating',
            ratingValue: p.ratingValue,
            reviewCount: p.reviewCount,
          }
        : undefined,
  };
  Object.keys(ld).forEach((k) => ld[k] === undefined && delete ld[k]);
  return ld;
}
