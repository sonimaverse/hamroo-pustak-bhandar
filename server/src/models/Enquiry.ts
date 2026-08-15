import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrganizationType = 'College' | 'School' | 'Institution' | 'Office' | 'Stationery' | 'Other';
export type EnquiryStatus = 'pending' | 'quoted' | 'closed';

export interface IEnquiry extends Document {
  _id: mongoose.Types.ObjectId;
  organizationName: string;
  organizationType: OrganizationType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  requirements: string;
  estimatedQuantity?: number;
  status: EnquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    organizationName: {
      type: String,
      required: [true, 'Organization or institution name is required'],
      trim: true,
    },
    organizationType: {
      type: String,
      enum: ['College', 'School', 'Institution', 'Office', 'Stationery', 'Other'],
      required: [true, 'Organization type is required'],
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    requirements: {
      type: String,
      required: [true, 'Requirement details/product list is required'],
      trim: true,
    },
    estimatedQuantity: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'quoted', 'closed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
