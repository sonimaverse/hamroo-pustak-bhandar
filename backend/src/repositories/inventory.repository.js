import Product from '../models/product.model.js';
import Inventory from '../models/inventory.model.js';

const findById = (id) => {
  return Product.findById(id).select('stock minimumStock title isDeleted').lean();
};

const findLowStockProducts = (query = {}) => {
  const filter = {
    isDeleted: false,
  };

  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;

  filter.$expr = { $lte: ['$stock', '$minimumStock'] };

  return Product.find(filter)
    .sort({ stock: 1 })
    .skip((parseInt(query.page || 1) - 1) * parseInt(query.limit || 10))
    .limit(Math.min(parseInt(query.limit || 10), 50))
    .lean();
};

const countLowStockProducts = (query = {}) => {
  const filter = {
    isDeleted: false,
  };

  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;

  filter.$expr = { $lte: ['$stock', '$minimumStock'] };

  return Product.countDocuments(filter);
};

const updateProductStock = (productId, newStock) => {
  return Product.findByIdAndUpdate(productId, { stock: newStock }, { new: true }).lean();
};

const createStockHistory = (data) => {
  return Inventory.create(data);
};

const findHistoryByProduct = (productId, { page = 1, limit = 20 } = {}) => {
  return Inventory.find({ product: productId })
    .populate('performedBy', 'fullName email role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Math.min(limit, 50))
    .lean();
};

const countHistoryByProduct = (productId) => {
  return Inventory.countDocuments({ product: productId });
};

export {
  findById,
  findLowStockProducts,
  countLowStockProducts,
  updateProductStock,
  createStockHistory,
  findHistoryByProduct,
  countHistoryByProduct,
};
