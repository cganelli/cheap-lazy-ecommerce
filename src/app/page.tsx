/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import TrendingSection from '@/components/TrendingSection'
import CategorySection from '@/components/CategorySection'
import CategoryNavigation from '@/components/CategoryNavigation'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'
import { ProductCardImage } from '@/components/ProductCardImage'
import Fuse from 'fuse.js'
import SearchBox from '@/components/SearchBox'
import { getProductsSync } from '@/lib/static-products'
import CategoryShelf from '@/components/CategoryShelf'
import { products } from '@/lib/static-products'
import { mergeReviewUrls } from '@/lib/mergeReviewUrls'
import MyReviewsSection from '@/components/MyReviewsSection'

function byCategory() {
  // Merge review URLs before categorizing
  const productsWithReviews = mergeReviewUrls(products);
  const map = new Map<string, typeof productsWithReviews>();
  for (const p of productsWithReviews) {
    const key = p.category ?? 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  // Sort categories by name (optional)
  return [...map.entries()].sort((a,b) => a[0].localeCompare(b[0]));
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [footerEmail, setFooterEmail] = useState('')

  // Memoized category list
  const categories = useMemo(() => byCategory(), []);

  // Use direct data loading (bypass problematic useProducts hook)
  const staticProducts = getProductsSync()
  
  // Convert static products to our Product type
  const allProductsRaw = staticProducts.map((p: any) => ({
    id: p.asin,
    title: p.title,
    name: p.title,
    price: p.price || 0,
    description: p.title,
    category: p.category || 'Household',
    image: p.image_url,
    imageSrcSet: p.image_srcset,
    imageBlur: p.image_blur,
    imageRatio: p.image_ratio,
    images: [p.image_url],
    rating: { rate: 4.5, count: 100 },
    amazonUrl: p.affiliate_url,
    availability: 'in_stock',
    sku: p.asin,
    asin: p.asin // Add asin for mergeReviewUrls
  }))
  
  // Merge review URLs from reviewUrls.json
  const allProducts = mergeReviewUrls(allProductsRaw)
  
  // Get categories from products
  const categoryList = [...new Set(allProducts.map((p: any) => p.category)) as Set<string>].map((cat: string) => ({
    id: cat.toLowerCase().replace(/\s+/g, '-'),
    title: cat,
    slug: cat.toLowerCase().replace(/\s+/g, '-'),
    itemCount: allProducts.filter((p: any) => p.category === cat).length,
    isActive: true
  })).sort((a, b) => a.title.localeCompare(b.title))

  // Debug logging
  console.log('📊 Homepage: Products loaded:', allProducts.length)
  console.log('📊 Homepage: Categories loaded:', categoryList.length)

  // Get trending products (first 5 products)
  const trendingProducts = allProducts.slice(0, 5)
  const trendingLoading = false

  // Set up Fuse.js search
  const fuse = useMemo(() => new Fuse(allProducts, {
    keys: ['title', 'category', 'sku'],
    threshold: 0.35,
  }), [allProducts]);

  // Search functionality from Fuse.js
  const searchResults: Product[] = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).map(r => r.item) as Product[];
  }, [fuse, searchQuery]);
  const searchLoading = false

  // Always show static products (no Amazon check needed)
  const usingAmazonProducts = false

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    console.log('Searching for:', query)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)

    // Scroll to the relevant section
    if (category !== 'All Categories') {
      const sectionId = category.toLowerCase().replace(/\s+/g, '-')
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      // Scroll to top for "All Categories"
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFooterNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Footer newsletter signup:', footerEmail);
    
    const status = document.getElementById('footer-email-status');
    if (status) {
      status.textContent = 'Thanks! Please check your email.';
    }
    
    setFooterEmail('');
  }

  // Group products by category for display
  const productsByCategory = allProducts.reduce((acc: Record<string, any[]>, product: any) => {
    const category = product.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(product)
    return acc
  }, {} as Record<string, typeof allProducts>)

  // Simple debug logging
  console.log('📊 Homepage: Products loaded:', allProducts.length)
  console.log('📊 Homepage: Categories loaded:', categories.length)
  if (allProducts.length > 0) {
    console.log('📊 Homepage: Product categories:', Object.keys(productsByCategory))
  }

  // Show search results if searching
  const showSearchResults = searchQuery.trim().length > 0
  const cats = byCategory();

  return (
    <div className="min-h-screen" style={{backgroundColor: '#A0B5D0'}}>
      <Header />
      
      {/* Category nav pills - Full-bleed band (edge-to-edge) with inner max width */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <CategoryNavigation onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="w-full mb-2 pt-4" style={{backgroundColor: '#A0B5D0', height: '116px', overflow: 'hidden'}}>
        <img
          src="/Cheap-Lazy-Hero-2.png"
          alt="Cheap & Lazy Stuff - Too cheap to waste money. Too lazy to waste time."
          className="w-full h-full object-cover"
        />
      </div>

      <main id="main" className="max-w-7xl mx-auto px-4 pt-4 pb-8">
        <h1 className="sr-only">Cheap & Lazy Stuff - Find the best deals on quality products</h1>
        
        {/* Tagline */}
        <div className="mb-6 flex justify-center">
          <p className="text-3xl font-bold" style={{ color: '#1D3557' }}>
            Too cheap to waste money. Too lazy to waste time.
          </p>
        </div>
        
        {/* Search Box */}
        <div className="mb-8 flex justify-center">
          <SearchBox />
        </div>

        {showSearchResults ? (
          /* Search Results */
          <div className="mb-12" role="region" aria-labelledby="search-results-heading">
            <div className="flex items-center justify-between mb-6">
              <h2 id="search-results-heading" className="text-2xl font-bold custom-blue">
                Search results for "{searchQuery}"
              </h2>
              {searchLoading && (
                <div className="flex items-center text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                  Loading...
                </div>
              )}
            </div>

            {searchLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2 w-3/4"></div>
                    <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {searchResults.map((product: Product) => (
                  <article key={product.id} className="flex flex-col">
                    <ProductCardImage
                      src={product.image}
                      srcSet={(product as any).imageSrcSet}
                      alt={product.title}
                      blur={(product as any).imageBlur}
                      ratio={(product as any).imageRatio && Number.isFinite((product as any).imageRatio) ? (product as any).imageRatio * 1 : 4/5}
                      affiliateUrl={(product as any).amazonUrl}
                      reviewUrl={(product as any).reviewUrl}
                    />
                    <h3 className="mt-2 text-sm font-medium leading-tight">{product.title}</h3>
                  </article>
                ))}
              </section>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching "{searchQuery}".</p>
                <Button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 custom-bg-red hover:bg-red-600 text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* My Reviews Section - Products with review videos */}
            {(() => {
              // ASINs to exclude from My Reviews section (but keep review buttons on thumbnails)
              const excludedFromMyReviews = ['B001FB6IFY', 'B0002AQMZU', 'B01EKUBU5Y', 'B004452DPM']; // Polder, Vet's Best, TruSkin, Chi44
              
              const productsWithReviews = allProducts
                .filter((p: any) => p.reviewUrl && !excludedFromMyReviews.includes(p.sku || p.id))
                .slice(0, 6)
                .map((p: any) => ({
                  asin: p.sku || p.id,
                  title: p.title,
                  reviewUrl: p.reviewUrl,
                  amazonUrl: p.amazonUrl
                }));
              
              return productsWithReviews.length > 0 ? (
                <MyReviewsSection key="My Reviews" items={productsWithReviews} />
              ) : null;
            })()}
            
            {/* Category Shelves */}
            {cats.map(([name, items]) => (
              <CategoryShelf key={name} title={name} items={items} initialLimit={6} />
            ))}
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 bg-white py-8">
          <div className="mx-auto max-w-6xl px-4">
            {/* Newsletter row – keep your current form, but ensure it wraps on mobile */}
            <form
              onSubmit={handleFooterNewsletterSignup}
              className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                name="email"
                type="email"
                autoComplete="email"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                placeholder="Enter your email"
                required
                aria-describedby="footer-email-help"
                className="w-[min(220px,50vw)] sm:w-64 rounded border px-3 py-2 text-sm"
              />
              <p id="footer-email-help" className="sr-only">
                Enter a valid email address.
              </p>
              <button 
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-red-600 text-white"
              >
                Subscribe
              </button>
              <div id="footer-email-status" aria-live="polite" className="sr-only" />
            </form>

            {/* Footer Links */}
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/accessibility">Accessibility</Link>
              {/* NEW: anchored link into About */}
              <Link href="/about#disclosure">Affiliate Disclosure</Link>
            </nav>

            {/* Short disclosure line (kept small on phones) */}
            <p className="mt-6 text-center text-xs text-gray-700 sm:text-sm">
              As an Amazon Associate, I may earn commissions from qualifying purchases.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
