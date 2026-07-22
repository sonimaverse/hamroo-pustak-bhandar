import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Document type is required'],
      enum: ['business_registration', 'pan_vat_certificate', 'other'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    url: {
      type: String,
      required: [true, 'Document URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

export default documentSchema;
