import { init } from '@sentry/nextjs';
import { SENTRY_CAPTURE_RATE, SENTRY_DSN } from 'sentry.constants.mjs';

init({
  dsn: SENTRY_DSN,
  tracesSampleRate: SENTRY_CAPTURE_RATE,
  environment: process.env.ENV,
});
