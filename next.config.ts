import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*', // requests to /api/* will be proxied
        destination: 'http://103.174.103.132:7250/api/:path*', // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
