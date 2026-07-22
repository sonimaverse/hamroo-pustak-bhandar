import { ApiError } from '../utils/apiError.js';
import {
  createProduct,
  findById,
  findMany,
  countDocuments,
  findByIdAndUpdate,
  deleteProduct,
  updateStock,
  updatePricing,
} from '../repositories/product.repository.js';
import { USER_ROLES } from '../utils/constants.js';

const create = async (productData) => {
  return createProduct(productData);
};

const update = async (id, updateData) => {
  const product = await findById(id);
  if (!product) throw new ApiError('Product not found', 404);

  return findByIdAndUpdate(id, updateData);
};

const removeProduct = async (id) => {
  const product = await deleteProduct(id);
  if (!product) throw new ApiError('Product not found', 404);
  return product;
};

const transformProductView = (product, userRole) => {
  const baseFields = {
    _id: product._id,
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.image,
    retailPrice: product.retailPrice,
    stockQuantity: product.stockQuantity,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  if (userRole === USER_ROLES.WHOLESALE_APPROVED || userRole === USER_ROLES.ADMIN) {
    return { ...baseFields, wholesalePrice: product.wholesalePrice };
  }

  return baseFields;
};

const getProductById = async (id, userRole) => {
  const product = await findById(id);
  if (!product) throw new ApiError('Product not found', 404);
  return transformProductView(product, userRole);
};

const getAllProducts = async (query, userRole) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 12, 50);

  const [products, total] = await Promise.all([
    findMany({ ...query, page, limit }),
    countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  const transformedProducts = products.map((product) =>
    transformProductView(product, userRole)
  );

  return {
    products: transformedProducts,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

const changeStock = async (id, stock) => {
  if (stock < 0) throw new ApiError('Stock cannot be negative', 400);
  return updateStock(id, stock);
};

const changePricing = async (id, retailPrice, wholesalePrice) => {
  if (wholesalePrice > retailPrice) {
    throw new ApiError('Wholesale price cannot exceed retail price', 400);
  }
  return updatePricing(id, retailPrice, wholesalePrice);
};

export {
  create,
  update,
  removeProduct,
  getProductById,
  getAllProducts,
  changeStock,
  changePricing,
};
