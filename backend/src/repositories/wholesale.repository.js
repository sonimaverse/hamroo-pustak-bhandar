import User from '../models/user.model.js';

/**
 * Find pending wholesale applications with pagination.
 * Excludes password and refreshToken.
 */
const findPendingApplications = async ({ skip = 0, limit = 10 }) => {
  return await User.find({
    role: 'wholesale_pending',
    status: 'pending',
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-password -refreshToken');
};

/**
 * Count total pending applications.
 */
const countPendingApplications = async () => {
  return await User.countDocuments({
    role: 'wholesale_pending',
    status: 'pending',
  });
};

/**
 * Find approved wholesale users with pagination.
 * Excludes password and refreshToken.
 */
const findApprovedApplications = async ({ skip = 0, limit = 10 }) => {
  return await User.find({
    role: 'wholesale_approved',
    status: 'approved',
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-password -refreshToken');
};

/**
 * Count total approved applications.
 */
const countApprovedApplications = async () => {
  return await User.countDocuments({
    role: 'wholesale_approved',
    status: 'approved',
  });
};

/**
 * Find rejected wholesale applications with pagination.
 * Excludes password and refreshToken.
 */
const findRejectedApplications = async ({ skip = 0, limit = 10 }) => {
  return await User.find({
    status: 'rejected',
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-password -refreshToken');
};

/**
 * Count total rejected applications.
 */
const countRejectedApplications = async () => {
  return await User.countDocuments({
    status: 'rejected',
  });
};

/**
 * Find application/user by ID.
 * Excludes password and refreshToken.
 */
const findById = async (id) => {
  return await User.findById(id).select('-password -refreshToken');
};

/**
 * Update wholesale application fields for a user.
 * Excludes password and refreshToken.
 */
const updateWholesaleApplication = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password -refreshToken');
};

/**
 * Approve wholesale application.
 * Changes role to wholesale_approved, status to approved, and unsets rejectionReason.
 * Excludes password and refreshToken.
 */
const approveUser = async (userId, adminId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        role: 'wholesale_approved',
        status: 'approved',
        updatedBy: adminId,
      },
      $unset: { rejectionReason: 1 },
    },
    { new: true }
  ).select('-password -refreshToken');
};

/**
 * Reject wholesale application.
 * Changes role to guest, status to rejected, and sets rejectionReason.
 * Excludes password and refreshToken.
 */
const rejectUser = async (userId, reason, adminId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        role: 'guest',
        status: 'rejected',
        rejectionReason: reason,
        updatedBy: adminId,
      },
    },
    { new: true }
  ).select('-password -refreshToken');
};

export {
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
};
