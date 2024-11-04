import { init } from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import {
  Resource,
  detectResourcesSync,
  envDetector,
  hostDetector,
} from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { HostMetrics } from '@opentelemetry/host-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

import { SENTRY_CAPTURE_RATE, SENTRY_DSN } from 'sentry.constants.mjs';

init({
  dsn: SENTRY_DSN,
  tracesSampleRate: SENTRY_CAPTURE_RATE,
  profilesSampleRate: SENTRY_CAPTURE_RATE,
  integrations: [nodeProfilingIntegration()],
});

const { endpoint, port } = PrometheusExporter.DEFAULT_OPTIONS;

const exporter = new PrometheusExporter({}, () => {
  console.log(
    ` ✓ Prometheus scrape endpoint: http://${process.env.HOSTNAME || 'localhost'}:${port}${endpoint}`,
  );
});

const customResources = new Resource({
  [ATTR_SERVICE_NAME]: 'next-app',
  [ATTR_SERVICE_VERSION]: process.env.SENTRY_RELEASE,
});

const detectedResources = detectResourcesSync({
  detectors: [envDetector, hostDetector],
});

const resource = detectedResources.merge(customResources);

const meterProvider = new MeterProvider({ readers: [exporter], resource });

registerInstrumentations({
  meterProvider,
  instrumentations: [new RuntimeNodeInstrumentation()],
});

const hostMetrics = new HostMetrics({
  meterProvider,
  name: 'host-metrics',
});

hostMetrics.start();
