import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createApp } from './server/src/app';
import { connectDB } from './server/src/config/db';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  try {
    // Connect to Database
    await connectDB();

    const app = createApp();

    if (process.env.NODE_ENV !== 'production') {
      // Vite middleware must be attached after the API app is created.
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
        },
        appType: 'spa',
      });

      app.use(vite.middlewares);

      console.log(
        '⚡ [Vite] Middleware initialized for single-port frontend + backend development.'
      );
    } else {
      // Production: serve the built React application.
      const distPath = path.join(process.cwd(), 'dist');

      app.use((await import('express')).default.static(distPath));

      // SPA fallback for React Router routes such as /admin, /shop, /login.
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `🚀 [Hamro Pustak Bhandar Backend] Server active on http://0.0.0.0:${PORT}`
      );
      console.log(
        `📌 Health check available at: http://localhost:${PORT}/api/health`
      );
      console.log(
        `🔐 Auth API available at: http://localhost:${PORT}/api/auth`
      );
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();