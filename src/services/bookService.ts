import { apiClient } from './apiClient';
import { ApiResponse } from '../types/auth';
import { Book, BookListResponse } from '../types/book';

export interface GetBooksParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const bookService = {
  getBooks: async (params?: GetBooksParams): Promise<BookListResponse> => {
    const res = await apiClient.get<ApiResponse<BookListResponse>>('/books', { params });
    return res.data.data;
  },

  getBookById: async (id: string): Promise<{ book: Book }> => {
    const res = await apiClient.get<ApiResponse<{ book: Book }>>(`/books/${id}`);
    return res.data.data;
  },

  createBook: async (formData: FormData): Promise<{ book: Book }> => {
    const res = await apiClient.post<ApiResponse<{ book: Book }>>('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  updateBook: async (id: string, formData: FormData): Promise<{ book: Book }> => {
    const res = await apiClient.put<ApiResponse<{ book: Book }>>(`/books/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  deleteBook: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<ApiResponse<{ message: string }>>(`/books/${id}`);
    return res.data.data;
  },
};
