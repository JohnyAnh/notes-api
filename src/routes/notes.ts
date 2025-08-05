import { Router, Request, Response } from 'express';
const router = Router();

// tạm 1 route ping để test
router.get('/ping', (_req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

export default router;
