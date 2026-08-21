import { apiClient } from './apiClient';
import { ApiResponse, User } from '../types/auth';
import { WholesaleApplication } from '../types/wholesale';
import { Order } from '../types/order';

export const adminService = {
  getWholesaleApplications: async (status?: string): Promise<{ applications: WholesaleApplication[] }> => {
    const params = status && status !== 'all' ? { status } : {};
    const res = await apiClient.get<ApiResponse<{ applications: WholesaleApplication[] }>>('/admin/wholesale-applications', { params });
    return res.data.data;
  },

  approveWholesaleApplication: async (id: string): Promise<any> => {
    const res = await apiClient.put<ApiResponse<any>>(`/admin/wholesale-applications/${id}/approve`);
    return res.data.data;
  },

  rejectWholesaleApplication: async (id: string, rejectionReason: string): Promise<any> => {
    const res = await apiClient.put<ApiResponse<any>>(`/admin/wholesale-applications/${id}/reject`, { rejectionReason });
    return res.data.data;
  },

  getOrders: async (filters?: { orderStatus?: string; paymentStatus?: string; orderType?: string; page?: number; limit?: number }): Promise<{ orders: Order[]; pagination: any }> => {
    const res = await apiClient.get<ApiResponse<{ orders: Order[]; pagination: any }>>('/admin/orders', { params: filters });
    return res.data.data;
  },

  updateOrderStatus: async (id: string, updates: { orderStatus?: string; paymentStatus?: string }): Promise<{ order: Order }> => {
    const res = await apiClient.put<ApiResponse<{ order: Order }>>(`/admin/orders/${id}/status`, updates);
    return res.data.data;
  },

  deactivateUser: async (id: string): Promise<{ user: User }> => {
    const res = await apiClient.put<ApiResponse<{ user: User }>>(`/admin/users/${id}/deactivate`);
    return res.data.data;
  },

  reactivateUser: async (id: string): Promise<{ user: User }> => {
    const res = await apiClient.put<ApiResponse<{ user: User }>>(`/admin/users/${id}/reactivate`);
    return res.data.data;
  },

  revokeWholesale: async (id: string): Promise<{ user: User }> => {
    const res = await apiClient.put<ApiResponse<{ user: User }>>(`/admin/users/${id}/revoke-wholesale`);
    return res.data.data;
  },
};
