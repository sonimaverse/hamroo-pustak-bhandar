import { ApiError } from '../../utils/apiError.js';
import {
  findPendingApplications,
  findById,
  updateWholesaleApplication,
  approveUser,
  rejectUser,
} from '../repositories/wholesale.repository.js';

const applyForWholesale = async (userId, applicationData) => {
  const user = await findById(userId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (user.role === 'wholesale_approved') {
    throw new ApiError('Your wholesale account is already approved', 400);
  }

  if (user.status === 'pending') {
    throw new ApiError('Your application is already pending review', 400);
  }

  const updatedUser = await updateWholesaleApplication(userId, {
    businessName: applicationData.businessName,
    panVatNumber: applicationData.panVatNumber,
    address: applicationData.address,
    phone: applicationData.phone,
    documents: applicationData.documents,
    role: 'wholesale_pending',
    status: 'pending',
  });

  return updatedUser;
};

const getMyApplication = async (userId) => {
  const user = await findById(userId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (user.role !== 'wholesale_pending' && user.role !== 'wholesale_approved') {
    throw new ApiError('You have not applied for wholesale access', 403);
  }

  return user;
};

const getAllPendingApplications = async () => {
  return await findPendingApplications();
};

const getApplicationDetails = async (userId, targetUserId) => {
  const application = await findById(targetUserId);
  if (!application) {
    throw new ApiError('Application not found', 404);
  }

  if (application.role !== 'wholesale_pending') {
    throw new ApiError('This user has not submitted a wholesale application', 400);
  }

  return application;
};

const approveApplication = async (adminId, targetUserId) => {
  const user = await findById(targetUserId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (user.role === 'wholesale_approved') {
    throw new ApiError('User is already approved', 400);
  }

  if (user.role !== 'wholesale_pending') {
    throw new ApiError('User does not have a pending application', 400);
  }

  const approvedUser = await approveUser(targetUserId, adminId);

  return approvedUser;
};

const rejectApplication = async (adminId, targetUserId, reason) => {
  if (!reason || reason.trim().length === 0) {
    throw new ApiError('Rejection reason is required', 400);
  }

  const user = await findById(targetUserId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  if (user.role !== 'wholesale_pending') {
    throw new ApiError('User does not have a pending application', 400);
  }

  const rejectedUser = await rejectUser(targetUserId, reason, adminId);

  return rejectedUser;
};

export {
  applyForWholesale,
  getMyApplication,
  getAllPendingApplications,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
};
