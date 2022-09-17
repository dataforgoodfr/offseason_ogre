/* eslint-disable import/no-import-module-exports */
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { setSessionItem, startSession } from "../lib/session";

export { setRequestId };

const CORRELATION_ID_HEADER = "X-Correlation-Id";
const REQUEST_ID_HEADER = "X-Request-Id";

const setRequestId = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.get(CORRELATION_ID_HEADER) || uuidv4();
  const requestId = uuidv4();

  res.set(CORRELATION_ID_HEADER, correlationId);
  res.set(REQUEST_ID_HEADER, requestId);

  startSession(() => {
    setSessionItem("correlationId", correlationId);
    setSessionItem("requestId", requestId);
    next();
  });
  next();
};
