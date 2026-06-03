import { Router } from 'express';
import { z } from 'zod';
import { register, refresh, updateFcmToken, getMe, validateStream } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validateBody';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', authLimiter, validateBody(z.object({ deviceId: z.string(), appVersion: z.string().optional(), platform: z.string().optional() })), register);
router.post('/refresh', validateBody(z.object({ refreshToken: z.string() })), refresh);
router.put('/fcm-token', authenticate, validateBody(z.object({ fcmToken: z.string() })), updateFcmToken);
router.get('/me', authenticate, getMe);
router.get('/validate-stream', validateStream);

export default router;
