/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.module.rules.push({
      test: /\.(mov|mp4)$/i,
      type: 'asset/resource'
    });
    return config;
  },
  output: 'standalone',
  experimental: {
    optimizeCss: false,
    forceSwcTransforms: true
  }
}

module.exports = nextConfig
