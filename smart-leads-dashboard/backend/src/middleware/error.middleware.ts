import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError';
import { sendError } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorData = err.errors || {};

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorData = err.errors || {};
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Failed';
    const errors: any = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
    errorData = errors;
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate key error';
    const field = Object.keys(err.keyValue)[0];
    errorData = { [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` };
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authorization token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authorization token has expired';
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('💥 Unhandled Server Exception:', err);
  }

  sendError(res, statusCode, message, errorData);
};
export default errorHandler;
