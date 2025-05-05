import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import config from '../config';

// Not found middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

/**
 * Central error handling middleware
 * Formats and standardizes all error responses
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Log detailed error in development/test environments
  if (config.SERVER.NODE_ENV !== 'production') {
    console.error('\x1b[31m%s\x1b[0m', '[ERROR]', {
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      // For AppError, include the status code
      ...(err instanceof AppError && { statusCode: err.statusCode }),
    });
  } else {
    // Simplified error logging in production
    console.error(`${req.method} ${req.originalUrl} - Error: ${err.message}`);
  }

  // Set default error information
  const statusCode = err instanceof AppError 
    ? err.statusCode 
    : res.statusCode === 200 ? 500 : res.statusCode;
  
  const errorResponse = {
    success: false,
    message: err.message || 'Server Error',
    ...(config.SERVER.NODE_ENV !== 'production' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
};
