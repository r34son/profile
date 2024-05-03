import { init } from '@sentry/nextjs';
import { SENTRY_CAPTURE_RATE, SENTRY_DSN } from 'sentry.constants.mjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // https://github.com/getsentry/sentry-javascript/issues/11823
    const { nodeProfilingIntegration } = await import('@sentry/profiling-node');
    init({
      dsn: SENTRY_DSN,
      debug: false,
      tracesSampleRate: SENTRY_CAPTURE_RATE,
      profilesSampleRate: SENTRY_CAPTURE_RATE,
      environment: process.env.ENV,
      integrations: [nodeProfilingIntegration()],
    });
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    init({
      dsn: SENTRY_DSN,
      tracesSampleRate: SENTRY_CAPTURE_RATE,
      environment: process.env.ENV,
    });
  }
}
