// API-free product source: imports the static JSON at build time
import catalog from "../../data/products.json";

export type Product = {
  asin: string;
  title: string;
  price: number | null;
  image_url: string;
  category?: string;
  affiliate_url: string;
};

export async function getProducts(): Promise<Product[]> {
  // no network; this is baked into the build
  const items = (catalog as any)?.items ?? [];
  return items as Product[];
}

// For client-side components that can't use async at top level
export function getProductsSync(): Product[] {
  const items = (catalog as any)?.items ?? [];
  return items as Product[];
}
