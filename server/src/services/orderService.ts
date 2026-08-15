import mongoose from 'mongoose';
import { Order, IOrder, OrderType, OrderStatus, PaymentStatus } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { CreateOrderInput, UpdateOrderStatusInput } from '../validators/orderValidator.js';
import { ApiError } from '../utils/apiError.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';
import { CartService } from './cartService.js';

export class OrderService {
  /**
   * Helper: Determine unit price for a book based on user's wholesale eligibility
   */
  private static determineUnitPrice(user: any, book: any): number {
    const isApprovedWholesale = user?.role === 'wholesale' && user?.wholesaleStatus === 'approved';
    if (isApprovedWholesale && typeof book.wholesalePrice === 'number' && book.wholesalePrice > 0) {
      return book.wholesalePrice;
    }
    return book.regularPrice;
  }

  /**
   * Create new order (Checkout)
   */
  static async checkout(userId: string | null, input: CreateOrderInput) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      let user: any = null;
      let isApprovedWholesale = false;

      if (userId) {
        user = await User.findById(userId);
        if (!user) throw new ApiError(404, 'User account not found.');
        isApprovedWholesale = user.role === 'wholesale' && user.wholesaleStatus === 'approved';
      }

      const orderType: OrderType = isApprovedWholesale ? 'wholesale' : 'regular';

      // Resolve cart items either from payload (guest cart / direct payload) or DB cart
      let cartItemsToProcess: { bookId: any; quantity: number }[] = [];
      let cartModelToClear: any = null;

