import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrderType = 'regular' | 'wholesale';

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'Bank Transfer'
  | 'Online Payment'
  | 'COD'
  | 'Online';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface IOrderItem {
  bookId: mongoose.Types.ObjectId;
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  tole?: string;
  streetAddress?: string;
  deliveryNotes?: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;

  userId?: mongoose.Types.ObjectId | null;

  orderType: OrderType;

  items: IOrderItem[];

  totalAmount: number;

  shippingAddress: IShippingAddress;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  /**
   * Payment screenshot uploaded by customer.
   * Cloudinary URL will be stored here.
   */
  paymentScreenshot?: string;

  orderStatus: OrderStatus;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================================================
   ORDER ITEM SCHEMA
========================================================= */

const OrderItemSchema = new Schema<IOrderItem>(
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
  {
    _id: false,
  }
);

/* =========================================================
   SHIPPING ADDRESS SCHEMA
========================================================= */

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: {
      type: String,
      required: [true, 'Recipient full name is required'],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },

    province: {
      type: String,
      required: [true, 'Province is required'],
      enum: [
        'Koshi',
        'Madhesh',
        'Bagmati',
        'Gandaki',
        'Lumbini',
        'Karnali',
        'Sudurpashchim',
      ],
      trim: true,
    },

    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },

    municipality: {
      type: String,
      required: [true, 'Municipality is required'],
      trim: true,
    },

    ward: {
      type: String,
      required: [true, 'Ward number is required'],
      trim: true,
    },

    tole: {
      type: String,
      default: '',
      trim: true,
    },

    streetAddress: {
      type: String,
      default: '',
      trim: true,
    },

    deliveryNotes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   ORDER SCHEMA
========================================================= */

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },

    orderType: {
      type: String,
      enum: ['regular', 'wholesale'],
      default: 'regular',
    },

    items: {
      type: [OrderItemSchema],
      required: true,

      validate: {
        validator: (value: IOrderItem[]) => {
          return Array.isArray(value) && value.length > 0;
        },

        message: 'Order must contain at least one item',
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },

    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        'Cash on Delivery',
        'Bank Transfer',
        'Online Payment',
        'COD',
        'Online',
      ],
      default: 'Cash on Delivery',
    },

    /*
     * Payment verification status.
     *
     * pending = customer has not been verified yet
     * paid    = admin verified payment
     * failed  = payment rejected
     */
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },

    /*
     * Customer's payment screenshot.
     *
     * This will contain the Cloudinary secure URL.
     *
     * Example:
     * https://res.cloudinary.com/...
     */
    paymentScreenshot: {
      type: String,
      default: '',
      trim: true,
    },

    orderStatus: {
      type: String,
      enum: [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },

    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

/* =========================================================
   IMPORTANT
=========================================================

   Do NOT add orderId middleware.

   Do NOT add:

   OrderSchema.pre('validate', function(next) {
      ...
      next();
   });

   MongoDB's default _id is enough for identifying orders.

========================================================= */

export const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>('Order', OrderSchema);