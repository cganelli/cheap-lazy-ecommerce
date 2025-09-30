// Use TDD approach and follow all CLAUDE.md best practices including proper testing,
// code quality checks, and implementation standards.

import fs from 'node:fs';

const FILE = 'data/products.optimized.json';
const raw = fs.readFileSync(FILE, 'utf-8');
const json = JSON.parse(raw);
const items = json.items || [];

let changed = 0;
for (const p of items) {
  const title = String(p.title || '').toLowerCase();
  if (title.includes('3 pack') && title.includes('pet') && title.includes('can') && title.includes('cover')) {
    if (p.category !== 'Pet Care') {
      p.category = 'Pet Care';
      changed++;
    }
  }
}

if (changed > 0) {
  fs.writeFileSync(FILE, JSON.stringify({ ...json, items }, null, 2));
  console.log(`Updated ${changed} item(s) to category "Pet Care".`);
} else {
  console.log('No matching items changed.');
}
