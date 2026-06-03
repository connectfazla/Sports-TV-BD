import { Router } from 'express';
import * as c from '../controllers/notifications.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireAdmin, c.listNotifications);
router.post('/send', authenticate, requireAdmin, c.sendNotification);
router.delete('/:id', authenticate, requireAdmin, c.deleteNotification);

export default router;
