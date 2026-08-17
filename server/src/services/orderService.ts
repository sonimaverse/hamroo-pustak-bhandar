import mongoose from 'mongoose';
import {
  Order,
  OrderType,
  OrderStatus,
  PaymentStatus,
} from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
} from '../validators/orderValidator.js';
import { ApiError } from '../utils/apiError.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';

export class OrderService {
  /**
   * Determine the correct book price.
   *
   * Approved wholesale users get wholesale price.
   * Everyone else gets regular price.
   */
  private static determineUnitPrice(
    user: any,
    book: any
  ): number {
    const isApprovedWholesale =
      user?.role === 'wholesale' &&
      user?.wholesaleStatus === 'approved';

    if (
      isApprovedWholesale &&
      typeof book.wholesalePrice === 'number' &&
      book.wholesalePrice > 0
    ) {
      return book.wholesalePrice;
    }

    return book.regularPrice;
  }

  /**
   * =========================================================
   * CREATE ORDER
   * =========================================================
   */
  static async checkout(
    userId: string | null,
    input: CreateOrderInput
  ) {
    const dbState = getDbStatus();

    /* =======================================================
       MONGODB ATLAS
    ======================================================= */

    if (
      dbState.mode === 'mongodb_atlas' &&
      dbState.isConnected
    ) {
      let user: any = null;
      let isApprovedWholesale = false;

      /* -----------------------------------------------------
         Find logged-in user
      ----------------------------------------------------- */

      if (userId) {
        user = await User.findById(userId);

        if (!user) {
          throw new ApiError(
            404,
            'User account not found.'
          );
        }

        isApprovedWholesale =
          user.role === 'wholesale' &&
          user.wholesaleStatus === 'approved';
      }

      const orderType: OrderType =
        isApprovedWholesale
          ? 'wholesale'
          : 'regular';

      /* -----------------------------------------------------
         Resolve cart items
      ----------------------------------------------------- */

      let cartItemsToProcess: {
        bookId: any;
        quantity: number;
      }[] = [];

      let cartModelToClear: any = null;

      /*
       * Guest checkout / direct checkout
       */
      if (
        input.items &&
        input.items.length > 0
      ) {
        cartItemsToProcess = input.items;
      }

      /*
       * Logged-in user checkout from database cart
       */
      else if (userId) {
        cartModelToClear =
          await Cart.findOne({ userId });

        if (
          !cartModelToClear ||
          cartModelToClear.items.length === 0
        ) {
          throw new ApiError(
            400,
            'Your cart is empty. Please add items to your cart before checking out.'
          );
        }

        cartItemsToProcess =
          cartModelToClear.items;
      }

      /*
       * Guest with no items
       */
      else {
        throw new ApiError(
          400,
          'Your cart is empty. Please add items to your cart before checking out.'
        );
      }

      /* -----------------------------------------------------
         Start MongoDB transaction
      ----------------------------------------------------- */

      const session =
        await mongoose.startSession();

      session.startTransaction();

      try {
        const orderItems: any[] = [];
        let totalAmount = 0;

        /* ---------------------------------------------------
           Validate books, price and stock
        --------------------------------------------------- */

        for (
          const item of cartItemsToProcess
        ) {
          const book =
            await Book.findById(
              item.bookId
            ).session(session);

          if (!book) {
            throw new ApiError(
              404,
              `Book with ID ${item.bookId} was not found.`
            );
          }

          if (
            book.status === 'discontinued'
          ) {
            throw new ApiError(
              400,
              `Book "${book.title}" is discontinued and cannot be purchased.`
            );
          }

          if (
            book.status === 'out_of_stock' ||
            book.stockQuantity <= 0
          ) {
            throw new ApiError(
              400,
              `Book "${book.title}" is out of stock.`
            );
          }

          if (
            item.quantity >
            book.stockQuantity
          ) {
            throw new ApiError(
              400,
              `Insufficient stock for "${book.title}". Requested ${item.quantity}, available: ${book.stockQuantity}.`
            );
          }

          /*
           * Server-side price calculation.
           * Never trust price coming from frontend.
           */
          const unitPrice =
            this.determineUnitPrice(
              user,
              book
            );

          const subtotal =
            unitPrice * item.quantity;

          totalAmount += subtotal;

          orderItems.push({
            bookId: book._id,
            title: book.title,
            quantity: item.quantity,
            price: unitPrice,
            subtotal,
          });

          /* Deduct inventory */
          book.stockQuantity -=
            item.quantity;

          if (
            book.stockQuantity === 0
          ) {
            book.status =
              'out_of_stock';
          }

          await book.save({
            session,
          });
        }

        /* ---------------------------------------------------
           CREATE ORDER
           
           IMPORTANT:
           We intentionally DO NOT create orderId.
           
           MongoDB's default _id is the order identifier.
        --------------------------------------------------- */

        const order = new Order({
          userId:
            user?._id || null,

          orderType,

          items: orderItems,

          totalAmount,

          shippingAddress:
            input.shippingAddress,

          paymentMethod:
            input.paymentMethod,

          paymentStatus:
            'pending',

          /*
           * Cloudinary URL uploaded by controller.
           */
          paymentScreenshot:
            input.paymentScreenshot ||
            '',

          orderStatus:
            'pending',

          notes:
            input.notes || '',
        });

        await order.save({
          session,
        });

        /* ---------------------------------------------------
           Clear cart
        --------------------------------------------------- */

        if (cartModelToClear) {
          cartModelToClear.items = [];

          await cartModelToClear.save({
            session,
          });
        } else if (userId) {
          await Cart.updateOne(
            { userId },
            { items: [] },
            { session }
          );
        }

        await session.commitTransaction();

        return order;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        await session.endSession();
      }
    }

    /* =======================================================
       FALLBACK STORE
    ======================================================= */

    const user = userId
      ? fallbackStore.findUserById(
          userId
        )
      : null;

    const isApprovedWholesale =
      user?.role === 'wholesale' &&
      user?.wholesaleStatus === 'approved';

    const orderType: OrderType =
      isApprovedWholesale
        ? 'wholesale'
        : 'regular';

    /* -------------------------------------------------------
       Resolve cart
    ------------------------------------------------------- */

    let cartItemsToProcess: {
      bookId: string;
      quantity: number;
    }[] = [];

    if (
      input.items &&
      input.items.length > 0
    ) {
      cartItemsToProcess =
        input.items;
    } else if (userId) {
      const cart =
        fallbackStore.getCartByUserId(
          userId
        );

      if (
        !cart ||
        cart.items.length === 0
      ) {
        throw new ApiError(
          400,
          'Your cart is empty. Please add items to your cart before checking out.'
        );
      }

      cartItemsToProcess =
        cart.items;
    } else {
      throw new ApiError(
        400,
        'Your cart is empty. Please add items to your cart before checking out.'
      );
    }

    /* -------------------------------------------------------
       Validate stock
    ------------------------------------------------------- */

    for (
      const item of cartItemsToProcess
    ) {
      const book =
        fallbackStore.findBookById(
          item.bookId
        );

      if (!book) {
        throw new ApiError(
          404,
          `Book with ID ${item.bookId} was not found.`
        );
      }

      if (
        book.status === 'discontinued'
      ) {
        throw new ApiError(
          400,
          `Book "${book.title}" is discontinued and cannot be purchased.`
        );
      }

      if (
        book.status === 'out_of_stock' ||
        book.stockQuantity <= 0
      ) {
        throw new ApiError(
          400,
          `Book "${book.title}" is out of stock.`
        );
      }

      if (
        item.quantity >
        book.stockQuantity
      ) {
        throw new ApiError(
          400,
          `Insufficient stock for "${book.title}". Requested ${item.quantity}, available: ${book.stockQuantity}.`
        );
      }
    }

    /* -------------------------------------------------------
       Process order
    ------------------------------------------------------- */

    const orderItems: any[] = [];

    let totalAmount = 0;

    for (
      const item of cartItemsToProcess
    ) {
      const book =
        fallbackStore.findBookById(
          item.bookId
        );

      if (!book) {
        throw new ApiError(
          404,
          `Book with ID ${item.bookId} was not found.`
        );
      }

      const unitPrice =
        this.determineUnitPrice(
          user,
          book
        );

      const subtotal =
        unitPrice * item.quantity;

      totalAmount += subtotal;

      orderItems.push({
        bookId: book._id,
        title: book.title,
        quantity: item.quantity,
        price: unitPrice,
        subtotal,
      });

      /* Deduct stock */
      book.stockQuantity -=
        item.quantity;

      if (
        book.stockQuantity === 0
      ) {
        book.status =
          'out_of_stock';
      }

      fallbackStore.saveBook(book);
    }

    /* -------------------------------------------------------
       Create fallback order
    ------------------------------------------------------- */

    const newOrder =
      fallbackStore.createOrder({
        userId:
          userId || 'guest',

        orderType,

        items: orderItems,

        totalAmount,

        shippingAddress:
          input.shippingAddress,

        paymentMethod:
          input.paymentMethod,

        paymentStatus:
          'pending',

        paymentScreenshot:
          input.paymentScreenshot ||
          '',

        orderStatus:
          'pending',

        notes:
          input.notes || '',
      });

    /* Clear cart */
    if (userId) {
      fallbackStore.clearCart(
        userId
      );
    }

    return newOrder;
  }

