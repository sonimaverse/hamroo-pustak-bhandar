import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User.js';
import { RegisterInput, LoginInput, UpdateProfileInput } from '../validators/authValidator.js';
import { ApiError } from '../utils/apiError.js';
import { generateToken } from '../utils/jwt.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';

export class AuthService {
  /**
   * Register a new customer account
   */
  static async register(input: RegisterInput) {
    const { name, email, password, phone, address } = input;
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      // Check existing user in MongoDB
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(400, 'An account with this email address already exists.');
      }

      // Create new customer account in MongoDB
      const user = new User({
        name,
        email,
        password,
        phone,
        address,
        role: 'customer',
        wholesaleStatus: 'none',
      });

      await user.save();

      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return {
        user: user.toSafeObject(),
        token,
      };
    } else {
      // Fallback engine
      const existingUser = fallbackStore.findUserByEmail(email);
      if (existingUser) {
        throw new ApiError(400, 'An account with this email address already exists.');
      }

      const newUser = await fallbackStore.createUser({
        name,
        email,
        password,
        phone,
        address,
      });

      const token = generateToken({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      });

      return {
        user: fallbackStore.toSafeObject(newUser),
        token,
      };
    }
  }

  /**
   * Login user with email & password
   */
  static async login(input: LoginInput) {
    const { email, password } = input;
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new ApiError(401, 'Invalid email or password.');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password.');
      }

      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return {
        user: user.toSafeObject(),
        token,
      };
    } else {
      const user = fallbackStore.findUserByEmail(email);
      if (!user) {
        throw new ApiError(401, 'Invalid email or password.');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password.');
      }

      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
      });

      return {
        user: fallbackStore.toSafeObject(user),
        token,
      };
    }
  }

  /**
   * Update user profile fields (name, phone, address)
   */
  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }

      if (input.name) user.name = input.name;
      if (input.phone !== undefined) user.phone = input.phone;
      if (input.address) {
        user.address = {
          ...user.address,
          ...input.address,
        };
      }

      await user.save();
      return user.toSafeObject();
    } else {
      const updatedUser = fallbackStore.updateUserProfile(userId, input);
      if (!updatedUser) {
        throw new ApiError(404, 'User account not found.');
      }
      return fallbackStore.toSafeObject(updatedUser);
    }
  }
}
