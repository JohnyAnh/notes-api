import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || 'Internal Server Error' });
}

