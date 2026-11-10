/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // TMDB already serves appropriately sized images; bypass Vercel Image Optimization
    // to avoid transformation quota/402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
