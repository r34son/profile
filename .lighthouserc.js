const puppeteer = require('puppeteer');
const isCI = require('is-ci');

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm lhci:start',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
      chromePath: puppeteer.executablePath(),
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'bf-cache': 'off',
        'button-name': 'off',
        'csp-xss': 'off',
        'inspector-issues': 'off',
        'link-name': 'off',
        'no-unload-listeners': 'off',
        'unused-css-rules': 'off',
        'unused-javascript': 'off',
        'errors-in-console': isCI ? ['error', { minScore: 0.9 }] : 'off',
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
