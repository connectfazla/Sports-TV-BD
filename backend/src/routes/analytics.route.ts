import { Router } from 'express';
import * as c from '../controllers/analytics.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { analyticsLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/events', authenticate, analyticsLimiter, c.ingestEvents);
router.get('/dashboard', authenticate, requireAdmin, c.getDashboard);
router.get('/isp', authenticate, requireAdmin, c.getIspBreakdown);
router.get('/streams', authenticate, requireAdmin, c.getStreamStats);

export default router;
