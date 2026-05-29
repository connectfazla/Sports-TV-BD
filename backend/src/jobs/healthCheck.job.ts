import cron from 'node-cron';
import { runHealthCheck } from '../services/serverHealth.service';
import { logger } from '../utils/logger';

export function startHealthCheckJob(): void {
  cron.schedule('*/30 * * * * *', async () => {
    try {
      await runHealthCheck();
    } catch (err) {
      logger.error({ err }, 'Health check job error');
    }
  });
  logger.info('Health check job started (every 30s)');
}
