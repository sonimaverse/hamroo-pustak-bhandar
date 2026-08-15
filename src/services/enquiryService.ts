import { apiClient } from './apiClient';

export interface EnquiryInput {
  organizationName: string;
  organizationType: 'College' | 'School' | 'Institution' | 'Office' | 'Stationery' | 'Other';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  requirements: string;
  estimatedQuantity?: number;
}

export interface EnquiryItem {
  _id: string;
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  requirements: string;
  estimatedQuantity: number;
  status: 'pending' | 'quoted' | 'closed';
  createdAt: string;
}

export const enquiryService = {
  async submitEnquiry(input: EnquiryInput) {
    const response = await apiClient.post('/enquiries', input);
    return response.data?.data?.enquiry || response.data?.enquiry || response.data;
  },

  async getAllEnquiries(statusFilter?: string): Promise<EnquiryItem[]> {
    const params = statusFilter ? { status: statusFilter } : {};
    const response = await apiClient.get('/admin/enquiries', { params });
    const resData = response.data;
    if (Array.isArray(resData)) {
      return resData;
    }
    if (Array.isArray(resData?.data?.enquiries)) {
      return resData.data.enquiries;
    }
    if (Array.isArray(resData?.enquiries)) {
      return resData.enquiries;
    }
    if (Array.isArray(resData?.data)) {
      return resData.data;
    }
    return [];
  },

  async updateEnquiryStatus(id: string, status: 'pending' | 'quoted' | 'closed') {
    const response = await apiClient.put(`/admin/enquiries/${id}/status`, { status });
    return response.data?.data?.enquiry || response.data?.enquiry || response.data;
  },
};
