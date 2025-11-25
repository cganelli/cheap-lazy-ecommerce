'use client'

import React from 'react'
import Header from '@/components/Header'
import { useState } from 'react'

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
              <a href="https://www.facebook.com/profile.php?id=61580073592267" className="text-gray-600 hover:text-red-600" aria-label="Facebook">
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
    </div>
  )
}
