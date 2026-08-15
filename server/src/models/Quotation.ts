import mongoose, { Schema, Document, Model } from 'mongoose';

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface IQuotationItem {
  title: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IQuotation extends Document {
  _id: mongoose.Types.ObjectId;
  enquiryId?: mongoose.Types.ObjectId;
  quotationNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  organizationName: string;
  items: IQuotationItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  notes?: string;
  validUntil: Date;
  status: QuotationStatus;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuotationItemSchema = new Schema<IQuotationItem>(
  {
    title: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const QuotationSchema = new Schema<IQuotation>(
  {
    enquiryId: {
      type: Schema.Types.ObjectId,
      ref: 'Enquiry',
    },
    quotationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Client email is required'],
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      required: [true, 'Client phone is required'],
      trim: true,
    },
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    items: {
      type: [QuotationItemSchema],
      required: true,
      validate: [(val: IQuotationItem[]) => val.length > 0, 'Quotation must have at least one item'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'declined', 'expired'],
      default: 'sent',
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

export const Quotation: Model<IQuotation> =
  mongoose.models.Quotation || mongoose.model<IQuotation>('Quotation', QuotationSchema);
