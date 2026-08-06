import type { NextConfig } from 'next';

import { resolve } from 'node:path';

const nextConfig: NextConfig = {
  transpilePackages: [],
  outputFileTracingRoot: resolve(__dirname, '../..'),
  serverExternalPackages: ['@neurolift-technologies/rrt-advocate'],
  // Next.js 16 uses Turbopack by default. The RRT Advocate and Sleepwalker
  // Protocol packages import Node.js built-ins (fs, crypto, path, module,
  // url, yaml) at the top level. These are used only by server-side
  // deterministic assessment logic but are traced by the bundler because
  // client components import the agent modules transitively. We alias the
  // node:-prefixed imports to browser-safe polyfills or an empty module for
  // client-side compatibility.
  turbopack: {
    // Pin the workspace root so Turbopack resolves `next` (hoisted to the
    // monorepo root node_modules) instead of failing hermetic resolution.
    root: resolve(__dirname, '../..'),
    resolveAlias: {
      'node:crypto': 'crypto-browserify',
      'node:fs': {
        browser: './src/lib/empty-module.ts',
      },
      'node:path': 'path-browserify',
      'node:stream': 'stream-browserify',
      'node:buffer': 'buffer/',
      'node:url': 'url/',
      'node:util': {
        browser: './src/lib/empty-module.ts',
      },
      'node:module': {
        browser: './src/lib/empty-module.ts',
      },
      'node:yaml': {
        browser: './src/lib/empty-module.ts',
      },
      'node:querystring': 'querystring',
      crypto: 'crypto-browserify',
      fs: {
        browser: './src/lib/empty-module.ts',
      },
      path: 'path-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer/',
      url: 'url/',
      util: {
        browser: './src/lib/empty-module.ts',
      },
      module: {
        browser: './src/lib/empty-module.ts',
      },
      yaml: {
        browser: './src/lib/empty-module.ts',
      },
      querystring: 'querystring',
    },
  },
};

export default nextConfig;
