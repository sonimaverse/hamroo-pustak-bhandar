export interface InvoiceItem {
  bookId: string;
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface PaymentRecord {
  _id: string;
  amount: number;
  method: string;
  screenshot?: string;
  notes?: string;
  date: string;
}

export type InvoiceStatus =
  | 'draft'
  | 'issued'
  | 'partially_paid'
  | 'paid'
  | 'cancelled';

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  orderId: string | null | { _id: string; orderStatus?: string; paymentStatus?: string };
  userId?: string | null | { _id: string; name?: string; email?: string };
  invoiceDate: string;
  dueDate?: string;
  items: InvoiceItem[];
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
  paymentRecords?: PaymentRecord[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}
