'use client'

import { Plus, ExternalLink } from 'lucide-react'
import { ProductCardImage } from '@/components/ProductCardImage'

interface TrendingProduct {
  id: string
  name: string
  price: string
  originalPrice?: string
  image: string
  imageSrcSet?: string
  imageBlur?: string
  imageRatio?: number
  amazonUrl: string
  badge?: string
  discount?: string
}

interface TrendingSectionProps {
  products: TrendingProduct[]
  loading?: boolean
}

export default function TrendingSection({ products, loading = false }: TrendingSectionProps) {
  const openAmazonLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 p-6 bg-white">
      <div className="mb-6">
        <img
          src="/whats_new_red.png"
          alt="What's New"
          className="h-16 mb-2 object-contain"
        />
        <p className="text-gray-700">
          {loading ? 'Loading trending products...' : 'Hot deals and popular items flying off the shelves'}
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {loading ? (
          // Loading skeletons
          [...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-64 border border-gray-200 bg-white rounded-lg animate-pulse">
              <div className="bg-gray-300 h-48 rounded-t-lg"></div>
              <div className="p-4">
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded mb-2 w-3/4"></div>
                <div className="bg-gray-300 h-6 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : products.length > 0 ? (
          products.map((product, index) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-64 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 bg-white rounded-lg"
            onClick={() => openAmazonLink(product.amazonUrl)}
          >
            <div className="relative">
              <ProductCardImage
                src={product.image}
                srcSet={product.imageSrcSet}
                alt={product.name}
                blur={product.imageBlur}
                ratio={product.imageRatio ? 1 / product.imageRatio : 4/5}
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-red-600 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full">
                  {product.badge}
                </span>
              )}
              <div className="absolute top-3 right-3 opacity-0 hover:opacity-100 transition-opacity">
                <ExternalLink className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
              <button
                className="absolute bottom-3 right-3 w-8 h-8 p-0 custom-bg-red hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  openAmazonLink(product.amazonUrl)
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 text-sm">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold custom-red">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
              {product.discount && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  Save {product.discount}
                </p>
              )}
            </div>
          </div>
        ))
        ) : (
          // No products available
          <div className="flex-shrink-0 w-full text-center py-8">
            <p className="text-gray-500">No trending products available</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
