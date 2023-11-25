// @ts-check
const withPlugins = require('next-compose-plugins');
const withNextIntl = require('next-intl/plugin')();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: process.env.ASSET_PREFIX,
  experimental: {
    optimizeServerReact: true,
  },
};

module.exports = withPlugins([withNextIntl, [withBundleAnalyzer]], nextConfig);
