module.exports = {
  ci: {
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
      },
    },
  },
};
