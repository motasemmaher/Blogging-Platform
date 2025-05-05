import { AnySchema, ValidationError } from 'yup';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Enhanced middleware for validating request data using Yup schemas
 * Supports validation for different parts of the request:
 * - body: validate request body (POST/PUT data)
 * - query: validate URL query parameters
 * - params: validate URL path parameters
 *
 * @param schema Yup schema for validation
 * @param location Where to find the data to validate ('body', 'query', 'params')
 * @returns Express middleware function that validates the request
 */
export const validateRequest = (
  schema: AnySchema,
  location: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req[location], {
        abortEarly: false, // Return all errors, not just the first one
      });

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        // Format detailed error message with all validation errors
        const errorDetails = error.inner.map(err => 
          `${err.path}: ${err.message}`
        ).join('; ');
        
        return next(new AppError(
          `Validation failed: ${errorDetails || error.message}`, 
          400
        ));
      }
      // For other types of errors, pass to the error handler
      next(new AppError(`Validation error: ${(error as Error).message}`, 500));
    }
  };
};
