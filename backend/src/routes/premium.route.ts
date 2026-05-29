import { Router } from 'express';
import * as c from '../controllers/premium.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/status', authenticate, c.getStatus);
router.post('/activate', authenticate, requireAdmin, c.activatePremium);
router.get('/subscriptions', authenticate, requireAdmin, c.listSubscriptions);

export default router;
