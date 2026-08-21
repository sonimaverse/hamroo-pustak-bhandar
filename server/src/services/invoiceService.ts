import mongoose from 'mongoose';
import { Invoice, InvoiceStatus } from '../models/Invoice.js';
import { Order, PaymentStatus } from '../models/Order.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';
import { ApiError } from '../utils/apiError.js';

export interface GenerateInvoiceInput {
  discount?: number;
  tax?: number;
  notes?: string;
  dueDate?: Date;
}

export interface RecordPaymentInput {
  amount: number;
  paymentMethod: string;
  paymentScreenshot?: string;
  notes?: string;
}

export interface PaymentRecord {
  _id: string;
  amount: number;
  method: string;
  screenshot?: string;
  notes?: string;
  date: Date;
}

export class InvoiceService {
  /**
   * Generate a sequential invoice number: HPB-000001
   */
  private static generateInvoiceNumber(count: number): string {
    return `HPB-${(count + 1).toString().padStart(6, '0')}`;
  }

  /**
   * Normalize any payment-method variant to a single canonical display
   * label. The original Order payment method is the source of truth; this
   * guarantees the Invoice header and Payment History never disagree.
   *
   * Mappings:
   *   bank_transfer / bank transfer / Bank Transfer         -> Bank Transfer
   *   cod / cash_on_delivery / cash on delivery / COD       -> Cash on Delivery
   *   online / online_payment / online payment / Online     -> Online Payment
   */
  private static normalizePaymentMethod(value?: string): string {
    if (!value) {
      return 'Cash on Delivery';
    }

    const v = value.trim().toLowerCase().replace(/[\s_-]+/g, '_');

    switch (v) {
      case 'bank_transfer':
        return 'Bank Transfer';

      case 'cod':
      case 'cash_on_delivery':
        return 'Cash on Delivery';

      case 'online':
      case 'online_payment':
        return 'Online Payment';

      default:
        /*
         * If it already matches one of the known canonical labels,
         * keep it unchanged. Otherwise fall back to Cash on Delivery.
         */
        const canonical = [
          'Cash on Delivery',
          'Bank Transfer',
          'Online Payment',
          'COD',
          'Online',
        ];

        return canonical.includes(value) ? value : 'Cash on Delivery';
    }
  }

  /**
   * Recompute invoice totals and status after payment changes.
   */
  private static recomputeInvoice(invoice: any): void {
    const total = Number(invoice.total) || 0;
    const paidAmount = Number(invoice.paidAmount) || 0;

    if (paidAmount >= total && total > 0) {
      invoice.status = 'paid' as InvoiceStatus;
    } else if (paidAmount > 0) {
      invoice.status = 'partially_paid' as InvoiceStatus;
    } else {
      invoice.status = 'issued' as InvoiceStatus;
    }

    invoice.dueAmount = Math.max(total - paidAmount, 0);
  }

  /**
   * Generate an invoice from an existing order.
   * Admin-only.
   */
  static async generateFromOrder(
    orderId: string,
    input: GenerateInvoiceInput,
    createdBy?: string
  ): Promise<any> {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const order = await Order.findById(orderId).populate(
        'userId',
        'name email phone role wholesaleStatus address'
      );

      if (!order) {
        throw new ApiError(404, 'Order record not found.');
      }

      const count = await Invoice.countDocuments();
      const invoiceNumber = this.generateInvoiceNumber(count);

      const discount = Number(input.discount) || 0;
      const tax = Number(input.tax) || 0;
      const subtotal = Number(order.totalAmount) || 0;

      const items = order.items.map((item: any) => ({
        bookId: item.bookId,
        title: item.title,
        quantity: Number(item.quantity),
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      }));

      const invoice = await Invoice.create({
        invoiceNumber,
        orderId: order._id,
        userId: order.userId ?? null,
        invoiceDate: new Date(),
        dueDate: input.dueDate,
        items,
        subtotal,
        discount,
        tax,
        total: subtotal - discount + tax,
        paidAmount: 0,
        status: 'issued',
        paymentMethod: this.normalizePaymentMethod(order.paymentMethod),
        paymentScreenshot: order.paymentScreenshot || '',
        billingAddress: order.shippingAddress,
        notes: input.notes || '',
        createdBy: createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined,
      });

      return invoice.populate(['orderId', 'userId']);
    }

    /* =======================================================
       FALLBACK STORE
       ======================================================= */

    const order = fallbackStore.getOrderById(orderId);

    if (!order) {
      throw new ApiError(404, 'Order record not found.');
    }

    const discount = Number(input.discount) || 0;
    const tax = Number(input.tax) || 0;
    const subtotal = Number(order.totalAmount) || 0;

