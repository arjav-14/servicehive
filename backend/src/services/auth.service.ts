import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import User from '../models/user.model';
import { IUser, UserRole } from '../interfaces/auth.interface';
import { ApiError } from '../utils/apiError';

export class AuthService {
  public static generateToken(userId: string, role: UserRole): string {
    return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
      expiresIn: '24h',
    });
  }

  public static async register(userData: Partial<IUser>): Promise<{ user: IUser; token: string }> {
    const { name, email, password, role } = userData;

    const existingUser = await User.findOne({ email: email?.toLowerCase() });
    if (existingUser) {
      throw new ApiError(400, 'Email address already registered');
    }

    const user = await User.create({ name, email, password, role });
    
    const userObj = user.toObject();
    delete userObj.password;

    const token = this.generateToken(user._id.toString(), user.role);

    return { user: userObj as IUser, token };
  }

  public static async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const userObj = user.toObject();
    delete userObj.password;

    const token = this.generateToken(user._id.toString(), user.role);

    return { user: userObj as IUser, token };
  }

  public static async getUserProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }
}
export default AuthService;
