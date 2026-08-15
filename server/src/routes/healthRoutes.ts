import { Router, Request, Response } from 'express';
import { getDbStatus } from '../config/db.js';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const dbStatus = getDbStatus();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        status: 'online',
        app: 'Hamro Pustak Bhandar API',
        timestamp: new Date().toISOString(),
        database: dbStatus,
      },
      'Health check successful'
    )
  );
});

export default router;
