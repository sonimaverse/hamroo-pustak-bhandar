import { z } from 'zod';
import { ApiError } from '../utils/apiError.js';

/**
 * Validation schema for submitting/applying for wholesale access.
 */
export const applyWholesaleSchema = z.object({
  businessName: z
    .string({ required_error: 'Business name is required' })
    .trim()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name cannot exceed 100 characters'),
  
  panVatNumber: z
    .string({ required_error: 'PAN/VAT number is required' })
    .trim()
    .min(3, 'PAN/VAT number must be at least 3 characters')
    .max(50, 'PAN/VAT number cannot exceed 50 characters'),
  
  address: z
    .string({ required_error: 'Address is required' })
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address cannot exceed 200 characters'),
  
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number (international format)'),
  
  documents: z
    .array(
      z.object({
        type: z.enum(['business_registration', 'pan_vat_certificate', 'other'], {
          required_error: 'Document type is required',
          invalid_type_error: 'Document type must be one of: business_registration, pan_vat_certificate, other',
        }),
        fileName: z
          .string({ required_error: 'File name is required' })
          .trim()
          .min(1, 'File name cannot be empty'),
        url: z
          .string({ required_error: 'Document URL is required' })
          .url('Please enter a valid document URL'),
        publicId: z
          .string({ required_error: 'Cloudinary public ID is required' })
          .trim()
          .min(1, 'Cloudinary public ID cannot be empty'),
      }),
      { required_error: 'Documents array is required' }
    )
    .min(1, 'At least one document must be uploaded'),
});

/**
 * Validation schema for updating own wholesale application.
 * Same rules apply as submission.
 */
export const updateWholesaleSchema = applyWholesaleSchema;

/**
 * Validation schema for rejecting a wholesale application.
 */
export const rejectWholesaleSchema = z.object({
  reason: z
    .string({ required_error: 'Rejection reason is required' })
    .trim()
    .min(3, 'Rejection reason must be at least 3 characters')
    .max(500, 'Rejection reason cannot exceed 500 characters'),
});

/**
 * Validation middleware wrapper.
 * Returns a 400 Bad Request error if validation fails.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return next(new ApiError(errorMessage, 400));
    }
    next(error);
  }
};
