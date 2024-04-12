import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_HOST_ARCH,
  SEMRESATTRS_OS_TYPE,
  SEMRESATTRS_PROCESS_RUNTIME_VERSION,
  SEMRESATTRS_SERVICE_NAME,
} from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  SentrySpanProcessor,
  SentryPropagator,
} from '@sentry/opentelemetry-node';

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'next-app',
    [SEMRESATTRS_HOST_ARCH]: process.arch,
    [SEMRESATTRS_PROCESS_RUNTIME_VERSION]: process.version,
    [SEMRESATTRS_OS_TYPE]: process.platform,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  spanProcessors: [new SentrySpanProcessor()],
  textMapPropagator: new SentryPropagator(),
});

sdk.start();
