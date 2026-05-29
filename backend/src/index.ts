import { createApp } from './app';
import { pool } from './config/database';
import { env } from './config/env';
import { logger } from './utils/logger';
import { startHealthCheckJob } from './jobs/healthCheck.job';
import { startSubExpiryJob } from './jobs/subExpiry.job';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Sports TV API started');
  startHealthCheckJob();
  startSubExpiryJob();
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});
