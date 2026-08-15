import { Book, IBook } from '../models/Book.js';
import { Category } from '../models/Category.js';
import { BookInput } from '../validators/bookValidator.js';
import { ApiError } from '../utils/apiError.js';
import { getDbStatus } from '../config/db.js';
import { fallbackStore } from './fallbackStore.js';

export interface BookQueryOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export class BookService {
  /**
   * Helper to format book pricing based on user authorization
   * Hides wholesale price if user is not an approved wholesale customer
   */
  public static formatBookForUser(bookObj: any, user?: any) {
    const isApprovedWholesale =
      user && user.role === 'wholesale' && user.wholesaleStatus === 'approved';
    const isAdmin = user && user.role === 'admin';

    const plainBook = typeof bookObj.toObject === 'function' ? bookObj.toObject() : { ...bookObj };

    const effectivePrice = isApprovedWholesale ? plainBook.wholesalePrice : plainBook.regularPrice;

    if (!isApprovedWholesale && !isAdmin) {
      delete plainBook.wholesalePrice;
    }

    return {
      ...plainBook,
      price: effectivePrice,
      effectivePrice,
      isWholesaleDiscounted: isApprovedWholesale,
    };
  }

  /**
   * Get paginated books with search, filter, and sorting
   */
  static async getBooks(options: BookQueryOptions, currentUser?: any) {
    const dbState = getDbStatus();
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const filter: any = {};

      if (options.search) {
        const searchRegex = new RegExp(options.search, 'i');
        filter.$or = [
          { title: searchRegex },
          { author: searchRegex },
          { isbn: searchRegex },
          { publisher: searchRegex },
        ];
      }

      if (options.category) {
        // Find category by ID or slug
        let catId = options.category;
        if (!options.category.match(/^[0-9a-fA-F]{24}$/)) {
          const categoryObj = await Category.findOne({ slug: options.category });
          if (categoryObj) catId = categoryObj._id.toString();
        }
        filter.category = catId;
      }

      if (options.minPrice !== undefined || options.maxPrice !== undefined) {
        filter.regularPrice = {};
        if (options.minPrice !== undefined) filter.regularPrice.$gte = Number(options.minPrice);
        if (options.maxPrice !== undefined) filter.regularPrice.$lte = Number(options.maxPrice);
      }

      // Sort
      let sortQuery: any = { createdAt: -1 };
      if (options.sortBy === 'price_asc') sortQuery = { regularPrice: 1 };
      else if (options.sortBy === 'price_desc') sortQuery = { regularPrice: -1 };
      else if (options.sortBy === 'title_asc') sortQuery = { title: 1 };
      else if (options.sortBy === 'title_desc') sortQuery = { title: -1 };

      const total = await Book.countDocuments(filter);
      const rawBooks = await Book.find(filter)
        .populate('category', 'name slug icon')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

      const formattedBooks = rawBooks.map((b) => this.formatBookForUser(b, currentUser));

      const totalPages = Math.ceil(total / limit) || 1;

      return {
        books: formattedBooks,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } else {
      // Fallback engine
      const result = fallbackStore.getBooks({
        search: options.search,
        category: options.category,
        minPrice: options.minPrice,
        maxPrice: options.maxPrice,
        sortBy: options.sortBy,
        page,
        limit,
      });

      const formattedBooks = result.books.map((b) => this.formatBookForUser(b, currentUser));

      return {
        books: formattedBooks,
        pagination: result.pagination,
      };
    }
  }

  /**
   * Get single book details
   */
  static async getBookById(id: string, currentUser?: any) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const book = await Book.findById(id).populate('category', 'name slug icon');
      if (!book) {
        throw new ApiError(404, 'Book not found.');
      }
      return this.formatBookForUser(book, currentUser);
    } else {
      const book = fallbackStore.getBookById(id);
      if (!book) {
        throw new ApiError(404, 'Book not found.');
      }
      return this.formatBookForUser(book, currentUser);
    }
  }

  /**
   * Create book (Admin only)
   */
  static async createBook(input: BookInput, coverImageUrl?: string) {
    const dbState = getDbStatus();
    const finalCoverImage = coverImageUrl || input.coverImage;

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      // Check ISBN & SKU uniqueness
      const existingIsbn = await Book.findOne({ isbn: input.isbn });
      if (existingIsbn) {
        throw new ApiError(400, 'A book with this ISBN already exists.');
      }

      const existingSku = await Book.findOne({ sku: input.sku });
      if (existingSku) {
        throw new ApiError(400, 'A book with this SKU already exists.');
      }

      // Verify category exists
      const categoryExists = await Category.findById(input.category);
      if (!categoryExists) {
        throw new ApiError(400, 'Specified category does not exist.');
      }

      const book = new Book({
        ...input,
        coverImage: finalCoverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        status: input.stockQuantity <= 0 ? 'out_of_stock' : input.status || 'active',
      });

      await book.save();
      return book;
    } else {
      const existingIsbn = fallbackStore.getBooks({}).books.find((b) => b.isbn === input.isbn);
      if (existingIsbn) {
        throw new ApiError(400, 'A book with this ISBN already exists.');
      }

      return fallbackStore.createBook({
        title: input.title,
        author: input.author,
        isbn: input.isbn,
        description: input.description,
        category: input.category,
        publisher: input.publisher || '',
        edition: input.edition || '',
        language: input.language || 'Nepali',
        regularPrice: Number(input.regularPrice),
        wholesalePrice: Number(input.wholesalePrice),
        stockQuantity: Number(input.stockQuantity),
        sku: input.sku,
        coverImage: finalCoverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        status: Number(input.stockQuantity) <= 0 ? 'out_of_stock' : input.status || 'active',
      });
    }
  }

  /**
   * Update book (Admin only)
   */
  static async updateBook(id: string, input: Partial<BookInput>, coverImageUrl?: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const book = await Book.findById(id);
      if (!book) {
        throw new ApiError(404, 'Book not found.');
      }

      if (input.isbn && input.isbn !== book.isbn) {
        const existingIsbn = await Book.findOne({ isbn: input.isbn, _id: { $ne: id } });
        if (existingIsbn) throw new ApiError(400, 'Another book with this ISBN already exists.');
      }

      if (input.sku && input.sku !== book.sku) {
        const existingSku = await Book.findOne({ sku: input.sku, _id: { $ne: id } });
        if (existingSku) throw new ApiError(400, 'Another book with this SKU already exists.');
      }

      if (coverImageUrl) {
        book.coverImage = coverImageUrl;
      }

      Object.assign(book, input);

      if (input.stockQuantity !== undefined) {
        if (input.stockQuantity <= 0 && book.status !== 'discontinued') {
          book.status = 'out_of_stock';
        } else if (input.stockQuantity > 0 && book.status === 'out_of_stock') {
          book.status = 'active';
        }
      }

      await book.save();
      return book;
    } else {
      const updated = fallbackStore.updateBook(id, {
        ...input,
        ...(coverImageUrl ? { coverImage: coverImageUrl } : {}),
      });

      if (!updated) {
        throw new ApiError(404, 'Book not found.');
      }
      return updated;
    }
  }

  /**
   * Delete book (Admin only)
   */
  static async deleteBook(id: string) {
    const dbState = getDbStatus();

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      const book = await Book.findByIdAndDelete(id);
      if (!book) {
        throw new ApiError(404, 'Book not found.');
      }
      return true;
    } else {
      const deleted = fallbackStore.deleteBook(id);
      if (!deleted) {
        throw new ApiError(404, 'Book not found.');
      }
      return true;
    }
  }
}
