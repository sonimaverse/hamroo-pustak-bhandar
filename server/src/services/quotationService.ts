import { Quotation, IQuotationItem, QuotationStatus } from '../models/Quotation.js';
import { Enquiry } from '../models/Enquiry.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';
import { ApiError } from '../utils/apiError.js';

export interface CreateQuotationInput {
  enquiryId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  organizationName: string;
  items: IQuotationItem[];
  subtotal: number;
  discount?: number;
  tax?: number;
  grandTotal: number;
  notes?: string;
  validUntil: Date;
  createdBy?: string;
}

export class QuotationService {
  static async createQuotation(input: CreateQuotationInput): Promise<any> {
    const dbStatus = getDbStatus();

    if (dbStatus.mode === 'mongodb_atlas' && dbStatus.isConnected) {
      const count = await Quotation.countDocuments();
      const quotationNumber = `HPB-QT-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

      const quotation = await Quotation.create({
        ...input,
        quotationNumber,
        status: 'sent',
      });

      if (input.enquiryId) {
        await Enquiry.findByIdAndUpdate(input.enquiryId, { status: 'quoted' });
      }

      return quotation;
    }

    return fallbackStore.createQuotation({
      enquiryId: input.enquiryId,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      clientPhone: input.clientPhone,
      organizationName: input.organizationName,
      items: input.items,
      subtotal: input.subtotal,
      discount: input.discount || 0,
      tax: input.tax || 0,
      grandTotal: input.grandTotal,
      notes: input.notes,
      validUntil: input.validUntil,
      status: 'sent',
      createdBy: input.createdBy,
    });
  }

  static async getAllQuotations(): Promise<any[]> {
    const dbStatus = getDbStatus();

    if (dbStatus.mode === 'mongodb_atlas' && dbStatus.isConnected) {
      return await Quotation.find().sort({ createdAt: -1 });
    }

    return fallbackStore.getAllQuotations();
  }

  static async getQuotationById(id: string): Promise<any> {
    const dbStatus = getDbStatus();

    if (dbStatus.mode === 'mongodb_atlas' && dbStatus.isConnected) {
      const quotation = await Quotation.findById(id);
      if (!quotation) {
        throw new ApiError(404, 'Quotation not found');
      }
      return quotation;
    }

    const quotation = fallbackStore.getQuotationById(id);
    if (!quotation) {
      throw new ApiError(404, 'Quotation not found');
    }
    return quotation;
  }
}
