import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import ApiError from '../utils/apiError';
import { UserRole } from '../interfaces/auth.interface';

interface DecodedToken {
  id: string;
  role: UserRole;
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'Access denied. Invalid token format.');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken;

    (req as any).user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, 'Authorization token has expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid authorization token'));
    } else {
      next(error);
    }
  }
};

export default authenticate;
