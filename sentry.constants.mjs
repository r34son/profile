export const SENTRY_DSN =
  'https://90b846a21ddfd33d1b051d0bdb689bda@o4506048860258304.ingest.us.sentry.io/4506959997501440';

export const SENTRY_CAPTURE_RATE = 1;

/**
 * This configures which Sentry features to tree-shake/remove from the Sentry bundle
 *
 * @see https://docs.sentry.io/platforms/javascript/configuration/tree-shaking/#tree-shaking-optional-code-with-webpack
 */
export const SENTRY_EXTENSIONS = {
  __SENTRY_DEBUG__: false,
  __SENTRY_TRACING__: true,
  __RRWEB_EXCLUDE_IFRAME__: true,
  __RRWEB_EXCLUDE_SHADOW_DOM__: true,
  __SENTRY_EXCLUDE_REPLAY_WORKER__: false,
};
