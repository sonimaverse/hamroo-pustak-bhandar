import { User } from '../models/User.js';
import { Book } from '../models/Book.js';
import { Category } from '../models/Category.js';
import { Order } from '../models/Order.js';
import { WholesaleProfile } from '../models/WholesaleProfile.js';
import { ApiError } from '../utils/apiError.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';

export interface AdminUsersFilter {
  search?: string;
  role?: string;
  wholesaleStatus?: string;
  page?: number;
  limit?: number;
}

export class AdminService {
  /**
   * Get overall store analytics and stats
   */
  static async getDashboardStats() {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const [
        totalBooks,
        activeBooks,
        outOfStockBooks,
        totalCategories,
        totalOrders,
        pendingOrders,
        totalWholesaleApps,
        pendingWholesaleApps,
        totalUsers,
      ] = await Promise.all([
        Book.countDocuments(),
        Book.countDocuments({ status: 'active' }),
        Book.countDocuments({ stockQuantity: { $lte: 0 } }),
        Category.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ orderStatus: 'pending' }),
        WholesaleProfile.countDocuments(),
        WholesaleProfile.countDocuments({ status: 'pending' }),
        User.countDocuments(),
      ]);

      return {
        totalBooks,
        activeBooks,
        outOfStockBooks,
        totalCategories,
        totalOrders,
        pendingOrders,
        totalWholesaleApps,
        pendingWholesaleApps,
        totalUsers,
      };
    } else {
      // Fallback Engine Stats
      const booksData = fallbackStore.getBooks({ limit: 10000 });
      const books = booksData.books;
      const categories = fallbackStore.getCategories();
      const orders = fallbackStore.getAllOrders();
      const wholesaleApps = fallbackStore.getAllWholesaleProfiles();
      const users = (fallbackStore as any).getAllUsers ? (fallbackStore as any).getAllUsers({}) : [];

      const activeBooks = books.filter((b) => b.stockQuantity > 0 && b.status !== 'discontinued').length;
      const outOfStockBooks = books.filter((b) => b.stockQuantity <= 0).length;
      const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;
      const pendingWholesaleApps = wholesaleApps.filter((w) => w.status === 'pending').length;

      return {
        totalBooks: books.length,
        activeBooks,
        outOfStockBooks,
        totalCategories: categories.length,
        totalOrders: orders.length,
        pendingOrders,
        totalWholesaleApps: wholesaleApps.length,
        pendingWholesaleApps,
        totalUsers: users.length || 3,
      };
    }
  }

  /**
   * List all registered users with search, role/status filters, and pagination
   */
  static async getUsers(filters: AdminUsersFilter) {
    const { search, role, wholesaleStatus, page = 1, limit = 20 } = filters;
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const query: any = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      if (role && role !== 'all') {
        query.role = role;
      }

      if (wholesaleStatus && wholesaleStatus !== 'all') {
        query.wholesaleStatus = wholesaleStatus;
      }

      const total = await User.countDocuments(query);
      const totalPages = Math.ceil(total / limit) || 1;
      const skip = (page - 1) * limit;

      const rawUsers = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const users = rawUsers.map((u) => u.toSafeObject());

      return {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } else {
      // Fallback Store
      return fallbackStore.getAllUsersPaginated({
        search,
        role,
        wholesaleStatus,
        page,
        limit,
      });
    }
  }

  /**
   * Deactivate a user account. Preserves the user record and all associated
   * historical data (Orders, Invoices, WholesaleProfile, Cart).
   */
  static async deactivateUser(userId: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const user = await User.findById(userId);

      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }

      user.isActive = false;
      await user.save();

      return user.toSafeObject();
    }

    const user = fallbackStore.deactivateUser(userId);

    if (!user) {
      throw new ApiError(404, 'User account not found.');
    }

    return fallbackStore.toSafeObject(user);
  }

  /**
   * Reactivate a previously deactivated user account.
   */
  static async reactivateUser(userId: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const user = await User.findById(userId);

      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }

      user.isActive = true;
      await user.save();

      return user.toSafeObject();
    }

    const user = fallbackStore.reactivateUser(userId);

    if (!user) {
      throw new ApiError(404, 'User account not found.');
    }

    return fallbackStore.toSafeObject(user);
  }

  /**
   * Revoke wholesale privileges from a user. Changes role to customer and
   * wholesaleStatus to rejected. Keeps the account active and preserves all
   * historical records.
   */
  static async revokeWholesale(userId: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const user = await User.findById(userId);

      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }

      if (user.role === 'wholesale') {
        user.role = 'customer';
        user.wholesaleStatus = 'rejected';
        await user.save();
      }

      return user.toSafeObject();
    }

    const user = fallbackStore.revokeWholesale(userId);

    if (!user) {
      throw new ApiError(404, 'User account not found.');
    }

    return fallbackStore.toSafeObject(user);
  }
}
