import { Router } from 'express';
import * as c from '../controllers/matches.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, c.listMatches);
router.get('/live', authenticate, c.getLiveMatches);
router.get('/:id', authenticate, c.getMatch);
router.post('/', authenticate, requireAdmin, c.createMatch);
router.put('/:id', authenticate, requireAdmin, c.updateMatch);
router.patch('/:id/score', authenticate, requireAdmin, c.patchScore);
router.patch('/:id/status', authenticate, requireAdmin, c.patchMatchStatus);
router.delete('/:id', authenticate, requireAdmin, c.deleteMatch);

export default router;
