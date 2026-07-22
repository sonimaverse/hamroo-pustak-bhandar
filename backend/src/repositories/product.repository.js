import Product from '../models/product.model.js';
import { PAGINATION } from '../utils/constants.js';

const buildFilter = (query) => {
  const filter = {};

  if (query.category) filter.category = query.category;
  if (query.search) filter.$text = { $search: query.search };
  if (query.inStock === 'true') filter.stockQuantity = { $gt: 0 };

  if (query.minPrice || query.maxPrice) {
    filter.retailPrice = {};
    if (query.minPrice) filter.retailPrice.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.retailPrice.$lte = parseFloat(query.maxPrice);
  }

  return filter;
};

const createProduct = (data) => {
  return Product.create(data);
};

const findById = (id) => {
  return Product.findById(id).lean();
};

const findMany = (query) => {
  const page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
  const skip = (page - 1) * limit;
  const sort = {};

  if (query.sort === 'price_asc') sort.retailPrice = 1;
  else if (query.sort === 'price_desc') sort.retailPrice = -1;
  else if (query.sort === 'newest') sort.createdAt = -1;

  if (query.search) sort.score = { $meta: 'textScore' };

  const filter = buildFilter(query);

  return Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
};

const countDocuments = (query) => {
  return Product.countDocuments(buildFilter(query));
};

const findByIdAndUpdate = (id, updateData, options = {}) => {
  return Product.findByIdAndUpdate(id, updateData, { new: true, ...options });
};

const deleteProduct = (id) => {
  return Product.findByIdAndDelete(id);
};

const updateStock = (id, stock) => {
  return Product.findByIdAndUpdate(id, { stockQuantity: stock }, { new: true });
};

const updatePricing = (id, retailPrice, wholesalePrice) => {
  return Product.findByIdAndUpdate(id, { retailPrice, wholesalePrice }, { new: true });
};

export {
  createProduct,
  findById,
  findMany,
  countDocuments,
  findByIdAndUpdate,
  deleteProduct,
  updateStock,
  updatePricing,
};
