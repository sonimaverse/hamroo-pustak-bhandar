export interface Book {
  id: string;
  title: string;
  retailPrice: number;
  wholesalePrice: number;
  isNew?: boolean;
  coverFrom?: string;
  coverTo?: string;
  textColor?: string;
  category: string;
  stock: number;
  description?: string;
  image?: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface StationeryItem {
  id: string;
  name: string;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  icon: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
  priceMode: 'retail' | 'wholesale';
}

export interface User {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'guest' | 'wholesale_pending' | 'wholesale_approved' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  businessName?: string;
  panVatNumber?: string;
  address?: string;
  documents?: { type: string; fileName: string; url: string; publicId: string }[];
  rejectionReason?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  imagePublicId?: string;
  retailPrice: number;
  wholesalePrice: number;
  stockQuantity: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}