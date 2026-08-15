import mongoose, { Schema, Document, Model } from 'mongoose';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface IBusinessAddress {
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  country?: string;
}

export interface IWholesaleProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyName: string;
  panVatNumber: string;
  businessType: string;
  contactPerson: string;
  businessPhone: string;
  businessAddress: IBusinessAddress;
  documentUrl: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WholesaleProfileSchema = new Schema<IWholesaleProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company / Business name is required'],
      trim: true,
    },
    panVatNumber: {
      type: String,
      required: [true, 'PAN/VAT Registration Number is required'],
      trim: true,
    },
    businessType: {
      type: String,
      required: [true, 'Business type is required'],
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    businessPhone: {
      type: String,
      required: [true, 'Business phone number is required'],
      trim: true,
    },
    businessAddress: {
      street: { type: String, required: [true, 'Street address is required'], trim: true },
      city: { type: String, required: [true, 'City is required'], trim: true },
      state: { type: String, required: [true, 'State / Province is required'], trim: true },
      postalCode: { type: String, default: '', trim: true },
      country: { type: String, default: 'Nepal', trim: true },
    },
    documentUrl: {
      type: String,
      required: [true, 'Business registration or PAN/VAT certificate document is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
      trim: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const WholesaleProfile: Model<IWholesaleProfile> =
  mongoose.models.WholesaleProfile ||
  mongoose.model<IWholesaleProfile>('WholesaleProfile', WholesaleProfileSchema);
