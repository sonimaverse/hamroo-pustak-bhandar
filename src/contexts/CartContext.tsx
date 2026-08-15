import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Cart, CartItem } from '../types/cart';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

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

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (bookId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.addItem(bookId, quantity);
      setCart(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bookId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.updateQuantity(bookId, quantity);
      setCart(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update quantity';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (bookId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.removeItem(bookId);
      setCart(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to remove item';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.clearCart();
      setCart(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to clear cart';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0;
  const totalAmount = cart?.totalAmount || 0;

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
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
