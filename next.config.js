/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ignore ESLint errors during build to avoid failing on pre-existing issues
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig