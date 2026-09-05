/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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
