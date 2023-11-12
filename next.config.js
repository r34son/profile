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
    serverComponentsExternalPackages: [
      '@react-aria/visually-hidden',
      '@nextui-org/system',
      '@nextui-org/theme',
      '@nextui-org/accordion',
      '@nextui-org/autocomplete',
      '@nextui-org/avatar',
      '@nextui-org/badge',
      '@nextui-org/button',
      '@nextui-org/card',
      '@nextui-org/chip',
      '@nextui-org/checkbox',
      '@nextui-org/code',
      '@nextui-org/link',
      '@nextui-org/pagination',
      '@nextui-org/radio',
      '@nextui-org/snippet',
      '@nextui-org/spinner',
      '@nextui-org/tooltip',
      '@nextui-org/switch',
      '@nextui-org/user',
      '@nextui-org/progress',
      '@nextui-org/input',
      '@nextui-org/popover',
      '@nextui-org/dropdown',
      '@nextui-org/image',
      '@nextui-org/modal',
      // '@nextui-org/navbar',
      '@nextui-org/table',
      '@nextui-org/spacer',
      '@nextui-org/divider',
      '@nextui-org/kbd',
      '@nextui-org/tabs',
      '@nextui-org/skeleton',
      '@nextui-org/scroll-shadow',
      '@nextui-org/select',
      '@nextui-org/listbox',
      '@nextui-org/menu',
      '@nextui-org/ripple',
      '@nextui-org/slider',
      '@nextui-org/breadcrumbs',
      'framer-motion',
    ],
  },
};

module.exports = withPlugins([[withBundleAnalyzer]], nextConfig);
