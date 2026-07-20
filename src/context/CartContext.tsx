import { createContext, useContext, useState, ReactNode } from 'react';
import { Book } from '../types';

export interface CartItem {
  book: Book;
  quantity: number;
  priceMode: 'retail' | 'wholesale';
}

interface CartContextType {
  items: CartItem[];
  addItem: (book: Book, priceMode: 'retail' | 'wholesale') => boolean;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (book: Book, priceMode: 'retail' | 'wholesale') => {
    if (book.stock <= 0) return false;

    setItems((prev) => {
      const existing = prev.find((item) => item.book.id === book.id && item.priceMode === priceMode);
      if (existing) {
        if (existing.quantity >= book.stock) return prev;
        return prev.map((item) =>
          item.book.id === book.id && item.priceMode === priceMode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1, priceMode }];
    });
    return true;
  };

  const removeItem = (bookId: string) => {
    setItems((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    const item = items.find((i) => i.book.id === bookId);
    if (item && quantity > item.book.stock) {
      quantity = item.book.stock;
    }
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.book.id !== bookId));
    } else {
      setItems((prev) =>
        prev.map((item) => (item.book.id === bookId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.priceMode === 'wholesale' ? item.book.wholesalePrice : item.book.retailPrice;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}