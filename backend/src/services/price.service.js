import { USER_ROLES } from '../utils/constants.js';

const canAccessWholesalePrice = (userRole) => {
  return userRole === USER_ROLES.WHOLESALE_APPROVED || userRole === USER_ROLES.ADMIN;
};

const getVisiblePrices = (product, userRole) => {
  const prices = {
    retailPrice: product.retailPrice,
  };

  if (canAccessWholesalePrice(userRole)) {
    prices.wholesalePrice = product.wholesalePrice;
  }

  return prices;
};

export { canAccessWholesalePrice, getVisiblePrices };
