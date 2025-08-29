'use client'

import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: string
  image: string
  amazonUrl: string
  badge?: string
}

interface CategorySectionProps {
  title: string
  products: Product[]
  featuredImage?: string
  itemCount: number
  headingImage?: string
}

export default function CategorySection({ title, products, featuredImage, itemCount, headingImage }: CategorySectionProps) {
  const openAmazonLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Category header with heading image */}
      <div className="relative bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {headingImage ? (
              <img
                src={headingImage}
                alt={title}
                className="h-12 object-contain"
              />
            ) : (
              <h2 className="text-xl font-bold custom-blue">{title}</h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-600 text-sm">See all {itemCount} items</p>
            <span className="bg-red-100 text-red-600 border border-red-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {itemCount}
            </span>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold custom-blue">Featured Products</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 p-0 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 p-0 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200 bg-white rounded-lg"
              onClick={() => openAmazonLink(product.amazonUrl)}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {product.badge}
                  </span>
                )}
                <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-white drop-shadow-md" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {product.name}
                </p>
                <p className="text-lg font-bold custom-red">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-4 text-center">
          <button className="custom-red border border-red-500 hover:bg-red-50 px-4 py-2 rounded-md font-medium transition-colors">
            View All {itemCount} Items
          </button>
        </div>
      </div>
    </div>
  )
}
