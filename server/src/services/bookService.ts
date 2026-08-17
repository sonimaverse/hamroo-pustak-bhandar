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
   * Format book pricing based on user authorization.
   * Wholesale price is hidden from normal customers.
   */
  public static formatBookForUser(
    bookObj: any,
    user?: any
  ) {
    const isApprovedWholesale =
      user &&
      user.role === 'wholesale' &&
      user.wholesaleStatus === 'approved';

    const isAdmin =
      user && user.role === 'admin';

    const plainBook =
      typeof bookObj.toObject === 'function'
        ? bookObj.toObject()
        : { ...bookObj };

    const effectivePrice =
      isApprovedWholesale
        ? plainBook.wholesalePrice
        : plainBook.regularPrice;

    if (!isApprovedWholesale && !isAdmin) {
      delete plainBook.wholesalePrice;
    }

    return {
      ...plainBook,
      price: effectivePrice,
      effectivePrice,
      isWholesaleDiscounted:
        isApprovedWholesale,
    };
  }

  /**
   * Get paginated books.
   */
  static async getBooks(
    options: BookQueryOptions,
    currentUser?: any
  ) {
    const dbState = getDbStatus();

    const page = Math.max(
      1,
      Number(options.page) || 1
    );

    const limit = Math.max(
      1,
      Number(options.limit) || 10
    );

    const skip = (page - 1) * limit;

    // =========================
    // MONGODB
    // =========================
    if (
      dbState.mode === 'mongodb_atlas' &&
      dbState.isConnected
    ) {
      const filter: any = {};

      // Search
      if (options.search) {
        const searchRegex = new RegExp(
          options.search,
          'i'
        );

        filter.$or = [
          { title: searchRegex },
          { author: searchRegex },
          { isbn: searchRegex },
          { sku: searchRegex },
          { publisher: searchRegex },
        ];
      }

      // Category
      if (options.category) {
        let catId = options.category;

        if (
          !options.category.match(
            /^[0-9a-fA-F]{24}$/
          )
        ) {
          const categoryObj =
            await Category.findOne({
              slug: options.category,
            });

          if (categoryObj) {
            catId =
              categoryObj._id.toString();
          }
        }

        filter.category = catId;
      }

      // Price filter
      if (
        options.minPrice !== undefined ||
        options.maxPrice !== undefined
      ) {
        filter.regularPrice = {};

        if (
          options.minPrice !== undefined
        ) {
          filter.regularPrice.$gte =
            Number(options.minPrice);
        }

        if (
          options.maxPrice !== undefined
        ) {
          filter.regularPrice.$lte =
            Number(options.maxPrice);
        }
      }

      // Sorting
      let sortQuery: any = {
        createdAt: -1,
      };

      if (
        options.sortBy === 'price_asc'
      ) {
        sortQuery = {
          regularPrice: 1,
        };
      } else if (
        options.sortBy === 'price_desc'
      ) {
        sortQuery = {
          regularPrice: -1,
        };
      } else if (
        options.sortBy === 'title_asc'
      ) {
        sortQuery = {
          title: 1,
        };
      } else if (
        options.sortBy === 'title_desc'
      ) {
        sortQuery = {
          title: -1,
        };
      }

      const total =
        await Book.countDocuments(filter);

      const rawBooks =
        await Book.find(filter)
          .populate(
            'category',
            'name slug icon'
          )
          .sort(sortQuery)
          .skip(skip)
          .limit(limit);

      const formattedBooks =
        rawBooks.map((book) =>
          this.formatBookForUser(
            book,
            currentUser
          )
        );

      const totalPages =
        Math.ceil(total / limit) || 1;

      return {
        books: formattedBooks,

        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNext:
            page < totalPages,
          hasPrev:
            page > 1,
        },
      };
    }

    // =========================
    // FALLBACK STORE
    // =========================
    const result =
      fallbackStore.getBooks({
        search: options.search,
        category: options.category,
        minPrice: options.minPrice,
        maxPrice: options.maxPrice,
        sortBy: options.sortBy,
        page,
        limit,
      });

    const formattedBooks =
      result.books.map((book) =>
        this.formatBookForUser(
          book,
          currentUser
        )
      );

    return {
      books: formattedBooks,
      pagination: result.pagination,
    };
  }

  /**
   * Get single book.
   */
  static async getBookById(
    id: string,
    currentUser?: any
  ) {
    const dbState = getDbStatus();

    if (
      dbState.mode === 'mongodb_atlas' &&
      dbState.isConnected
    ) {
      const book =
        await Book.findById(id).populate(
          'category',
          'name slug icon'
        );

      if (!book) {
        throw new ApiError(
          404,
          'Book not found.'
        );
      }

      return this.formatBookForUser(
        book,
        currentUser
      );
    }

    const book =
      fallbackStore.getBookById(id);

    if (!book) {
      throw new ApiError(
        404,
        'Book not found.'
      );
    }

    return this.formatBookForUser(
      book,
      currentUser
    );
  }

  /**
   * Create book.
   *
   * ISBN and SKU are OPTIONAL.
   */
  static async createBook(
    input: BookInput,
    coverImageUrl?: string
  ) {
    const dbState = getDbStatus();

    const finalCoverImage =
      coverImageUrl ||
      input.coverImage;

    // =========================
    // MONGODB
    // =========================
    if (
      dbState.mode === 'mongodb_atlas' &&
      dbState.isConnected
    ) {
      // -------------------------
      // OPTIONAL ISBN CHECK
      // -------------------------
      if (input.isbn?.trim()) {
        const existingIsbn =
          await Book.findOne({
            isbn: input.isbn.trim(),
          });

        if (existingIsbn) {
          throw new ApiError(
            400,
            'A book with this ISBN already exists.'
          );
        }
      }

      // -------------------------
      // OPTIONAL SKU CHECK
      // -------------------------
      if (input.sku?.trim()) {
        const existingSku =
          await Book.findOne({
            sku: input.sku.trim(),
          });

        if (existingSku) {
          throw new ApiError(
            400,
            'A book with this SKU already exists.'
          );
        }
      }

      // -------------------------
      // CATEGORY CHECK
      // -------------------------
      const categoryExists =
        await Category.findById(
          input.category
        );

      if (!categoryExists) {
        throw new ApiError(
          400,
          'Specified category does not exist.'
        );
      }

      // -------------------------
      // CREATE BOOK DATA
      // -------------------------
      const bookData: any = {
        title: input.title,
        author: input.author,
        description: input.description,
        category: input.category,

        publisher:
          input.publisher || '',

        edition:
          input.edition || '',

        language:
          input.language || 'Nepali',

        regularPrice:
          Number(input.regularPrice),

        wholesalePrice:
          Number(input.wholesalePrice),

        stockQuantity:
          Number(input.stockQuantity),

        coverImage:
          finalCoverImage ||
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',

        status:
          Number(input.stockQuantity) <= 0
            ? 'out_of_stock'
            : input.status || 'active',
      };

      // -------------------------
      // ONLY ADD ISBN IF PROVIDED
      // -------------------------
      if (input.isbn?.trim()) {
        bookData.isbn =
          input.isbn.trim();
      }

      // -------------------------
      // ONLY ADD SKU IF PROVIDED
      // -------------------------
      if (input.sku?.trim()) {
        bookData.sku =
          input.sku.trim().toUpperCase();
      }

      const book =
        new Book(bookData);

      await book.save();

      return book;
    }

    // =========================
    // FALLBACK STORE
    // =========================

    // Optional ISBN uniqueness
    if (input.isbn?.trim()) {
      const existingIsbn =
        fallbackStore
          .getBooks({})
          .books.find(
            (b) =>
              b.isbn === input.isbn
          );

      if (existingIsbn) {
        throw new ApiError(
          400,
          'A book with this ISBN already exists.'
        );
      }
    }

    // Optional SKU uniqueness
    if (input.sku?.trim()) {
      const existingSku =
        fallbackStore
          .getBooks({})
          .books.find(
            (b) =>
              b.sku === input.sku
          );

      if (existingSku) {
        throw new ApiError(
          400,
          'A book with this SKU already exists.'
        );
      }
    }

    const fallbackData: any = {
      title: input.title,
      author: input.author,

      description:
        input.description,

      category:
        input.category,

      publisher:
        input.publisher || '',

      edition:
        input.edition || '',

      language:
        input.language || 'Nepali',

      regularPrice:
        Number(input.regularPrice),

      wholesalePrice:
        Number(input.wholesalePrice),

      stockQuantity:
        Number(input.stockQuantity),

      coverImage:
        finalCoverImage ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',

      status:
        Number(input.stockQuantity) <= 0
          ? 'out_of_stock'
          : input.status || 'active',
    };

    // Optional ISBN
    if (input.isbn?.trim()) {
      fallbackData.isbn =
        input.isbn.trim();
    }

    // Optional SKU
    if (input.sku?.trim()) {
      fallbackData.sku =
        input.sku.trim().toUpperCase();
    }

    return fallbackStore.createBook(
      fallbackData
    );
  }

  /**
   * Update book.
   *
   * ISBN and SKU remain optional.
   */
  static async updateBook(
    id: string,
    input: Partial<BookInput>,
    coverImageUrl?: string
  ) {
    const dbState = getDbStatus();

    // =========================
    // MONGODB
    // =========================
    if (
      dbState.mode === 'mongodb_atlas' &&
      dbState.isConnected
    ) {
      const book =
        await Book.findById(id);

      if (!book) {
        throw new ApiError(
          404,
          'Book not found.'
        );
      }

      // -------------------------
      // ISBN uniqueness
      // -------------------------
      if (
        input.isbn?.trim() &&
        input.isbn.trim() !== book.isbn
      ) {
        const existingIsbn =
          await Book.findOne({
            isbn: input.isbn.trim(),
            _id: { $ne: id },
          });

        if (existingIsbn) {
          throw new ApiError(
            400,
            'Another book with this ISBN already exists.'
          );
        }
      }

      // -------------------------
      // SKU uniqueness
      // -------------------------
      if (
        input.sku?.trim() &&
        input.sku.trim() !== book.sku
      ) {
        const existingSku =
          await Book.findOne({
            sku: input.sku.trim(),
            _id: { $ne: id },
          });

        if (existingSku) {
          throw new ApiError(
            400,
            'Another book with this SKU already exists.'
          );
        }
      }

      // -------------------------
      // Cover image
      // -------------------------
      if (coverImageUrl) {
        book.coverImage =
          coverImageUrl;
      }

      // -------------------------
      // Build update data
      // -------------------------
      const updateData: any = {
        ...input,
      };

      // If ISBN is empty, remove it
      if (
        input.isbn !== undefined &&
        !input.isbn.trim()
      ) {
        updateData.$unset = {
          ...(updateData.$unset || {}),
          isbn: 1,
        };

        delete updateData.isbn;
      }

      // If SKU is empty, remove it
      if (
        input.sku !== undefined &&
        !input.sku.trim()
      ) {
        updateData.$unset = {
          ...(updateData.$unset || {}),
          sku: 1,
        };

        delete updateData.sku;
      }

      // Normalize SKU
      if (input.sku?.trim()) {
        updateData.sku =
          input.sku
            .trim()
            .toUpperCase();
      }

      // Normalize ISBN
      if (input.isbn?.trim()) {
        updateData.isbn =
          input.isbn.trim();
      }

      // -------------------------
      // Apply normal fields
      // -------------------------
      Object.keys(updateData).forEach(
        (key) => {
          if (
            key !== '$unset'
          ) {
            (book as any)[key] =
              updateData[key];
          }
        }
      );

      // -------------------------
      // Remove optional fields
      // -------------------------
      if (
        updateData.$unset?.isbn
      ) {
        (book as any).isbn =
          undefined;
      }

      if (
        updateData.$unset?.sku
      ) {
        (book as any).sku =
          undefined;
      }

      // -------------------------
      // Stock status
      // -------------------------
      if (
        input.stockQuantity !==
        undefined
      ) {
        if (
          input.stockQuantity <= 0 &&
          book.status !==
            'discontinued'
        ) {
          book.status =
            'out_of_stock';
        } else if (
          input.stockQuantity > 0 &&
          book.status ===
            'out_of_stock'
        ) {
          book.status = 'active';
        }
      }

      await book.save();

      return book;
    }

    // =========================
    // FALLBACK STORE
    // =========================
    const updateData: any = {
      ...input,
      ...(coverImageUrl
        ? {
            coverImage:
              coverImageUrl,
          }
        : {}),
    };

    // Normalize optional fields
    if (
      input.isbn !== undefined
    ) {
      updateData.isbn =
        input.isbn.trim()
          ? input.isbn.trim()
          : undefined;
    }

    if (
      input.sku !== undefined
    ) {
      updateData.sku =
        input.sku.trim()
          ? input.sku
              .trim()
              .toUpperCase()
          : undefined;
    }

    const updated =
      fallbackStore.updateBook(
        id,
        updateData
      );

    if (!updated) {
      throw new ApiError(
        404,
        'Book not found.'
      );
    }

    return updated;
  }

  /**
   * Delete book.
   */
  static async deleteBook(
    id: string
  ) {
    const dbState = getDbStatus();

    if (
      dbState.mode === 'mongodb_atlas' &&
      dbState.isConnected
    ) {
      const book =
        await Book.findByIdAndDelete(
          id
        );

      if (!book) {
        throw new ApiError(
          404,
          'Book not found.'
        );
      }

      return true;
    }

    const deleted =
      fallbackStore.deleteBook(id);

    if (!deleted) {
      throw new ApiError(
        404,
        'Book not found.'
      );
    }

    return true;
  }
}