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

  // Security headers (applied via Netlify _headers file or middleware)
  // Note: For static export, headers should be configured in netlify.toml or _headers file
};

export default nextConfig;
