// @ts-check
import withPlugins from 'next-compose-plugins';
import withNextIntl from 'next-intl/plugin';
import withPWA from 'next-pwa';
import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: process.env.ASSET_PREFIX,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    swcMinify: true,
    // instrumentationHook: true,
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-darwin-arm64',
        'node_modules/@esbuild/darwin-arm64',
        'node_modules/@img/sharp-libvips-darwin-arm64',
        'node_modules/@img/sharp-darwin-arm64',
        'node_modules/caniuse-lite',
        'node_modules/source-map-js',
        'node_modules/jest-worker',
        'node_modules/uglify-js',
        'node_modules/webpack',
        'node_modules/esbuild',
        'node_modules/terser',
        'node_modules/terser-webpack-plugin',
        'node_modules/sharp',
      ],
    },
    optimizePackageImports: [
      '@floating-ui/core',
      '@floating-ui/utils',
      '@radix-ui/primitive',
      '@radix-ui/react-popper',
      '@radix-ui/react-compose-refs',
      '@radix-ui/react-context',
      '@radix-ui/react-id',
      '@radix-ui/react-menu',
      '@radix-ui/react-primitive',
      '@radix-ui/react-use-controllable-state',
      '@radix-ui/react-use-escape-keydown',
      '@radix-ui/react-dismissable-layer',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-slot',
      '@radix-ui/react-tooltip',
      'tailwindcss',
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ],
};

export default withPlugins(
  [
    withNextIntl(),
    withPWA({
      dest: 'public',
      disable: process.env.NODE_ENV === 'development',
    }),
    withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' }),
  ],
  nextConfig,
);
