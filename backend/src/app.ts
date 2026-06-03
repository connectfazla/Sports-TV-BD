import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './utils/logger';
import { globalLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes/index';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet({
    hsts: { maxAge: 31536000, includeSubDomains: true },
  }));

  const origins = env.CORS_ORIGINS.split(',').map(o => o.trim());
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin || origins.includes(origin) || origins.includes('null')) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger }));
  app.use(globalLimiter);

  app.use('/api/v1', routes);

  app.get('/ping', (_, res) => res.json({ pong: true }));

  app.use(errorHandler);

  return app;
}
