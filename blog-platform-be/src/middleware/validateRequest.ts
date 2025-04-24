import { Request, Response, NextFunction } from 'express';
import { AnySchema, ValidationError } from 'yup';

type ValidateSource = 'body' | 'query' | 'params';

// Middleware factory to validate request against a Yup schema
export const validateRequest = (schema: AnySchema, source: ValidateSource = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req[source];
      await schema.validate(data, { abortEarly: false });
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        // Format error messages from Yup
        const errors = error.inner.reduce((acc: Record<string, string>, curr) => {
          if (curr.path) {
            acc[curr.path] = curr.message;
          }
          return acc;
        }, {});

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
      } else {
        next(error);
      }
    }
  };
}; 