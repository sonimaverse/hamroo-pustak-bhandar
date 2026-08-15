import { Response, NextFunction } from 'express';
import { BookService, BookQueryOptions } from '../services/bookService.js';
import { bookSchema, updateBookSchema } from '../validators/bookValidator.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

export class BookController {
  /**
   * GET /api/books
   * Public book listing with search, category filter, min/max price, sorting, pagination
   */
  static async getBooks(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const options: BookQueryOptions = {
        search: req.query.search as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        sortBy: req.query.sortBy as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const result = await BookService.getBooks(options, req.user);

      res.status(200).json(
        new ApiResponse(200, result, 'Books retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/books/:id
   * Public book details
   */
  static async getBookById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const book = await BookService.getBookById(id, req.user);

      res.status(200).json(
        new ApiResponse(200, { book }, 'Book details retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/books
   * Admin-only book creation (supports cover image file upload)
   */
  static async createBook(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let coverImageUrl: string | undefined;

      if (req.file) {
        coverImageUrl = await uploadToCloudinary(req.file.buffer, 'hamro_pustak_bhandar/covers');
      }

      const validatedInput = bookSchema.parse(req.body);
      const book = await BookService.createBook(validatedInput, coverImageUrl);

      res.status(201).json(
        new ApiResponse(201, { book }, 'Book created successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/books/:id
   * Admin-only book update (supports cover image file upload)
   */
  static async updateBook(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      let coverImageUrl: string | undefined;

      if (req.file) {
        coverImageUrl = await uploadToCloudinary(req.file.buffer, 'hamro_pustak_bhandar/covers');
      }

      const validatedInput = updateBookSchema.parse(req.body);
      const book = await BookService.updateBook(id, validatedInput, coverImageUrl);

      res.status(200).json(
        new ApiResponse(200, { book }, 'Book updated successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/books/:id
   * Admin-only book deletion
   */
  static async deleteBook(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await BookService.deleteBook(id);

      res.status(200).json(
        new ApiResponse(200, null, 'Book deleted successfully.')
      );
    } catch (error) {
      next(error);
    }
  }
}
