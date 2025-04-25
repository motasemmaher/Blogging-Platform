import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handling middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response
): void => {
  // Set status code
  const statusCode = err instanceof AppError 
    ? err.statusCode 
    : res.statusCode === 200 ? 500 : res.statusCode;

  // Send error response
  res.status(statusCode).json({
    message: err.message
  });
};
