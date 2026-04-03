import * as Sentry from '@sentry/react';

import { APP_ENVIRONMENT, SENTRY_DSN } from '@/config/runtimeConfig';

let monitoringInitialized = false;

export const initializeClientMonitoring = () => {
  if (monitoringInitialized || !SENTRY_DSN) {
    return monitoringInitialized;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: APP_ENVIRONMENT,
    tracesSampleRate: 0
  });

  monitoringInitialized = true;
  return true;
};

export const reportClientError = (error, context = {}) => {
  console.error({
    level: 'error',
    source: 'frontend',
    message: error?.message || 'Unexpected client error',
    context
  });

  if (!SENTRY_DSN) {
    return;
  }

  initializeClientMonitoring();
  Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
    extra: context
  });
};

export const ClientErrorBoundary = Sentry.ErrorBoundary;