  /* =======================================================
     CUSTOMER ORDERS
  ======================================================= */

  static async getMyOrders(
    userId: string
  ) {
    const dbState =
      getDbStatus();

    if (
      dbState.mode ===
        'mongodb_atlas' &&
      dbState.isConnected
    ) {
      return await Order.find({
        userId,
      }).sort({
        createdAt: -1,
      });
    }

    return fallbackStore.getOrdersByUserId(
      userId
    );
  }

  /* =======================================================
     GET ORDER BY ID
  ======================================================= */

  static async getOrderById(
    userId: string | null,
    userRole: string,
    orderId: string
  ) {
    const dbState =
      getDbStatus();

    if (
      dbState.mode ===
        'mongodb_atlas' &&
      dbState.isConnected
    ) {
      /*
       * MongoDB _id is the ONLY order identifier.
       */
      const order =
        await Order.findById(
          orderId
        ).populate(
          'userId',
          'name email phone role wholesaleStatus'
        );

      if (!order) {
        throw new ApiError(
          404,
          'Order record not found.'
        );
      }

      /* ---------------------------------------------------
         Owner OR admin can view
      --------------------------------------------------- */

      if (
        order.userId &&
        typeof order.userId === 'object' &&
        '_id' in order.userId
      ) {
        const orderUserId =
          (
            order.userId as any
          )._id.toString();

        if (
          !userId ||
          (
            orderUserId !== userId &&
            userRole !== 'admin'
          )
        ) {
          throw new ApiError(
            403,
            'You are not authorized to view this order.'
          );
        }
      }

      return order;
    }

    /* -------------------------------------------------------
       FALLBACK
    ------------------------------------------------------- */

    const order =
      fallbackStore.getOrderById(
        orderId
      );

    if (!order) {
      throw new ApiError(
        404,
        'Order record not found.'
      );
    }

    if (
      order.userId &&
      order.userId !== 'guest'
    ) {
      if (
        order.userId !== userId &&
        userRole !== 'admin'
      ) {
        throw new ApiError(
          403,
          'You are not authorized to view this order.'
        );
      }
    }

    return order;
  }

