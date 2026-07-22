import { asyncHandler } from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';

import {
  create,
  update,
  removeProduct as deleteProduct,
  getProductById,
  getAllProducts,
  changeStock,
  changePricing,
} from '../services/product.service.js';


const createProduct = asyncHandler(async (req, res) => {
  const productData = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    retailPrice: req.body.retailPrice,
    wholesalePrice: req.body.wholesalePrice,
    stockQuantity: req.body.stockQuantity,
    createdBy: req.user._id,
  };

  const product = await create(productData);

  ApiResponse(
    res,
    201,
    'Product created successfully',
    { product }
  );
});


const updateProduct = asyncHandler(async (req, res) => {
  const productData = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
    retailPrice: req.body.retailPrice,
    wholesalePrice: req.body.wholesalePrice,
    stockQuantity: req.body.stockQuantity,
  };

  const product = await update(req.params.id, productData);

  ApiResponse(
    res,
    200,
    'Product updated successfully',
    { product }
  );
});


const removeProduct = asyncHandler(async (req, res) => {
  const product = await deleteProduct(req.params.id);

  ApiResponse(
    res,
    200,
    'Product deleted successfully',
    { product }
  );
});


const updateStock = asyncHandler(async (req, res) => {
  const { stockQuantity } = req.body;

  const product = await changeStock(
    req.params.id,
    stockQuantity
  );

  ApiResponse(
    res,
    200,
    'Stock updated successfully',
    { product }
  );
});


const updatePricing = asyncHandler(async (req, res) => {
  const {
    retailPrice,
    wholesalePrice
  } = req.body;

  const product = await changePricing(
    req.params.id,
    retailPrice,
    wholesalePrice
  );

  ApiResponse(
    res,
    200,
    'Pricing updated successfully',
    { product }
  );
});


const getAll = asyncHandler(async (req, res) => {

  const filters = {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
    category: req.query.category,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    search: req.query.search,
    inStock: req.query.inStock,
  };


  const userRole = req.user?.role || 'guest';

  const result = await getAllProducts(
    filters,
    userRole
  );


  ApiResponse(
    res,
    200,
    'Products fetched successfully',
    result
  );

});


const getOne = asyncHandler(async (req, res) => {

  const userRole = req.user?.role || 'guest';

  const product = await getProductById(
    req.params.id,
    userRole
  );


  ApiResponse(
    res,
    200,
    'Product fetched successfully',
    { product }
  );

});


export {
  createProduct,
  updateProduct,
  removeProduct,
  updateStock,
  updatePricing,
  getAll,
  getOne,
};