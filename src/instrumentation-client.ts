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
  captureRouterTransitionStart,
  setCurrentClient,
} from '@sentry/nextjs';
import { SENTRY_CAPTURE_RATE, SENTRY_DSN } from 'sentry.constants';

const client = new BrowserClient({
  dsn: SENTRY_DSN,
  tracesSampleRate: SENTRY_CAPTURE_RATE,
  profilesSampleRate: SENTRY_CAPTURE_RATE,
  replaysOnErrorSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: [
    dedupeIntegration(),
    breadcrumbsIntegration(),
    linkedErrorsIntegration(),
    globalHandlersIntegration(),
    browserTracingIntegration(),
    browserProfilingIntegration(),
  ],
});

setCurrentClient(client);
client.init();

const lazyLoadSentryIntegrations = async () => {
  const { addIntegration, replayIntegration } = await import('@sentry/nextjs');
  addIntegration(replayIntegration({ maskAllText: false }));
};

lazyLoadSentryIntegrations();

export const onRouterTransitionStart = captureRouterTransitionStart;
