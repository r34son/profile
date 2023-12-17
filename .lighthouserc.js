const puppeteer = require('puppeteer');
const isCI = require('is-ci');

module.exports = {
  ci: {
    collect: {
      startServerCommand: isCI ? '' : 'pnpm lhci:start',
      url: ['http://localhost:3000/en'],
      numberOfRuns: 3,
      chromePath: !isCI && puppeteer.executablePath(),
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:accessibility': 'off',
        'bf-cache': 'off',
        'csp-xss': 'off',
        'link-name': 'off',
        'unused-javascript': 'off',
        'total-byte-weight': 'off',

        // Because of YM script
        deprecations: 'off',
        'no-unload-listeners': 'off',
        'inspector-issues': 'off',
        'third-party-cookies': 'off',
        'errors-in-console': isCI ? ['error', { minScore: 0.9 }] : 'off',
      },
    },
  },
};
