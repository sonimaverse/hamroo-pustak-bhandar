import { Enquiry, IEnquiry, OrganizationType, EnquiryStatus } from '../models/Enquiry.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';
import { ApiError } from '../utils/apiError.js';

export interface CreateEnquiryInput {
  organizationName: string;
  organizationType: OrganizationType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  requirements: string;
  estimatedQuantity?: number;
}

export class EnquiryService {
  static async createEnquiry(input: CreateEnquiryInput): Promise<any> {
    const dbStatus = getDbStatus();

    if (dbStatus.mode === 'mongodb_atlas' && dbStatus.isConnected) {
      const enquiry = await Enquiry.create(input);
      return enquiry;
    }

    return fallbackStore.createEnquiry(input);
  }

  static async getAllEnquiries(statusFilter?: string): Promise<any[]> {
    const dbStatus = getDbStatus();

    if (dbStatus.mode === 'mongodb_atlas' && dbStatus.isConnected) {
      const query: any = statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {};
      return await Enquiry.find(query).sort({ createdAt: -1 });
    }

    return fallbackStore.getAllEnquiries(statusFilter);
  }

  static async getEnquiryById(id: string): Promise<any> {
    const dbStatus = getDbStatus();

    if (dbStatus.mode === 'mongodb_atlas' && dbStatus.isConnected) {
      const enquiry = await Enquiry.findById(id);
      if (!enquiry) {
        throw new ApiError(404, 'Enquiry not found');
      }
      return enquiry;
    }

    const enquiry = fallbackStore.getEnquiryById(id);
    if (!enquiry) {
      throw new ApiError(404, 'Enquiry not found');
    }
    return enquiry;
  }

  static async updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<any> {
    const dbStatus = getDbStatus();

    if (dbStatus.mode === 'mongodb_atlas' && dbStatus.isConnected) {
      const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
      if (!enquiry) {
        throw new ApiError(404, 'Enquiry not found');
      }
      return enquiry;
    }

    const enquiry = fallbackStore.updateEnquiryStatus(id, status);
    if (!enquiry) {
      throw new ApiError(404, 'Enquiry not found');
    }
    return enquiry;
  }
}
