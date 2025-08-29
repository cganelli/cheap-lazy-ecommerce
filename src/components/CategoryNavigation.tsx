'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CategoryNavigationProps {
  onCategorySelect: (category: string) => void
  selectedCategory?: string
}

const mainCategories = [
  "All Categories",
  "Beauty",
  "Electronics",
  "Garden",
  "Hair Care",
  "Household",
  "Kitchen",
  "Pet Care"
]

const allCategories = [
  "All Categories",
  "Auto",
  "Beauty",
  "Child and Baby",
  "Dorm Essentials",
  "Electronics",
  "Games and Entertainment",
  "Garden",
  "Gifts and Special Occasions",
  "Hair Care",
  "Health",
  "Household",
  "Kitchen",
  "Pet Care",
  "Sports and Outdoors"
]

export default function CategoryNavigation({ onCategorySelect, selectedCategory = "All Categories" }: CategoryNavigationProps) {
  const [showAllCategories, setShowAllCategories] = useState(false)

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
