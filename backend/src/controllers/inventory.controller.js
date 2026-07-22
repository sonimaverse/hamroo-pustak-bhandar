import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/apiError.js';
import ApiResponse from '../../utils/apiResponse.js';
import {
  addStock,
  removeStock,
  updateStock,
  getStockHistory,
  getLowStockProducts,
} from '../services/inventory.service.js';

const add = asyncHandler(async (req, res) => {
  const result = await addStock(
    req.params.productId,
    parseInt(req.body.quantity),
    req.body.reason,
    req.user._id
  );

  ApiResponse(res, 200, 'Stock added successfully', result);
});

const remove = asyncHandler(async (req, res) => {
  const result = await removeStock(
    req.params.productId,
    parseInt(req.body.quantity),
    req.body.reason,
    req.user._id
  );

  ApiResponse(res, 200, 'Stock removed successfully', result);
});

const set = asyncHandler(async (req, res) => {
  const result = await updateStock(
    req.params.productId,
    parseInt(req.body.stock),
    req.body.reason,
    req.user._id
  );

  ApiResponse(res, 200, 'Stock updated successfully', result);
});

const history = asyncHandler(async (req, res) => {
  const result = await getStockHistory(req.params.productId, {
    page: req.query.page,
    limit: req.query.limit,
  });

  ApiResponse(res, 200, 'Stock history fetched successfully', result);
});

const lowStock = asyncHandler(async (req, res) => {
  const result = await getLowStockProducts({
    page: req.query.page,
    limit: req.query.limit,
    category: req.query.category,
    status: req.query.status,
  });

  ApiResponse(res, 200, 'Low stock products fetched successfully', result);
});

export {
  add,
  remove,
  set,
  history,
  lowStock,
};
