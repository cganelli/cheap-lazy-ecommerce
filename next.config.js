/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  eslint: {
    // Do NOT block `next build` in CI on lint errors.
    ignoreDuringBuilds: true,
  },
  // keep type errors on (safer); if you ever must unblock, set ignoreBuildErrors: true
  typescript: {
    ignoreBuildErrors: false,
  },
};
module.exports = nextConfig;
