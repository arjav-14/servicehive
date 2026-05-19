import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';

export class AuthController {
  public static register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await AuthService.register(req.body);
      sendSuccess(res, 201, 'User registered successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      sendSuccess(res, 200, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  };

  public static getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request = req as any;
      if (!request.user) {
        throw new Error('User context missing');
      }
      const userId = request.user.id;
      const user = await AuthService.getUserProfile(userId);
      sendSuccess(res, 200, 'Profile retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  };
}
export default AuthController;
