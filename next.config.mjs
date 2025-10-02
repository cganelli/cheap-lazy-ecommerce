/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export (Next will write to ./out during `next build`)
  output: 'export',

  // We're serving local images; disable Next Image optimizer for static export
  images: {
    unoptimized: true,
  },

  // Safe extras (optional)
  typedRoutes: true,
};

export default nextConfig;
