import React from 'react';
import { buildProductJsonLd, ProductForLd } from '@/lib/productJsonLd';

export default function ProductJsonLd(props: ProductForLd) {
  const ld = buildProductJsonLd(props);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />;
}
