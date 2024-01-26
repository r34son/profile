import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';

// https://yandex.ru/support/metrica/code/install-counter-csp.html#install-counter-csp__urls
const mcDomains = [
  'https://mc.yandex.ru',
  'https://mc.yandex.az',
  'https://mc.yandex.by',
  'https://mc.yandex.co.il',
  'https://mc.yandex.com',
  'https://mc.yandex.com.am',
  'https://mc.yandex.com.ge',
  'https://mc.yandex.com.tr',
  'https://mc.yandex.ee',
  'https://mc.yandex.fr',
  'https://mc.yandex.kg',
  'https://mc.yandex.kz',
  'https://mc.yandex.lt',
  'https://mc.yandex.lv',
  'https://mc.yandex.md',
  'https://mc.yandex.tj',
  'https://mc.yandex.tm',
  'https://mc.yandex.ua',
  'https://mc.yandex.uz',
  'https://mc.webvisor.com',
  'https://mc.webvisor.org',
  'https://yastatic.net',
].join(' ');

// https://yandex.ru/support/metrica/behavior/click-map.html#iframe
const mcFrameAncestorsDomains = [
  'metrika.yandex.ru',
  'metrika.yandex.by',
  'metrica.yandex.com',
  'metrica.yandex.com.tr',
  'webvisor.com',
];

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
});

export default function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  request.headers.set('x-nonce', nonce);

  const response = intlMiddleware(request);

  const assetPrefix = process.env.ASSET_PREFIX
    ? `${process.env.ASSET_PREFIX}/`
    : '';

  // https://github.com/radix-ui/primitives/issues/2057
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https: ${
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''
    };
    style-src 'self' ${assetPrefix} 'unsafe-inline';
    img-src 'self' blob: data: ${assetPrefix} ${mcDomains};
    connect-src 'self' ${mcDomains};
    child-src blob: ${mcDomains};
    frame-src blob: ${mcDomains};
    font-src 'self' ${assetPrefix};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' ${mcFrameAncestorsDomains};
    block-all-mixed-content;
    upgrade-insecure-requests;
  `;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue,
  );
  return response;
}

export const config = {
  // Match only internationalized pathnames
  // matcher: ['/', '/(en|ru)/:path*'],
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.webmanifest (manifest file)
     * - icon (icons)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|manifest|icon).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
