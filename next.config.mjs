/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  /* config options here */
  // Removed 'output: export' to allow dynamic API routes for backend
  images: {
    unoptimized: true,
  },
  experimental: {
    // Required because the app now has multiple root layouts — (site) and
    // admin — so there's no single layout to compose a default 404 from.
    globalNotFound: true,
  },
};

export default nextConfig;
