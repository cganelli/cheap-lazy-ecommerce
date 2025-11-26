'use client'

import React from 'react'
import Header from '@/components/Header'
import { useState } from 'react'
import { Facebook, Instagram, Youtube } from 'lucide-react'

export default function Terms() {
  const [footerEmail, setFooterEmail] = useState('');

  const handleFooterNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Footer newsletter signup:', footerEmail);
    
    const status = document.getElementById('terms-footer-email-status');
    if (status) {
      status.textContent = 'Thanks! Please check your email.';
    }
    
    setFooterEmail('');
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#A0B5D0'}}>
      <Header />
      
      {/* Hero Banner */}
      <div className="w-full mb-4 pt-4" style={{backgroundColor: '#A0B5D0', height: '116px', overflow: 'hidden'}}>
        <img
          src="/Cheap-Lazy-Hero-2.png"
          alt="Cheap & Lazy Stuff - Too cheap to waste money. Too lazy to waste time."
          className="w-full h-full object-cover"
        />
      </div>

      <main id="main" className="bg-white min-h-screen">
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
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Newsletter Signup Section */}
          <div className="bg-white py-8 mb-8">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold custom-blue mb-4">Get the Best Deals First!</h2>
              <p className="text-gray-600 mb-6">Subscribe to our newsletter and never miss out on amazing deals, new arrivals, and exclusive offers.</p>
              <form onSubmit={handleFooterNewsletterSignup} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <label htmlFor="terms-footer-email" className="sr-only">Email address</label>
                <input
                  id="terms-footer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  required
                  aria-describedby="terms-footer-email-help"
                  className="flex-1 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p id="terms-footer-email-help" className="sr-only">
                  Enter a valid email address.
                </p>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary h-10 px-4 py-2 custom-bg-red hover:bg-red-600 text-white w-full sm:w-auto" type="submit">
                  Subscribe Now
                </button>
                <div id="terms-footer-email-status" aria-live="polite" className="sr-only" />
              </form>
              <p className="text-xs text-gray-500 mt-3">We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              © 2025 Cheap & Lazy Stuff. Find great deals on everything you need.
            </p>
            <p className="text-sm text-gray-500">
              Amazon Associate Program - Personally Curated Products
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
            <div className="flex gap-6">
              <a href="/about" className="text-gray-600 hover:text-red-600 text-sm">About</a>
              <a href="/privacy" className="text-gray-600 hover:text-red-600 text-sm">Privacy Policy</a>
              <a href="/terms" className="text-gray-600 hover:text-red-600 text-sm">Terms</a>
              <a href="/accessibility" className="text-gray-600 hover:text-red-600 text-sm">Accessibility</a>
              <a href="/about#disclosure" className="text-gray-600 hover:text-red-600 text-sm">Affiliate Disclosure</a>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-4">
              <a
                href="https://www.tiktok.com/@cheapandlazystuff"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 transition-colors"
                aria-label="Follow us on TikTok"
              >
                <svg className="h-12 w-12 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/cheapandlazystuff/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-12 w-12 shrink-0" />
              </a>
              <a
                href="https://www.facebook.com/cheapandlazystuff/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-12 w-12 shrink-0" />
              </a>
              <a
                href="https://www.youtube.com/@CheapAndLazyStuff"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 transition-colors"
                aria-label="Follow us on YouTube"
              >
                <Youtube className="h-12 w-12 shrink-0" />
              </a>
              <a
                href="https://www.pinterest.com/CheapAndLazyStuff"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 transition-colors"
                aria-label="Follow us on Pinterest"
              >
                <img
                  src="/pinterest-logo.svg"
                  alt="Pinterest"
                  className="h-12 w-12 shrink-0"
                  width={48}
                  height={48}
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
