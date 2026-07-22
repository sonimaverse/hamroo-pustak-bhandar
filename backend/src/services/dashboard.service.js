import {
  countTotalProducts,
  countTotalUsers,
  countApprovedWholesaleUsers,
  countPendingApplications,
  countLowStockProducts,
  countOutOfStockProducts,
} from '../repositories/dashboard.repository.js';

const getOverview = async () => {
  const [
    totalProducts,
    totalUsers,
    approvedWholesaleUsers,
    pendingApplications,
    lowStockProducts,
    outOfStockProducts,
  ] = await Promise.all([
    countTotalProducts(),
    countTotalUsers(),
    countApprovedWholesaleUsers(),
    countPendingApplications(),
    countLowStockProducts(),
    countOutOfStockProducts(),
  ]);

  return {
    totalProducts,
    totalUsers,
    approvedWholesaleUsers,
    pendingApplications,
    lowStockProducts,
    outOfStockProducts,
  };
};

export { getOverview };
