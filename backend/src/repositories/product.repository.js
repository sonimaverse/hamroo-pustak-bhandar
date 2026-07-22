import Product from '../models/product.model.js';
import { Pagination } from '../../utils/constants.js';

const buildFilter = (query) => {
  const filter = { isDeleted: false };

  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.featured !== undefined) filter.featured = query.featured === 'true';
  if (query.inStock === 'true') filter.stock = { $gt: 0 };

  if (query.minPrice || query.maxPrice) {
    filter.retailPrice = {};
    if (query.minPrice) filter.retailPrice.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.retailPrice.$lte = parseFloat(query.maxPrice);
  }

  if (query.search) {
    filter.$text = { $search: query.search };
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
  const page = parseInt(query.page) || Pagination.DEFAULT_PAGE;
  const limit = Math.min(parseInt(query.limit) || Pagination.DEFAULT_LIMIT, Pagination.MAX_LIMIT);
  const skip = (page - 1) * limit;
  const sort = {};

  if (query.sort === 'price_asc') sort.retailPrice = 1;
  else if (query.sort === 'price_desc') sort.retailPrice = -1;
  else if (query.sort === 'newest') sort.createdAt = -1;
  else if (query.sort === 'featured') sort.featured = -1;

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

const softDelete = (id) => {
  return Product.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
};

const updateStock = (id, stock) => {
  return Product.findByIdAndUpdate(id, { stock }, { new: true });
};

const updatePricing = (id, retailPrice, wholesalePrice) => {
  return Product.findByIdAndUpdate(id, { retailPrice, wholesalePrice }, { new: true });
};

const removeImage = (id, imageIndex) => {
  const update = { $unset: {} };
  update.$unset[`images.${imageIndex}`] = 1;
  return Product.findByIdAndUpdate(id, update, { new: true });
};

export {
  createProduct,
  findById,
  findMany,
  countDocuments,
  findByIdAndUpdate,
  softDelete,
  updateStock,
  updatePricing,
  removeImage,
};
