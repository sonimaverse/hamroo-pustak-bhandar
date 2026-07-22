import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/apiError.js';
import ApiResponse from '../../utils/apiResponse.js';
import {
  create,
  update,
  deleteProduct,
  getProductById,
  getAllProducts,
  changeStock,
  changePricing,
  addImages,
  deleteImage,
} from '../services/product.service.js';

const createProduct = asyncHandler(async (req, res) => {
  const productData = {
    title: req.body.title,
    slug: req.body.slug,
    isbn: req.body.isbn,
    author: req.body.author,
    publisher: req.body.publisher,
    category: req.body.category,
    description: req.body.description,
    retailPrice: req.body.retailPrice,
    wholesalePrice: req.body.wholesalePrice,
    stock: req.body.stock,
    minimumStock: req.body.minimumStock,
    featured: req.body.featured === 'true',
    status: req.body.status,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  };

  const product = await create(productData, req.files);
  
  ApiResponse(res, 201, 'Product created successfully', { product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const productData = {
    title: req.body.title,
    slug: req.body.slug,
    isbn: req.body.isbn,
    author: req.body.author,
    publisher: req.body.publisher,
    category: req.body.category,
    description: req.body.description,
    retailPrice: req.body.retailPrice,
    wholesalePrice: req.body.wholesalePrice,
    stock: req.body.stock,
    minimumStock: req.body.minimumStock,
    featured: req.body.featured === 'true',
    status: req.body.status,
    updatedBy: req.user._id,
  };

  const product = await update(req.params.id, productData, req.files);
  
  ApiResponse(res, 200, 'Product updated successfully', { product });
});

const removeProduct = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  ApiResponse(res, 200, 'Product deleted successfully');
});

const updateStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;
  const product = await changeStock(req.params.id, stock, req.user._id);
  ApiResponse(res, 200, 'Stock updated successfully', { product });
});

const updatePricing = asyncHandler(async (req, res) => {
  const { retailPrice, wholesalePrice } = req.body;
  const product = await changePricing(req.params.id, retailPrice, wholesalePrice, req.user._id);
  ApiResponse(res, 200, 'Pricing updated successfully', { product });
});

const getAll = asyncHandler(async (req, res) => {
  const filters = {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    category: req.query.category,
    status: req.query.status,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    search: req.query.search,
    inStock: req.query.inStock,
    lowStock: req.query.lowStock,
  };

  const userRole = req.user?.role || 'guest';
  const result = await getAllProducts(filters, userRole);
  
  ApiResponse(res, 200, 'Products fetched successfully', result);
});

const getOne = asyncHandler(async (req, res) => {
  const userRole = req.user?.role || 'guest';
  const product = await getProductById(req.params.id, userRole);
  ApiResponse(res, 200, 'Product fetched successfully', { product });
});

const addImagesToProduct = asyncHandler(async (req, res) => {
  const product = await addImages(req.params.id, req.files, req.user._id);
  ApiResponse(res, 200, 'Images added successfully', { product });
});

const removeProductImage = asyncHandler(async (req, res) => {
  const product = await deleteImage(req.params.id, req.query.imageUrl, req.user._id);
  ApiResponse(res, 200, 'Image removed successfully', { product });
});

export {
  createProduct,
  updateProduct,
  removeProduct,
  updateStock,
  updatePricing,
  getAll,
  getOne,
  addImagesToProduct,
  removeProductImage,
};
