import { buildProductJsonLd } from '@/lib/productJsonLd';

describe('product JSON-LD builder', () => {
  it('omits optional fields when not shown', () => {
    const ld = buildProductJsonLd({
      asin: 'X',
      title: 'Test',
      imageUrl: 'https://example.com/i.jpg',
      affiliateUrl: 'https://amazon.com/...'
    });
    expect(ld.offers).toBeUndefined();
    expect(ld.aggregateRating).toBeUndefined();
  });

  it('includes offers when price is shown', () => {
    const ld = buildProductJsonLd({
      asin: 'X',
      title: 'Test',
      imageUrl: 'https://example.com/i.jpg',
      affiliateUrl: 'https://amazon.com/...',
      price: '19.99',
      currency: 'USD',
      inStock: true,
      showPrice: true
    });
    expect(ld.offers.price).toBe('19.99');
    expect(ld.offers.priceCurrency).toBe('USD');
  });
});
