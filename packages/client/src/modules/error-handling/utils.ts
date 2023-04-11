import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

export { captureError, initErrorTracer };

const initErrorTracer = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENV || "development",
    integrations: [new BrowserTracing()],
    tracesSampleRate: import.meta.env.PROD ? 0.01 : 1.0,
  });
};

const captureError = (
  err: Error,
  additionalData: Record<string, string> = {}
) => {
  Sentry.captureException(err, {
    contexts: {
      additionalData,
    },
  });
};
