'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import TrendingSection from '@/components/TrendingSection'
import CategorySection from '@/components/CategorySection'
import CategoryNavigation from '@/components/CategoryNavigation'
import { Button } from '@/components/ui/button'

// Sample data
const trendingProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds with Charging Case',
    price: '$24.99',
    originalPrice: '$49.99',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
    amazonUrl: 'https://amazon.com',
    badge: '50% off',
    discount: '$25.00'
  },
  {
    id: '2',
    name: 'LED Desk Lamp with USB Charging Port',
    price: '$18.99',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    amazonUrl: 'https://amazon.com',
    badge: 'Best seller'
  },
  {
    id: '3',
    name: 'Portable Phone Stand Adjustable Holder',
    price: '$9.97',
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=300&h=300&fit=crop',
    amazonUrl: 'https://amazon.com'
  },
  {
    id: '4',
    name: 'Cooling Gel Memory Foam Pillow',
    price: '$35.99',
    originalPrice: '$59.99',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop',
    amazonUrl: 'https://amazon.com',
    discount: '$24.00'
  },
  {
    id: '5',
    name: 'Stainless Steel Water Bottle 32oz',
    price: '$15.99',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
    amazonUrl: 'https://amazon.com'
  }
]

// Alphabetically ordered categories array (What's New will be handled separately)
const categories = [
  {
    title: 'Auto',
    itemCount: 167,
    headingImage: '/AUTO_RED_TOUCHING.png',
    products: [
      {
        id: 'a1',
        name: 'Car Phone Mount Dashboard',
        price: '$16.99',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'a2',
        name: 'Car Charger USB-C Fast Charge',
        price: '$12.95',
        image: 'https://images.unsplash.com/photo-1626668011726-6d28161b8bb4?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'a3',
        name: 'Tire Pressure Gauge Digital',
        price: '$24.99',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'a4',
        name: 'Car Trunk Organizer',
        price: '$29.99',
        image: 'https://images.unsplash.com/photo-1605515298946-d062f2e9cd58?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Beauty',
    itemCount: 127,
    headingImage: '/BEAUTY_RED_TOUCHING.png',
    products: [
      {
        id: 'b1',
        name: 'Vitamin C Serum for Face',
        price: '$19.95',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'b2',
        name: 'Makeup Brush Set',
        price: '$12.99',
        image: 'https://images.unsplash.com/photo-1583241475880-2b13c8b91952?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com',
        badge: 'Deal'
      },
      {
        id: 'b3',
        name: 'Face Moisturizer SPF 30',
        price: '$16.50',
        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'b4',
        name: 'Lip Balm Set of 4',
        price: '$8.99',
        image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Child and Baby',
    itemCount: 156,
    headingImage: '/CHILD_AND_BABY_RED_TOUCHING.png',
    products: [
      {
        id: 'cb1',
        name: 'Baby Stroller Lightweight',
        price: '$89.99',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'cb2',
        name: 'Baby Car Seat Safety',
        price: '$129.99',
        image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com',
        badge: 'Safety certified'
      },
      {
        id: 'cb3',
        name: 'Baby Monitor with Camera',
        price: '$79.95',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'cb4',
        name: 'Kids Educational Toy Set',
        price: '$34.99',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Dorm Essentials',
    itemCount: 156,
    headingImage: '/DORM_ESSENTIALS_RED_TOUCHING.png',
    products: [
      {
        id: 'd1',
        name: 'Under Bed Storage Boxes',
        price: '$29.99',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'd2',
        name: 'Desk Organizer Set',
        price: '$15.99',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'd3',
        name: 'Mini Fridge 4.4 cu ft',
        price: '$159.99',
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'd4',
        name: 'Study Lamp LED',
        price: '$22.99',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Electronics',
    itemCount: 178,
    headingImage: '/ELECTRONICS_RED_TOUCHING.png',
    products: [
      {
        id: 'e1',
        name: 'Wireless Charging Pad',
        price: '$19.99',
        image: 'https://images.unsplash.com/photo-1586892478025-2fcc2bf7b25a?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'e2',
        name: 'USB-C Hub 7-in-1',
        price: '$29.95',
        image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'e3',
        name: 'Bluetooth Speaker Waterproof',
        price: '$39.99',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'e4',
        name: 'Phone Camera Lens Kit',
        price: '$24.99',
        image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Games and Entertainment',
    itemCount: 142,
    headingImage: '/GAMES_AND_ENTERTAINMENT_RED_TOUCHING.png',
    products: [
      {
        id: 'ge1',
        name: 'Board Game Collection',
        price: '$39.99',
        image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'ge2',
        name: 'Puzzle 1000 Pieces',
        price: '$14.95',
        image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com',
        badge: 'Popular'
      },
      {
        id: 'ge3',
        name: 'Bluetooth Game Controller',
        price: '$49.99',
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'ge4',
        name: 'Playing Cards Premium Set',
        price: '$12.99',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Garden',
    itemCount: 132,
    headingImage: '/GARDEN_RED_TOUCHING.png',
    products: [
      {
        id: 'g1',
        name: 'Garden Hose 50ft Expandable',
        price: '$32.99',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'g2',
        name: 'Plant Pots Set of 6 with Drainage',
        price: '$24.95',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'g3',
        name: 'Garden Tool Set 10-Piece',
        price: '$45.99',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'g4',
        name: 'Solar Garden Lights Set of 8',
        price: '$28.99',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Gifts and Special Occasions',
    itemCount: 186,
    headingImage: '/SPECIAL_OCCASIONS_RED_TOUCHING.png',
    products: [
      {
        id: 'gi1',
        name: 'Personalized Photo Frame',
        price: '$21.99',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'gi2',
        name: 'Gift Card Holder Set of 10',
        price: '$9.95',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'gi3',
        name: 'Scented Candle Gift Set',
        price: '$34.99',
        image: 'https://images.unsplash.com/photo-1602847406709-e7b3d49c34dd?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com',
        badge: 'Gift idea'
      },
      {
        id: 'gi4',
        name: 'Wine Bottle Holder Decorative',
        price: '$18.99',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Hair Care',
    itemCount: 89,
    headingImage: '/HAIR_CARE_RED_TOUCHING.png',
    products: [
      {
        id: 'h1',
        name: 'Argan Oil Hair Treatment',
        price: '$24.99',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'h2',
        name: 'Silk Hair Scrunchies Set',
        price: '$11.99',
        image: 'https://images.unsplash.com/photo-1594736797933-d0b22d7a4116?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'h3',
        name: 'Hair Growth Shampoo',
        price: '$18.95',
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'h4',
        name: 'Hair Straightening Brush',
        price: '$32.50',
        image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Health',
    itemCount: 142,
    headingImage: '/HEALTH_RED_TOUCHING.png',
    products: [
      {
        id: 'he1',
        name: 'Vitamins Multivitamin Gummies',
        price: '$16.99',
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'he2',
        name: 'Resistance Bands Set',
        price: '$12.99',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'he3',
        name: 'Yoga Mat Non-Slip',
        price: '$25.99',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'he4',
        name: 'Essential Oil Diffuser',
        price: '$32.99',
        image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Household',
    itemCount: 218,
    headingImage: '/HOUSEHOLD_RED_TOUCHING.png',
    products: [
      {
        id: 'ho1',
        name: 'Vacuum Cleaner Cordless',
        price: '$149.99',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'ho2',
        name: 'Storage Bins with Lids Set of 6',
        price: '$34.99',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'ho3',
        name: 'Microfiber Cleaning Cloths 24-Pack',
        price: '$12.99',
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'ho4',
        name: 'Laundry Hamper with Wheels',
        price: '$39.95',
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Kitchen',
    itemCount: 203,
    headingImage: '/KITCHEN_RED_TOUCHING.png',
    products: [
      {
        id: 'k1',
        name: 'Air Fryer 4.2 Quart',
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1574781330855-d0db2706b3d0?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com',
        badge: 'Best seller'
      },
      {
        id: 'k2',
        name: 'Non-Stick Cookware Set',
        price: '$49.99',
        image: 'https://images.unsplash.com/photo-1556909045-f23c1b3a14f8?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'k3',
        name: 'Kitchen Knife Set',
        price: '$34.95',
        image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'k4',
        name: 'Coffee Maker Single Serve',
        price: '$89.99',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Pet Care',
    itemCount: 94,
    headingImage: '/PET_CARE_RED_TOUCHING.png',
    products: [
      {
        id: 'p1',
        name: 'Dog Food Bowl Set Stainless Steel',
        price: '$22.99',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'p2',
        name: 'Cat Litter Box Self-Cleaning',
        price: '$89.99',
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com',
        badge: 'Popular'
      },
      {
        id: 'p3',
        name: 'Pet Hair Removal Tool',
        price: '$14.95',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'p4',
        name: 'Dog Leash Retractable 16ft',
        price: '$18.99',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  },
  {
    title: 'Sports and Outdoors',
    itemCount: 187,
    headingImage: '/SPORTS_AND_OUTDOOR_RED_TOUCHING.png',
    products: [
      {
        id: 'so1',
        name: 'Camping Tent 4-Person',
        price: '$149.99',
        image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'so2',
        name: 'Hiking Backpack 50L',
        price: '$89.95',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com',
        badge: 'Bestseller'
      },
      {
        id: 'so3',
        name: 'Fitness Resistance Bands',
        price: '$24.99',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      },
      {
        id: 'so4',
        name: 'Water Bottle Insulated',
        price: '$19.99',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop',
        amazonUrl: 'https://amazon.com'
      }
    ]
  }
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [email, setEmail] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Here you would implement actual search functionality
    console.log('Searching for:', query)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    // Scroll to the relevant section
    if (category !== 'All Categories') {
      const element = document.getElementById(category.toLowerCase().replace(/\s+/g, '-'))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would implement actual newsletter signup
    console.log('Newsletter signup:', email)
    alert('Thank you for subscribing to our newsletter!')
    setEmail('')
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#A0B5D0'}}>
      <Header onSearch={handleSearch} />
      <CategoryNavigation onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />

      {/* Hero Banner */}
      <div className="w-full mb-4" style={{backgroundColor: '#A0B5D0', height: '200px', overflow: 'hidden'}}>
        <img
          src="/Short_banner.png"
          alt="Cheap & Lazy Stuff - Too cheap to waste money. Too lazy to waste time."
          className="w-full h-full object-cover"
        />
      </div>

      {/* Newsletter Signup Section */}
      <div className="bg-white py-8 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold custom-blue mb-4">
            📧 Get the Best Deals First!
          </h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter and never miss out on amazing deals, new arrivals, and exclusive offers.
          </p>
          <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <Button type="submit" className="custom-bg-red hover:bg-red-600 text-white w-full sm:w-auto">
              Subscribe Now
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Trending Section */}
        <div className="mb-12">
          <TrendingSection products={trendingProducts} />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold custom-blue mb-4">
              Search results for "{searchQuery}"
            </h2>
            <p className="text-gray-600">
              Showing products matching your search...
            </p>
          </div>
        )}

        {/* Category Sections */}
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.title} id={category.title.toLowerCase().replace(/\s+/g, '-')}>
              <CategorySection
                title={category.title}
                products={category.products}
                headingImage={category.headingImage}
                itemCount={category.itemCount}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">
                © 2025 Cheap & Lazy Stuff. Find great deals on everything you need.
              </p>
              <p className="text-sm text-gray-500">
                Amazon Affiliate Links
              </p>
            </div>

            {/* Footer Links */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
              <div className="flex gap-6">
                <a href="/about" className="text-gray-600 hover:text-red-600 text-sm">About</a>
                <a href="/privacy" className="text-gray-600 hover:text-red-600 text-sm">Privacy Policy</a>
                <a href="/terms" className="text-gray-600 hover:text-red-600 text-sm">Terms</a>
              </div>

              {/* Social Media Links - 100% larger */}
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-red-600" aria-label="Facebook">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-red-600" aria-label="Instagram">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.197-1.559-.748-.948-1.018-2.143-.754-3.34l.764-3.46c.295-1.338 1.498-2.28 2.894-2.28h5.788c1.396 0 2.599.942 2.894 2.28l.764 3.46c.264 1.197-.006 2.392-.754 3.34-.749.948-1.9 1.559-3.197 1.559H8.449z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-red-600" aria-label="TikTok">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
