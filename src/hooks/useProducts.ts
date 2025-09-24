'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Product, Category, ProductFilters, ApiResponse } from '@/types/product'
import { getProductsSync, Product as StaticProduct, debugProducts } from '@/lib/static-products'
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

  // Memoize filters to prevent infinite re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.search,
    filters.sortBy,
    filters.sortOrder,
    filters.limit,
    filters.page
  ])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Use static products only
      const staticProducts = getProductsSync()
      console.log('🔍 Raw static products count:', staticProducts.length)
      
      if (staticProducts.length === 0) {
        console.error('❌ No static products loaded!')
        setProducts([])
        setLoading(false)
        return
      }
      
      let filteredProducts = staticProducts.map(convertStaticProduct)
      console.log('🔍 Converted products count:', filteredProducts.length)

      // Apply filters
      if (memoizedFilters.category && memoizedFilters.category !== 'All Categories') {
        filteredProducts = filteredProducts.filter(p => 
          p.category?.toLowerCase() === memoizedFilters.category?.toLowerCase()
        )
      }

      if (memoizedFilters.search) {
        const searchTerm = memoizedFilters.search.toLowerCase()
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
        )
      }

      if (memoizedFilters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= memoizedFilters.minPrice!)
      }

      if (memoizedFilters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= memoizedFilters.maxPrice!)
      }

      // Apply sorting
      if (memoizedFilters.sortBy) {
        filteredProducts.sort((a, b) => {
          const order = memoizedFilters.sortOrder === 'desc' ? -1 : 1
          switch (memoizedFilters.sortBy) {
            case 'price':
              return (a.price - b.price) * order
            case 'name':
              return a.title.localeCompare(b.title) * order
            case 'rating':
              return ((a.rating?.rate || 0) - (b.rating?.rate || 0)) * order
            default:
              return 0
          }
        })
      }

      // Apply pagination
      const limit = memoizedFilters.limit ?? filteredProducts.length // Use all products if no limit specified
      const page = memoizedFilters.page || 1
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

      setProducts(paginatedProducts)
      console.log('🔍 Setting products:', paginatedProducts.length)
      console.log('🔍 Pagination:', { page, limit, total: filteredProducts.length })
      
      setPagination({
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit)
      })
    } catch (err) {
      console.error('Error loading products:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [memoizedFilters])

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
  const filters = useMemo(() => ({
    category,
    limit: limit || 12
  }), [category, limit])

  return useProducts(filters)
}

// Hook for product search
export function useProductSearch(query: string, limit?: number) {
  const filters = useMemo(() => ({
    search: query,
    limit: limit || 20
  }), [query, limit])

  return useProducts(filters)
}

// Hook for fetching a single product by ID
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)

      try {
        const staticProducts = getProductsSync()
        const foundProduct = staticProducts.find(p => p.asin === id)
        
        if (foundProduct) {
          setProduct(convertStaticProduct(foundProduct))
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error('Error loading product:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
}

// Hook for fetching categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      setError(null)

      try {
        const staticProducts = getProductsSync()
        console.log('Static products loaded:', staticProducts.length)
        console.log('Categories found:', staticProducts.map(p => p.category))
        
        const uniqueCategories = Array.from(
          new Set(staticProducts.map(p => p.category).filter(Boolean))
        ).map(name => ({
          id: (name || 'Uncategorized').toLowerCase().replace(/\s+/g, '-'),
          title: name || 'Uncategorized',
          name: name || 'Uncategorized',
          slug: (name || 'Uncategorized').toLowerCase().replace(/\s+/g, '-'),
          itemCount: staticProducts.filter(p => p.category === name).length,
          isActive: true
        }))

        console.log('Processed categories:', uniqueCategories)
        setCategories(uniqueCategories)
      } catch (err) {
        console.error('Error loading categories:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// Hook for trending products
export function useTrendingProducts(limit: number = 6) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true)
      setError(null)

      try {
        const staticProducts = getProductsSync()
        // Simple trending logic: take first N products
        const trendingProducts = staticProducts.slice(0, limit).map(convertStaticProduct)
        setProducts(trendingProducts)
      } catch (err) {
        console.error('Error loading trending products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [limit])

  return { products, loading, error }
}

// Hook for favorites (using localStorage)
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = safeStorage.get('favorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch {
        setFavorites([])
      }
    }
  }, [])

  const addToFavorites = useCallback((productId: string) => {
    setFavorites(prev => {
      const updated = [...prev, productId]
      safeStorage.set('favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites(prev => {
      const updated = prev.filter(id => id !== productId)
      safeStorage.set('favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  const toggleFavorite = useCallback((productId: string) => {
    if (favorites.includes(productId)) {
      removeFromFavorites(productId)
    } else {
      addToFavorites(productId)
    }
  }, [favorites, addToFavorites, removeFromFavorites])

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId)
  }, [favorites])

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite
  }
}

// Hook for managing product filters
export function useProductFilters(initialFilters: ProductFilters = {}) {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters)

  const updateFilter = useCallback((key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  return {
    filters,
    updateFilter,
    clearFilters,
    resetFilters
  }
}