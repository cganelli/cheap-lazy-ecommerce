'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, ExternalLink, Save, X } from 'lucide-react'
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

const CATEGORIES = [
  'Electronics', 'Beauty', 'Kitchen', 'Household', 'Garden',
  'Pet Care', 'Hair Care', 'Health', 'Fashion', 'Sports & Outdoors',
  'Books & Media', 'Toys & Games', 'Automotive', 'Home & Decor', 'Gifts'
]

export default function AdminPage() {
  const [products, setProducts] = useState<AmazonProduct[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AmazonProduct | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Load products from localStorage on mount
  useEffect(() => {
    const storedProducts = safeStorage.get('amazon-products')
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts))
      } catch (error) {
        console.error('Failed to load products:', error)
      }
    }
  }, [])

  // Save products to localStorage
  const saveProducts = (updatedProducts: AmazonProduct[]) => {
    setProducts(updatedProducts)
    safeStorage.set('amazon-products', JSON.stringify(updatedProducts))
  }

  // Extract ASIN from Amazon URL
  const extractASIN = (url: string): string | null => {
    const asinRegex = /\/([A-Z0-9]{10})(?:[/?]|$)/
    const match = url.match(asinRegex)
    return match ? match[1] : null
  }

  // Add new product
  const addProduct = (productData: Omit<AmazonProduct, 'id' | 'dateAdded'>) => {
    const newProduct: AmazonProduct = {
      ...productData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
      amazonASIN: extractASIN(productData.amazonUrl) || undefined
    }
    saveProducts([...products, newProduct])
    setShowAddForm(false)
  }

  // Update product
  const updateProduct = (id: string, updatedData: Partial<AmazonProduct>) => {
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, ...updatedData } : p
    )
    saveProducts(updatedProducts)
    setIsEditing(false)
    setEditingProduct(null)
  }

  // Delete product
  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const filteredProducts = products.filter(p => p.id !== id)
      saveProducts(filteredProducts)
    }
  }

  // Export products as JSON
  const exportProducts = () => {
    const dataStr = JSON.stringify(products, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'amazon-products.json'
    link.click()
  }

  // Import products from JSON
  const importProducts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedProducts = JSON.parse(e.target?.result as string)
          saveProducts(importedProducts)
          alert('Products imported successfully!')
        } catch (error) {
          alert('Error importing products. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Admin</h1>
              <p className="text-gray-600">Manage your Amazon affiliate products</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={exportProducts}>
                Export Products
              </Button>
              <label className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>Import Products</span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importProducts}
                  className="hidden"
                />
              </label>
              <a href="/" className="text-blue-600 hover:underline">
                ← Back to Site
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(products.map(p => p.category)).size}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Purchased Items</h3>
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => p.isPurchased).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Avg. Price</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Amazon Product
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || isEditing) && (
          <ProductForm
            product={editingProduct}
            categories={CATEGORIES}
            onSave={isEditing ?
              (data) => updateProduct(editingProduct!.id, data) :
              addProduct
            }
            onCancel={() => {
              setShowAddForm(false)
              setIsEditing(false)
              setEditingProduct(null)
            }}
          />
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.png'
                  }}
                />
                {product.isPurchased && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✓ Purchased
                  </div>
                )}
                {product.badge && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    {product.badge}
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingProduct(product)
                        setIsEditing(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{product.category}</span>
                    <span className="font-bold text-green-600">${product.price.toFixed(2)}</span>
                  </div>

                  {product.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">{product.rating}/5</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Amazon Link
                    </a>
                    {product.amazonASIN && (
                      <span className="text-xs text-gray-400">ASIN: {product.amazonASIN}</span>
                    )}
                  </div>

                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products added yet</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Product Form Component
function ProductForm({
  product,
  categories,
  onSave,
  onCancel
}: {
  product?: AmazonProduct | null
  categories: string[]
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    category: product?.category || categories[0],
    price: product?.price || 0,
    originalPrice: product?.originalPrice || '',
    amazonUrl: product?.amazonUrl || '',
    imageUrl: product?.imageUrl || '',
    description: product?.description || '',
    yourReview: product?.yourReview || '',
    rating: product?.rating || 5,
    badge: product?.badge || '',
    tags: product?.tags?.join(', ') || '',
    isPurchased: product?.isPurchased ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      rating: Number(formData.rating),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter product title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Current Price *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Original Price (optional)</label>
          <input
            type="number"
            step="0.01"
            value={formData.originalPrice}
            onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="0.00"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Amazon URL *</label>
          <input
            type="url"
            required
            value={formData.amazonUrl}
            onChange={(e) => setFormData({...formData, amazonUrl: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="https://amazon.com/dp/..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Product Image URL *</label>
          <input
            type="url"
            required
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Your Rating</label>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {[1,2,3,4,5].map(num => (
              <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Badge (optional)</label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData({...formData, badge: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Best seller, Deal, etc."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="wireless, bluetooth, headphones"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Product Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Brief description of the product..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Your Personal Review (optional)</label>
          <textarea
            value={formData.yourReview}
            onChange={(e) => setFormData({...formData, yourReview: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Share your experience with this product..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isPurchased}
              onChange={(e) => setFormData({...formData, isPurchased: e.target.checked})}
              className="mr-2"
            />
            <span className="text-sm font-medium">I have purchased this product</span>
          </label>
        </div>

        <div className="md:col-span-2 flex gap-4">
          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Product
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
