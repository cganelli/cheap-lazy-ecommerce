// API-free product source: imports the static data at build time
import { StaticProduct } from './products-data';

// Import the products data directly
const PRODUCTS: StaticProduct[] = [
  {
    "asin": "B0F7LSKLTZ",
    "title": "Dog Bark Deterrent Device, 3X Ultrasonic Anti Barking, 6 Training Modes 23 FT Range Barks No More Indoors Outdoors Behavior Correct Safe & Humane Rechargeable Compact Bark Control for Dogs",
    "price": null,
    "image_url": "https://cheapandlazystuff.com/products/B0F7LSKLTZ.jpg",
    "category": "Pet Care",
    "affiliate_url": "https://amzn.to/4mshS3J"
  },
  {
    "asin": "B087CX6F6X",
    "title": "Geesta Dehydrator Rack Stainless Steel Stand Compatible with Ninja Foodi AG300, AG300C, AG301, AG301C, AG302, AG400, IG301A Ninja Foodi Grill Accessories",
    "price": null,
    "image_url": "https://cheapandlazystuff.com/products/B087CX6F6X.jpg",
    "category": "Kitchen",
    "affiliate_url": "https://amzn.to/3KiWssz"
  }
  // Note: This is a subset for testing. The full 72 products will be loaded from the CSV
];

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
