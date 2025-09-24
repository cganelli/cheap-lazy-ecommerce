'use client'

// Enforce static generation. If anything dynamic sneaks in, build will error (good TDD guard).
export const dynamic = 'force-static';

import { useState } from 'react'
import Header from '@/components/Header'
import TrendingSection from '@/components/TrendingSection'
import CategorySection from '@/components/CategorySection'
import CategoryNavigation from '@/components/CategoryNavigation'
import { Button } from '@/components/ui/button'
import { useProducts, useCategories, useProductSearch, useProductFilters, useTrendingProducts } from '@/hooks/useProducts'
import { amazonProductService } from '@/services/amazonProductService'
import { useAmazonItems } from '@/hooks/useAmazonItems'
import ProductCard from '@/components/ProductCard'

// Amazon Products Section Component
function AmazonProductsSection() {
  // Only fetch Amazon products if we have real ASINs configured
  // For now, return empty to avoid hanging on fake ASINs
  const ASINS: string[] = []; // Add your real ASINs here when ready
  const { items, loading, error } = useAmazonItems(ASINS);

  // Don't show anything if no ASINs are configured
  if (ASINS.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        <p>No Amazon products configured yet.</p>
        <p className="text-sm mt-2">Add your ASINs to display real products.</p>
      </div>
    );
  }

  return (
    <div>
      {loading && <p className="text-center text-gray-600">Loading products…</p>}
      {error && <p className="text-center text-red-600 text-sm">Error: {error}</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <ProductCard
            key={it.asin}
            {...it}
            ugcBlurb="Small, quick, and easy to clean. Perfect for one person."
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [footerEmail, setFooterEmail] = useState('')

  // Use hooks for dynamic data
  const { filters, updateFilter } = useProductFilters({
    category: selectedCategory === 'All Categories' ? undefined : selectedCategory,
    limit: 8
  })

  const { products: allProducts, loading: allProductsLoading } = useProducts(filters)
  const { products: searchResults, loading: searchLoading } = useProductSearch(searchQuery, { limit: 12 })
  const { categories, loading: categoriesLoading } = useCategories()

  // Get trending products (prioritizes Amazon products)
  const { products: trendingProducts, loading: trendingLoading } = useTrendingProducts(5)

  // Check if using Amazon products
  const usingAmazonProducts = amazonProductService.hasAmazonProducts()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    console.log('Searching for:', query)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    updateFilter('category', category === 'All Categories' ? undefined : category)

    // Scroll to the relevant section
    if (category !== 'All Categories') {
      const element = document.getElementById(category.toLowerCase().replace(/\s+/g, '-'))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleFooterNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Footer newsletter signup:', footerEmail);
    alert('Thank you for subscribing to our newsletter!');
    setFooterEmail('');
  }

  // Group products by category for display
  const productsByCategory = allProducts.reduce((acc, product) => {
    const category = product.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(product)
    return acc
  }, {} as Record<string, typeof allProducts>)

  // Show search results if searching
  const showSearchResults = searchQuery.trim().length > 0

  return (
    <div className="min-h-screen" style={{backgroundColor: '#A0B5D0'}}>
      <Header />
      <CategoryNavigation onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />

      {/* Hero Banner */}
      <div className="w-full mb-4" style={{backgroundColor: '#A0B5D0', height: '200px', overflow: 'hidden'}}>
        <img
          src="/Cheap-Lazy-Hero-2.png"
          alt="Cheap & Lazy Stuff - Too cheap to waste money. Too lazy to waste time."
          className="w-full h-full object-cover"
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Admin Notice for Demo Data */}
        {!usingAmazonProducts && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Using Demo Products</h3>
                <p className="text-sm text-blue-700">
                  You're currently viewing demo products. Add your own Amazon products for authentic affiliate marketing!
                </p>
              </div>
              <a
                href="/admin"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Add Your Products
              </a>
            </div>
          </div>
        )}

        {showSearchResults ? (
          /* Search Results */
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold custom-blue">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-48 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.png'
                          }}
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h4>
                      <div className="flex items-center mb-2">
                        {product.rating && (
                          <>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < Math.floor(product.rating!.rate)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">({product.rating.rate})</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        {product.price !== null ? (
                          <span className="text-lg font-bold custom-red">${product.price.toFixed(2)}</span>
                        ) : (
                          <span className="text-lg font-bold text-gray-500">Price TBD</span>
                        )}
                        <Button size="sm" className="custom-bg-red hover:bg-red-600 text-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
            {/* Trending Section */}
            <div className="mb-12">
              <TrendingSection
                products={trendingProducts.map(p => ({
                  id: p.id.toString(),
                  name: p.title,
                  price: p.price !== null ? `$${p.price.toFixed(2)}` : 'Price TBD',
                  originalPrice: p.originalPrice ? `$${p.originalPrice.toFixed(2)}` : undefined,
                  image: p.image,
                  amazonUrl: p.amazonUrl || '#',
                  badge: p.badge,
                  discount: p.discount
                }))}
                loading={trendingLoading}
              />
            </div>

            {/* Category Sections */}
            <div className="space-y-12">
              {selectedCategory === 'All Categories' ? (
                // Show all categories
                categories.map((category) => {
                  const categoryProducts = productsByCategory[category.id] || []
                  if (categoryProducts.length === 0) return null

                  return (
                    <div key={category.id} id={category.title.toLowerCase().replace(/\s+/g, '-')}>
                      <CategorySection
                        title={category.title}
                        products={categoryProducts.slice(0, 4).map(p => ({
                          id: p.id.toString(),
                          name: p.title,
                          price: p.price !== null ? `$${p.price.toFixed(2)}` : 'Price TBD',
                          image: p.image,
                          amazonUrl: p.amazonUrl || '#',
                          badge: p.badge
                        }))}
                        headingImage={`/${category.title.toUpperCase().replace(/\s+/g, '_')}_RED_TOUCHING.png`}
                        itemCount={category.itemCount}
                        loading={allProductsLoading}
                      />
                    </div>
                  )
                })
              ) : (
                // Show selected category
                <div id={selectedCategory.toLowerCase().replace(/\s+/g, '-')}>
                  <CategorySection
                    title={selectedCategory}
                    products={allProducts.map(p => ({
                      id: p.id.toString(),
                      name: p.title,
                      price: p.price !== null ? `$${p.price.toFixed(2)}` : 'Price TBD',
                      image: p.image,
                      amazonUrl: p.amazonUrl || '#',
                      badge: p.badge
                    }))}
                    headingImage={`/${selectedCategory.toUpperCase().replace(/\s+/g, '_')}_RED_TOUCHING.png`}
                    itemCount={allProducts.length}
                    loading={allProductsLoading}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Amazon Products Section */}
        <div className="bg-white py-12 mb-8">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold custom-blue mb-6 text-center">
              Actually Good Cheap Finds
            </h2>
            <AmazonProductsSection />
          </div>
        </div>

        {/* API Status Indicator */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-3 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${usingAmazonProducts ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className="text-gray-600">
                {usingAmazonProducts ? 'Your Amazon Products' : 'Demo Products (FakeStore API)'}
              </span>
            </div>
            {usingAmazonProducts && (
              <div className="mt-1">
                <a
                  href="/admin"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Manage Products →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            {/* Newsletter Signup Section */}
            <div className="bg-white py-8 mb-8">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-2xl font-bold custom-blue mb-4">Get the Best Deals First!</h2>
                <p className="text-gray-600 mb-6">Subscribe to our newsletter and never miss out on amazing deals, new arrivals, and exclusive offers.</p>
                <form onSubmit={handleFooterNewsletterSignup} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    required
                    className="flex-1 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary h-10 px-4 py-2 custom-bg-red hover:bg-red-600 text-white w-full sm:w-auto" type="submit">
                    Subscribe Now
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-3">We respect your privacy. Unsubscribe anytime.</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">
                © 2025 Cheap & Lazy Stuff. Find great deals on everything you need.
              </p>
              <p className="text-sm text-gray-500">
                {usingAmazonProducts
                  ? 'Amazon Associate Program - Personally Curated Products'
                  : 'Powered by Dynamic Product APIs'
                }
              </p>
            </div>

            {/* Footer Links */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
              <div className="flex gap-6">
                <a href="/about" className="text-gray-600 hover:text-red-600 text-sm">About</a>
                <a href="/privacy" className="text-gray-600 hover:text-red-600 text-sm">Privacy Policy</a>
                <a href="/terms" className="text-gray-600 hover:text-red-600 text-sm">Terms</a>
              </div>

              {/* Social Media Links - 100% larger */}
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-red-600" aria-label="Facebook">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-red-600" aria-label="Instagram">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.197-1.559-.748-.948-1.018-2.143-.754-3.34l.764-3.46c.295-1.338 1.498-2.28 2.894-2.28h5.788c1.396 0 2.599.942 2.894 2.28l.764 3.46c.264 1.197-.006 2.392-.754 3.34-.749.948-1.9 1.559-3.197 1.559H8.449z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-red-600" aria-label="TikTok">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
