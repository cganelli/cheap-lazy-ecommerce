// API-free product source: imports the static data at build time
import { PRODUCTS, StaticProduct } from './products-data';

export type Product = StaticProduct;

export async function getProducts(): Promise<Product[]> {
  // no network; this is baked into the build
  return PRODUCTS;
}

// For client-side components that can't use async at top level
export function getProductsSync(): Product[] {
  // Simple test to verify products are loading
  if (PRODUCTS.length === 0) {
    console.error('❌ PRODUCTS array is empty! Import may have failed.');
    return [];
  }
  
  console.log('✅ Products loaded successfully:', PRODUCTS.length);
  return PRODUCTS;
}

// Debug function to check if products are loaded
export function debugProducts(): void {
  console.log('🔍 Debug: PRODUCTS length:', PRODUCTS.length);
  if (PRODUCTS.length > 0) {
    console.log('🔍 Debug: First product:', PRODUCTS[0]);
    console.log('🔍 Debug: Categories:', [...new Set(PRODUCTS.map(p => p.category))]);
  }
}
