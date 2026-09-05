/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
  },
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      {
        source: '/watch-party',
        destination: '/forum',
        permanent: false,
      },
      {
        source: '/watch-party/:path*',
        destination: '/forum',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
