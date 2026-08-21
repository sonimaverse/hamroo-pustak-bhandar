import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '../validators/authValidator.js';
import { ApiError } from '../utils/apiError.js';
import { generateToken } from '../utils/jwt.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';

const RESET_TOKEN_EXPIRY_MINUTES = 15;

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export class AuthService {
  /**
   * POST /api/auth/register
   * Register a new customer account
   */
  static async register(input: RegisterInput) {
    const { name, email, password, phone, address } = input;
    const dbState = getDbStatus();

    try {
      /*
       * ============================================================
       * MONGODB ATLAS
       * ============================================================
       */
      if (
        dbState.mode === 'mongodb_atlas' &&
        dbState.isConnected
      ) {
        const normalizedEmail = email.trim().toLowerCase();

        // Check whether email already exists
        const existingUser = await User.findOne({
          email: normalizedEmail,
        });

        if (existingUser) {
          throw new ApiError(
            400,
            'An account with this email address already exists.'
          );
        }

        // Create new customer
        const user = new User({
          name: name.trim(),
          email: normalizedEmail,
          password,
          phone: phone || '',
          address: address || {},
          role: 'customer',
          wholesaleStatus: 'none',
        });

        await user.save();

        console.log(
          `✅ [Registration] New customer created: ${normalizedEmail}`
        );

        // Generate JWT
        const token = generateToken({
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        });

        return {
          user: user.toSafeObject(),
          token,
        };
      }

      /*
       * ============================================================
       * FALLBACK STORAGE
       * ============================================================
       */

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser =
        fallbackStore.findUserByEmail(normalizedEmail);

      if (existingUser) {
        throw new ApiError(
          400,
          'An account with this email address already exists.'
        );
      }

      const newUser = await fallbackStore.createUser({
        name: name.trim(),
        email: normalizedEmail,
        password,
        phone,
        address,
      });

      console.log(
        `✅ [Registration/Fallback] New customer created: ${normalizedEmail}`
      );

      const token = generateToken({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      });

      return {
        user: fallbackStore.toSafeObject(newUser),
        token,
      };
    } catch (error: any) {
      console.error(
        '❌ [Registration Error]:',
        error?.message || error
      );

      /*
       * Already handled API errors
       */
      if (error instanceof ApiError) {
        throw error;
      }

      /*
       * MongoDB duplicate key error
       */
      if (error?.code === 11000) {
        throw new ApiError(
          400,
          'An account with this email address already exists.'
        );
      }

      /*
       * Mongoose validation error
       */
      if (error?.name === 'ValidationError') {
        const messages = Object.values(
          error.errors || {}
        )
          .map((err: any) => err.message)
          .join(', ');

        throw new ApiError(
          400,
          messages || 'Invalid registration information.'
        );
      }

      /*
       * Generic registration error
       */
      throw new ApiError(
        500,
        error?.message ||
          'Registration failed. Please try again.'
      );
    }
  }

  /**
   * POST /api/auth/login
   * Login customer / wholesale / admin
   */
  static async login(input: LoginInput) {
    const { email, password } = input;
    const dbState = getDbStatus();

    try {
      /*
       * ============================================================
       * MONGODB ATLAS LOGIN
       * ============================================================
       */
      if (
        dbState.mode === 'mongodb_atlas' &&
        dbState.isConnected
      ) {
        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
          email: normalizedEmail,
        }).select('+password');

        if (!user) {
          throw new ApiError(
            401,
            'Invalid email or password.'
          );
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          throw new ApiError(
            401,
            'Invalid email or password.'
          );
        }

        if (user.isActive === false) {
          throw new ApiError(
            403,
            'This account has been deactivated. Please contact support.'
          );
        }

        const token = generateToken({
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        });

        console.log(
          `✅ [Login] User logged in: ${normalizedEmail} (${user.role})`
        );

        return {
          user: user.toSafeObject(),
          token,
        };
      }

      /*
       * ============================================================
       * FALLBACK LOGIN
       * ============================================================
       */

      const normalizedEmail = email.trim().toLowerCase();

      const user =
        fallbackStore.findUserByEmail(normalizedEmail);

      if (!user) {
        throw new ApiError(
          401,
          'Invalid email or password.'
        );
      }

      const isMatch = await bcrypt.compare(
        password,
        user.passwordHash
      );

      if (!isMatch) {
        throw new ApiError(
          401,
          'Invalid email or password.'
        );
      }

      if (user.isActive === false) {
        throw new ApiError(
          403,
          'This account has been deactivated. Please contact support.'
        );
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
    } catch (error: any) {
      console.error(
        '❌ [Login Error]:',
        error?.message || error
      );

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        error?.message || 'Login failed. Please try again.'
      );
    }
  }

  /**
   * PUT /api/auth/profile
   * Update authenticated user's profile
   */
  static async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ) {
    const dbState = getDbStatus();

    try {
      /*
       * ============================================================
       * MONGODB ATLAS
       * ============================================================
       */
      if (
        dbState.mode === 'mongodb_atlas' &&
        dbState.isConnected
      ) {
        const user = await User.findById(userId);

        if (!user) {
          throw new ApiError(
            404,
            'User account not found.'
          );
        }

        if (input.name) {
          user.name = input.name.trim();
        }

        if (input.phone !== undefined) {
          user.phone = input.phone;
        }

        if (input.address) {
          user.address = {
            ...user.address,
            ...input.address,
          };
        }

        await user.save();

        return user.toSafeObject();
      }

      /*
       * ============================================================
       * FALLBACK STORAGE
       * ============================================================
       */

      const updatedUser =
        fallbackStore.updateUserProfile(
          userId,
          input
        );

      if (!updatedUser) {
        throw new ApiError(
          404,
          'User account not found.'
        );
      }

      return fallbackStore.toSafeObject(updatedUser);
    } catch (error: any) {
      console.error(
        '❌ [Profile Update Error]:',
        error?.message || error
      );

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        error?.message ||
          'Unable to update profile. Please try again.'
      );
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Generate a password reset token for the given email.
   * Always returns a generic success message to avoid revealing
   * whether an email is registered.
   *
   * Returns the raw reset token + expiry so the caller can deliver it
   * (e.g. email link). In production this would be emailed; here it is
   * returned directly for applications without an email provider.
   */
  static async forgotPassword(input: ForgotPasswordInput) {
    const normalizedEmail = input.email.trim().toLowerCase();
    const dbState = getDbStatus();

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(rawToken);
    const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

    let userFound = false;

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user) {
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = expires;
        await user.save({ validateBeforeSave: false });
        userFound = true;
      }
    } else {
      const user = fallbackStore.findUserByEmail(normalizedEmail);
      if (user) {
        fallbackStore.setPasswordResetToken(user._id, hashedToken, expires);
        userFound = true;
      }
    }

    if (process.env.NODE_ENV === 'production' || !userFound) {
      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
      resetToken: rawToken,
      expiresAt: expires.toISOString(),
    };
  }

  /**
   * POST /api/auth/reset-password
   * Consume a reset token and set a new password.
   * Token is single-use: cleared immediately upon success.
   */
  static async resetPassword(input: ResetPasswordInput) {
    const hashedToken = hashToken(input.token);
    const dbState = getDbStatus();

    let user: any = null;

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
      }).select('+password +passwordResetToken +passwordResetExpires');

      if (!user) {
        throw new ApiError(400, 'Invalid or expired reset token. Please request a new one.');
      }

      user.password = input.password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
    } else {
      user = fallbackStore.findUserByResetToken(hashedToken);

      if (!user) {
        throw new ApiError(400, 'Invalid or expired reset token. Please request a new one.');
      }

      const newPasswordHash = await bcrypt.hash(input.password, 10);
      fallbackStore.updateUserPassword(user._id, newPasswordHash);
      fallbackStore.clearPasswordResetToken(user._id);
    }

    return { message: 'Your password has been reset successfully. You can now log in with your new password.' };
  }

  /**
   * PUT /api/auth/change-password
   * Allow an authenticated user to change their password after
   * verifying the current one.
   */
  static async changePassword(
    userId: string,
    input: ChangePasswordInput
  ) {
    const dbState = getDbStatus();

    let user: any = null;

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      user = await User.findById(userId).select('+password');

      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }

      const isMatch = await user.comparePassword(input.currentPassword);

      if (!isMatch) {
        throw new ApiError(401, 'Current password is incorrect.');
      }

      user.password = input.password;
      await user.save();
    } else {
      user = fallbackStore.findUserById(userId);

      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }

      const isMatch = await bcrypt.compare(input.currentPassword, user.passwordHash);

      if (!isMatch) {
        throw new ApiError(401, 'Current password is incorrect.');
      }

      const newPasswordHash = await bcrypt.hash(input.password, 10);
      fallbackStore.updateUserPassword(user._id, newPasswordHash);
    }

    return { message: 'Your password has been changed successfully.' };
  }
}