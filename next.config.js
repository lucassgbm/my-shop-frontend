/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '*.onrender.com' },
      { protocol: 'https', hostname: '*.railway.app' },
      { protocol: 'https', hostname: '*.aivencloud.com' },
    ],
  },
  async rewrites() {
    return [];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
