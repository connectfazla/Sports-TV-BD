import { Router } from 'express';
import * as c from '../controllers/health.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', c.liveness);
router.get('/servers', authenticate, c.getServerHealth);
router.get('/servers/best', authenticate, c.getBestServer);

export default router;