    return fallbackStore.createInvoice({
      orderId,
      userId: order.userId || null,
      items: order.items.map((item) => ({
        bookId: item.bookId,
        title: item.title,
        quantity: Number(item.quantity),
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
      subtotal,
      discount,
      tax,
      total: subtotal - discount + tax,
      notes: input.notes || '',
      dueDate: input.dueDate,
      paymentMethod: this.normalizePaymentMethod(order.paymentMethod),
      paymentScreenshot: order.paymentScreenshot || '',
      billingAddress: order.shippingAddress,
      createdBy: createdBy,
    });
  }

  /**
   * Get all invoices (admin).
   */
  static async getAllInvoices(): Promise<any[]> {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      return await Invoice.find()
        .populate('orderId', 'orderStatus paymentStatus')
        .populate('userId', 'name email phone role wholesaleStatus')
        .sort({ createdAt: -1 });
    }

    return fallbackStore.getAllInvoices();
  }

  /**
   * Get invoice by ID.
   * Accessible by admin or the order owner.
   */
  static async getInvoiceById(
    id: string,
    userId: string | null,
    userRole: string
  ): Promise<any> {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const invoice = await Invoice.findById(id)
        .populate('orderId')
        .populate('userId', 'name email phone role wholesaleStatus');

      if (!invoice) {
        throw new ApiError(404, 'Invoice not found.');
      }

      const invoiceUserId =
        invoice.userId && typeof invoice.userId === 'object' && '_id' in invoice.userId
          ? (invoice.userId as any)._id.toString()
          : invoice.userId
            ? invoice.userId.toString()
            : null;

      if (
        invoiceUserId &&
        invoiceUserId !== userId &&
        userRole !== 'admin'
      ) {
        throw new ApiError(403, 'You are not authorized to view this invoice.');
      }

      return invoice;
    }

    const invoice = fallbackStore.getInvoiceById(id);

    if (!invoice) {
      throw new ApiError(404, 'Invoice not found.');
    }

    const invoiceUserId = invoice.userId;

    if (
      invoiceUserId &&
      invoiceUserId !== userId &&
      userRole !== 'admin'
    ) {
      throw new ApiError(403, 'You are not authorized to view this invoice.');
    }

    return invoice;
  }

  /**
   * Get invoice by linked order ID.
   * Accessible by admin or the order owner.
   */
  static async getInvoiceByOrderId(
    orderId: string,
    userId: string | null,
    userRole: string
  ): Promise<any> {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const invoice = await Invoice.findOne({ orderId })
        .populate('orderId')
        .populate('userId', 'name email phone role wholesaleStatus');

      if (!invoice) {
        throw new ApiError(404, 'No invoice found for this order.');
      }

      const invoiceUserId =
        invoice.userId && typeof invoice.userId === 'object' && '_id' in invoice.userId
          ? (invoice.userId as any)._id.toString()
          : invoice.userId
            ? invoice.userId.toString()
            : null;

      if (
        invoiceUserId &&
        invoiceUserId !== userId &&
        userRole !== 'admin'
      ) {
        throw new ApiError(403, 'You are not authorized to view this invoice.');
      }

      return invoice;
    }

    const order = fallbackStore.getOrderById(orderId);

    if (!order) {
      throw new ApiError(404, 'Order not found.');
    }

    const invoice = fallbackStore.getInvoiceByOrderId(orderId);

    if (!invoice) {
      throw new ApiError(404, 'No invoice found for this order.');
    }

    const invoiceUserId = invoice.userId;

    if (
      invoiceUserId &&
      invoiceUserId !== userId &&
      userRole !== 'admin'
    ) {
      throw new ApiError(403, 'You are not authorized to view this invoice.');
    }

    return invoice;
  }

  /**
   * Record a payment against an invoice.
   * Admin-only.
   * Syncs Order.paymentStatus when invoice is fully paid.
   */
  static async recordPayment(
    invoiceId: string,
    input: RecordPaymentInput
  ): Promise<any> {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const invoice = await Invoice.findById(invoiceId);

      if (!invoice) {
        throw new ApiError(404, 'Invoice not found.');
      }

      const amount = Number(input.amount);
      if (amount <= 0) {
        throw new ApiError(400, 'Payment amount must be greater than zero.');
      }

      invoice.paidAmount = (Number(invoice.paidAmount) || 0) + amount;

      if (!invoice.paymentRecords) {
        (invoice as any).paymentRecords = [];
      }

      (invoice as any).paymentRecords.push({
        _id: new mongoose.Types.ObjectId(),
        amount,
        method: this.normalizePaymentMethod(invoice.paymentMethod),
        screenshot: input.paymentScreenshot || '',
        notes: input.notes || '',
        date: new Date(),
      });

      this.recomputeInvoice(invoice);
      await invoice.save();

      /*
       * Sync fully-paid invoices to the parent Order.
       */
      if (invoice.status === 'paid' && invoice.orderId) {
        const order = await Order.findById(invoice.orderId);
        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          await order.save();
        }
      }

      return invoice.populate(['orderId', 'userId']);
    }

    /* =======================================================
       FALLBACK STORE
       ======================================================= */

    const invoice = fallbackStore.getInvoiceById(invoiceId);

    if (!invoice) {
      throw new ApiError(404, 'Invoice not found.');
    }

    const amount = Number(input.amount);
    if (amount <= 0) {
      throw new ApiError(400, 'Payment amount must be greater than zero.');
    }

    invoice.paidAmount = (Number(invoice.paidAmount) || 0) + amount;

    invoice.paymentRecords = invoice.paymentRecords || [];
    invoice.paymentRecords.push({
      _id: 'pay_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      amount,
      method: this.normalizePaymentMethod(invoice.paymentMethod),
      screenshot: input.paymentScreenshot || '',
      notes: input.notes || '',
      date: new Date(),
    });

    this.recomputeInvoice(invoice);

    /*
     * Sync fully-paid invoices to the parent Order.
     */
    if (invoice.status === 'paid' && invoice.orderId) {
      const order = fallbackStore.getOrderById(invoice.orderId);
      if (order && order.paymentStatus !== 'paid') {
        fallbackStore.updateOrderStatus(order._id, {
          paymentStatus: 'paid' as PaymentStatus,
        });
      }
    }

    return invoice;
  }
}
