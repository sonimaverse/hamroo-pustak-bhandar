import { Category } from './category';

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  category: Category | string;
  publisher?: string;
  edition?: string;
  language: string;
  coverImage?: string;
  regularPrice: number;
  wholesalePrice?: number;
  price?: number;
  effectivePrice?: number;
  isWholesaleDiscounted?: boolean;
  stockQuantity: number;
  sku: string;
  status: 'active' | 'out_of_stock' | 'discontinued';
  createdAt?: string;
  updatedAt?: string;
}

export interface BookListResponse {
  books: Book[];
  pagination: {
    totalBooks: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
