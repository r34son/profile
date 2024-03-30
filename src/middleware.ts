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
].join(' ');

const reportEndpoint = `https://o4506048860258304.ingest.sentry.io/api/4506959997501440/security/?sentry_key=90b846a21ddfd33d1b051d0bdb689bda&sentry_environment=${process.env.ENV}`;

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
    connect-src 'self' ${mcDomains} sentry.io;
    child-src blob: ${mcDomains};
    frame-src blob: ${mcDomains};
    font-src 'self' ${assetPrefix};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' ${mcFrameAncestorsDomains};
    block-all-mixed-content;
    upgrade-insecure-requests;
    report-uri ${reportEndpoint};
    report-to csp-endpoint
  `;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue,
  );

  response.headers.set(
    'Report-To',
    `{"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"${reportEndpoint}"}],"include_subdomains":true}`,
  );

  response.headers.set('Expect-CT', `report-uri="${reportEndpoint}"`);

  response.headers.set('Public-Key-Pins', `report-uri="${reportEndpoint}"`);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - monitoring (sentry tunnel route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     * - manifest.webmanifest (manifest file)
     * - icon (icons)
     */
    {
      source:
        '/((?!api|monitoring|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest|icon).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
