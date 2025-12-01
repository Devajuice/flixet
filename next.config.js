/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
    unoptimized: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;