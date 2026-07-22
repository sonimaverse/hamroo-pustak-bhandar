import User from '../models/user.model.js';
import { ApiError } from '../../utils/apiError.js';

const findPendingApplications = () => {
  return User.find({
    role: 'wholesale_pending',
    status: 'pending',
    isDeleted: false,
  }).select('-password -refreshToken');
};

const findById = (id) => {
  return User.findById(id).select('-password -refreshToken');
};

const findByEmail = (email) => {
  return User.findOne({ email }).select('+password');
};

const updateWholesaleApplication = (userId, updateData) => {
  return User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -refreshToken');
};

const approveUser = (userId, updatedBy) => {
  return User.findByIdAndUpdate(
    userId,
    {
      role: 'wholesale_approved',
      status: 'approved',
      updatedBy,
      $unset: { rejectionReason: 1 },
    },
    { new: true }
  ).select('-password -refreshToken');
};

const rejectUser = (userId, reason, updatedBy) => {
  return User.findByIdAndUpdate(
    userId,
    {
      status: 'rejected',
      rejectionReason: reason,
      updatedBy,
    },
    { new: true }
  ).select('-password -refreshToken');
};

export {
  findPendingApplications,
  findById,
  findByEmail,
  updateWholesaleApplication,
  approveUser,
  rejectUser,
};
