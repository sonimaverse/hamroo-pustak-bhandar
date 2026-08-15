import { Cart, ICart } from '../models/Cart.js';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore, FallbackCart } from './fallbackStore.js';

export class CartService {
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
   * Get formatted cart for authenticated user
   */
  static async getCart(userId: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }

      let cart = await Cart.findOne({ userId }).populate('items.bookId');
      if (!cart) {
        cart = await Cart.create({ userId, items: [] });
      }

      // Recalculate item prices and subtotals based on current user role/wholesale status
      let totalAmount = 0;
      const formattedItems = [];

      for (const item of cart.items) {
        const book: any = item.bookId;
        if (!book) continue;

        const unitPrice = this.determineUnitPrice(user, book);
        const subtotal = unitPrice * item.quantity;
        totalAmount += subtotal;

        formattedItems.push({
          bookId: book._id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          stockQuantity: book.stockQuantity,
          status: book.status,
          quantity: item.quantity,
          regularPrice: book.regularPrice,
          wholesalePrice: (user.role === 'wholesale' && user.wholesaleStatus === 'approved') ? book.wholesalePrice : undefined,
          unitPrice,
          subtotal,
        });
      }

      return {
        cartId: cart._id,
        userId: cart.userId,
        items: formattedItems,
        totalAmount,
        updatedAt: cart.updatedAt,
      };
    } else {
      const user = fallbackStore.findUserById(userId);
      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }

      const cart = fallbackStore.getCartByUserId(userId);
      let totalAmount = 0;
      const formattedItems = [];

      for (const item of cart.items) {
        const book = fallbackStore.findBookById(item.bookId);
        if (!book) continue;

        const unitPrice = this.determineUnitPrice(user, book);
        const subtotal = unitPrice * item.quantity;
        totalAmount += subtotal;

        formattedItems.push({
          bookId: book._id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          stockQuantity: book.stockQuantity,
          status: book.status,
          quantity: item.quantity,
          regularPrice: book.regularPrice,
          wholesalePrice: (user.role === 'wholesale' && user.wholesaleStatus === 'approved') ? book.wholesalePrice : undefined,
          unitPrice,
          subtotal,
        });
      }

      return {
        cartId: cart._id,
        userId: cart.userId,
        items: formattedItems,
        totalAmount,
        updatedAt: cart.updatedAt,
      };
    }
  }

  /**
   * Add item to cart
   */
  static async addItem(userId: string, bookId: string, quantity: number) {
    if (quantity <= 0) {
      throw new ApiError(400, 'Quantity must be greater than 0.');
    }

    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const user = await User.findById(userId);
      if (!user) throw new ApiError(404, 'User account not found.');

      const book = await Book.findById(bookId);
      if (!book) throw new ApiError(404, 'Book not found.');

      if (book.status === 'discontinued') {
        throw new ApiError(400, 'This book has been discontinued and cannot be purchased.');
      }

      if (book.status === 'out_of_stock' || book.stockQuantity <= 0) {
        throw new ApiError(400, 'This book is currently out of stock.');
      }

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      const existingItemIndex = cart.items.findIndex((item) => item.bookId.toString() === bookId);
      const currentCartQty = existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
      const newTotalQty = currentCartQty + quantity;

      if (newTotalQty > book.stockQuantity) {
        throw new ApiError(
          400,
          `Cannot add ${quantity} units. Stock limit is ${book.stockQuantity} (currently ${currentCartQty} in cart).`
        );
      }

      const unitPrice = this.determineUnitPrice(user, book);

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity = newTotalQty;
        cart.items[existingItemIndex].price = unitPrice;
        cart.items[existingItemIndex].subtotal = unitPrice * newTotalQty;
      } else {
        cart.items.push({
          bookId: book._id,
          quantity,
          price: unitPrice,
          subtotal: unitPrice * quantity,
        });
      }

      await cart.save();
      return this.getCart(userId);
    } else {
      const user = fallbackStore.findUserById(userId);
      if (!user) throw new ApiError(404, 'User account not found.');

      const book = fallbackStore.findBookById(bookId);
      if (!book) throw new ApiError(404, 'Book not found.');

      if (book.status === 'discontinued') {
        throw new ApiError(400, 'This book has been discontinued and cannot be purchased.');
      }

      if (book.status === 'out_of_stock' || book.stockQuantity <= 0) {
        throw new ApiError(400, 'This book is currently out of stock.');
      }

      const cart = fallbackStore.getCartByUserId(userId);
      const existingItemIndex = cart.items.findIndex((item) => item.bookId === bookId);
      const currentCartQty = existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
      const newTotalQty = currentCartQty + quantity;

      if (newTotalQty > book.stockQuantity) {
        throw new ApiError(
          400,
          `Cannot add ${quantity} units. Stock limit is ${book.stockQuantity} (currently ${currentCartQty} in cart).`
        );
      }

      const unitPrice = this.determineUnitPrice(user, book);

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity = newTotalQty;
        cart.items[existingItemIndex].price = unitPrice;
        cart.items[existingItemIndex].subtotal = unitPrice * newTotalQty;
      } else {
        cart.items.push({
          bookId: book._id,
          quantity,
          price: unitPrice,
          subtotal: unitPrice * quantity,
        });
      }

      fallbackStore.saveCart(cart);
      return this.getCart(userId);
    }
  }

  /**
   * Update quantity of item in cart
   */
  static async updateItemQuantity(userId: string, bookId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, bookId);
    }

    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const user = await User.findById(userId);
      if (!user) throw new ApiError(404, 'User account not found.');

      const book = await Book.findById(bookId);
      if (!book) throw new ApiError(404, 'Book not found.');

      if (quantity > book.stockQuantity) {
        throw new ApiError(400, `Cannot set quantity to ${quantity}. Stock limit is ${book.stockQuantity}.`);
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) throw new ApiError(404, 'Cart not found.');

      const itemIndex = cart.items.findIndex((item) => item.bookId.toString() === bookId);
      if (itemIndex === -1) {
        throw new ApiError(404, 'Book not found in cart.');
      }

      const unitPrice = this.determineUnitPrice(user, book);
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = unitPrice;
      cart.items[itemIndex].subtotal = unitPrice * quantity;

      await cart.save();
      return this.getCart(userId);
    } else {
      const user = fallbackStore.findUserById(userId);
      if (!user) throw new ApiError(404, 'User account not found.');

      const book = fallbackStore.findBookById(bookId);
      if (!book) throw new ApiError(404, 'Book not found.');

      if (quantity > book.stockQuantity) {
        throw new ApiError(400, `Cannot set quantity to ${quantity}. Stock limit is ${book.stockQuantity}.`);
      }

      const cart = fallbackStore.getCartByUserId(userId);
      const itemIndex = cart.items.findIndex((item) => item.bookId === bookId);
      if (itemIndex === -1) {
        throw new ApiError(404, 'Book not found in cart.');
      }

      const unitPrice = this.determineUnitPrice(user, book);
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = unitPrice;
      cart.items[itemIndex].subtotal = unitPrice * quantity;

      fallbackStore.saveCart(cart);
      return this.getCart(userId);
    }
  }

  /**
   * Remove item from cart
   */
  static async removeItem(userId: string, bookId: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const cart = await Cart.findOne({ userId });
      if (cart) {
        cart.items = cart.items.filter((item) => item.bookId.toString() !== bookId);
        await cart.save();
      }
      return this.getCart(userId);
    } else {
      const cart = fallbackStore.getCartByUserId(userId);
      cart.items = cart.items.filter((item) => item.bookId !== bookId);
      fallbackStore.saveCart(cart);
      return this.getCart(userId);
    }
  }

  /**
   * Clear user's cart
   */
  static async clearCart(userId: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const cart = await Cart.findOne({ userId });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
      return this.getCart(userId);
    } else {
      fallbackStore.clearCart(userId);
      return this.getCart(userId);
    }
  }
}
