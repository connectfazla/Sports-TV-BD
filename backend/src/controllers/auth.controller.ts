import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/jwt.service';
import { ok, created, unauthorized, badRequest } from '../utils/response';
import { User } from '../types/models';

export async function register(req: Request, res: Response): Promise<void> {
  const { deviceId, appVersion, platform } = req.body;

  let user: User;
  const existing = await query<User>('SELECT * FROM users WHERE device_id = $1', [deviceId]);

  if (existing.rows.length > 0) {
    user = existing.rows[0];
    if (user.is_banned) {
      unauthorized(res, 'Device banned');
      return;
    }
    await query('UPDATE users SET app_version = $1, last_seen_at = NOW(), updated_at = NOW() WHERE id = $2', [appVersion, user.id]);
  } else {
    const result = await query<User>(
      `INSERT INTO users (device_id, app_version) VALUES ($1, $2) RETURNING *`,
      [deviceId, appVersion]
    );
    user = result.rows[0];
  }

  const payload = { sub: user.id, role: user.role, deviceId: user.device_id };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  created(res, { accessToken, refreshToken, user: { id: user.id, role: user.role } });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body;
  if (!refreshToken) { badRequest(res, 'refreshToken required'); return; }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const { rows } = await query<User>('SELECT * FROM users WHERE id = $1', [payload.sub]);
    if (!rows.length || rows[0].is_banned) { unauthorized(res); return; }
    const user = rows[0];
    const newPayload = { sub: user.id, role: user.role, deviceId: user.device_id };
    ok(res, {
      accessToken: signAccessToken(newPayload),
      refreshToken: signRefreshToken(newPayload),
    });
  } catch {
    unauthorized(res, 'Invalid refresh token');
  }
}

export async function updateFcmToken(req: Request, res: Response): Promise<void> {
  const { fcmToken } = req.body;
  await query('UPDATE users SET fcm_token = $1, updated_at = NOW() WHERE id = $2', [fcmToken, req.user!.id]);
  ok(res, null, 'FCM token updated');
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const { rows } = await query<User>('SELECT id, device_id, role, country_code, created_at FROM users WHERE id = $1', [req.user!.id]);
  ok(res, rows[0]);
}

export async function validateStream(req: Request, res: Response): Promise<void> {
  const { tk, uid, exp } = req.query as Record<string, string>;
  if (!tk || !uid || !exp) { res.status(401).send(); return; }

  const mirrorId = req.headers['x-mirror-id'] as string;
  if (!mirrorId) { res.status(401).send(); return; }

  const { validateStreamToken } = await import('../services/streamToken.service');
  const valid = validateStreamToken(mirrorId, uid, Number(exp), tk);
  res.status(valid ? 200 : 401).send();
}
