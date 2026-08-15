import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/authValidator.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class AuthController {
  /**
   * POST /api/auth/register
   * Register standard customer account
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedInput = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedInput);

      res.status(201).json(
        new ApiResponse(201, result, 'User registered successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Authenticate user & issue JWT
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedInput = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedInput);

      res.status(200).json(
        new ApiResponse(200, result, 'User logged in successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user profile
   */
  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const safeUser = user?.toSafeObject ? user.toSafeObject() : user;

      res.status(200).json(
        new ApiResponse(200, { user: safeUser }, 'User profile retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   * Update authenticated user's profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedInput = updateProfileSchema.parse(req.body);
      const userId = req.user._id ? req.user._id.toString() : req.user.id;

      const updatedUser = await AuthService.updateProfile(userId, validatedInput);

      res.status(200).json(
        new ApiResponse(200, { user: updatedUser }, 'User profile updated successfully.')
      );
    } catch (error) {
      next(error);
    }
  }
}
