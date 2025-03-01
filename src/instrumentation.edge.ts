import { init } from '@sentry/nextjs';
import { SENTRY_CAPTURE_RATE, SENTRY_DSN } from 'sentry.constants';

init({
  dsn: SENTRY_DSN,
  tracesSampleRate: SENTRY_CAPTURE_RATE,
});
