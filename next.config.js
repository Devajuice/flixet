/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Covers every rendered size in the app: avatars/thumbnails through to
    // posters and backdrops. Next picks the smallest entry >= the rendered width.
    imageSizes: [36, 44, 84, 140, 180, 200, 300, 500],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
