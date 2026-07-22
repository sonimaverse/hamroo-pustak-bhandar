import { ApiError } from '../utils/apiError.js';
import { USER_ROLES, WHOLESALE_STATUS } from '../utils/constants.js';
import {
  findPendingApplications,
  countPendingApplications,
  findApprovedApplications,
  countApprovedApplications,
  findRejectedApplications,
  countRejectedApplications,
  findById,
  updateWholesaleApplication,
  approveUser,
  rejectUser,
} from '../repositories/wholesale.repository.js';

/**
 * Submit wholesale application (initial apply).
 * Enforces business rules:
 * 1. User cannot apply if already approved.
 * 2. User cannot apply if an application is already pending.
 */
const applyForWholesale = async (userId, applicationData) => {
  const user = await findById(userId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Approved users cannot apply again
  if (user.role === USER_ROLES.WHOLESALE_APPROVED || user.status === WHOLESALE_STATUS.APPROVED) {
    throw new ApiError('Your wholesale application is already approved', 400);
  }

  // Cannot submit if already pending
  if (user.role === USER_ROLES.WHOLESALE_PENDING && user.status === WHOLESALE_STATUS.PENDING) {
    throw new ApiError('Your wholesale application is already pending review', 400);
  }

  // Update only wholesale fields and set state to pending
  const updateData = {
    businessName: applicationData.businessName,
    panVatNumber: applicationData.panVatNumber,
    address: applicationData.address,
    phone: applicationData.phone,
    documents: applicationData.documents,
    role: USER_ROLES.WHOLESALE_PENDING,
    status: WHOLESALE_STATUS.PENDING,
    rejectionReason: '', // Clear any previous rejection reason
  };

  return await updateWholesaleApplication(userId, updateData);
};

/**
 * Update and/or resubmit a wholesale application.
 * Enforces business rules:
 * 1. User cannot update if already approved.
 * 2. Cannot update if user has not applied yet.
 * 3. When a rejected user updates and resubmits, state resets to pending and rejectionReason is cleared.
 */
const updateMyApplication = async (userId, applicationData) => {
  const user = await findById(userId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Approved users cannot update or apply again
  if (user.role === USER_ROLES.WHOLESALE_APPROVED || user.status === WHOLESALE_STATUS.APPROVED) {
    throw new ApiError('Your wholesale account is already approved', 400);
  }

  // Must have an application to update (either pending or rejected)
  const isPending = user.role === USER_ROLES.WHOLESALE_PENDING && user.status === WHOLESALE_STATUS.PENDING;
  const isRejected = user.status === WHOLESALE_STATUS.REJECTED;

  if (!isPending && !isRejected) {
    throw new ApiError('You have not applied for wholesale access yet. Please submit an application first.', 400);
  }

  // Construct update payload preserving unrelated fields
  const updateData = {
    businessName: applicationData.businessName,
    panVatNumber: applicationData.panVatNumber,
    address: applicationData.address,
    phone: applicationData.phone,
    documents: applicationData.documents,
  };

  // If rejected user resubmits, reset role/status and clear rejectionReason
  if (isRejected) {
    updateData.role = USER_ROLES.WHOLESALE_PENDING;
    updateData.status = WHOLESALE_STATUS.PENDING;
    updateData.rejectionReason = '';
  }

  return await updateWholesaleApplication(userId, updateData);
};

/**
 * Fetch the logged-in user's own application.
 */
const getMyApplication = async (userId) => {
  const user = await findById(userId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // If the user is a guest and has not been rejected, they haven't applied
  if (user.role === USER_ROLES.GUEST && user.status !== WHOLESALE_STATUS.REJECTED) {
    throw new ApiError('No wholesale application found for this user', 404);
  }

  return user;
};

/**
 * Fetch pending applications with pagination.
 */
const getAllPendingApplications = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [applications, total] = await Promise.all([
    findPendingApplications({ skip, limit }),
    countPendingApplications(),
  ]);

  return {
    applications,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

/**
 * Fetch approved applications with pagination.
 */
const getAllApprovedApplications = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [applications, total] = await Promise.all([
    findApprovedApplications({ skip, limit }),
    countApprovedApplications(),
  ]);

  return {
    applications,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

/**
 * Fetch rejected applications with pagination.
 */
const getAllRejectedApplications = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [applications, total] = await Promise.all([
    findRejectedApplications({ skip, limit }),
    countRejectedApplications(),
  ]);

  return {
    applications,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

/**
 * Fetch details of a specific application.
 * Enforces ownership access rules.
 */
const getApplicationDetails = async (requesterId, targetUserId, isAdmin) => {
  if (!isAdmin && requesterId.toString() !== targetUserId.toString()) {
    throw new ApiError('You are not authorized to view this application', 403);
  }

  const application = await findById(targetUserId);
  if (!application) {
    throw new ApiError('Wholesale application not found', 404);
  }

  // If requesting user is not admin and is self but has not applied
  if (!isAdmin && application.role === USER_ROLES.GUEST && application.status !== WHOLESALE_STATUS.REJECTED) {
    throw new ApiError('No wholesale application found', 404);
  }

  return application;
};

/**
 * Approve wholesale application.
 * Enforces:
 * 1. Only users with status = pending can be approved.
 */
const approveApplication = async (adminId, targetUserId) => {
  const user = await findById(targetUserId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (user.status !== WHOLESALE_STATUS.PENDING) {
    throw new ApiError('Only users with pending status can be approved', 400);
  }

  return await approveUser(targetUserId, adminId);
};

/**
 * Reject wholesale application.
 * Enforces:
 * 1. Only users with status = pending can be rejected.
 * 2. Rejection reason is required.
 */
const rejectApplication = async (adminId, targetUserId, reason) => {
  if (!reason || reason.trim().length === 0) {
    throw new ApiError('Rejection reason is required', 400);
  }

  const user = await findById(targetUserId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (user.status !== WHOLESALE_STATUS.PENDING) {
    throw new ApiError('Only users with pending status can be rejected', 400);
  }

  return await rejectUser(targetUserId, reason, adminId);
};

export {
  applyForWholesale,
  updateMyApplication,
  getMyApplication,
  getAllPendingApplications,
  getAllApprovedApplications,
  getAllRejectedApplications,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
};
