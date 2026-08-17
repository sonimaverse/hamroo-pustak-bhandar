import mongoose, { Schema, Document, Model } from 'mongoose';

export type BookStatus =
  | 'active'
  | 'out_of_stock'
  | 'discontinued';

export interface IBook extends Document {
  _id: mongoose.Types.ObjectId;

  title: string;
  author: string;

  // OPTIONAL
  isbn?: string;

  description: string;

  category: mongoose.Types.ObjectId;

  publisher?: string;
  edition?: string;
  language: string;
  coverImage?: string;

  regularPrice: number;
  wholesalePrice: number;
  stockQuantity: number;

  // OPTIONAL
  sku?: string;

  status: BookStatus;

  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    // =========================
    // TITLE
    // =========================
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },

    // =========================
    // AUTHOR
    // =========================
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },

    // =========================
    // ISBN - OPTIONAL
    // =========================
    isbn: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },

    // =========================
    // DESCRIPTION
    // =========================
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    // =========================
    // CATEGORY
    // =========================
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
    },

    // =========================
    // PUBLISHER
    // =========================
    publisher: {
      type: String,
      trim: true,
      default: '',
    },

    // =========================
    // EDITION
    // =========================
    edition: {
      type: String,
      trim: true,
      default: '',
    },

    // =========================
    // LANGUAGE
    // =========================
    language: {
      type: String,
      trim: true,
      default: 'Nepali',
    },

    // =========================
    // COVER IMAGE
    // =========================
    coverImage: {
      type: String,
      trim: true,
      default:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    },

    // =========================
    // REGULAR PRICE
    // =========================
    regularPrice: {
      type: Number,
      required: [true, 'Regular price is required'],
      min: [0, 'Regular price cannot be negative'],
    },

    // =========================
    // WHOLESALE PRICE
    // =========================
    wholesalePrice: {
      type: Number,
      required: [true, 'Wholesale price is required'],
      min: [0, 'Wholesale price cannot be negative'],
    },

    // =========================
    // STOCK
    // =========================
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
    },

    // =========================
    // SKU - OPTIONAL
    // =========================
    sku: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },

    // =========================
    // STATUS
    // =========================
    status: {
      type: String,
      enum: [
        'active',
        'out_of_stock',
        'discontinued',
      ],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// =========================
// PRE-SAVE INVENTORY STATUS
// =========================
BookSchema.pre<IBook>('save', function () {
  if (this.status !== 'discontinued') {
    if (this.stockQuantity <= 0) {
      this.status = 'out_of_stock';
    } else if (
      this.stockQuantity > 0 &&
      this.status === 'out_of_stock'
    ) {
      this.status = 'active';
    }
  }
});

// =========================
// EXPORT MODEL
// =========================
export const Book: Model<IBook> =
  mongoose.models.Book ||
  mongoose.model<IBook>('Book', BookSchema);