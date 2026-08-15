import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';
import { WholesaleApplication } from '../types/wholesale';

export const wholesaleService = {
  apply: async (formData: FormData): Promise<{ application: WholesaleApplication }> => {
    const res = await apiClient.post<ApiResponse<{ application: WholesaleApplication }>>('/wholesale/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  applyForWholesale: async (formData: FormData): Promise<{ application: WholesaleApplication }> => {
    return wholesaleService.apply(formData);
  },

  getStatus: async (): Promise<{ status: string; application: WholesaleApplication | null }> => {
    const res = await apiClient.get<ApiResponse<{ status: string; application: WholesaleApplication | null }>>('/wholesale/status');
    return res.data.data;
  },

  getMyWholesaleStatus: async (): Promise<{ status: string; application: WholesaleApplication | null }> => {
    return wholesaleService.getStatus();
  },
};
