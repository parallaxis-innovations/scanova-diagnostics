/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: ['185.165.240.191'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '185.165.240.191',
      },
    ],
   },
};

module.exports = nextConfig;
