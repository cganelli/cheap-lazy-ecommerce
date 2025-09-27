import React from 'react';

export default function DisclosureSection() {
  return (
    <section
      id="disclosure"
      aria-labelledby="disclosure-heading"
      className="scroll-mt-28 md:scroll-mt-32 rounded-xl border bg-slate-50 p-4 md:p-6"
    >
      <h2 id="disclosure-heading" className="mb-2 text-lg font-semibold">
        Affiliate Disclosure
      </h2>
      <p className="mb-2">
        <strong>As an Amazon Associate, I earn from qualifying purchases.</strong>
      </p>
      <p className="text-sm text-gray-700">
        Some links on this site are affiliate links. If you click and buy, I may receive a small
        commission at no additional cost to you. I only feature products I believe are genuinely useful.
      </p>
    </section>
  );
}
