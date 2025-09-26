import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import sharp from 'sharp';
import { globby } from 'globby';

const ROOT = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(ROOT, '..');
const dataDir = path.join(projectRoot, 'data');
const publicDir = path.join(projectRoot, 'public', 'products');

const baseJsonPath = path.join(dataDir, 'products.json');
const outJsonPath  = path.join(dataDir, 'products.optimized.json');

function readItems(p) {
  const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
  return Array.isArray(obj) ? obj : (obj.items ?? []);
}
function sanitize(str) { return String(str ?? '').trim(); }

function deriveASIN(p) {
  const cands = [p.asin, p.ASIN, p.id, p.sku, p.SKU, p.Asin];
  for (const c of cands) if (sanitize(c)) return sanitize(c);
  const img = sanitize(p.image_url || p.image || p.img);
  const m = img.match(/([A-Z0-9]{10})(?:[_.-]|$)/i);
  if (m) return m[1].toUpperCase();
  const t = sanitize(p.title || p.name);
  return t ? t.toUpperCase().replace(/[^A-Z0-9]+/g,'-').slice(0,20) : `ITEM-${Math.random().toString(36).slice(2,8)}`;
}

async function findSourceForAsin(asin) {
  const patterns = [
    `${publicDir}/${asin}.*`,
    `${publicDir}/${asin}_*.*`,
    `${publicDir}/${asin}-orig.*`,
    `${publicDir}/*${asin}*.*`,
  ];
  const files = (await globby(patterns, { caseSensitiveMatch: false }))
    .filter(f => !f.endsWith('-400.webp') && !f.endsWith('-800.webp'));
  return files[0]; // first match
}

async function ensureWebps(srcPath, asin) {
  const w400 = path.join(publicDir, `${asin}-400.webp`);
  const w800 = path.join(publicDir, `${asin}-800.webp`);
  if (!srcPath) return { created: false };

  // generate inside-fit to preserve portrait-ish orientation
  await sharp(srcPath).resize({ width: 400, height: 500, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 }).toFile(w400);
  await sharp(srcPath).resize({ width: 800, height: 1000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 }).toFile(w800);

  return { created: true };
}

async function main() {
  const base = readItems(baseJsonPath);
  let created = 0, missing = 0;

  const items = [];
  for (const p of base) {
    const asin = deriveASIN(p);
    const title = sanitize(p.title ?? p.name);
    const category = sanitize(p.category ?? p.cat);
    const affiliate_url = sanitize(p.affiliate_url ?? p.link ?? p.url);

    const existing400 = path.join(publicDir, `${asin}-400.webp`);
    const existing800 = path.join(publicDir, `${asin}-800.webp`);
    const has400 = fs.existsSync(existing400);
    const has800 = fs.existsSync(existing800);

    if (!has400 || !has800) {
      const src = await findSourceForAsin(asin);
      if (src) {
        const res = await ensureWebps(src, asin);
        if (res.created) created++;
      } else {
        missing++;
      }
    }

    const havePair = fs.existsSync(existing400) && fs.existsSync(existing800);
    items.push({
      asin, title, category, affiliate_url,
      image_url: havePair ? `/products/${asin}-800.webp` : (sanitize(p.image_url || p.image || p.img) || `/products/${asin}.webp`),
      image_srcset: havePair ? `/products/${asin}-400.webp 400w, /products/${asin}-800.webp 800w` : undefined,
      image_blur: p.image_blur ?? undefined,
      image_ratio: typeof p.image_ratio === 'number' ? p.image_ratio : 4/5,
    });
  }

  fs.writeFileSync(outJsonPath, JSON.stringify({ items }, null, 2));
  console.log(`✅ Optimized catalog written: ${path.relative(projectRoot, outJsonPath)} (${items.length} items)`);
  console.log(`ℹ️ WebP pairs created: ${created}, items without source image: ${missing}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
