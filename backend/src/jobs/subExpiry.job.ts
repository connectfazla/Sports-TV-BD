import cron from 'node-cron';
import { query } from '../config/database';
import { logger } from '../utils/logger';

export function startSubExpiryJob(): void {
  cron.schedule('0 2 * * *', async () => {
    try {
      const { rowCount } = await query(`
        UPDATE premium_subscriptions
        SET status = 'expired'
        WHERE status = 'active' AND expires_at IS NOT NULL AND expires_at < NOW()
      `);

      if (rowCount && rowCount > 0) {
        await query(`
          UPDATE users SET role = 'user', updated_at = NOW()
          WHERE id IN (
            SELECT user_id FROM premium_subscriptions
            WHERE status = 'expired' AND expires_at < NOW()
          ) AND role = 'premium'
        `);
        logger.info({ rowCount }, 'Expired premium subscriptions downgraded');
      }
    } catch (err) {
      logger.error({ err }, 'Sub expiry job error');
    }
  });
  logger.info('Sub expiry job started (daily at 02:00)');
}