  /* =======================================================
     ADMIN - GET ALL ORDERS
  ======================================================= */

  static async getAllOrders(
    filters: {
      orderStatus?: string;
      paymentStatus?: string;
      orderType?: string;
      page?: number;
      limit?: number;
      search?: string;
    }
  ) {
    const dbState =
      getDbStatus();

    if (
      dbState.mode ===
        'mongodb_atlas' &&
      dbState.isConnected
    ) {
      const query: any = {};

      /* Order status */
      if (
        filters.orderStatus &&
        [
          'pending',
          'processing',
          'shipped',
          'delivered',
          'cancelled',
        ].includes(
          filters.orderStatus
        )
      ) {
        query.orderStatus =
          filters.orderStatus;
      }

      /* Payment status */
      if (
        filters.paymentStatus &&
        [
          'pending',
          'paid',
          'failed',
        ].includes(
          filters.paymentStatus
        )
      ) {
        query.paymentStatus =
          filters.paymentStatus;
      }

      /* Order type */
      if (
        filters.orderType &&
        [
          'regular',
          'wholesale',
        ].includes(
          filters.orderType
        )
      ) {
        query.orderType =
          filters.orderType;
      }

      /* Search */
      if (
        filters.search &&
        filters.search.trim()
      ) {
        const search =
          filters.search.trim();

        /*
         * Search by MongoDB _id when valid.
         * Otherwise search customer-related fields.
         */
        if (
          mongoose.Types.ObjectId.isValid(
            search
          )
        ) {
          query._id =
            new mongoose.Types.ObjectId(
              search
            );
        }
      }

      /* Pagination */
      const page = Math.max(
        1,
        filters.page || 1
      );

      const limit = Math.max(
        1,
        Math.min(
          100,
          filters.limit || 20
        )
      );

      const skip =
        (page - 1) * limit;

      const totalOrders =
        await Order.countDocuments(
          query
        );

      const orders =
        await Order.find(query)
          .populate(
            'userId',
            'name email phone role wholesaleStatus'
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit);

      return {
        orders,

        pagination: {
          totalOrders,

          page,

          limit,

          totalPages:
            Math.ceil(
              totalOrders / limit
            ),
        },
      };
    }

    /* -------------------------------------------------------
       FALLBACK
    ------------------------------------------------------- */

    const orders =
      fallbackStore.getAllOrders(
        filters
      );

    return {
      orders,

      pagination: {
        totalOrders:
          orders.length,

        page: 1,

        limit:
          orders.length,

        totalPages: 1,
      },
    };
  }

  /* =======================================================
     ADMIN - UPDATE ORDER / PAYMENT STATUS
  ======================================================= */

  static async updateOrderStatus(
    orderId: string,
    input: UpdateOrderStatusInput
  ) {
    const dbState =
      getDbStatus();

    if (
      dbState.mode ===
        'mongodb_atlas' &&
      dbState.isConnected
    ) {
      const order =
        await Order.findById(
          orderId
        );

      if (!order) {
        throw new ApiError(
          404,
          'Order record not found.'
        );
      }

      if (
        input.orderStatus
      ) {
        order.orderStatus =
          input.orderStatus as OrderStatus;
      }

      if (
        input.paymentStatus
      ) {
        order.paymentStatus =
          input.paymentStatus as PaymentStatus;
      }

      await order.save();

      return order;
    }

    /* -------------------------------------------------------
       FALLBACK
    ------------------------------------------------------- */

    const order =
      fallbackStore.updateOrderStatus(
        orderId,
        input
      );

    if (!order) {
      throw new ApiError(
        404,
        'Order record not found.'
      );
    }

    return order;
  }
}