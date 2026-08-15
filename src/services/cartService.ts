import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';
import { Cart } from '../types/cart';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const res = await apiClient.get<ApiResponse<Cart>>('/cart');
    return res.data.data;
  },

  addItem: async (bookId: string, quantity: number): Promise<Cart> => {
    const res = await apiClient.post<ApiResponse<Cart>>('/cart/items', { bookId, quantity });
    return res.data.data;
  },

  updateQuantity: async (bookId: string, quantity: number): Promise<Cart> => {
    const res = await apiClient.put<ApiResponse<Cart>>(`/cart/items/${bookId}`, { quantity });
    return res.data.data;
  },

  removeItem: async (bookId: string): Promise<Cart> => {
    const res = await apiClient.delete<ApiResponse<Cart>>(`/cart/items/${bookId}`);
    return res.data.data;
  },

  clearCart: async (): Promise<Cart> => {
    const res = await apiClient.delete<ApiResponse<Cart>>('/cart');
    return res.data.data;
  },
};
