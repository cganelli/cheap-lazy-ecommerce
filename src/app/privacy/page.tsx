import Header from '@/components/Header'

export default function Privacy() {
  const handleSearch = (query: string) => {
    console.log('Search from Privacy page:', query)
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#A0B5D0'}}>
      <Header onSearch={handleSearch} />

      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold custom-blue mb-8 text-center">Privacy Policy</h1>
          <p className="text-gray-600 mb-8 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Subscribe to our newsletter</li>
                <li>Contact us with questions or feedback</li>
                <li>Use our search functionality</li>
                <li>Browse our website and interact with our content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Send you our newsletter with deals and updates (only if you subscribe)</li>
                <li>Respond to your questions and provide customer support</li>
                <li>Improve our website and user experience</li>
                <li>Analyze how our site is used to better serve our visitors</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>To trusted service providers who assist us in operating our website (like email service providers)</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer (merger, acquisition, etc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Affiliate Links & Third Parties</h2>
              <p className="text-gray-600 mb-4">
                Our website contains affiliate links to products on Amazon and other retailers. When you click these links:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>You'll be redirected to the retailer's website</li>
                <li>The retailer's privacy policy will apply to your purchase</li>
                <li>We may earn a small commission if you make a purchase (at no extra cost to you)</li>
                <li>We do not have access to your payment or personal information from these transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information against unauthorized access,
                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure,
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access the personal information we have about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Unsubscribe from our newsletter at any time</li>
                <li>Opt out of certain communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Cookies</h2>
              <p className="text-gray-600">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic,
                and understand where our visitors are coming from. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. We will notify you of any changes by posting
                the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                <strong>Email:</strong> <a href="mailto:privacy@cheapandlazystuff.com" className="text-red-600 hover:underline">privacy@cheapandlazystuff.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
