import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService.js';
import { categorySchema, updateCategorySchema } from '../validators/bookValidator.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class CategoryController {
  /**
   * GET /api/categories
   * Public category listing
   */
  static async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(
        new ApiResponse(200, { categories }, 'Categories retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/categories
   * Admin-only create category
   */
  static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedInput = categorySchema.parse(req.body);
      const category = await CategoryService.createCategory(validatedInput);

      res.status(201).json(
        new ApiResponse(201, { category }, 'Category created successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/categories/:id
   * Admin-only update category
   */
  static async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedInput = updateCategorySchema.parse(req.body);
      const category = await CategoryService.updateCategory(id, validatedInput);

      res.status(200).json(
        new ApiResponse(200, { category }, 'Category updated successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/categories/:id
   * Admin-only delete category
   */
  static async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await CategoryService.deleteCategory(id);

      res.status(200).json(
        new ApiResponse(200, null, 'Category deleted successfully.')
      );
    } catch (error) {
      next(error);
    }
  }
}
