import { z } from 'zod';

export const addToCartSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const NEPAL_PROVINCES = [
  'Koshi',
  'Madhesh',
  'Bagmati',
  'Gandaki',
  'Lumbini',
  'Karnali',
  'Sudurpashchim',
] as const;

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Recipient full name is required'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  province: z.enum(NEPAL_PROVINCES),
  district: z.string().min(2, 'District is required'),
  municipality: z.string().min(2, 'Municipality is required'),
  ward: z.string().min(1, 'Ward number is required'),
  tole: z.string().optional().default(''),
  streetAddress: z.string().optional().default(''),
  deliveryNotes: z.string().optional().default(''),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z
    .enum(['Cash on Delivery', 'Bank Transfer', 'Online Payment', 'COD', 'Online'])
    .default('Cash on Delivery'),
  notes: z.string().optional().default(''),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),
}).refine(data => data.orderStatus !== undefined || data.paymentStatus !== undefined, {
  message: 'At least one of orderStatus or paymentStatus must be provided for update',
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
