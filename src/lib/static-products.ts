// API-free product source: imports the static data at build time
import { PRODUCTS, StaticProduct } from './products-data';
import { normalizeCategory, CanonCategory } from './category-normalize';

export type Product = {
  asin: string;
  title: string;
  price: number | null;
  image_url: string;
  category?: CanonCategory;
  affiliate_url: string;
};

export async function getProducts(): Promise<Product[]> {
  const items = PRODUCTS ?? [];

  const normalized: Product[] = items
    .filter((p: any) => p && (p.title || p.affiliate_url))
    .map((p: any) => {
      // numeric price if possible
      let price: number | null = null;
      if (typeof p.price === "number") price = p.price;
      else if (typeof p.price === "string") {
        const n = Number(p.price.replace(/[^\d.]/g, ""));
        price = Number.isFinite(n) ? n : null;
      }

      return {
        asin: String(p.asin || "").toUpperCase(),
        title: String(p.title || ""),
        price,
        image_url: String(p.image_url || ""),
        category: normalizeCategory(p.category, p.title),
        affiliate_url: String(p.affiliate_url || ""),
      };
    });

  console.log('🔍 Normalized products:', normalized.length);
  console.log('🔍 Categories found:', [...new Set(normalized.map(p => p.category))]);
  
  return normalized;
}

// For client-side components that can't use async at top level
export function getProductsSync(): Product[] {
  console.log('🔍 getProductsSync called');
  console.log('🔍 PRODUCTS import:', PRODUCTS);
  console.log('🔍 PRODUCTS length:', PRODUCTS?.length);
  
  // Simple test to verify products are loading
  if (!PRODUCTS || PRODUCTS.length === 0) {
    console.error('❌ PRODUCTS array is empty! Import may have failed.');
    console.error('❌ PRODUCTS value:', PRODUCTS);
    return [];
  }
  
  const items = PRODUCTS ?? [];
  const normalized: Product[] = items
    .filter((p: any) => p && (p.title || p.affiliate_url))
    .map((p: any) => {
      // numeric price if possible
      let price: number | null = null;
      if (typeof p.price === "number") price = p.price;
      else if (typeof p.price === "string") {
        const n = Number(p.price.replace(/[^\d.]/g, ""));
        price = Number.isFinite(n) ? n : null;
      }

      return {
        asin: String(p.asin || "").toUpperCase(),
        title: String(p.title || ""),
        price,
        image_url: String(p.image_url || ""),
        category: normalizeCategory(p.category, p.title),
        affiliate_url: String(p.affiliate_url || ""),
      };
    });

  console.log('✅ Products loaded and normalized successfully:', normalized.length);
  console.log('🔍 Categories found:', [...new Set(normalized.map(p => p.category))]);
  return normalized;
}

// Debug function to check if products are loaded
export function debugProducts(): void {
  console.log('🔍 Debug: PRODUCTS length:', PRODUCTS.length);
  if (PRODUCTS.length > 0) {
    console.log('🔍 Debug: First product:', PRODUCTS[0]);
    console.log('🔍 Debug: Categories:', [...new Set(PRODUCTS.map(p => p.category))]);
  }
}
