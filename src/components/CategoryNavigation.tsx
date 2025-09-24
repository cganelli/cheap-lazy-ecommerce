'use client'

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useCategories } from '@/hooks/useProducts'

interface CategoryNavigationProps {
  onCategorySelect: (category: string) => void
  selectedCategory?: string
}

export default function CategoryNavigation({ onCategorySelect, selectedCategory = "All Categories" }: CategoryNavigationProps) {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const router = useRouter()
  const [q, setQ] = useState('')
  const { categories, loading } = useCategories()

  // Create category arrays from the dynamic data, sorted alphabetically
  const sortedCategories = categories.sort((a, b) => a.title.localeCompare(b.title))
  const mainCategories = ["All Categories", ...sortedCategories.slice(0, 7).map(cat => cat.title)]
  const allCategories = ["All Categories", ...sortedCategories.map(cat => cat.title)]

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = q.trim();
    router.push(next ? '/?q=' + encodeURIComponent(next) : '/');
  }, [q, router]);

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* All Categories Button */}
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className={`whitespace-nowrap px-4 py-2 rounded-md transition-colors ${
              selectedCategory === "All Categories"
                ? 'custom-bg-red text-white'
                : 'text-gray-700 hover:text-red-600 hover:bg-red-50 border border-gray-300'
            }`}
          >
            All Categories ▼
          </button>

          {/* Main Category Links */}
          {mainCategories.slice(1).map((category) => (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-md transition-colors ${
                selectedCategory === category
                  ? 'custom-bg-red text-white'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              {category}
            </button>
          ))}

          {/* Search Box - positioned after Pet Care */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 ml-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="border rounded px-2 py-1 text-sm"
            />
            <button 
              type="submit" 
              className="whitespace-nowrap px-4 py-2 rounded-md transition-colors custom-bg-red text-white hover:bg-red-600"
            >
              Search
            </button>
          </form>
        </div>

        {/* Dropdown Categories (when expanded) */}
        {showAllCategories && (
          <div className="mt-3 p-4 bg-gray-50 rounded-md border">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategorySelect(category)
                    setShowAllCategories(false)
                  }}
                  className="text-left px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-white rounded transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
