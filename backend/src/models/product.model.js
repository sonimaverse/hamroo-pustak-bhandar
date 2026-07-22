import mongoose from 'mongoose';
import generateSequence from '../services/counter.service.js';
import { PRODUCT_STATUS, ALLOWED_CATEGORIES } from '../utils/constants.js';

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      unique: true,
      index: true,
      immutable: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
      index: true,
    },
    author: {
      type: String,
      trim: true,
      index: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ALLOWED_CATEGORIES,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    retailPrice: {
      type: Number,
      required: [true, 'Retail price is required'],
      min: [0, 'Retail price cannot be negative'],
    },
    wholesalePrice: {
      type: Number,
      required: [true, 'Wholesale price is required'],
      min: [0, 'Wholesale price cannot be negative'],
      validate: {
        validator: function (value) {
          return value <= this.retailPrice;
        },
        message: 'Wholesale price cannot exceed retail price',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    minimumStock: {
      type: Number,
      required: [true, 'Minimum stock is required'],
      min: [0, 'Minimum stock cannot be negative'],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.ACTIVE,
      index: true,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ title: 'text', author: 'text', description: 'text' });

productSchema.virtual('isLowStock').get(function () {
  return this.stock <= this.minimumStock;
});

productSchema.pre('validate', async function (next) {
  if (this.isNew && !this.sku) {
    try {
      this.sku = await generateSequence('product', { prefix: 'SKU', padding: 8 });
    } catch (error) {
      return next(new Error(`Failed to generate SKU: ${error.message}`));
    }
  }

  if (!this.slug && this.title) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const randomSuffix = Math.random().toString(36).substring(2, 8);
    this.slug = `${baseSlug}-${randomSuffix}`;
  }

  next();
});

export default mongoose.model('Product', productSchema);
