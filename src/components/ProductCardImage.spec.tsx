import React from 'react';
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ProductCardImage } from './ProductCardImage';

test('emits webp srcset with 400w and 800w', () => {
  const { getByAltText } = render(
    <ProductCardImage
      src="/products/ASIN-800.webp"
      srcSet="/products/ASIN-400.webp 400w, /products/ASIN-800.webp 800w"
      alt="Sample"
      ratio={4/5}
    />
  );
  const img = getByAltText('Sample') as HTMLImageElement;
  expect(img.hasAttribute('srcset')).toBe(true);
  expect(img.getAttribute('srcset')).toMatch(/400\.webp 400w/);
  expect(img.getAttribute('srcset')).toMatch(/800\.webp 800w/);
});
