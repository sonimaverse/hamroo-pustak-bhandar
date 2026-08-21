import mongoose, { Schema, Document, Model } from 'mongoose';

export type InvoiceStatus =
  | 'draft'
  | 'issued'
  | 'partially_paid'
  | 'paid'
  | 'cancelled';

export interface IInvoiceItem {
  bookId: mongoose.Types.ObjectId;
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IPaymentRecord {
  _id: mongoose.Types.ObjectId;
  amount: number;
  method: string;
  screenshot?: string;
  notes?: string;
  date: Date;
}

export interface IInvoice extends Document {
  _id: mongoose.Types.ObjectId;

  invoiceNumber: string;

  orderId: mongoose.Types.ObjectId;

  userId?: mongoose.Types.ObjectId | null;

  invoiceDate: Date;

  dueDate?: Date;

  items: IInvoiceItem[];

  subtotal: number;

  discount: number;

  tax: number;

  total: number;

  paidAmount: number;

  dueAmount: number;

  status: InvoiceStatus;

  paymentMethod: string;

  paymentScreenshot?: string;

  billingAddress?: Record<string, any>;

  notes?: string;

  paymentRecords?: IPaymentRecord[];

  createdBy?: mongoose.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },

    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },

    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
  },
  { _id: false }
);

const PaymentRecordSchema = new Schema<IPaymentRecord>(
  {
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, required: true, trim: true },
    screenshot: { type: String, default: '', trim: true },
    notes: { type: String, default: '', trim: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },

    invoiceDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
    },

    items: {
      type: [InvoiceItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },

    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },

    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'],
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative'],
    },

    dueAmount: {
      type: Number,
      default: 0,
      min: [0, 'Due amount cannot be negative'],
    },

    status: {
      type: String,
      enum: ['draft', 'issued', 'partially_paid', 'paid', 'cancelled'],
      default: 'issued',
    },

    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
    },

    paymentScreenshot: {
      type: String,
      default: '',
      trim: true,
    },

    billingAddress: {
      type: Schema.Types.Mixed,
    },

    notes: {
      type: String,
      default: '',
      trim: true,
    },

    paymentRecords: {
      type: [PaymentRecordSchema],
      default: [],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

InvoiceSchema.pre('save', function () {
  const total = this.total || 0;
  const paidAmount = this.paidAmount || 0;
  this.dueAmount = Math.max(total - paidAmount, 0);

  if (paidAmount >= total && total > 0) {
    this.status = 'paid';
  } else if (paidAmount > 0 && paidAmount < total) {
    this.status = 'partially_paid';
  } else if (paidAmount === 0) {
    this.status = 'issued';
  }
});

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice ||
  mongoose.model<IInvoice>('Invoice', InvoiceSchema);
