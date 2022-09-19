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
  next: NextFunction
) => {
  logger.error(err);

  if (err instanceof BusinessError) {
    res.status(400).send({
      message: err.message,
      code: err.code,
      ...(!isProd ? { stack: err.stack } : {}),
    });
  } else {
    const businessError = createBusinessError("UNEXPECTED");
    res.status(500).send({
      message: businessError.message,
      code: businessError.code,
      ...(!isProd ? { stack: err.stack } : {}),
    });
  }
};
