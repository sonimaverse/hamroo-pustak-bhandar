import { apiClient } from './apiClient';
import { ApiResponse, AuthResponseData, User } from '../types/auth';

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponseData> => {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', credentials);
    return res.data.data;
  },

  register: async (userData: { name: string; email: string; password: string; phone?: string; role?: string }): Promise<AuthResponseData> => {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', userData);
    return res.data.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const res = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: { name?: string; phone?: string; address?: { street?: string; city?: string; state?: string; postalCode?: string; country?: string } }): Promise<{ user: User }> => {
    const res = await apiClient.put<ApiResponse<{ user: User }>>('/auth/profile', data);
    return res.data.data;
  },
};
