const puppeteer = require('puppeteer');
const isCI = require('is-ci');

module.exports = {
  ci: {
    collect: {
      startServerCommand: isCI ? '' : 'pnpm lhci:start',
      startServerReadyPattern: 'Ready',
      url: ['http://localhost:3000/en'],
      numberOfRuns: 3,
      chromePath: !isCI && puppeteer.executablePath(),
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:accessibility': 'off',

        // TODO:
        'unused-javascript': 'off',
        'total-byte-weight': 'off',

        // App router doesn`t have way to inline critical css
        'render-blocking-resources': 'off',

        // Because of YM script
        deprecations: 'off',
        'inspector-issues': 'off',
        'no-unload-listeners': 'off',
        'uses-long-cache-ttl': 'off',
        'third-party-cookies': 'off',
        'errors-in-console': isCI ? ['error', { minScore: 0.9 }] : 'off',
      },
    },
  },
};
