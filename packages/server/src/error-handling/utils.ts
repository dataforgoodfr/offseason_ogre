import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { Request, Response, Router } from "express";
import { getUserRequesting } from "../lib/express";

export { initErrorTracer, traceError, traceRequests };

const initErrorTracer = (app: Router) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENV || "development",
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: process.env.SENTRY_ENV !== "development" ? 0.01 : 1.0,
  });
};

const traceRequests = (app: Router) => {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
};

const traceError = (err: Error, req: Request, res: Response) => {
  const data = Sentry.extractRequestData(req);
  const user = getUserRequesting(res);
  Sentry.captureException(err, {
    user: {
      id: user?.id?.toString(),
    },
    contexts: data,
  });
};
