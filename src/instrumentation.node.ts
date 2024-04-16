import { init } from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { SENTRY_CAPTURE_RATE, SENTRY_DSN } from 'sentry.constants.mjs';

init({
  dsn: SENTRY_DSN,
  debug: false,
  tracesSampleRate: SENTRY_CAPTURE_RATE,
  profilesSampleRate: SENTRY_CAPTURE_RATE,
  environment: process.env.ENV,
  integrations: [nodeProfilingIntegration()],
});
