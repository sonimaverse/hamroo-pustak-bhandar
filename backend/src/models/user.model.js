import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import generateSequence from '../services/counter.service.js';
import documentSchema from './document.schema.js';
import { USER_ROLES, WHOLESALE_STATUS } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      index: true,
      immutable: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid international phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.WHOLESALE_PENDING,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(WHOLESALE_STATUS),
      default: WHOLESALE_STATUS.PENDING,
      index: true,
    },
    businessName: {
      type: String,
      trim: true,
      default: '',
    },
    panVatNumber: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
    refreshToken: {
      type: String,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre('validate', async function (next) {
  if (this.isNew && !this.userId) {
    try {
      this.userId = await generateSequence('user', { prefix: 'USR', padding: 6 });
    } catch (error) {
      return next(new Error(`Failed to generate userId: ${error.message}`));
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
