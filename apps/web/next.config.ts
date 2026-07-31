import type { NextConfig } from 'next';

import { resolve } from 'node:path';

const nextConfig: NextConfig = {
  transpilePackages: [],
  eslint: {
    ignoreDuringBuilds: true,
  },
  outputFileTracingRoot: resolve(__dirname),
  serverExternalPackages: ['@neurolift-technologies/rrt-advocate'],
  webpack: (config, { isServer }) => {
    // The RRT Advocate and Sleepwalker Protocol packages import Node.js
    // built-ins (fs, crypto, path, module, url, yaml) at the top level.
    // These are used only by server-side deterministic assessment logic
    // but are traced by the bundler because client components import the
    // agent modules transitively. We alias the node:-prefixed imports
    // to browser-safe polyfills or void for client-side compatibility.
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        alias: {
          ...(config.resolve as { alias?: Record<string, unknown> }).alias,
          'node:crypto': 'crypto-browserify',
          'node:fs': false,
          'node:path': 'path-browserify',
          'node:stream': 'stream-browserify',
          'node:buffer': 'buffer/',
          'node:url': 'url/',
          'node:util': false,
          'node:module': false,
          'node:yaml': false,
          'node:querystring': 'querystring',
          'crypto': 'crypto-browserify',
          'fs': false,
          'path': 'path-browserify',
          'stream': 'stream-browserify',
          'buffer': 'buffer/',
          'url': 'url/',
          'util': false,
          'module': false,
          'yaml': false,
          'querystring': 'querystring',
        },
      };
    }
    return config;
  },
};

export default nextConfig;
