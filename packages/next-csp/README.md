# Content-Security-Policy (CSP) for Next.js

Middleware wrapper for [csp-header](https://github.com/frux/csp/tree/master/packages/csp-header), so for more information read its documentation.

Inspired by [express-csp-header](https://www.npmjs.com/package/express-csp-header)

## Usage

```ts
import createCspMiddleware, { INLINE, NONE, SELF } from 'next-csp';

const cspMiddleware = createCspMiddleware({
  directives: {
    'default-src': [SELF],
    'script-src': [SELF, INLINE, 'somehost.com'],
    'style-src': [SELF, 'mystyles.net'],
    'img-src': ['data:', 'images.com'],
    'worker-src': [NONE],
    'block-all-mixed-content': true,
  },
});

// middleware will send header "Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' somehost.com; style-src 'self' mystyles.net; img-src data: images.com; workers-src 'none'; block-all-mixed-content; report-uri https://cspreport.com/send;'
```

### nonce parameter

If you want to use nonce parameter you should use `NONCE` constant. Nonce key will be generated automatically. Also generated nonce key will be stored in `req.nonce`:

```js
const createCspMiddleware, { NONCE } = require('next-csp');

const cspMiddleware = createCspMiddleware({
    directives: {
      'script-src': [NONCE],
    },
  });
// middleware will send header with a random nonce key "Content-Security-Policy: script-src 'nonce-pSQ9TwXOMI+HezKshnuRaw==';"

app.use((req, res) => {
  console.log(req.nonce); // 'pSQ9TwXOMI+HezKshnuRaw=='
});
```

### Auto tld

If you have more than one tlds you may want to have only current tld in your security policy. You can do this by replacing tld by `TLD` constant:

```js
const createCspMiddleware, { TLD } = require('next-csp');

const cspMiddleware = createCspMiddleware({
    directives: {
      'script-src': [`mystatic.${TLD}`],
    },
  });
// for myhost.com it will send: "Content-Security-Policy: script-src mystatic.com;"
// for myhost.net it will send: "Content-Security-Policy: script-src mystatic.net;"
// etc
```

### TLD parsing options

`next-csp` uses [psl](https://www.npmjs.com/package/psl) package to parse tld for auto-tld feature. If you have a custom tld you can specify it as an array or a regexp.

```js
const createCspMiddleware, { TLD } = require('next-csp');

const cspMiddleware = createCspMiddleware({
    directives: {
      'script-src': [`mystatic.${TLD}`],
    },
    domainOptions: {
      customTlds: ['example.com'],
    },
  });
// for myhost.com it will send: "Content-Security-Policy: script-src mystatic.com;"
// for myhost.example.com it will send: "Content-Security-Policy: script-src mystatic.example.com;"
// etc
```

## CSP violation report

For more information read [csp-header documentation](https://github.com/frux/csp/tree/master/packages/csp-header#csp-violation-report). `next-csp` helps you manage both `Content-Security-Policy` and `Report-To` headers.

```js
const { cspMiddleware, INLINE, NONE, SELF } = require('next-csp');

app.use(
  cspMiddleware({
    directives: {
      'default-src': [SELF],
      'report-to': 'my-report-group',
    },
    reportUri: 'https://cspreport.com/send',
    reportTo: [
      {
        group: 'my-report-group',
        max_age: 30 * 60,
        endpoints: [{ url: 'https://cspreport.com/send' }],
        include_subdomains: true,
      },
    ],
  }),
);

/* express will send two headers
1. Content-Security-Policy: default-src 'self'; report-to my-report-group; report-uri https://cspreport.com/send;
2. Report-To: {"group":"my-report-group","max_age":1800,"endpoints":[{"url":"https://cspreport.com/send"}],"include_subdomains":true}
*/
```

### Presets

Read about preset in [`csp-header` docs](https://github.com/frux/csp/tree/master/packages/csp-header#presets)

### Content-Security-Policy-Report-Only mode

To switch on Report-Only mode just specify `reportOnly` param:

```js
const { cspMiddleware, SELF } = require('next-csp');

app.use(
  cspMiddleware({
    directives: {
      'script-src': [SELF],
    },
    reportOnly: true,
  }),
);
// it will send: "Content-Security-Policy-Report-Only: script-src 'self';"
```

### report-uri parameter

```js
const { cspMiddleware, SELF } = require('next-csp');

app.use(
  cspMiddleware({
    directives: {
      'script-src': [SELF],
    },
    reportUri: 'https://cspreport.com/send',
  }),
);
// express will send header "Content-Security-Policy: script-src 'self'; report-uri https://cspreport.com/send;"
```

If you want to pass some params to the report uri just pass function instead of string:

```js
const { cspMiddleware, SELF } = require('next-csp');

app.use(
  cspMiddleware({
    directives: {
      'script-src': [SELF],
    },
    reportUri: (req, res) => {
      return `https://cspreport.com/send?time=${Number(new Date())}`;
    },
  }),
);
// express will send header "Content-Security-Policy: script-src 'self'; report-uri https://cspreport.com/send?time=1460467355592;"
```

## Links

- [csp-header](https://github.com/frux/csp/tree/master/packages/csp-header)
