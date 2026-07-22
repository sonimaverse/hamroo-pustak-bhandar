import { asyncHandler } from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import { getOverview } from '../services/dashboard.service.js';
import {
  countActiveProducts,
  countDeletedProducts,
  getCategoryDistribution,
  countCustomers,
  countWholesaleUsers,
  countPendingApprovals,
} from '../repositories/dashboard.repository.js';

const overview = asyncHandler(async (req, res) => {
  const data = await getOverview();

  ApiResponse(res, 200, 'Dashboard overview fetched successfully', data);
});

const productStats = asyncHandler(async (req, res) => {
  const [activeProducts, deletedProducts, categoryDistribution] = await Promise.all([
    countActiveProducts(),
    countDeletedProducts(),
    getCategoryDistribution(),
  ]);

  ApiResponse(res, 200, 'Product stats fetched successfully', {
    activeProducts,
    deletedProducts,
    categoryDistribution,
  });
});

const userStats = asyncHandler(async (req, res) => {
  const [customers, wholesaleUsers, pendingApprovals] = await Promise.all([
    countCustomers(),
    countWholesaleUsers(),
    countPendingApprovals(),
  ]);

  ApiResponse(res, 200, 'User stats fetched successfully', {
    customers,
    wholesaleUsers,
    pendingApprovals,
  });
});

export {
  overview,
  productStats,
  userStats,
};
