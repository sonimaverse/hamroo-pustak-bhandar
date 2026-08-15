export interface CartItem {
  bookId: string;
  title: string;
  author: string;
  coverImage?: string;
  stockQuantity: number;
  status: string;
  quantity: number;
  regularPrice: number;
  wholesalePrice?: number;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  cartId: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt: string;
}
