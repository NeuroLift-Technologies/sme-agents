import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
