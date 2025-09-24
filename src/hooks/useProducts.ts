'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Product, Category, ProductFilters, ApiResponse } from '@/types/product'
import { getProductsSync, Product as StaticProduct } from '@/lib/static-products'
import { safeStorage } from '@/lib/safeStorage'

// Convert static product to our Product type
function convertStaticProduct(staticProduct: StaticProduct): Product {
  return {
    id: staticProduct.asin,
    title: staticProduct.title,
    name: staticProduct.title,
    price: staticProduct.price || 0,
    description: staticProduct.title,
    category: staticProduct.category || 'Uncategorized',
    image: staticProduct.image_url,
    images: [staticProduct.image_url],
    rating: { rate: 4.5, count: 100 }, // Default rating
    amazonUrl: staticProduct.affiliate_url,
    availability: 'in_stock',
    sku: staticProduct.asin
  }
}

// Hook for fetching all products with filters
export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<ApiResponse<Product[]>['pagination']>()

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Use static products only
      const staticProducts = getProductsSync()
      let filteredProducts = staticProducts.map(convertStaticProduct)

      // Apply filters
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase() === filters.category!.toLowerCase()
        )
      }

      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!)
      }

      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!)
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
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
          } else {
            return aVal > bVal ? 1 : -1
          }
        })
      }

      // Apply pagination
      const limit = filters.limit || 20
      const page = filters.page || 1
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

      setProducts(paginatedProducts)
      setPagination({
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const refetch = useCallback(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    pagination,
    refetch
  }
}

// Hook for fetching products by category
export function useProductsByCategory(category: string, limit?: number) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    if (!category) return

    setLoading(true)
    setError(null)

    try {
      // Use static products only
      const staticProducts = getProductsSync()
      const categoryProducts = staticProducts
        .filter(product => product.category?.toLowerCase() === category.toLowerCase())
        .slice(0, limit || 20)
        .map(convertStaticProduct)
      
      setProducts(categoryProducts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category, limit])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
}

// Hook for product search
export function useProductSearch(query: string, filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<ApiResponse<Product[]>['pagination']>()

  const searchProducts = useCallback(async () => {
    if (!query.trim()) {
      setProducts([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Use static products search only
      const staticProducts = getProductsSync()
      const searchTerm = query.toLowerCase()
      
      const searchResults = staticProducts
        .filter(product => 
          product.title.toLowerCase().includes(searchTerm) ||
          (product.category && product.category.toLowerCase().includes(searchTerm))
        )
        .map(convertStaticProduct)

      // Apply additional filters
      let filteredResults = searchResults
      if (filters.category) {
        filteredResults = filteredResults.filter(p => 
          p.category.toLowerCase() === filters.category!.toLowerCase()
        )
      }

      if (filters.minPrice !== undefined) {
        filteredResults = filteredResults.filter(p => p.price >= filters.minPrice!)
      }

      if (filters.maxPrice !== undefined) {
        filteredResults = filteredResults.filter(p => p.price <= filters.maxPrice!)
      }

      // Apply pagination
      const limit = filters.limit || 20
      const page = filters.page || 1
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedResults = filteredResults.slice(startIndex, endIndex)

      setProducts(paginatedResults)
      setPagination({
        page,
        limit,
        total: filteredResults.length,
        totalPages: Math.ceil(filteredResults.length / limit)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search error occurred')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [query, filters])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts()
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchProducts])

  return {
    products,
    loading,
    error,
    pagination,
    refetch: searchProducts
  }
}

// Hook for fetching a single product
export function useProduct(id: string | number | null) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      // Use static products for now
      const staticProducts = getProductsSync()
      const foundProduct = staticProducts.find(p => p.asin === id.toString())
      
      if (foundProduct) {
        setProduct(convertStaticProduct(foundProduct))
      } else {
        setError('Product not found')
        setProduct(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  }
}

// Hook for fetching categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Generate categories from static products only
      const staticProducts = getProductsSync()
      const categoryMap = new Map<string, number>()
      
      staticProducts.forEach(product => {
        const category = product.category || 'Uncategorized'
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
      })

      const categories: Category[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        title: name,
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        itemCount: count,
        isActive: true
      }))

      setCategories(categories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  }
}

// Hook for managing product filters
export function useProductFilters(initialFilters: ProductFilters = {}) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters)

  const updateFilter = useCallback((key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const removeFilter = useCallback((key: keyof ProductFilters) => {
    setFilters(prev => {
      const { [key]: removed, ...rest } = prev
      return rest
    })
  }, [])

  return {
    filters,
    updateFilter,
    resetFilters,
    removeFilter,
    setFilters
  }
}

// Hook for favorites management (using localStorage)
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set())

  useEffect(() => {
    // Load favorites from localStorage on mount
    try {
      const stored = safeStorage.get('product-favorites')
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)))
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }, [])

  const addFavorite = useCallback((productId: string | number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      newFavorites.add(productId)

      // Save to localStorage
      try {
        safeStorage.set('product-favorites', JSON.stringify(Array.from(newFavorites)))
      } catch (error) {
        console.error('Failed to save favorites:', error)
      }

      return newFavorites
    })
  }, [])

  const removeFavorite = useCallback((productId: string | number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      newFavorites.delete(productId)

      // Save to localStorage
      try {
        safeStorage.set('product-favorites', JSON.stringify(Array.from(newFavorites)))
      } catch (error) {
        console.error('Failed to save favorites:', error)
      }

      return newFavorites
    })
  }, [])

  const toggleFavorite = useCallback((productId: string | number) => {
    if (favorites.has(productId)) {
      removeFavorite(productId)
    } else {
      addFavorite(productId)
    }
  }, [favorites, addFavorite, removeFavorite])

  const isFavorite = useCallback((productId: string | number) => {
    return favorites.has(productId)
  }, [favorites])

  const getFavoriteProducts = useCallback(async (): Promise<Product[]> => {
    const favoriteIds = Array.from(favorites)
    const staticProducts = getProductsSync()
    const products: Product[] = []

    for (const id of favoriteIds) {
      const foundProduct = staticProducts.find(p => p.asin === id.toString())
      if (foundProduct) {
        products.push(convertStaticProduct(foundProduct))
      }
    }

    return products
  }, [favorites])

  return {
    favorites: Array.from(favorites),
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoriteProducts,
    favoriteCount: favorites.size
  }
}

// Hook for trending products
export function useTrendingProducts(limit: number = 5) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrendingProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Use static products as trending
      const staticProducts = getProductsSync()
      const trendingProducts = staticProducts
        .slice(0, limit) // Take first N products as "trending"
        .map(convertStaticProduct)
      
      setProducts(trendingProducts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchTrendingProducts()
  }, [fetchTrendingProducts])

  return {
    products,
    loading,
    error,
    refetch: fetchTrendingProducts
  }
}
