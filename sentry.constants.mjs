// https://docs.sentry.io/concepts/key-terms/dsn-explainer/#the-parts-of-the-dsn
export const SENTRY_PUBLIC_KEY = '90b846a21ddfd33d1b051d0bdb689bda';

export const SENTRY_HOST = 'o4506048860258304.ingest.us.sentry.io';

export const SENTRY_PROJECT_ID = '4506959997501440';

export const SENTRY_DSN = `https://${SENTRY_PUBLIC_KEY}@${SENTRY_HOST}/${SENTRY_PROJECT_ID}`;

export const SENTRY_CAPTURE_RATE = 1;
