import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'customer' | 'wholesale' | 'admin';
export type WholesaleStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: IAddress;
  role: UserRole;
  wholesaleStatus: WholesaleStatus;

  /*
   * Password reset token (SHA-256 hash) and expiry.
   * Both excluded from default queries via schema-level select: false.
   */
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  /*
   * Activation flag. Deactivated users cannot authenticate but all their
   * historical records (Orders, Invoices, WholesaleProfile) are preserved.
   */
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toSafeObject(): Record<string, any>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'Nepal' },
    },
    role: {
      type: String,
      enum: ['customer', 'wholesale', 'admin'],
      default: 'customer',
    },
    wholesaleStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },

    /*
     * Password reset token (SHA-256 hash of the raw token).
     * Stored as a hash so a database leak cannot be used to reset passwords.
     */
    passwordResetToken: {
      type: String,
      select: false,
    },

    /*
     * Password reset token expiry.
     * Token is single-use: cleared from the document once consumed.
     */
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    /*
     * Activation flag. Deactivated users cannot authenticate but all their
     * historical records are preserved. Defaults to true so existing users
     * remain active.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get safe user payload without sensitive fields
UserSchema.methods.toSafeObject = function (): Record<string, any> {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpires;
  delete userObj.__v;
  return userObj;
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
