import {
  BrowserClient,
  breadcrumbsIntegration,
  dedupeIntegration,
  defaultStackParser,
  globalHandlersIntegration,
  makeFetchTransport,
  linkedErrorsIntegration,
  setCurrentClient,
} from '@sentry/nextjs';
import { SENTRY_CAPTURE_RATE, SENTRY_DSN } from 'sentry.constants.mjs';

const client = new BrowserClient({
  dsn: SENTRY_DSN,
  tracesSampleRate: SENTRY_CAPTURE_RATE,
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
  ],
});

setCurrentClient(client);

// Loads this Dynamically to avoid adding this to the main bundle (initial load)
import('@sentry/nextjs').then(({ Replay, BrowserTracing }) => {
  client.addIntegration(new Replay({ maskAllText: false }));
  client.addIntegration(new BrowserTracing({ enableInp: true }));
});
