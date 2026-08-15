import mongoose from 'mongoose';

export interface DbStatus {
  isConnected: boolean;
  mode: 'mongodb_atlas' | 'fallback_store';
  host?: string;
  name?: string;
}

let dbStatus: DbStatus = {
  isConnected: false,
  mode: 'fallback_store',
};

export const getDbStatus = (): DbStatus => dbStatus;

export const connectDB = async (): Promise<void> => {
  mongoose.set('bufferCommands', false);
  const mongoUri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  const isPlaceholderUri = !mongoUri || mongoUri.includes('<username>') || mongoUri.includes('username:password');

  if (isPlaceholderUri) {
    if (isProduction) {
      throw new Error('FATAL: MONGODB_URI is required in production environment.');
    }
    console.warn(
      '⚠️  [Development Warning] MONGODB_URI is not configured in .env or contains placeholder credentials.\n' +
      '   Running server with Fallback Data Storage Engine for live preview testing.\n' +
      '   To connect to production MongoDB Atlas, update MONGODB_URI in .env'
    );
    dbStatus = {
      isConnected: true,
      mode: 'fallback_store',
      host: 'In-Memory/Seeded Engine',
      name: 'hamro_pustak_bhandar',
    };
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    dbStatus = {
      isConnected: true,
      mode: 'mongodb_atlas',
      host: conn.connection.host,
      name: conn.connection.name,
    };

    console.log(`✅ [MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
  } catch (error: any) {
    if (isProduction) {
      throw new Error(`FATAL: Could not connect to MongoDB Atlas in production: ${error.message}`);
    }
    console.warn(`⚠️  [MongoDB Notice] Atlas connection bypass (${error.message}).`);
    console.warn('   Using In-Memory/Seeded fallback data engine for preview application.');
    try {
      await mongoose.disconnect();
    } catch (_) {}
    dbStatus = {
      isConnected: false,
      mode: 'fallback_store',
      host: 'Fallback Engine',
      name: 'hamro_pustak_bhandar',
    };
  }
};
