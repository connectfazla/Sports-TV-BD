import { Router } from 'express';
import * as c from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/users', authenticate, requireAdmin, c.listUsers);
router.put('/users/:id/ban', authenticate, requireAdmin, c.banUser);
router.put('/users/:id/role', authenticate, requireAdmin, c.setUserRole);
router.post('/server-rotation', authenticate, requireAdmin, c.emergencyRedirect);
router.put('/maintenance', authenticate, requireAdmin, c.setMaintenance);

export default router;
