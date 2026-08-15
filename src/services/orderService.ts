import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';
import { Order, CreateOrderPayload } from '../types/order';

export const orderService = {
  createOrder: async (payload: CreateOrderPayload): Promise<{ order: Order }> => {
    const res = await apiClient.post<ApiResponse<{ order: Order }>>('/orders', payload);
    return res.data.data;
  },

  getMyOrders: async (): Promise<{ orders: Order[] }> => {
    const res = await apiClient.get<ApiResponse<{ orders: Order[] }>>('/orders/my-orders');
    return res.data.data;
  },

  getOrderById: async (id: string): Promise<{ order: Order }> => {
    const res = await apiClient.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
    return res.data.data;
  },
};
