import {
  BrowserClient,
  breadcrumbsIntegration,
  dedupeIntegration,
  defaultStackParser,
  globalHandlersIntegration,
  makeFetchTransport,
  linkedErrorsIntegration,
  browserTracingIntegration,
  browserProfilingIntegration,
  setCurrentClient,
} from '@sentry/nextjs';
import { SENTRY_CAPTURE_RATE, SENTRY_DSN } from 'sentry.constants.mjs';

const client = new BrowserClient({
  dsn: SENTRY_DSN,
  debug: true,
  tracesSampleRate: SENTRY_CAPTURE_RATE,
  profilesSampleRate: SENTRY_CAPTURE_RATE,
  replaysOnErrorSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  environment: process.env.NEXT_PUBLIC_ENV,
  integrations: [
    breadcrumbsIntegration(),
    globalHandlersIntegration(),
    linkedErrorsIntegration(),
    dedupeIntegration(),
    browserTracingIntegration(),
    browserProfilingIntegration(),
  ],
});

setCurrentClient(client);

const lazyLoadSentryIntegrations = async () => {
  const { addIntegration, replayIntegration } = await import('@sentry/nextjs');
  addIntegration(replayIntegration({ maskAllText: false }));
};

lazyLoadSentryIntegrations();
