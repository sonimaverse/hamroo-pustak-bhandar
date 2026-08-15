import mongoose, { Schema, Document, Model } from 'mongoose';

export type BookStatus = 'active' | 'out_of_stock' | 'discontinued';

export interface IBook extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  author: string;
  isbn: string;
  description: string;
  category: mongoose.Types.ObjectId;
  publisher?: string;
  edition?: string;
  language: string;
  coverImage?: string;
  regularPrice: number;
  wholesalePrice: number;
  stockQuantity: number;
  sku: string;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
    },
    publisher: {
      type: String,
      trim: true,
      default: '',
    },
    edition: {
      type: String,
      trim: true,
      default: '',
    },
    language: {
      type: String,
      trim: true,
      default: 'Nepali',
    },
    coverImage: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    },
    regularPrice: {
      type: Number,
      required: [true, 'Regular price is required'],
      min: [0, 'Regular price cannot be negative'],
    },
    wholesalePrice: {
      type: Number,
      required: [true, 'Wholesale price is required'],
      min: [0, 'Wholesale price cannot be negative'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'out_of_stock', 'discontinued'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to maintain inventory status automatically
BookSchema.pre<IBook>('save', function () {
  if (this.status !== 'discontinued') {
    if (this.stockQuantity <= 0) {
      this.status = 'out_of_stock';
    } else if (this.stockQuantity > 0 && this.status === 'out_of_stock') {
      this.status = 'active';
    }
  }
});

export const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
