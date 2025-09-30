/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product, Category, ApiResponse, ProductFilters, ApiProviderName, API_PROVIDERS } from '@/types/product'

// Cache for API responses (simple in-memory cache)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

// Cache TTL in milliseconds
const CACHE_TTL = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 30 * 60 * 1000, // 30 minutes
  SEARCH: 2 * 60 * 1000 // 2 minutes
}

class ProductApiService {
  private activeProvider: ApiProviderName = 'FAKE_STORE'

  constructor() {
    // Initialize with available provider
    this.setActiveProvider()
  }

  private setActiveProvider() {
    // Find the first active provider
    const provider = Object.entries(API_PROVIDERS).find(([_, config]) => config.isActive)
    if (provider) {
      this.activeProvider = provider[0] as ApiProviderName
    }
  }

  private getCacheKey(method: string, params?: any): string {
    return `${this.activeProvider}_${method}_${JSON.stringify(params || {})}`
  }

  private getFromCache<T>(key: string): T | null {
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T
    }
    cache.delete(key)
    return null
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    cache.set(key, { data, timestamp: Date.now(), ttl })
  }

  private async fetchWithCache<T>(
    url: string,
    cacheKey: string,
    ttl: number,
    options?: RequestInit
  ): Promise<T> {
    // Check cache first
    const cached = this.getFromCache<T>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      this.setCache(cacheKey, data, ttl)
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // FakeStore API implementation
  private async fetchFromFakeStore<T>(endpoint: string): Promise<T> {
    const baseUrl = API_PROVIDERS.FAKE_STORE.baseUrl
    const url = `${baseUrl}${endpoint}`
    const cacheKey = this.getCacheKey('fakestore', endpoint)

    return this.fetchWithCache<T>(url, cacheKey, CACHE_TTL.PRODUCTS)
  }

  private transformFakeStoreProduct(item: any): Product {
    return {
      id: item.id,
      title: item.title,
      name: item.title, // For backward compatibility
      price: item.price,
      description: item.description,
      category: item.category,
      image: item.image,
      images: [item.image],
      rating: item.rating,
      amazonUrl: '#', // Placeholder
      availability: 'in_stock',
      sku: `FS-${item.id}`
    }
  }

  private mapCategoryName(apiCategory: string): string {
    const categoryMap: Record<string, string> = {
      "men's clothing": "Fashion",
      "women's clothing": "Fashion",
      "jewelery": "Beauty",
      "electronics": "Electronics"
    }
    return categoryMap[apiCategory] || apiCategory.charAt(0).toUpperCase() + apiCategory.slice(1)
  }

  // Public API methods
  async getAllProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    try {
      let products: Product[] = []

      switch (this.activeProvider) {
        case 'FAKE_STORE':
          const fakeStoreData = await this.fetchFromFakeStore<any[]>('/products')
          products = fakeStoreData.map(item => this.transformFakeStoreProduct(item))
          break

        default:
          throw new Error(`Provider ${this.activeProvider} not implemented`)
      }

      // Apply filters
      let filteredProducts = products

      if (filters.category && filters.category !== 'All Categories') {
        filteredProducts = filteredProducts.filter(p =>
          p.category.toLowerCase() === filters.category?.toLowerCase() ||
          this.mapCategoryName(p.category).toLowerCase() === filters.category?.toLowerCase()
        )
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredProducts = filteredProducts.filter(p =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        )
      }

      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!)
      }

      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!)
      }

      if (filters.rating !== undefined) {
        filteredProducts = filteredProducts.filter(p =>
          p.rating && p.rating.rate >= filters.rating!
        )
      }

      // Apply sorting
      if (filters.sortBy) {
        filteredProducts.sort((a, b) => {
          let aVal: any, bVal: any

          switch (filters.sortBy) {
            case 'price':
              aVal = a.price
              bVal = b.price
              break
            case 'rating':
              aVal = a.rating?.rate || 0
              bVal = b.rating?.rate || 0
              break
            case 'name':
              aVal = a.title.toLowerCase()
              bVal = b.title.toLowerCase()
              break
            default:
              return 0
          }

          if (filters.sortOrder === 'desc') {
            return bVal > aVal ? 1 : -1
          }
          return aVal > bVal ? 1 : -1
        })
      }

      // Apply pagination
      const total = filteredProducts.length
      const page = filters.page || 1
      const limit = filters.limit || 12

      const startIndex = (page - 1) * limit
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit)

      return {
        data: paginatedProducts,
        success: true,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch products'
      }
    }
  }

  async getProductsByCategory(category: string, limit?: number): Promise<ApiResponse<Product[]>> {
    return this.getAllProducts({ category, limit })
  }

  async searchProducts(query: string, filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    return this.getAllProducts({ ...filters, search: query })
  }

  async getProduct(id: string | number): Promise<ApiResponse<Product | null>> {
    try {
      let product: Product | null = null

      switch (this.activeProvider) {
        case 'FAKE_STORE':
          const fakeStoreData = await this.fetchFromFakeStore<any>(`/products/${id}`)
          product = this.transformFakeStoreProduct(fakeStoreData)
          break

        default:
          throw new Error(`Provider ${this.activeProvider} not implemented`)
      }

      return {
        data: product,
        success: true
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch product'
      }
    }
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const cacheKey = this.getCacheKey('categories')
      const cached = this.getFromCache<Category[]>(cacheKey)
      if (cached) {
        return { data: cached, success: true }
      }

      let categories: Category[] = []

      switch (this.activeProvider) {
        case 'FAKE_STORE':
          const fakeStoreCategories = await this.fetchFromFakeStore<string[]>('/products/categories')
          categories = fakeStoreCategories.map((cat, index) => ({
            id: cat,
            title: this.mapCategoryName(cat),
            slug: cat.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
            itemCount: 0, // Will be calculated
            isActive: true,
            sortOrder: index
          }))
          break

        default:
          throw new Error(`Provider ${this.activeProvider} not implemented`)
      }

      // Calculate item counts
      const allProducts = await this.getAllProducts()
      if (allProducts.success) {
        categories.forEach(category => {
          category.itemCount = allProducts.data.filter(p =>
            this.mapCategoryName(p.category) === category.title
          ).length
        })
      }

      this.setCache(cacheKey, categories, CACHE_TTL.CATEGORIES)

      return {
        data: categories,
        success: true
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch categories'
      }
    }
  }

  // Cache management
  clearCache(): void {
    cache.clear()
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    }
  }

  // Provider management
  setProvider(provider: ApiProviderName): void {
    if (API_PROVIDERS[provider]?.isActive) {
      this.activeProvider = provider
      this.clearCache() // Clear cache when switching providers
    } else {
      throw new Error(`Provider ${provider} is not active or doesn't exist`)
    }
  }

  getActiveProvider(): ApiProviderName {
    return this.activeProvider
  }

  getAvailableProviders(): ApiProviderName[] {
    return Object.entries(API_PROVIDERS)
      .filter(([_, config]) => config.isActive)
      .map(([name]) => name) as ApiProviderName[]
  }
}

// Export singleton instance
export const productApi = new ProductApiService()
export default productApi
