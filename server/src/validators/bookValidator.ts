import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters long')
    .max(100),

  description: z
    .string()
    .optional()
    .default(''),

  icon: z
    .string()
    .optional()
    .default('BookOpen'),
});

export const updateCategorySchema =
  categorySchema.partial();

export const bookSchema = z.object({
  // Required
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters long'),

  author: z
    .string()
    .min(2, 'Author name must be at least 2 characters long'),

  // OPTIONAL ISBN
  isbn: z
    .string()
    .min(5, 'ISBN must be at least 5 characters long')
    .optional(),

  // Required
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters long'),

  category: z
    .string()
    .min(1, 'Category is required'),

  // Optional
  publisher: z
    .string()
    .optional()
    .default(''),

  edition: z
    .string()
    .optional()
    .default(''),

  language: z
    .string()
    .optional()
    .default('Nepali'),

  coverImage: z
    .string()
    .optional(),

  // Required
  regularPrice: z.preprocess(
    (val) =>
      typeof val === 'string'
        ? parseFloat(val)
        : val,
    z
      .number()
      .min(
        0,
        'Regular price must be non-negative'
      )
  ),

  // Required
  wholesalePrice: z.preprocess(
    (val) =>
      typeof val === 'string'
        ? parseFloat(val)
        : val,
    z
      .number()
      .min(
        0,
        'Wholesale price must be non-negative'
      )
  ),

  // Required
  stockQuantity: z.preprocess(
    (val) =>
      typeof val === 'string'
        ? parseInt(val, 10)
        : val,
    z
      .number()
      .int()
      .min(
        0,
        'Stock quantity cannot be negative'
      )
  ),

  // OPTIONAL SKU
  sku: z
    .string()
    .min(2, 'SKU must be at least 2 characters long')
    .optional(),

  // Optional
  status: z
    .enum([
      'active',
      'out_of_stock',
      'discontinued',
    ])
    .optional()
    .default('active'),
});

export const updateBookSchema =
  bookSchema.partial();

export type CategoryInput =
  z.infer<typeof categorySchema>;

export type BookInput =
  z.infer<typeof bookSchema>;