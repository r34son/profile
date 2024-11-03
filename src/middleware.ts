import createIntlMiddleware from 'next-intl/middleware';
import type { NextFetchEvent, NextRequest } from 'next/server';
import createCspMiddleware, {
  INLINE,
  NONCE,
  STRICT_DYNAMIC,
  NONE,
  SELF,
  BLOB,
  DATA,
} from 'next-csp';
import {
  SENTRY_HOST,
  SENTRY_PROJECT_ID,
  SENTRY_PUBLIC_KEY,
} from 'sentry.constants.mjs';
import { locales } from '@/i18n';

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

const reportUri = `https://${SENTRY_HOST}/api/${SENTRY_PROJECT_ID}/security/?sentry_key=${SENTRY_PUBLIC_KEY}&sentry_release=${process.env.SENTRY_RELEASE}&sentry_environment=${process.env.SENTRY_ENVIRONMENT}`;

const intlMiddleware = createIntlMiddleware({ locales, defaultLocale: 'en' });

const assetPrefix = process.env.ASSET_PREFIX
  ? `${process.env.ASSET_PREFIX}/`
  : '';

// https://github.com/emilkowalski/vaul/issues/283
// https://github.com/radix-ui/primitives/issues/2057
// https://developer.chrome.com/docs/lighthouse/best-practices/csp-xss#how_to_develop_a_strict_csp
// require-trusted-types-for 'script';
const cspMiddleware = createCspMiddleware({
  directives: {
    'default-src': [SELF],
    'script-src': [SELF, NONCE, STRICT_DYNAMIC, INLINE, 'https:'],
    'style-src': [SELF, assetPrefix, INLINE],
    'img-src': [
      SELF,
      BLOB,
      DATA,
      assetPrefix,
      mcDomains,
      'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/',
    ],
    'connect-src': [SELF, mcDomains, '*.sentry.io'],
    'child-src': [BLOB, mcDomains],
    'frame-src': [BLOB, 'https://smartcaptcha.yandexcloud.net', mcDomains],
    'font-src': [SELF, 'https://yastatic.net/s3/home/fonts/ys/1/', assetPrefix],
    'object-src': [NONE],
    'base-uri': [NONE],
    'form-action': [SELF],
    'frame-ancestors': [SELF, mcFrameAncestorsDomains],
    'block-all-mixed-content': true,
    'upgrade-insecure-requests': true,
  },
  reportUri,
});

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const response = intlMiddleware(request);
  // @ts-expect-error https://github.com/pnpm/pnpm/issues/6382
  return cspMiddleware(request, event, response);
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
