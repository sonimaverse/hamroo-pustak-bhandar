import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import { USER_ROLES, WHOLESALE_STATUS } from '../utils/constants.js';

const countTotalProducts = () => Product.countDocuments({ isDeleted: false });

const countTotalUsers = () => User.countDocuments({ isDeleted: false });

const countApprovedWholesaleUsers = () =>
  User.countDocuments({
    role: USER_ROLES.WHOLESALE_APPROVED,
    status: WHOLESALE_STATUS.APPROVED,
    isDeleted: false,
  });

const countPendingApplications = () =>
  User.countDocuments({
    role: USER_ROLES.WHOLESALE_PENDING,
    status: WHOLESALE_STATUS.PENDING,
    isDeleted: false,
  });

const countLowStockProducts = () =>
  Product.countDocuments({
    isDeleted: false,
    $expr: { $lte: ['$stock', '$minimumStock'] },
  });

const countOutOfStockProducts = () =>
  Product.countDocuments({ isDeleted: false, stock: 0 });

const countActiveProducts = () =>
  Product.countDocuments({ isDeleted: false, status: 'active' });

const countDeletedProducts = () =>
  Product.countDocuments({ isDeleted: true });

const getCategoryDistribution = () =>
  Product.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

const countCustomers = () =>
  User.countDocuments({
    role: USER_ROLES.GUEST,
    isDeleted: false,
  });

const countWholesaleUsers = () =>
  User.countDocuments({
    role: { $in: [USER_ROLES.WHOLESALE_PENDING, USER_ROLES.WHOLESALE_APPROVED] },
    isDeleted: false,
  });

const countPendingApprovals = () =>
  User.countDocuments({
    role: USER_ROLES.WHOLESALE_PENDING,
    status: WHOLESALE_STATUS.PENDING,
    isDeleted: false,
  });

export {
  countTotalProducts,
  countTotalUsers,
  countApprovedWholesaleUsers,
  countPendingApplications,
  countLowStockProducts,
  countOutOfStockProducts,
  countActiveProducts,
  countDeletedProducts,
  getCategoryDistribution,
  countCustomers,
  countWholesaleUsers,
  countPendingApprovals,
};
