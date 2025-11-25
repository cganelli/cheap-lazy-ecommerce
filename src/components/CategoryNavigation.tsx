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
  const { categories, loading } = useCategories()

  // Create category arrays from the dynamic data, sorted alphabetically
  const sortedCategories = categories.sort((a, b) => a.title.localeCompare(b.title))
  const mainCategories = ["All Categories", ...sortedCategories.slice(0, 7).map(cat => cat.title)]
  const allCategories = ["All Categories", ...sortedCategories.map(cat => cat.title)]

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
    <nav className="bg-white border-b border-gray-200 shadow-sm" aria-label="Product categories">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]" role="tablist" aria-label="Product categories">
          {/* All Categories Button */}
          <button
            onClick={() => {
              setShowAllCategories(!showAllCategories);
              // Scroll to top when "All Categories" is selected
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onCategorySelect('All Categories');
            }}
            role="tab"
            aria-selected={selectedCategory === "All Categories"}
            aria-controls={showAllCategories ? "category-dropdown" : undefined}
            aria-expanded={showAllCategories}
            className={`whitespace-nowrap px-4 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600 ${
              selectedCategory === "All Categories"
                ? 'custom-bg-red text-white'
                : 'text-gray-700 hover:text-red-600 hover:bg-red-50 border border-gray-300'
            }`}
          >
            All Categories <span aria-hidden="true">▼</span>
          </button>

          {/* Main Category Links */}
          {mainCategories.slice(1).map((category) => {
            const sectionId = category.toLowerCase().replace(/\s+/g, '-');
            return (
              <a
                key={category}
                href={`#${sectionId}`}
                role="tab"
                aria-selected={selectedCategory === category}
                onClick={(e) => {
                  e.preventDefault();
                  onCategorySelect(category);
                  const element = document.getElementById(sectionId);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600 ${
                  selectedCategory === category
                    ? 'custom-bg-red text-white'
                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                {category}
              </a>
            );
          })}

        </div>

        {/* Dropdown Categories (when expanded) */}
        {showAllCategories && (
          <div id="category-dropdown" className="mt-3 p-4 bg-gray-50 rounded-md border" role="tabpanel">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {allCategories.map((category) => {
                if (category === 'All Categories') {
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        onCategorySelect(category);
                        setShowAllCategories(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-left px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-white rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
                    >
                      {category}
                    </button>
                  );
                }
                const sectionId = category.toLowerCase().replace(/\s+/g, '-');
                return (
                  <a
                    key={category}
                    href={`#${sectionId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onCategorySelect(category);
                      setShowAllCategories(false);
                      const element = document.getElementById(sectionId);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-left px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-white rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
                  >
                    {category}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
