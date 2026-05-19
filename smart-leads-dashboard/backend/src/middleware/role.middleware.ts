import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../interfaces/auth.interface';
import ApiError from '../utils/apiError';

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const request = req as any;
      if (!request.user) {
        throw new ApiError(401, 'Authentication required');
      }

      if (!roles.includes(request.user.role)) {
        throw new ApiError(403, 'Access denied. You do not have permission to perform this action.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorize;
