'use client';
export const dynamic = 'force-static';

import React, { useState } from 'react';
import Header from '@/components/Header';
import DisclosureSection from '@/components/DisclosureSection';
import HashAnchor from '@/components/HashAnchor';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function AboutPage() {
  const [footerEmail, setFooterEmail] = useState('');

  const handleFooterNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Footer newsletter signup:', footerEmail);
    
    const status = document.getElementById('about-footer-email-status');
    if (status) {
      status.textContent = 'Thanks! Please check your email.';
    }
    
    setFooterEmail('');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#A0B5D0' }}>
      <Header />
      {/* ensures #disclosure is scrolled with the right offset on load */}
      <HashAnchor id="disclosure" extraOffset={16} />

      {/* Hero Banner */}
      <div
        id="about-hero"
        className="w-full mb-4 pt-4"
        style={{backgroundColor: '#A0B5D0', height: '116px', overflow: 'hidden'}}
      >
        <img
          src="/Cheap-Lazy-Hero-2.png"
          alt="Cheap & Lazy Stuff - Too cheap to waste money. Too lazy to waste time."
          className="w-full h-full object-cover"
        />
      </div>

      <main id="main" className="relative">
        <h1 className="sr-only">About Cheap & Lazy Stuff</h1>
        
        {/* Background Image */}
        <div className="relative w-full">
          <img
            src="/Cheap-Lazy-Background.png"
            alt="Background"
            className="w-full h-auto object-cover"
          />
          
          {/* Medium Blue Box (35% width on desktop, full width on mobile) with white border */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[35%] min-h-[400px] border-4 border-white"
            style={{backgroundColor: '#A0B5D0'}}
          >
            {/* Profile Image */}
            <div className="flex justify-center pt-8">
              <img
                src="/Cheap-Lazy-Profile.png"
                alt="Crissy Profile"
                className="w-48 h-48 object-cover rounded-full"
              />
            </div>
            
            {/* Text Box */}
            <div className="px-8 py-6">
              <p 
                className="text-sm leading-relaxed"
                style={{color: '#1D3557', fontFamily: 'Inter, sans-serif'}}
              >
                Hi, I'm Crissy. My three sisters and I were raised by a single mom on one income. Money was tight. Stretching a dollar became second nature.
                <br /><br />
                I hunt deals so you don't waste cash or time. I buy every product myself and use them at home. If a product disappoints, I don't post it. If it earns a spot here, it works and it's worth the price.
                <br /><br />
                <strong>What you get:</strong>
                <br />
                • Picks that solve real problems
                <br />
                • Simple reasons to buy
                <br />
                • Links to purchase each item I recommend
                <br /><br />
                I may earn a small commission when you shop through my links. It never changes your price.
                <br /><br />
                If you love a good bargain and hate buyer's remorse, you're in the right place.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Disclosure Section is the target */}
      <div id="disclosure" className="max-w-7xl mx-auto px-4 py-8 mt-32 sm:mt-8">
        <DisclosureSection />
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Newsletter Signup Section */}
          <div className="bg-white py-8 mb-8">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold custom-blue mb-4">Get the Best Deals First!</h2>
              <p className="text-gray-600 mb-6">Subscribe to our newsletter and never miss out on amazing deals, new arrivals, and exclusive offers.</p>
              <form onSubmit={handleFooterNewsletterSignup} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <label htmlFor="about-footer-email" className="sr-only">Email address</label>
                <input
                  id="about-footer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  required
                  aria-describedby="about-footer-email-help"
                  className="flex-1 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <p id="about-footer-email-help" className="sr-only">
                  Enter a valid email address.
                </p>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary h-10 px-4 py-2 custom-bg-red hover:bg-red-600 text-white w-full sm:w-auto" type="submit">
                  Subscribe Now
                </button>
                <div id="about-footer-email-status" aria-live="polite" className="sr-only" />
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
