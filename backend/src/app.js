import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import env from './utils/env.js';
import { logRequest } from './middleware/logger.middleware.js';
import { sanitizeInput } from './middleware/xss.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import wholesaleRoutes from './routes/wholesale.routes.js';
import productRoutes from './routes/product.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use(sanitizeInput);
app.use(logRequest);

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/', limiter);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wholesale', wholesaleRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;
