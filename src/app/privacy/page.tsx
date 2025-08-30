'use client';
export const dynamic = 'force-static';

import Header from '@/components/Header';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-semibold mb-4">Privacy Policy</h1>
          <p className="text-sm opacity-70 mb-6">Last updated: August 29, 2025</p>

          <p className="mb-4">
            We don't collect personal data on this static site. Some outbound links are Amazon affiliate links.
            As an Amazon Associate, we earn from qualifying purchases.
          </p>

          <p className="mb-4">
            For questions, contact us via the <Link href="/about" className="underline">About</Link> page.
          </p>
        </div>
      </main>
    </div>
  );
}
