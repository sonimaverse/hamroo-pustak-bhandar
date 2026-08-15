export interface ShippingAddress {
  fullName: string;
  phone: string;
  province: 'Koshi' | 'Madhesh' | 'Bagmati' | 'Gandaki' | 'Lumbini' | 'Karnali' | 'Sudurpashchim' | string;
  district: string;
  municipality: string;
  ward: string;
  tole?: string;
  streetAddress?: string;
  deliveryNotes?: string;
}

export interface OrderItem {
  bookId: string;
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type PaymentMethod = 'Cash on Delivery' | 'Bank Transfer' | 'Online Payment';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type OrderType = 'regular' | 'wholesale';

export interface Order {
  _id: string;
  userId: any;
  orderType: OrderType;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod | string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items?: Array<{ bookId: string; quantity: number }>;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}
