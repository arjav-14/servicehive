import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import ApiError from '../utils/apiError';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails: Record<string, string> = {};
        error.issues.forEach((err) => {
          const field = err.path.join('.') || 'body';
          errorDetails[field] = err.message;
        });
        next(new ApiError(400, 'Validation validation failed', errorDetails));
      } else {
        next(error);
      }
    }
  };
};

export default validateRequest;
