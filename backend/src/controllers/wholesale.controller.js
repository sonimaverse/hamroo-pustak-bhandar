import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/apiError.js';
import ApiResponse from '../../utils/apiResponse.js';
import {
  applyForWholesale,
  getMyApplication,
  getAllPendingApplications,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
} from '../services/wholesale.service.js';

const applyWholesale = asyncHandler(async (req, res) => {
  const application = await applyForWholesale(req.user._id, req.body);

  ApiResponse(res, 200, 'Wholesale application submitted successfully', { application });
});

const getMyWholesaleApplication = asyncHandler(async (req, res) => {
  const application = await getMyApplication(req.user._id);

  ApiResponse(res, 200, 'Application fetched successfully', { application });
});

const getPendingApplications = asyncHandler(async (req, res) => {
  const applications = await getAllPendingApplications();

  ApiResponse(res, 200, 'Pending applications fetched successfully', { applications });
});

const getApplicationById = asyncHandler(async (req, res) => {
  const application = await getApplicationDetails(req.user._id, req.params.id);

  ApiResponse(res, 200, 'Application fetched successfully', { application });
});

const approveWholesaleApplication = asyncHandler(async (req, res) => {
  const application = await approveApplication(req.user._id, req.params.id);

  ApiResponse(res, 200, 'Wholesale application approved successfully', { application });
});

const rejectWholesaleApplication = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const application = await rejectApplication(req.user._id, req.params.id, reason);

  ApiResponse(res, 200, 'Wholesale application rejected', { application });
});

export {
  applyWholesale,
  getMyWholesaleApplication,
  getPendingApplications,
  getApplicationById,
  approveWholesaleApplication,
  rejectWholesaleApplication,
};
