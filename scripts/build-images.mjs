// scripts/build-images.mjs
// Robust generator: reads base data.items (72), maps to optimized without dropping,
// derives asin if missing, DOES NOT require webp files to exist.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(ROOT, '..');
const dataDir = path.join(projectRoot, 'data');
const publicDir = path.join(projectRoot, 'public', 'products');

const baseJsonPath = path.join(dataDir, 'products.json');
const outJsonPath  = path.join(dataDir, 'products.optimized.json');

function readItems(p) {
  const txt = fs.readFileSync(p, 'utf8');
  const obj = JSON.parse(txt);
  if (Array.isArray(obj)) return obj;          // array style
  if (Array.isArray(obj.items)) return obj.items; // object with .items
  return [];
}

// Try to find something usable as ASIN (10-char alnum is common, but not guaranteed)
// If not found, fallback to a slug based on title.
function deriveASIN(p) {
  const candidates = [p.asin, p.ASIN, p.id, p.sku, p.SKU, p.Asin];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  // Try to parse from image filename if present
  const img = p.image_url || p.image || p.img || '';
  const m = String(img).match(/([A-Z0-9]{10})(?:[_.-]|$)/i);
  if (m) return m[1].toUpperCase();
  // Fallback: slug from title (ensures we don't drop an item)
  const title = String(p.title || p.name || '').trim();
  if (title) {
    return title
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 20) || `ITEM-${Math.random().toString(36).slice(2, 8)}`;
  }
  // Last resort unique id
  return `ITEM-${Math.random().toString(36).slice(2, 8)}`;
}

function fileExists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function buildSrcsetIfExists(asin) {
  const f400 = path.join(publicDir, `${asin}-400.webp`);
  const f800 = path.join(publicDir, `${asin}-800.webp`);
  const has400 = fileExists(f400);
  const has800 = fileExists(f800);
  if (has400 && has800) {
    return {
      image_url: `/products/${asin}-800.webp`,
      image_srcset: `/products/${asin}-400.webp 400w, /products/${asin}-800.webp 800w`,
    };
  }
  // No webp pair? return undefined fields; component still renders with object-contain & ratio
  return {};
}

function main() {
  const base = readItems(baseJsonPath);
  if (!base.length) {
    console.error('❌ No items found in base products.json');
    process.exit(1);
  }

  let missingAsin = 0;
  let withoutWebp = 0;

  const items = base.map((p) => {
    const asin = deriveASIN(p);
    if (!p.asin && !p.ASIN && !p.id && !p.sku && !p.SKU && !p.Asin) missingAsin++;

    const title = String(p.title ?? p.name ?? '').trim();
    const category = String(p.category ?? p.cat ?? '').trim();
    const affiliate_url = String(p.affiliate_url ?? p.link ?? p.url ?? '').trim();

    const webp = buildSrcsetIfExists(asin);
    if (!webp.image_srcset) withoutWebp++;

    // Fallback image if webp pair not found: use existing image_url/image if present
    const fallbackImage =
      p.image_url || p.image || p.img || (webp.image_url ?? `/products/${asin}.webp`);

    return {
      asin,
      title,
      category,
      affiliate_url,
      image_url: webp.image_url ?? fallbackImage,
      image_srcset: webp.image_srcset,  // undefined is OK; component uses object-contain
      image_blur: p.image_blur ?? undefined,
      image_ratio: typeof p.image_ratio === 'number' ? p.image_ratio : 4 / 5, // width/height
    };
  });

  // Do NOT filter items out — keep all 72
  const out = { items };

  fs.writeFileSync(outJsonPath, JSON.stringify(out, null, 2));
  console.log(`✅ Wrote ${items.length} items to ${path.relative(projectRoot, outJsonPath)}`);
  console.log(`ℹ️  Items missing explicit ASIN field but derived: ${missingAsin}`);
  console.log(`ℹ️  Items without webp pair (-400/-800): ${withoutWebp}`);
}

main();
