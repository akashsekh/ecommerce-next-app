/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Ensure mysql2 is available in Vercel serverless functions
    serverComponentsExternalPackages: ['mysql2'],
  },
};

module.exports = nextConfig;