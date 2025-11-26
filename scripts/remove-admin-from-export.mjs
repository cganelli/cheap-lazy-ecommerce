/**
 * Remove admin UI and API routes from static export
 * 
 * Location: scripts/remove-admin-from-export.mjs
 * Purpose: Remove admin pages and API routes from production static export
 *          while keeping them available in local development
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outDir = path.join(projectRoot, 'out');

// Paths to remove from static export
const pathsToRemove = [
  path.join(outDir, 'admin'),
  path.join(outDir, 'admin.html'),
  path.join(outDir, 'admin.txt'),
  path.join(outDir, 'api', 'admin'),
  path.join(outDir, 'api', 'admin', 'products'),
  path.join(outDir, '_next', 'static', 'chunks', 'app', 'admin'),
  path.join(outDir, '_next', 'static', 'chunks', 'app', 'api', 'admin'),
];

let removedCount = 0;

console.log('🧹 Removing admin UI and API routes from static export...\n');

for (const targetPath of pathsToRemove) {
  if (fs.existsSync(targetPath)) {
    try {
      const stats = fs.statSync(targetPath);
      fs.rmSync(targetPath, { recursive: true, force: true });
      const pathType = stats.isDirectory() ? 'directory' : 'file';
      console.log(`  ✓ Removed ${pathType}: ${path.relative(projectRoot, targetPath)}`);
      removedCount++;
    } catch (error) {
      console.error(`  ✗ Error removing ${path.relative(projectRoot, targetPath)}:`, error.message);
    }
  }
}

console.log(`\n✅ Cleanup complete. Removed ${removedCount} admin path(s) from static export.`);

