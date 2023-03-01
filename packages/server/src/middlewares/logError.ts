import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import {
  BusinessError,
  createBusinessError,
} from "../modules/utils/businessError";

export { logError };

const isProd = process.env.NODE_ENV === "production";

const logError = (
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  logger.error(err);

  if (err instanceof BusinessError) {
    if (err.code === "USER_NOT_AUTHENTICATED") {
      res.status(401).json(formatBusinessError(err));
    } else if (err.code === "USER_NOT_AUTHORIZED") {
      res.status(403).json(formatBusinessError(err));
    } else {
      res.status(400).json(formatBusinessError(err));
    }
    return;
  }

  const unexpectedErr = createBusinessError("UNEXPECTED");
  res.status(500).json(formatBusinessError(unexpectedErr));
};

function formatBusinessError(err: BusinessError) {
  return {
    message: err.message,
    code: err.code,
    ...(!isProd ? { stack: err.stack } : {}),
  };
}
