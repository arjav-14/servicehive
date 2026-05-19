import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/auth.interface';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'sales',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to the database
userSchema.pre('save', async function () {
  const user = this as any;
  if (!user.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password || '', salt);
  } catch (err) {
    throw err;
  }
});

// Instance method to compare incoming plain text password with hashed DB value
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  try {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
  } catch {
    return false;
  }
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
