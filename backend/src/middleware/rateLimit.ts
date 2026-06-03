import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 60_000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests' },
});

export const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts' },
});

export const playbackLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  keyGenerator: (req) => req.user?.id ?? req.ip ?? 'unknown',
  message: { success: false, message: 'Playback rate limit exceeded' },
});

export const analyticsLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  message: { success: false, message: 'Analytics rate limit exceeded' },
});
