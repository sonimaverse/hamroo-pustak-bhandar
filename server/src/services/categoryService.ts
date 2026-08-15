import { Category, ICategory } from '../models/Category.js';
import { CategoryInput } from '../validators/bookValidator.js';
import { ApiError } from '../utils/apiError.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';

export class CategoryService {
  /**
   * Get all categories
   */
  static async getAllCategories() {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      return await Category.find().sort({ name: 1 });
    } else {
      return fallbackStore.getCategories();
    }
  }

  /**
   * Create category (Admin only)
   */
  static async createCategory(input: CategoryInput) {
    const { name, description, icon } = input;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const existing = await Category.findOne({
        $or: [{ name: { $regex: new RegExp(`^${name}$`, 'i') } }, { slug }],
      });

      if (existing) {
        throw new ApiError(400, 'A category with this name or slug already exists.');
      }

      const category = new Category({
        name,
        slug,
        description,
        icon,
      });

      await category.save();
      return category;
    } else {
      const existing = fallbackStore.getCategories().find(
        (c) => c.name.toLowerCase() === name.toLowerCase() || c.slug === slug
      );

      if (existing) {
        throw new ApiError(400, 'A category with this name or slug already exists.');
      }

      return fallbackStore.createCategory({ name, slug, description, icon });
    }
  }

  /**
   * Update category (Admin only)
   */
  static async updateCategory(id: string, input: Partial<CategoryInput>) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const category = await Category.findById(id);
      if (!category) {
        throw new ApiError(404, 'Category not found.');
      }

      if (input.name) {
        const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existing = await Category.findOne({
          _id: { $ne: id },
          $or: [{ name: { $regex: new RegExp(`^${input.name}$`, 'i') } }, { slug }],
        });

        if (existing) {
          throw new ApiError(400, 'Another category with this name already exists.');
        }

        category.name = input.name;
        category.slug = slug;
      }

      if (input.description !== undefined) category.description = input.description;
      if (input.icon) category.icon = input.icon;

      await category.save();
      return category;
    } else {
      const slug = input.name
        ? input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : undefined;

      const updated = fallbackStore.updateCategory(id, {
        ...(input.name ? { name: input.name, slug } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.icon ? { icon: input.icon } : {}),
      });

      if (!updated) {
        throw new ApiError(404, 'Category not found.');
      }
      return updated;
    }
  }

  /**
   * Delete category (Admin only)
   */
  static async deleteCategory(id: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        throw new ApiError(404, 'Category not found.');
      }
      return true;
    } else {
      const deleted = fallbackStore.deleteCategory(id);
      if (!deleted) {
        throw new ApiError(404, 'Category not found.');
      }
      return true;
    }
  }
}
