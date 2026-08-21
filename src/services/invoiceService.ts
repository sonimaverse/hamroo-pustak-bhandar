import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';
import { Invoice } from '../types/invoice';

export const invoiceService = {
  generateFromOrder: async (
    orderId: string,
    input: {
      discount?: number;
      tax?: number;
      notes?: string;
      dueDate?: string;
    }
  ): Promise<{ invoice: Invoice }> => {
    const res = await apiClient.post<ApiResponse<{ invoice: Invoice }>>(
      `/admin/invoices/generate/${orderId}`,
      input
    );
    return res.data.data;
  },

  getAllInvoices: async (): Promise<{ invoices: Invoice[] }> => {
    const res = await apiClient.get<ApiResponse<{ invoices: Invoice[] }>>(
      '/admin/invoices'
    );
    return res.data.data;
  },

  getInvoiceById: async (id: string): Promise<{ invoice: Invoice }> => {
    const res = await apiClient.get<ApiResponse<{ invoice: Invoice }>>(
      `/invoices/${id}`
    );
    return res.data.data;
  },

  getInvoiceByOrderId: async (orderId: string): Promise<{ invoice: Invoice }> => {
    const res = await apiClient.get<ApiResponse<{ invoice: Invoice }>>(
      `/invoices/order/${orderId}`
    );
    return res.data.data;
  },

  recordPayment: async (
    invoiceId: string,
    input: {
      amount: number;
      paymentMethod: string;
      paymentScreenshot?: string;
      notes?: string;
    }
  ): Promise<{ invoice: Invoice }> => {
    const res = await apiClient.post<ApiResponse<{ invoice: Invoice }>>(
      `/admin/invoices/${invoiceId}/payments`,
      input
    );
    return res.data.data;
  },
};
