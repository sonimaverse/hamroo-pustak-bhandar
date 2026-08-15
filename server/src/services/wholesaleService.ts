import { WholesaleProfile } from '../models/WholesaleProfile.js';
import { User } from '../models/User.js';
import { ApplyWholesaleInput } from '../validators/wholesaleValidator.js';
import { ApiError } from '../utils/apiError.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';

export class WholesaleService {
  /**
   * Submit a wholesale application for the authenticated customer
   */
  static async applyForWholesale(
    userId: string,
    input: ApplyWholesaleInput,
    documentUrl: string
  ) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }

      if (user.role === 'wholesale' && user.wholesaleStatus === 'approved') {
        throw new ApiError(400, 'Your account is already an approved wholesale partner.');
      }

      if (user.wholesaleStatus === 'pending') {
        throw new ApiError(400, 'You already have an active wholesale application pending review.');
      }

      // Check existing profile record
      const existingProfile = await WholesaleProfile.findOne({ userId });
      if (existingProfile && existingProfile.status === 'pending') {
        throw new ApiError(400, 'An application is already pending review for this user.');
      }

      const businessAddress = {
        street: input.street,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode || '',
        country: input.country || 'Nepal',
      };

      let profile;
      if (existingProfile) {
        // Re-applying after rejection
        existingProfile.companyName = input.companyName;
        existingProfile.panVatNumber = input.panVatNumber;
        existingProfile.businessType = input.businessType;
        existingProfile.contactPerson = input.contactPerson;
        existingProfile.businessPhone = input.businessPhone;
        existingProfile.businessAddress = businessAddress;
        if (documentUrl) existingProfile.documentUrl = documentUrl;
        existingProfile.status = 'pending';
        existingProfile.rejectionReason = '';
        existingProfile.appliedAt = new Date();
        profile = await existingProfile.save();
      } else {
        profile = new WholesaleProfile({
          userId,
          companyName: input.companyName,
          panVatNumber: input.panVatNumber,
          businessType: input.businessType,
          contactPerson: input.contactPerson,
          businessPhone: input.businessPhone,
          businessAddress,
          documentUrl,
          status: 'pending',
          appliedAt: new Date(),
        });
        await profile.save();
      }

      // Update user wholesale status
      user.wholesaleStatus = 'pending';
      await user.save();

      return profile;
    } else {
      // Fallback Store
      const user = fallbackStore.findUserById(userId);
      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }

      if (user.role === 'wholesale' && user.wholesaleStatus === 'approved') {
        throw new ApiError(400, 'Your account is already an approved wholesale partner.');
      }

      if (user.wholesaleStatus === 'pending') {
        throw new ApiError(400, 'You already have an active wholesale application pending review.');
      }

      return fallbackStore.createWholesaleProfile({
        userId,
        companyName: input.companyName,
        panVatNumber: input.panVatNumber,
        businessType: input.businessType,
        contactPerson: input.contactPerson,
        businessPhone: input.businessPhone,
        businessAddress: {
          street: input.street,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          country: input.country,
        },
        documentUrl,
      });
    }
  }

  /**
   * Get application status for the current authenticated user
   */
  static async getWholesaleStatus(userId: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const profile = await WholesaleProfile.findOne({ userId }).populate('userId', 'name email phone wholesaleStatus role');
      const user = await User.findById(userId);
      const currentStatus = profile?.status || user?.wholesaleStatus || 'none';

      return {
        status: currentStatus,
        wholesaleStatus: currentStatus,
        role: user?.role || 'customer',
        application: profile || null,
      };
    } else {
      const profile = fallbackStore.getWholesaleProfileByUserId(userId);
      const user = fallbackStore.findUserById(userId);
      const currentStatus = profile?.status || user?.wholesaleStatus || 'none';

      return {
        status: currentStatus,
        wholesaleStatus: currentStatus,
        role: user?.role || 'customer',
        application: profile || null,
      };
    }
  }

  /**
   * Admin: Get all applications (optional filter by status)
   */
  static async getAllApplications(statusFilter?: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const query: any = {};
      if (statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)) {
        query.status = statusFilter;
      }

      return await WholesaleProfile.find(query)
        .populate('userId', 'name email phone role wholesaleStatus')
        .sort({ appliedAt: -1 });
    } else {
      return fallbackStore.getAllWholesaleProfiles(statusFilter);
    }
  }

  /**
   * Admin: Get application by ID
   */
  static async getApplicationById(id: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const profile = await WholesaleProfile.findById(id).populate('userId', 'name email phone role wholesaleStatus');
      if (!profile) {
        throw new ApiError(404, 'Wholesale application record not found.');
      }
      return profile;
    } else {
      const profile = fallbackStore.getWholesaleProfileById(id);
      if (!profile) {
        throw new ApiError(404, 'Wholesale application record not found.');
      }
      return profile;
    }
  }

  /**
   * Admin: Approve Wholesale Application
   */
  static async approveApplication(id: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const profile = await WholesaleProfile.findById(id);
      if (!profile) {
        throw new ApiError(404, 'Wholesale application record not found.');
      }

      if (profile.status === 'approved') {
        throw new ApiError(400, 'This application has already been approved.');
      }

      const user = await User.findById(profile.userId);
      if (!user) {
        throw new ApiError(404, 'Associated user account not found.');
      }

      // Update Profile
      profile.status = 'approved';
      profile.rejectionReason = '';
      profile.reviewedAt = new Date();
      await profile.save();

      // Update User Role & Wholesale Status
      user.role = 'wholesale';
      user.wholesaleStatus = 'approved';
      await user.save();

      return profile;
    } else {
      const approved = fallbackStore.approveWholesaleProfile(id);
      if (!approved) {
        throw new ApiError(404, 'Wholesale application record not found.');
      }
      return approved;
    }
  }

  /**
   * Admin: Reject Wholesale Application
   */
  static async rejectApplication(id: string, rejectionReason: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const profile = await WholesaleProfile.findById(id);
      if (!profile) {
        throw new ApiError(404, 'Wholesale application record not found.');
      }

      const user = await User.findById(profile.userId);
      if (!user) {
        throw new ApiError(404, 'Associated user account not found.');
      }

      // Update Profile
      profile.status = 'rejected';
      profile.rejectionReason = rejectionReason;
      profile.reviewedAt = new Date();
      await profile.save();

      // Update User Wholesale Status (keep role as customer)
      user.wholesaleStatus = 'rejected';
      if (user.role === 'wholesale') {
        user.role = 'customer';
      }
      await user.save();

      return profile;
    } else {
      const rejected = fallbackStore.rejectWholesaleProfile(id, rejectionReason);
      if (!rejected) {
        throw new ApiError(404, 'Wholesale application record not found.');
      }
      return rejected;
    }
  }
}
