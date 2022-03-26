import { Request, Response, NextFunction } from 'express';

export function asyncErrorHandler(
  fn: (request: Request, response: Response, next: NextFunction) => void
) {
  return (request: Request, response: Response, next: NextFunction): void => {
    Promise.resolve(fn(request, response, next)).catch(next);
  };
}
