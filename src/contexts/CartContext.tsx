import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Cart, CartItem } from '../types/cart';
import { cartService } from '../services/cartService';
import { bookService } from '../services/bookService';
import { useAuth } from './AuthContext';

const GUEST_CART_KEY = 'hamro_guest_cart';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  itemCount: number;
  totalAmount: number;
  fetchCart: () => Promise<void>;
  addItem: (bookId: string, quantity: number) => Promise<void>;
  addToCart: (bookId: string, quantity: number) => Promise<void>;
  updateQuantity: (bookId: string, quantity: number) => Promise<void>;
  removeItem: (bookId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Load guest cart from browser localStorage.
 *
 * Guest customers do NOT need an account.
 * Their cart is stored locally until they place the order.
 */
const loadGuestCartFromStorage = (): Cart => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);

      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error(
      'Failed to parse guest cart from localStorage:',
      err
    );
  }

  return {
    cartId: 'guest-cart',
    userId: 'guest',
    items: [],
    totalAmount: 0,
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Save guest cart to browser localStorage.
 */
const saveGuestCartToStorage = (cart: Cart) => {
  try {
    localStorage.setItem(
      GUEST_CART_KEY,
      JSON.stringify(cart)
    );
  } catch (err) {
    console.error(
      'Failed to save guest cart to localStorage:',
      err
    );
  }
};

export const CartProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sync a guest cart into the authenticated user's
   * backend cart after login.
   */
  const syncGuestCartToBackend = async () => {
    const guestCart = loadGuestCartFromStorage();

    if (!guestCart.items || guestCart.items.length === 0) {
      return;
    }

    for (const item of guestCart.items) {
      try {
        await cartService.addItem(
          item.bookId,
          item.quantity
        );
      } catch (err) {
        console.error(
          `Failed to sync guest cart item ${item.bookId}:`,
          err
        );
      }
    }

    localStorage.removeItem(GUEST_CART_KEY);
  };

  /**
   * Fetch the correct cart depending on authentication state.
   *
   * Guest:
   *   localStorage cart
   *
   * Logged-in:
   *   backend cart
   */
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      const guestCart = loadGuestCartFromStorage();

      setCart(guestCart);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await syncGuestCartToBackend();

      const data = await cartService.getCart();

      setCart(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to fetch cart'
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /**
   * Add book to cart.
   *
   * Guest:
   *   - Uses localStorage
   *   - ALWAYS uses regularPrice
   *   - Never receives wholesale pricing
   *
   * Logged-in:
   *   - Uses backend cart
   *   - Backend determines whether user gets
   *     regular or approved wholesale pricing
   */
  const addItem = async (
    bookId: string,
    quantity: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      /**
       * AUTHENTICATED CUSTOMER
       *
       * The backend is responsible for deciding
       * regular vs wholesale pricing.
       */
      if (isAuthenticated && token) {
        const data = await cartService.addItem(
          bookId,
          quantity
        );

        setCart(data);
        return;
      }

      /**
       * GUEST CUSTOMER
       *
       * Guest cart lives in localStorage.
       */
      const currentCart =
        cart || loadGuestCartFromStorage();

      const { book } =
        await bookService.getBookById(bookId);

      if (!book) {
        throw new Error('Book not found.');
      }

      if (
        book.status === 'out_of_stock' ||
        book.stockQuantity <= 0
      ) {
        throw new Error(
          `Book "${book.title}" is out of stock.`
        );
      }

      const existingIndex =
        currentCart.items.findIndex(
          item => item.bookId === bookId
        );

      let newItems = [...currentCart.items];

      /**
       * IMPORTANT:
       *
       * Guest customers ALWAYS receive regular price.
       *
       * Do NOT use:
       *   book.effectivePrice
       *
       * here because that could expose a wholesale/
       * special price to an unauthenticated customer.
       */
      const unitPrice = book.regularPrice;

      /**
       * EXISTING CART ITEM
       */
      if (existingIndex > -1) {
        const currentQty =
          newItems[existingIndex].quantity;

        const newQty =
          currentQty + quantity;

        if (newQty > book.stockQuantity) {
          throw new Error(
            `Insufficient stock. Requested ${newQty}, available ${book.stockQuantity}.`
          );
        }

        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newQty,
          unitPrice,
          subtotal: unitPrice * newQty,
        };
      } else {
        /**
         * NEW CART ITEM
         */
        if (quantity > book.stockQuantity) {
          throw new Error(
            `Insufficient stock. Requested ${quantity}, available ${book.stockQuantity}.`
          );
        }

        const newItem: CartItem = {
          bookId: book._id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          stockQuantity: book.stockQuantity,
          status: book.status || 'in_stock',
          quantity,

          regularPrice: book.regularPrice,

          /**
           * Keep wholesalePrice in the cart data
           * so the UI can know that the book has
           * a wholesale rate.
           *
           * It is NOT used as guest unitPrice.
           */
          wholesalePrice: book.wholesalePrice,

          unitPrice,

          subtotal: unitPrice * quantity,
        };

        newItems.push(newItem);
      }

      /**
       * Recalculate guest cart total.
       */
      const totalAmount = newItems.reduce(
        (sum, item) =>
          sum + item.subtotal,
        0
      );

      const updatedCart: Cart = {
        cartId: 'guest-cart',
        userId: 'guest',
        items: newItems,
        totalAmount,
        updatedAt: new Date().toISOString(),
      };

      saveGuestCartToStorage(updatedCart);

      setCart(updatedCart);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to add item to cart';

      setError(msg);

      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update quantity.
   */
  const updateQuantity = async (
    bookId: string,
    quantity: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      /**
       * AUTHENTICATED CUSTOMER
       */
      if (isAuthenticated && token) {
        const data =
          await cartService.updateQuantity(
            bookId,
            quantity
          );

        setCart(data);
        return;
      }

      /**
       * GUEST CUSTOMER
       */
      const currentCart =
        cart || loadGuestCartFromStorage();

      const existingIndex =
        currentCart.items.findIndex(
          item => item.bookId === bookId
        );

      if (existingIndex === -1) {
        return;
      }

      const item =
        currentCart.items[existingIndex];

      if (quantity > item.stockQuantity) {
        throw new Error(
          `Insufficient stock. Requested ${quantity}, available ${item.stockQuantity}.`
        );
      }

      let newItems = [...currentCart.items];

      /**
       * Remove item if quantity becomes 0 or less.
       */
      if (quantity <= 0) {
        newItems = newItems.filter(
          item => item.bookId !== bookId
        );
      } else {
        /**
         * Guest cart always keeps regular price.
         */
        const unitPrice =
          item.regularPrice;

        newItems[existingIndex] = {
          ...item,
          quantity,
          unitPrice,
          subtotal:
            unitPrice * quantity,
        };
      }

      const totalAmount = newItems.reduce(
        (sum, item) =>
          sum + item.subtotal,
        0
      );

      const updatedCart: Cart = {
        cartId: 'guest-cart',
        userId: 'guest',
        items: newItems,
        totalAmount,
        updatedAt: new Date().toISOString(),
      };

      saveGuestCartToStorage(updatedCart);

      setCart(updatedCart);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to update quantity';

      setError(msg);

      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove item from cart.
   */
  const removeItem = async (
    bookId: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      /**
       * AUTHENTICATED CUSTOMER
       */
      if (isAuthenticated && token) {
        const data =
          await cartService.removeItem(bookId);

        setCart(data);
        return;
      }

      /**
       * GUEST CUSTOMER
       */
      const currentCart =
        cart || loadGuestCartFromStorage();

      const newItems =
        currentCart.items.filter(
          item => item.bookId !== bookId
        );

      const totalAmount = newItems.reduce(
        (sum, item) =>
          sum + item.subtotal,
        0
      );

      const updatedCart: Cart = {
        cartId: 'guest-cart',
        userId: 'guest',
        items: newItems,
        totalAmount,
        updatedAt: new Date().toISOString(),
      };

      saveGuestCartToStorage(updatedCart);

      setCart(updatedCart);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to remove item';

      setError(msg);

      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear entire cart.
   */
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      /**
       * AUTHENTICATED CUSTOMER
       */
      if (isAuthenticated && token) {
        const data =
          await cartService.clearCart();

        setCart(data);
        return;
      }

      /**
       * GUEST CUSTOMER
       */
      const updatedCart: Cart = {
        cartId: 'guest-cart',
        userId: 'guest',
        items: [],
        totalAmount: 0,
        updatedAt: new Date().toISOString(),
      };

      saveGuestCartToStorage(updatedCart);

      setCart(updatedCart);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to clear cart';

      setError(msg);

      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Derived cart values.
   */
  const itemCount =
    cart?.items?.reduce(
      (sum: number, item: CartItem) =>
        sum + item.quantity,
      0
    ) || 0;

  const totalAmount =
    cart?.totalAmount || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        itemCount,
        totalAmount,
        fetchCart,
        addItem,
        addToCart: addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider'
    );
  }

  return context;
};