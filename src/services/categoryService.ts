import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';
import { Category } from '../types/category';

export const categoryService = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    const res = await apiClient.get<ApiResponse<{ categories: Category[] }>>('/categories');
    return res.data.data;
  },

  getCategoryBySlug: async (slug: string): Promise<{ category: Category }> => {
    const res = await apiClient.get<ApiResponse<{ category: Category }>>(`/categories/${slug}`);
    return res.data.data;
  },

  createCategory: async (data: { name: string; description?: string }): Promise<{ category: Category }> => {
    const res = await apiClient.post<ApiResponse<{ category: Category }>>('/categories', data);
    return res.data.data;
  },
};
