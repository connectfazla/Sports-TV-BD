import { Router } from 'express';
import authRoutes from './auth.route';
import streamsRoutes from './streams.route';
import matchesRoutes from './matches.route';
import configRoutes from './config.route';
import notifRoutes from './notifications.route';
import analyticsRoutes from './analytics.route';
import healthRoutes from './health.route';
import adminRoutes from './admin.route';
import premiumRoutes from './premium.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/streams', streamsRoutes);
router.use('/matches', matchesRoutes);
router.use('/config', configRoutes);
router.use('/notifications', notifRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/health', healthRoutes);
router.use('/admin', adminRoutes);
router.use('/premium', premiumRoutes);

export default router;
