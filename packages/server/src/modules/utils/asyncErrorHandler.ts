import { Request, Response, NextFunction } from "express";
import { logError } from "../../middlewares";

export function asyncErrorHandler(
  fn: (request: Request, response: Response, next: NextFunction) => void
) {
  return (request: Request, response: Response, next: NextFunction): void => {
    Promise.resolve(fn(request, response, next)).catch((err) => {
      logError(err, request, response, next);
    });
  };
}
