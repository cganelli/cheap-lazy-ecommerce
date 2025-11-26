'use client';
export const dynamic = 'force-static';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function PrivacyPage() {
  const [footerEmail, setFooterEmail] = useState('');

  const handleFooterNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Footer newsletter signup:', footerEmail);
    
    const status = document.getElementById('privacy-footer-email-status');
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
          <h1 className="text-4xl font-bold custom-blue mb-8 text-center">Privacy Policy</h1>
          <p className="text-gray-600 mb-8 text-center">
            Last updated: 9/4/2025
          </p>

          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-gray-600">
              Cheap & Lazy Stuff ("we," "our," "us") respects your privacy. This policy explains what we collect, how we use it, and your choices.
            </p>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">What we collect</h2>
              <p className="text-gray-600 mb-4">
                Your email address, but only if you give it to us by subscribing or contacting us.
              </p>
              <p className="text-gray-600">
                We do not collect names, addresses, payment info, or browsing profiles. We do not sell or share your email with any third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">How we use your email</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>To send updates about new finds, deals, and site news.</li>
                <li>To reply to your messages.</li>
              </ul>
              <p className="text-gray-600 mt-4">
                You can unsubscribe at any time using the link in our emails or by emailing us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Legal basis</h2>
              <p className="text-gray-600">
                If you are in the EU, EEA, or UK, we process your email with your consent. You can withdraw consent at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Retention</h2>
              <p className="text-gray-600">
                We keep your email until you unsubscribe or ask us to delete it. When you unsubscribe, we remove you from active mailing lists. If you ask us to delete your email, we erase it from our records.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Cookies and third-party links</h2>
              <p className="text-gray-600">
                We do not set tracking cookies. Our pages link to retailers and other websites. Those sites may use cookies or collect data under their own policies. Review their privacy policies before purchasing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Children's privacy</h2>
              <p className="text-gray-600">
                Our site is for people 13 and older. We do not knowingly collect information from children under 13. If you believe a child gave us an email address, contact us and we will delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Your rights</h2>
              <p className="text-gray-600 mb-4">
                Depending on your location, you may have rights to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access the email we hold about you.</li>
                <li>Correct it.</li>
                <li>Delete it.</li>
                <li>Object or limit our use.</li>
                <li>Receive a portable copy.</li>
              </ul>
              <p className="text-gray-600 mt-4">
                To use these rights, email us at <a href="mailto:legal@cheapandlazystuff.com" className="text-red-600 hover:underline">legal@cheapandlazystuff.com</a>. We will verify and respond within a reasonable time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Security</h2>
              <p className="text-gray-600">
                We use reasonable safeguards to protect your email. No method of storage is perfectly secure. Please contact us right away if you think your email has been exposed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Do Not Track</h2>
              <p className="text-gray-600">
                We do not track you across sites, so browser Do Not Track signals do not change our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Changes</h2>
              <p className="text-gray-600">
                We may update this policy. We will post the new date at the top. Your continued use of the site means you accept the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold custom-blue mb-4">Contact</h2>
              <p className="text-gray-600 mb-4">
                Questions about privacy?
              </p>
              <p className="text-gray-600 mb-4">
                Email: <a href="mailto:legal@cheapandlazystuff.com" className="text-red-600 hover:underline">legal@cheapandlazystuff.com</a>
              </p>
              <p className="text-gray-600">
                <strong>Note on Terms</strong><br />
                Use of the site is also governed by our Terms & Conditions (last updated 9/4/2025), which describe our affiliate relationships and other important information.
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
                <label htmlFor="privacy-footer-email" className="sr-only">Email address</label>
                <input
                  id="privacy-footer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  required
                  aria-describedby="privacy-footer-email-help"
                  className="flex-1 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p id="privacy-footer-email-help" className="sr-only">
                  Enter a valid email address.
                </p>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary h-10 px-4 py-2 custom-bg-red hover:bg-red-600 text-white w-full sm:w-auto" type="submit">
                  Subscribe Now
                </button>
                <div id="privacy-footer-email-status" aria-live="polite" className="sr-only" />
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
  );
}
