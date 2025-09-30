/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product, Category, ApiResponse, ProductFilters } from '@/types/product'
import { safeStorage } from '@/lib/safeStorage'

interface AmazonProduct {
  id: string
  title: string
  category: string
  price: number
  originalPrice?: number
  amazonUrl: string
  amazonASIN?: string
  imageUrl: string
  description: string
  yourReview?: string
  rating?: number
  badge?: string
  tags: string[]
  dateAdded: string
  isPurchased: boolean
}

class AmazonProductService {
  private getStoredProducts(): AmazonProduct[] {
    try {
      const stored = safeStorage.get('amazon-products')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load Amazon products:', error)
      return []
    }
  }

  private transformAmazonProduct(amazonProduct: AmazonProduct): Product {
    return {
      id: amazonProduct.id,
      title: amazonProduct.title,
      name: amazonProduct.title,
      price: amazonProduct.price,
      originalPrice: amazonProduct.originalPrice,
      description: amazonProduct.description,
      category: amazonProduct.category,
      image: amazonProduct.imageUrl,
      images: [amazonProduct.imageUrl],
      rating: amazonProduct.rating ? {
        rate: amazonProduct.rating,
        count: amazonProduct.isPurchased ? 1 : 0
      } : undefined,
      badge: amazonProduct.badge,
      amazonUrl: amazonProduct.amazonUrl,
      availability: 'in_stock',
      sku: amazonProduct.amazonASIN || amazonProduct.id,
      tags: amazonProduct.tags,
      brand: 'User Curated'
    }
  }

  async getAllAmazonProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    try {
      const amazonProducts = this.getStoredProducts()
      let products = amazonProducts.map(p => this.transformAmazonProduct(p))

      // Apply filters
      if (filters.category && filters.category !== 'All Categories') {
        products = products.filter(p =>
          p.category.toLowerCase() === filters.category?.toLowerCase()
        )
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        products = products.filter(p =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        )
      }

      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice!)
      }

      if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice!)
      }

      if (filters.rating !== undefined) {
        products = products.filter(p =>
          p.rating && p.rating.rate >= filters.rating!
        )
      }

      // Apply sorting
      if (filters.sortBy) {
        products.sort((a, b) => {
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
            case 'newest':
              // Get the original Amazon product to access dateAdded
              const aOriginal = amazonProducts.find(ap => ap.id === a.id)
              const bOriginal = amazonProducts.find(bp => bp.id === b.id)
              aVal = new Date(aOriginal?.dateAdded || 0).getTime()
              bVal = new Date(bOriginal?.dateAdded || 0).getTime()
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
      const total = products.length
      const page = filters.page || 1
      const limit = filters.limit || 12

      const startIndex = (page - 1) * limit
      const paginatedProducts = products.slice(startIndex, startIndex + limit)

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
      console.error('Failed to fetch Amazon products:', error)
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch Amazon products'
      }
    }
  }

  async getAmazonProductsByCategory(category: string, limit?: number): Promise<ApiResponse<Product[]>> {
    return this.getAllAmazonProducts({ category, limit })
  }

  async searchAmazonProducts(query: string, filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    return this.getAllAmazonProducts({ ...filters, search: query })
  }

  async getAmazonProduct(id: string): Promise<ApiResponse<Product | null>> {
    try {
      const amazonProducts = this.getStoredProducts()
      const amazonProduct = amazonProducts.find(p => p.id === id)

      if (!amazonProduct) {
        return {
          data: null,
          success: false,
          message: 'Product not found'
        }
      }

      return {
        data: this.transformAmazonProduct(amazonProduct),
        success: true
      }
    } catch (error) {
      console.error('Failed to fetch Amazon product:', error)
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch Amazon product'
      }
    }
  }

  async getAmazonCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const amazonProducts = this.getStoredProducts()
      const categoryMap = new Map<string, number>()

      // Count products per category
      amazonProducts.forEach(product => {
        const count = categoryMap.get(product.category) || 0
        categoryMap.set(product.category, count + 1)
      })

      const categories: Category[] = Array.from(categoryMap.entries()).map(([title, count], index) => ({
        id: title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
        title,
        slug: title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
        itemCount: count,
        isActive: true,
        sortOrder: index,
        headingImage: `/${title.toUpperCase().replace(/\s+/g, '_')}_RED_TOUCHING.png`
      }))

      // Sort categories alphabetically
      categories.sort((a, b) => a.title.localeCompare(b.title))

      return {
        data: categories,
        success: true
      }
    } catch (error) {
      console.error('Failed to fetch Amazon categories:', error)
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch Amazon categories'
      }
    }
  }

  // Get featured/trending products (recently added or highly rated)
  async getTrendingAmazonProducts(limit: number = 5): Promise<ApiResponse<Product[]>> {
    try {
      const amazonProducts = this.getStoredProducts()

      // Sort by rating and recent additions
      const trendingProducts = amazonProducts
        .sort((a, b) => {
          // Prioritize purchased items and high ratings
          const aScore = (a.isPurchased ? 10 : 0) + (a.rating || 0) * 2
          const bScore = (b.isPurchased ? 10 : 0) + (b.rating || 0) * 2

          if (aScore !== bScore) {
            return bScore - aScore
          }

          // Then by date added (newest first)
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        })
        .slice(0, limit)
        .map(p => this.transformAmazonProduct(p))

      return {
        data: trendingProducts,
        success: true
      }
    } catch (error) {
      console.error('Failed to fetch trending Amazon products:', error)
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch trending Amazon products'
      }
    }
  }

  // Get products you've actually purchased (for authentic reviews)
  async getPurchasedProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const amazonProducts = this.getStoredProducts()
      const purchasedProducts = amazonProducts
        .filter(p => p.isPurchased)
        .map(p => this.transformAmazonProduct(p))

      return {
        data: purchasedProducts,
        success: true
      }
    } catch (error) {
      console.error('Failed to fetch purchased products:', error)
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch purchased products'
      }
    }
  }

  // Get stats for admin dashboard
  getProductStats() {
    const products = this.getStoredProducts()
    const categories = new Set(products.map(p => p.category))
    const purchasedCount = products.filter(p => p.isPurchased).length
    const averagePrice = products.length > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0

    return {
      totalProducts: products.length,
      categoryCount: categories.size,
      purchasedCount,
      averagePrice,
      categories: Array.from(categories)
    }
  }

  // Check if we have Amazon products (to decide between Amazon products vs API products)
  hasAmazonProducts(): boolean {
    return this.getStoredProducts().length > 0
  }
}

// Export singleton instance
export const amazonProductService = new AmazonProductService()
export default amazonProductService