      if (input.items && input.items.length > 0) {
        cartItemsToProcess = input.items;
      } else if (userId) {
        cartModelToClear = await Cart.findOne({ userId });
        if (!cartModelToClear || cartModelToClear.items.length === 0) {
          throw new ApiError(400, 'Your cart is empty. Please add items to your cart before checking out.');
        }
        cartItemsToProcess = cartModelToClear.items;
      } else {
        throw new ApiError(400, 'Your cart is empty. Please add items to your cart before checking out.');
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const orderItems = [];
        let totalAmount = 0;

        for (const item of cartItemsToProcess) {
          // Re-fetch book inside transaction
          const book = await Book.findById(item.bookId).session(session);
          if (!book) {
            throw new ApiError(404, `Book with ID ${item.bookId} was not found.`);
          }

          if (book.status === 'discontinued') {
            throw new ApiError(400, `Book "${book.title}" is discontinued and cannot be purchased.`);
          }

          if (book.status === 'out_of_stock' || book.stockQuantity <= 0) {
            throw new ApiError(400, `Book "${book.title}" is out of stock.`);
          }

          if (item.quantity > book.stockQuantity) {
            throw new ApiError(
              400,
              `Insufficient stock for "${book.title}". Requested ${item.quantity}, available: ${book.stockQuantity}.`
            );
          }

          // Server-side price calculation
          const unitPrice = this.determineUnitPrice(user, book);
          const subtotal = unitPrice * item.quantity;
          totalAmount += subtotal;

          orderItems.push({
            bookId: book._id,
            title: book.title,
            quantity: item.quantity,
            price: unitPrice,
            subtotal,
          });

          // Deduct stock
          book.stockQuantity -= item.quantity;
          if (book.stockQuantity === 0) {
            book.status = 'out_of_stock';
          }
          await book.save({ session });
        }

        // Create Order
        const order = new Order({
          userId: user ? user._id : null,
          orderType,
          items: orderItems,
          totalAmount,
          shippingAddress: input.shippingAddress,
          paymentMethod: input.paymentMethod,
          paymentStatus: 'pending',
          orderStatus: 'pending',
          notes: input.notes || '',
        });

        await order.save({ session });

        // Clear DB Cart if user has one
        if (cartModelToClear) {
          cartModelToClear.items = [];
          await cartModelToClear.save({ session });
        } else if (userId) {
          await Cart.updateOne({ userId }, { items: [] }, { session });
        }

        await session.commitTransaction();
        session.endSession();

        return order;
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } else {
      // Fallback Engine Checkout
      const user = userId ? fallbackStore.findUserById(userId) : null;
      const isApprovedWholesale = user?.role === 'wholesale' && user?.wholesaleStatus === 'approved';
      const orderType: OrderType = isApprovedWholesale ? 'wholesale' : 'regular';

      let cartItemsToProcess: { bookId: string; quantity: number }[] = [];
      if (input.items && input.items.length > 0) {
        cartItemsToProcess = input.items;
      } else if (userId) {
        const cart = fallbackStore.getCartByUserId(userId);
        if (!cart || cart.items.length === 0) {
          throw new ApiError(400, 'Your cart is empty. Please add items to your cart before checking out.');
        }
        cartItemsToProcess = cart.items;
      } else {
        throw new ApiError(400, 'Your cart is empty. Please add items to your cart before checking out.');
      }

      const orderItems = [];
      let totalAmount = 0;

      // Validate all books & stock first
      for (const item of cartItemsToProcess) {
        const book = fallbackStore.findBookById(item.bookId);
        if (!book) {
          throw new ApiError(404, `Book with ID ${item.bookId} was not found.`);
        }

        if (book.status === 'discontinued') {
          throw new ApiError(400, `Book "${book.title}" is discontinued and cannot be purchased.`);
        }

        if (book.status === 'out_of_stock' || book.stockQuantity <= 0) {
          throw new ApiError(400, `Book "${book.title}" is out of stock.`);
        }

        if (item.quantity > book.stockQuantity) {
          throw new ApiError(
            400,
            `Insufficient stock for "${book.title}". Requested ${item.quantity}, available: ${book.stockQuantity}.`
          );
        }
      }

      // Process stock deduction & order creation
      for (const item of cartItemsToProcess) {
        const book = fallbackStore.findBookById(item.bookId)!;
        const unitPrice = this.determineUnitPrice(user, book);
        const subtotal = unitPrice * item.quantity;
        totalAmount += subtotal;

        orderItems.push({
          bookId: book._id,
          title: book.title,
          quantity: item.quantity,
          price: unitPrice,
          subtotal,
        });

        // Deduct inventory
        book.stockQuantity -= item.quantity;
        if (book.stockQuantity === 0) {
          book.status = 'out_of_stock';
        }
        fallbackStore.saveBook(book);
      }

      // Create Order in fallback store
      const newOrder = fallbackStore.createOrder({
        userId: userId || 'guest',
        orderType,
        items: orderItems,
        totalAmount,
        shippingAddress: input.shippingAddress,
        paymentMethod: input.paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        notes: input.notes || '',
      });

      // Clear Cart if user exists
      if (userId) {
        fallbackStore.clearCart(userId);
      }

      return newOrder;
    }
  }

  /**
   * Get authenticated user's order history
   */
  static async getMyOrders(userId: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      return await Order.find({ userId }).sort({ createdAt: -1 });
    } else {
      return fallbackStore.getOrdersByUserId(userId);
    }
  }

  /**
   * Get order details by ID
   */
  static async getOrderById(userId: string | null, userRole: string, orderId: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const order = await Order.findById(orderId).populate('userId', 'name email phone role wholesaleStatus');
      if (!order) {
        throw new ApiError(404, 'Order record not found.');
      }

      // Security check: Only order owner or admin can view account orders; guest orders are accessible by invoice link
      if (order.userId && order.userId._id) {
        if (!userId || (order.userId._id.toString() !== userId && userRole !== 'admin')) {
          throw new ApiError(403, 'You are not authorized to view this order.');
        }
      }

      return order;
    } else {
      const order = fallbackStore.getOrderById(orderId);
      if (!order) {
        throw new ApiError(404, 'Order record not found.');
      }

      if (order.userId && order.userId !== 'guest') {
        if (order.userId !== userId && userRole !== 'admin') {
          throw new ApiError(403, 'You are not authorized to view this order.');
        }
      }

      return order;
    }
  }

  /**
   * Admin: List all orders with filters
   */
  static async getAllOrders(filters: {
    orderStatus?: string;
    paymentStatus?: string;
    orderType?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const query: any = {};

      if (filters.orderStatus && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(filters.orderStatus)) {
        query.orderStatus = filters.orderStatus;
      }

      if (filters.paymentStatus && ['pending', 'paid', 'failed'].includes(filters.paymentStatus)) {
        query.paymentStatus = filters.paymentStatus;
      }

      if (filters.orderType && ['regular', 'wholesale'].includes(filters.orderType)) {
        query.orderType = filters.orderType;
      }

      const page = Math.max(1, filters.page || 1);
      const limit = Math.max(1, Math.min(100, filters.limit || 20));
      const skip = (page - 1) * limit;

      const totalOrders = await Order.countDocuments(query);
      const orders = await Order.find(query)
        .populate('userId', 'name email phone role wholesaleStatus')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        orders,
        pagination: {
          totalOrders,
          page,
          limit,
          totalPages: Math.ceil(totalOrders / limit),
        },
      };
    } else {
      const orders = fallbackStore.getAllOrders(filters);
      return {
        orders,
        pagination: {
          totalOrders: orders.length,
          page: 1,
          limit: orders.length,
          totalPages: 1,
        },
      };
    }
  }

  /**
   * Admin: Update order status / payment status
   */
  static async updateOrderStatus(orderId: string, input: UpdateOrderStatusInput) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new ApiError(404, 'Order record not found.');
      }

      if (input.orderStatus) {
        order.orderStatus = input.orderStatus as OrderStatus;
      }

      if (input.paymentStatus) {
        order.paymentStatus = input.paymentStatus as PaymentStatus;
      }

      await order.save();
      return order;
    } else {
      const order = fallbackStore.updateOrderStatus(orderId, input);
      if (!order) {
        throw new ApiError(404, 'Order record not found.');
      }
      return order;
    }
  }
}
