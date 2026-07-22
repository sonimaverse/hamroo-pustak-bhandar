import { ApiError } from '../../utils/apiError.js';
import {
  findById,
  findLowStockProducts,
  countLowStockProducts,
  updateProductStock,
  createStockHistory,
  findHistoryByProduct,
  countHistoryByProduct,
} from '../repositories/inventory.repository.js';

const computeChange = (previous, next) => next - previous;

const addStock = async (productId, quantity, reason, userId) => {
  if (quantity <= 0) {
    throw new ApiError('Quantity must be greater than 0', 400);
  }

  const product = await findById(productId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  if (product.isDeleted) {
    throw new ApiError('Product has been deleted', 404);
  }

  const previousQuantity = product.stock;
  const newQuantity = previousQuantity + quantity;
  const changeAmount = computeChange(previousQuantity, newQuantity);

  const updatedProduct = await updateProductStock(productId, newQuantity);
  await createStockHistory({
    product: productId,
    previousQuantity,
    newQuantity,
    changeAmount,
    actionType: 'add',
    reason: reason || 'Stock added by admin',
    performedBy: userId,
  });

  return {
    product: updatedProduct,
    history: {
      previousQuantity,
      newQuantity,
      changeAmount,
      actionType: 'add',
    },
  };
};

const removeStock = async (productId, quantity, reason, userId) => {
  if (quantity <= 0) {
    throw new ApiError('Quantity must be greater than 0', 400);
  }

  const product = await findById(productId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  if (product.isDeleted) {
    throw new ApiError('Product has been deleted', 404);
  }

  const previousQuantity = product.stock;
  const newQuantity = previousQuantity - quantity;

  if (newQuantity < 0) {
    throw new ApiError(
      `Cannot remove ${quantity} units. Current stock is ${previousQuantity}.`,
      400
    );
  }

  const changeAmount = computeChange(previousQuantity, newQuantity);

  const updatedProduct = await updateProductStock(productId, newQuantity);
  await createStockHistory({
    product: productId,
    previousQuantity,
    newQuantity,
    changeAmount,
    actionType: 'remove',
    reason: reason || 'Stock removed by admin',
    performedBy: userId,
  });

  return {
    product: updatedProduct,
    history: {
      previousQuantity,
      newQuantity,
      changeAmount,
      actionType: 'remove',
    },
  };
};

const updateStock = async (productId, newStock, reason, userId) => {
  if (newStock < 0) {
    throw new ApiError('Stock cannot be negative', 400);
  }

  const product = await findById(productId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  if (product.isDeleted) {
    throw new ApiError('Product has been deleted', 404);
  }

  const previousQuantity = product.stock;
  const changeAmount = computeChange(previousQuantity, newStock);

  const updatedProduct = await updateProductStock(productId, newStock);
  await createStockHistory({
    product: productId,
    previousQuantity,
    newQuantity: newStock,
    changeAmount,
    actionType: 'update',
    reason: reason || 'Stock updated by admin',
    performedBy: userId,
  });

  return {
    product: updatedProduct,
    history: {
      previousQuantity,
      newQuantity: newStock,
      changeAmount,
      actionType: 'update',
    },
  };
};

const getStockHistory = async (productId, { page = 1, limit = 20 } = {}) => {
  const product = await findById(productId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  const [history, total] = await Promise.all([
    findHistoryByProduct(productId, { page, limit }),
    countHistoryByProduct(productId),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    history,
    productInfo: {
      id: product._id,
      title: product.title,
      currentStock: product.stock,
      minimumStock: product.minimumStock,
    },
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

const getLowStockProducts = async (query = {}) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    findLowStockProducts({ ...query, page, limit }),
    countLowStockProducts(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

export {
  addStock,
  removeStock,
  updateStock,
  getStockHistory,
  getLowStockProducts,
};
