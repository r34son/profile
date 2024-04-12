// @ts-check
import withPlugins from 'next-compose-plugins';
import withNextIntl from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import { SENTRY_EXTENSIONS } from './sentry.constants.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: process.env.ASSET_PREFIX,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    swcMinify: true,
    instrumentationHook: true,
    preloadEntriesOnStart: true,
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
    // TODO: no impact
    // optimizePackageImports: [
    //   '@floating-ui/core',
    //   '@floating-ui/utils',
    //   '@radix-ui/primitive',
    //   '@radix-ui/react-popper',
    //   '@radix-ui/react-compose-refs',
    //   '@radix-ui/react-context',
    //   '@radix-ui/react-id',
    //   '@radix-ui/react-menu',
    //   '@radix-ui/react-primitive',
    //   '@radix-ui/react-use-controllable-state',
    //   '@radix-ui/react-use-escape-keydown',
    //   '@radix-ui/react-dismissable-layer',
    //   '@radix-ui/react-dropdown-menu',
    //   '@radix-ui/react-navigation-menu',
    //   '@radix-ui/react-slot',
    //   '@radix-ui/react-tooltip',
    //   'tailwindcss',
    // ],
  },
  webpack: (config, { webpack, isServer }) => {
    // https://github.com/open-telemetry/opentelemetry-js/issues/4173#issuecomment-1822938936
    if (isServer) config.ignoreWarnings = [{ module: /@opentelemetry\// }];

    config.plugins.push(new webpack.DefinePlugin(SENTRY_EXTENSIONS));

    return config;
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

export default withSentryConfig(
  withPlugins(
    [
      withNextIntl(),
      withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' }),
    ],
    nextConfig,
  ),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'r34s0n',
    project: 'profile',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: false,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  },
);
