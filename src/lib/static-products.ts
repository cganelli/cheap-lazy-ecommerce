// API-free product source: imports the static data at build time
import catalog from '../../data/products.optimized.json';

export type Product = {
  asin: string;
  title: string;
  category?: string;
  image_url: string;
  image_srcset?: string;
  image_blur?: string;
  image_ratio?: number; // width/height, e.g., 4/5 for portrait
  affiliate_url: string;
  price?: number | null;
};

export const products: Product[] = (catalog as Record<string, unknown>).items as Product[] ?? [];

export async function getProducts(): Promise<Product[]> {
  return products;
}

// For client-side components that can't use async at top level
export function getProductsSync(): Product[] {
  console.log('🔍 getProductsSync called');
  console.log('🔍 products length:', products?.length);
  
  return products;
}

// Debug function to check if products are loaded
export function debugProducts(): void {
  console.log('🔍 Debug: products length:', products.length);
  if (products.length > 0) {
    console.log('🔍 Debug: First product:', products[0]);
    console.log('🔍 Debug: Categories:', [...new Set(products.map(p => p.category))]);
  }
}
