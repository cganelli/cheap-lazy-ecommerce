'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Product, Category, ProductFilters, ApiResponse } from '@/types/product'
import { productApi } from '@/services/productApi'
import { amazonProductService } from '@/services/amazonProductService'
import { safeStorage } from '@/lib/safeStorage'

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
      // Check if user has Amazon products configured
      const hasAmazonProducts = amazonProductService.hasAmazonProducts()

      const response = hasAmazonProducts
        ? await amazonProductService.getAllAmazonProducts(filters)
        : await productApi.getAllProducts(filters)

      if (response.success) {
        setProducts(response.data)
        setPagination(response.pagination)
      } else {
        setError(response.message || 'Failed to fetch products')
        setProducts([])
      }
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
      const hasAmazonProducts = amazonProductService.hasAmazonProducts()

      const response = hasAmazonProducts
        ? await amazonProductService.getAmazonProductsByCategory(category, limit)
        : await productApi.getProductsByCategory(category, limit)

      if (response.success) {
        setProducts(response.data)
      } else {
        setError(response.message || 'Failed to fetch products')
        setProducts([])
      }
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
      const hasAmazonProducts = amazonProductService.hasAmazonProducts()

      const response = hasAmazonProducts
        ? await amazonProductService.searchAmazonProducts(query, filters)
        : await productApi.searchProducts(query, filters)

      if (response.success) {
        setProducts(response.data)
        setPagination(response.pagination)
      } else {
        setError(response.message || 'Search failed')
        setProducts([])
      }
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
      const response = await productApi.getProduct(id)

      if (response.success) {
        setProduct(response.data)
      } else {
        setError(response.message || 'Failed to fetch product')
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
      const hasAmazonProducts = amazonProductService.hasAmazonProducts()

      const response = hasAmazonProducts
        ? await amazonProductService.getAmazonCategories()
        : await productApi.getCategories()

      if (response.success) {
        setCategories(response.data)
      } else {
        setError(response.message || 'Failed to fetch categories')
        setCategories([])
      }
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
    const products: Product[] = []

    for (const id of favoriteIds) {
      try {
        const response = await productApi.getProduct(id)
        if (response.success && response.data) {
          products.push(response.data)
        }
      } catch (error) {
        console.error(`Failed to fetch favorite product ${id}:`, error)
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

// Hook for trending products (prioritizes Amazon products)
export function useTrendingProducts(limit: number = 5) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrendingProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const hasAmazonProducts = amazonProductService.hasAmazonProducts()

      const response = hasAmazonProducts
        ? await amazonProductService.getTrendingAmazonProducts(limit)
        : await productApi.getAllProducts({ limit, sortBy: 'rating', sortOrder: 'desc' })

      if (response.success) {
        setProducts(response.data)
      } else {
        setError(response.message || 'Failed to fetch trending products')
        setProducts([])
      }
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
