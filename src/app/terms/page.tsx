import Header from '@/components/Header'

export default function Terms() {
  const handleSearch = (query: string) => {
    console.log('Search from Terms page:', query)
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#A0B5D0'}}>
      <Header onSearch={handleSearch} />

      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold custom-blue mb-8 text-center">Terms & Conditions</h1>
          <p className="text-gray-600 mb-8 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing and using Cheap & Lazy Stuff website, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Website Purpose</h2>
              <p className="text-gray-600 mb-4">
                Cheap & Lazy Stuff is a product discovery and affiliate marketing website that:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Curates and displays products from various online retailers</li>
                <li>Provides product information, pricing, and direct links to purchase</li>
                <li>Earns affiliate commissions from qualifying purchases</li>
                <li>Does not directly sell products or handle transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Affiliate Disclosure</h2>
              <p className="text-gray-600">
                Cheap & Lazy Stuff participates in affiliate programs including the Amazon Associates Program.
                This means we earn qualifying commissions from purchases made through our links at no additional
                cost to you. All opinions and product recommendations are our own.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Product Information</h2>
              <p className="text-gray-600 mb-4">
                While we strive to provide accurate product information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Product availability, pricing, and specifications may change without notice</li>
                <li>We are not responsible for errors in product listings</li>
                <li>Final product details, pricing, and availability are determined by the retailer</li>
                <li>We recommend verifying all information before making a purchase</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Purchases and Returns</h2>
              <p className="text-gray-600 mb-4">
                All purchases are made directly with third-party retailers:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>We do not process payments or handle customer service for purchases</li>
                <li>All return policies, warranties, and customer service are provided by the retailer</li>
                <li>Any issues with products should be directed to the retailer where you made the purchase</li>
                <li>We are not responsible for the quality, safety, or legality of products sold by retailers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">User Conduct</h2>
              <p className="text-gray-600 mb-4">
                When using our website, you agree not to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Use the site for any unlawful purpose</li>
                <li>Attempt to harm or disrupt the website's functionality</li>
                <li>Copy, reproduce, or distribute content without permission</li>
                <li>Use automated systems to access or scrape the website</li>
                <li>Impersonate others or provide false information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Intellectual Property</h2>
              <p className="text-gray-600">
                The content, design, graphics, and compilation of all content on this site is our property or
                used with permission. Unauthorized use of any materials may violate copyright, trademark, and
                other laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Disclaimer of Warranties</h2>
              <p className="text-gray-600">
                This website and its content are provided "as is" without any representations or warranties.
                We disclaim all warranties, express or implied, including but not limited to warranties of
                merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Limitation of Liability</h2>
              <p className="text-gray-600">
                We shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                resulting from your use of the website or any products purchased through our affiliate links.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. Changes will be effective immediately
                upon posting. Your continued use of the website after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms & Conditions, please contact us at:
                <br />
                <strong>Email:</strong> <a href="mailto:legal@cheapandlazystuff.com" className="text-red-600 hover:underline">legal@cheapandlazystuff.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
