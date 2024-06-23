// TODO: https://github.com/GoogleChrome/lighthouse-ci/issues/973
const puppeteer = require('puppeteer');
const isCI = require('is-ci');

module.exports = {
  ci: {
    collect: {
      startServerCommand: isCI ? '' : 'pnpm lhci:start',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 60000,
      url: ['http://localhost:3000/en'],
      numberOfRuns: 3,
      chromePath: !isCI && puppeteer.executablePath(),
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'bf-cache': 'off',
        // TODO:
        'unused-javascript': 'off',
        'total-byte-weight': 'off',

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
