import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import wholesaleRoutes from './routes/wholesaleRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';

import { ApiError } from './utils/apiError.js';

export const createApp = (): Application => {
  const app: Application = express();

  // =========================================================
  // SECURITY
  // =========================================================

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // =========================================================
  // CORS
  // =========================================================

  app.use(
    cors({
      origin: process.env.CLIENT_URL || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // =========================================================
  // BODY PARSING
  // =========================================================

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // =========================================================
  // API ROUTES
  // =========================================================

  app.use('/api/health', healthRoutes);

  app.use('/api/auth', authRoutes);

  app.use('/api/categories', categoryRoutes);

  app.use('/api/books', bookRoutes);

  app.use('/api/wholesale', wholesaleRoutes);

  app.use('/api/admin', adminRoutes);

  app.use('/api/cart', cartRoutes);

  app.use('/api/orders', orderRoutes);

  app.use('/api/enquiries', enquiryRoutes);

  app.use('/api/quotations', quotationRoutes);

  // =========================================================
  // UNKNOWN API ROUTES
  // =========================================================
  // Only API URLs should receive API 404 errors.
  // Frontend routes such as /admin, /shop, /login etc.
  // must NOT be handled here.

  app.all(
    '/api/*',
    (req: Request, res: Response, next: NextFunction) => {
      next(
        new ApiError(
          404,
          `Cannot find endpoint ${req.originalUrl} on this server.`
        )
      );
    }
  );

  // =========================================================
  // IMPORTANT
  // =========================================================
  // DO NOT put the global errorHandler here.
  //
  // Vite middleware is added later in server.ts.
  // Putting errorHandler here would intercept frontend routes
  // like /admin before React Router gets a chance to handle them.

  return app;
};