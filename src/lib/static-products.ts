// API-free product source: imports the static data at build time
import { PRODUCTS, StaticProduct } from './products-data';

export type Product = StaticProduct;

export async function getProducts(): Promise<Product[]> {
  // no network; this is baked into the build
  return PRODUCTS;
}

// For client-side components that can't use async at top level
export function getProductsSync(): Product[] {
  return PRODUCTS;
}

// Debug function to check if products are loaded
export function debugProducts(): void {
  console.log('Products loaded:', PRODUCTS.length);
  console.log('First product:', PRODUCTS[0]);
}
