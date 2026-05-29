import { Router } from 'express';
import * as c from '../controllers/config.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/app', authenticate, c.getAppConfig);
router.get('/ads', authenticate, c.getAdConfig);
router.put('/app/:key', authenticate, requireAdmin, c.updateAppConfig);
router.put('/ads/:id', authenticate, requireAdmin, c.updateAdConfig);

export default router;
