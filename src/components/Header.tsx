'use client'

import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/?q=' + encodeURIComponent(searchQuery))
  }

  return (
    <header className="w-full border-b border-gray-200 shadow-sm" style={{backgroundColor: '#A0B5D0'}}>
      {/* Top bar */}
      <div className="w-full custom-bg-blue text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          Smart buys, zero hassle. You save time and cash.
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Cart Icon + Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <img
              src="/cart-icon.png"
              alt="Shopping Cart"
              className="w-16 h-16"
            />
            <a href="#" className="text-gray-700 hover:text-red-600 font-medium">Home</a>
            <a href="#" className="text-gray-700 hover:text-red-600 font-medium">About</a>
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, categories..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-0 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 custom-bg-red hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Social Media Icons */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-red-600 hover:text-red-700 transition-colors" aria-label="Facebook">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-red-600 hover:text-red-700 transition-colors" aria-label="Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.197-1.559-.748-.948-1.018-2.143-.754-3.34l.764-3.46c.295-1.338 1.498-2.28 2.894-2.28h5.788c1.396 0 2.599.942 2.894 2.28l.764 3.46c.264 1.197-.006 2.392-.754 3.34-.749.948-1.9 1.559-3.197 1.559H8.449z"/>
              </svg>
            </a>
            <a href="#" className="text-red-600 hover:text-red-700 transition-colors" aria-label="TikTok">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-red-600 p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Cart icon for mobile */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <img
                src="/cart-icon.png"
                alt="Shopping Cart"
                className="w-12 h-12"
              />
              <span className="text-gray-700 font-medium">Shopping Cart</span>
            </div>
            <nav className="space-y-3">
              <a href="/" className="block text-gray-700 hover:text-red-600 font-medium">Home</a>
              <a href="/about" className="block text-gray-700 hover:text-red-600 font-medium">About</a>
              <a href="/privacy" className="block text-gray-700 hover:text-red-600 font-medium">Privacy Policy</a>
              <a href="/terms" className="block text-gray-700 hover:text-red-600 font-medium">Terms & Conditions</a>
            </nav>

            {/* Social Media Icons - Mobile */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Follow Us</p>
              <div className="flex gap-4">
                <a href="#" className="text-red-600 hover:text-red-700 transition-colors" aria-label="Facebook">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-red-600 hover:text-red-700 transition-colors" aria-label="Instagram">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.197-1.559-.748-.948-1.018-2.143-.754-3.34l.764-3.46c.295-1.338 1.498-2.28 2.894-2.28h5.788c1.396 0 2.599.942 2.894 2.28l.764 3.46c.264 1.197-.006 2.392-.754 3.34-.749.948-1.9 1.559-3.197 1.559H8.449z"/>
                  </svg>
                </a>
                <a href="#" className="text-red-600 hover:text-red-700 transition-colors" aria-label="TikTok">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
