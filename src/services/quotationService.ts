import { apiClient } from './apiClient';

export interface QuotationItemInput {
  title: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuotationInput {
  enquiryId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  organizationName: string;
  items: QuotationItemInput[];
  subtotal: number;
  discount?: number;
  tax?: number;
  grandTotal: number;
  notes?: string;
  validUntil: string;
}

export interface QuotationRecord extends QuotationInput {
  _id: string;
  quotationNumber: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
}

export const quotationService = {
  async createQuotation(input: QuotationInput) {
    const response = await apiClient.post('/admin/quotations', input);
    return response.data?.data?.quotation || response.data?.quotation || response.data;
  },

  async getAllQuotations(): Promise<QuotationRecord[]> {
    const response = await apiClient.get('/admin/quotations');
    const resData = response.data;
    if (Array.isArray(resData)) {
      return resData;
    }
    if (Array.isArray(resData?.data?.quotations)) {
      return resData.data.quotations;
    }
    if (Array.isArray(resData?.quotations)) {
      return resData.quotations;
    }
    if (Array.isArray(resData?.data)) {
      return resData.data;
    }
    return [];
  },

  async getQuotationById(id: string) {
    const response = await apiClient.get(`/quotations/${id}`);
    return response.data?.data?.quotation || response.data?.quotation || response.data;
  },
};
