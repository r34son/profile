import { init } from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { SENTRY_CAPTURE_RATE, SENTRY_DSN } from 'sentry.constants.mjs';

init({
  dsn: SENTRY_DSN,
  debug: true,
  tracesSampleRate: SENTRY_CAPTURE_RATE,
  profilesSampleRate: SENTRY_CAPTURE_RATE,
  instrumenter: 'otel',
  environment: process.env.ENV,
  integrations: [nodeProfilingIntegration()],
});
