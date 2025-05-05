import { Request, Response, Router } from 'express';

const router = Router();

/**
 * Basic health check endpoint 
 * Quick response to indicate service is running
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router; 