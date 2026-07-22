import { asyncHandler } from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import {
  applyForWholesale,
  updateMyApplication,
  getMyApplication,
  getAllPendingApplications,
  getAllApprovedApplications,
  getAllRejectedApplications,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
} from '../services/wholesale.service.js';

/**
 * Submit wholesale application.
 * POST /api/v1/wholesale/apply
 */
const applyWholesale = asyncHandler(async (req, res) => {
  const application = await applyForWholesale(req.user._id, req.body);
  ApiResponse(res, 201, 'Wholesale application submitted successfully', { application });
});

/**
 * Get logged-in user's wholesale application.
 * GET /api/v1/wholesale/my-application
 */
const getMyWholesaleApplication = asyncHandler(async (req, res) => {
  const application = await getMyApplication(req.user._id);
  ApiResponse(res, 200, 'Application details fetched successfully', { application });
});

/**
 * Update logged-in user's wholesale application.
 * PUT /api/v1/wholesale/my-application
 */
const updateMyWholesaleApplication = asyncHandler(async (req, res) => {
  const application = await updateMyApplication(req.user._id, req.body);
  ApiResponse(res, 200, 'Wholesale application updated successfully', { application });
});

/**
 * List pending wholesale applications.
 * GET /api/v1/wholesale/pending
 */
const getPendingApplications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await getAllPendingApplications(page, limit);
  ApiResponse(res, 200, 'Pending wholesale applications fetched successfully', result);
});

/**
 * List approved wholesale users.
 * GET /api/v1/wholesale/approved
 */
const getApprovedApplications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await getAllApprovedApplications(page, limit);
  ApiResponse(res, 200, 'Approved wholesale users fetched successfully', result);
});

/**
 * List rejected wholesale applications.
 * GET /api/v1/wholesale/rejected
 */
const getRejectedApplications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await getAllRejectedApplications(page, limit);
  ApiResponse(res, 200, 'Rejected wholesale applications fetched successfully', result);
});

/**
 * Get wholesale application by User ID.
 * GET /api/v1/wholesale/:id
 */
const getApplicationById = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const requesterId = req.user._id;
  const isAdmin = req.user.role === 'admin';

  const application = await getApplicationDetails(requesterId, targetUserId, isAdmin);
  ApiResponse(res, 200, 'Application details fetched successfully', { application });
});

/**
 * Approve wholesale application.
 * PATCH /api/v1/wholesale/:id/approve
 */
const approveWholesaleApplication = asyncHandler(async (req, res) => {
  const application = await approveApplication(req.user._id, req.params.id);
  ApiResponse(res, 200, 'Wholesale application approved successfully', { application });
});

/**
 * Reject wholesale application.
 * PATCH /api/v1/wholesale/:id/reject
 */
const rejectWholesaleApplication = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const application = await rejectApplication(req.user._id, req.params.id, reason);
  ApiResponse(res, 200, 'Wholesale application rejected successfully', { application });
});

export {
  applyWholesale,
  getMyWholesaleApplication,
  updateMyWholesaleApplication,
  getPendingApplications,
  getApprovedApplications,
  getRejectedApplications,
  getApplicationById,
  approveWholesaleApplication,
  rejectWholesaleApplication,
};
