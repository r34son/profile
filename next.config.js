// @ts-check
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: process.env.ASSET_PREFIX,
  experimental: {
    optimizePackageImports: ['@nextui-org/react'],
  },
};

module.exports = withPlugins([[withBundleAnalyzer]], nextConfig);
