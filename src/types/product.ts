// Product and API types for dynamic product management

export interface Product {
  id: string | number
  title: string
  name?: string // For backward compatibility
  price: number
  originalPrice?: number
  description: string
  category: string
  image: string
  images?: string[]
  rating?: {
    rate: number
    count: number
  }
  badge?: string
  discount?: string
  amazonUrl?: string
  availability?: 'in_stock' | 'out_of_stock' | 'limited'
  brand?: string
  sku?: string
  tags?: string[]
}

export interface Category {
  id: string
  title: string
  name?: string // For backward compatibility
  slug: string
  description?: string
  image?: string
  headingImage?: string
  itemCount: number
  isActive: boolean
  sortOrder?: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  search?: string
  brand?: string
  tags?: string[]
  sortBy?: 'price' | 'rating' | 'name' | 'newest'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  page?: number
}

export interface ApiProvider {
  name: string
  baseUrl: string
  apiKey?: string
  rateLimitPerMinute: number
  isActive: boolean
}

// API provider configurations
export const API_PROVIDERS = {
  FAKE_STORE: {
    name: 'FakeStore API',
    baseUrl: 'https://fakestoreapi.com',
    rateLimitPerMinute: 60,
    isActive: false // Disabled - using static products instead
  },
  AMAZON_PA: {
    name: 'Amazon Product Advertising',
    baseUrl: 'https://webservices.amazon.com/paapi5',
    rateLimitPerMinute: 8640, // 1 request per 10 seconds
    isActive: false // Requires API key setup
  },
  EBAY: {
    name: 'eBay Browse API',
    baseUrl: 'https://api.ebay.com/buy/browse/v1',
    rateLimitPerMinute: 5000,
    isActive: false // Requires API key setup
  }
} as const

export type ApiProviderName = keyof typeof API_PROVIDERS
