import Header from '@/components/Header'
import { Button } from '@/components/ui/button'

export default function About() {
  const handleSearch = (query: string) => {
    console.log('Search from About page:', query)
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#A0B5D0'}}>
      <Header onSearch={handleSearch} />

      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold custom-blue mb-4">About Cheap & Lazy Stuff</h1>
            <p className="text-xl text-gray-600">
              Too cheap to waste money. Too lazy to waste time.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold custom-blue mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  We believe shopping should be simple, affordable, and hassle-free. That's why we curate the best deals
                  across all categories - from beauty and kitchen essentials to electronics and pet care - so you don't
                  have to waste time searching.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold custom-blue mb-4">Why Choose Us?</h3>
                <p className="text-gray-600">
                  We're too cheap to waste money on overpriced products and too lazy to waste time on complicated shopping.
                  Every product we feature offers genuine value and convenience for busy people who want quality without the markup.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold custom-blue mb-6 text-center">What We Offer</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Best Deals</h3>
                  <p className="text-gray-600">Carefully selected products with genuine savings and value</p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Quick Shopping</h3>
                  <p className="text-gray-600">No endless browsing - we do the research so you don't have to</p>
                </div>
                <div className="text-center p-4">
                  <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
                  <p className="text-gray-600">Every category features hand-picked items that actually matter</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold custom-blue mb-4">15+ Categories. Hundreds of Products. Zero Hassle.</h2>
              <p className="text-gray-600 mb-6">
                From auto accessories to kitchen gadgets, beauty products to pet care - we've got everything you need
                at prices that make sense. All products link directly to trusted retailers for secure purchasing.
              </p>
              <Button asChild className="custom-bg-red hover:bg-red-600 text-white">
                <a href="/">Start Shopping</a>
              </Button>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold custom-blue mb-4">Questions?</h2>
              <p className="text-gray-600 mb-4">
                We're here to help you find exactly what you need without the runaround.
              </p>
              <p className="text-gray-600">
                Contact us: <a href="mailto:hello@cheapandlazystuff.com" className="text-red-600 hover:underline">hello@cheapandlazystuff.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
