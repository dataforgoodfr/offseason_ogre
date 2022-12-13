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
    res.status(400).json({
      message: err.message,
      code: err.code,
      ...(!isProd ? { stack: err.stack } : {}),
    });
    return;
  }

  const businessError = createBusinessError("UNEXPECTED");
  res.status(500).json({
    message: businessError.message,
    code: businessError.code,
    ...(!isProd ? { stack: err.stack } : {}),
  });
};
