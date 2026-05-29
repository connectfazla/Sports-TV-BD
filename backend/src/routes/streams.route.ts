import { Router } from 'express';
import { z } from 'zod';
import * as c from '../controllers/streams.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validateBody } from '../middleware/validateBody';
import { playbackLimiter } from '../middleware/rateLimit';

const router = Router();

router.get('/', authenticate, c.listStreams);
router.get('/:id', authenticate, c.getStream);
router.get('/:id/play', authenticate, playbackLimiter, c.getStreamPlayUrls);
router.post('/', authenticate, requireAdmin, validateBody(z.object({ name: z.string(), slug: z.string(), logo_url: z.string().optional(), category: z.string().optional(), sort_order: z.number().optional(), is_premium: z.boolean().optional(), is_featured: z.boolean().optional(), metadata: z.record(z.unknown()).optional() })), c.createStream);
router.put('/reorder', authenticate, requireAdmin, c.reorderStreams);
router.put('/:id', authenticate, requireAdmin, c.updateStream);
router.patch('/:id/status', authenticate, requireAdmin, validateBody(z.object({ status: z.enum(['active', 'inactive', 'maintenance']) })), c.patchStreamStatus);
router.delete('/:id', authenticate, requireAdmin, c.deleteStream);

router.get('/:id/mirrors', authenticate, requireAdmin, c.getMirrorHealth);
router.post('/mirrors', authenticate, requireAdmin, validateBody(z.object({ stream_id: z.string().uuid(), url: z.string().url(), label: z.string().optional(), server_region: z.string().optional(), is_bdix: z.boolean().optional(), priority: z.number().optional() })), c.addMirror);
router.put('/mirrors/:id', authenticate, requireAdmin, c.updateMirror);
router.delete('/mirrors/:id', authenticate, requireAdmin, c.deleteMirror);
router.get('/mirrors/health', authenticate, requireAdmin, c.getMirrorHealth);

export default router;
