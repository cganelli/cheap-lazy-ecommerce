'use client';
export const dynamic = 'force-static';

import Header from '@/components/Header';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-semibold mb-4">About Cheap & Lazy Stuff</h1>
          <p className="mb-4">
            We curate simple, affordable products with honest UGC. As an Amazon Associate, we earn from qualifying purchases.
          </p>
          <Link href="/" className="underline">Back to Home</Link>
        </div>
      </main>
    </div>
  );
}
