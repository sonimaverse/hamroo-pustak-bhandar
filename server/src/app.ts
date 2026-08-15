import express, { Application, Request, Response, NextFunction } from 'express';
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
import { errorHandler } from './middleware/errorMiddleware.js';
import { ApiError } from './utils/apiError.js';

export const createApp = (): Application => {
  const app: Application = express();

  // Security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Vite dev scripts when integrated
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: process.env.CLIENT_URL || '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
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

  // Handle Unknown API Routes
  app.all('/api/*', (req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, `Cannot find endpoint ${req.originalUrl} on this server.`));
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
