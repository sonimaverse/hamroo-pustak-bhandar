import { z } from 'zod';

export const applyWholesaleSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters long'),
  panVatNumber: z
    .string()
    .min(5, 'PAN/VAT number must be at least 5 characters long')
    .max(20, 'PAN/VAT number cannot exceed 20 characters'),
  businessType: z.string().min(2, 'Business type is required (e.g. Bookstore, Distributor, Institution)'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  businessPhone: z
    .string()
    .optional(),
  phone: z
    .string()
    .optional(),
  street: z.string().min(2, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  postalCode: z.string().optional().default(''),
  country: z.string().optional().default('Nepal'),
  documentUrl: z.string().optional(),
}).transform((data) => {
  const phoneVal = data.businessPhone || data.phone || '+977-1-4223344';
  if (phoneVal.length < 5) {
    throw new Error('Business phone number must be at least 5 characters');
  }
  return {
    ...data,
    businessPhone: phoneVal,
  };
});

export const rejectWholesaleSchema = z.object({
  rejectionReason: z
    .string()
    .min(5, 'A clear rejection reason of at least 5 characters is required')
    .max(500, 'Rejection reason cannot exceed 500 characters'),
});

export type ApplyWholesaleInput = z.infer<typeof applyWholesaleSchema>;
export type RejectWholesaleInput = z.infer<typeof rejectWholesaleSchema>;
