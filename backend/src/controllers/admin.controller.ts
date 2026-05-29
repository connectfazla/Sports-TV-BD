import { Request, Response } from 'express';
import { query } from '../config/database';
import { ok, notFound, badRequest } from '../utils/response';
import { User } from '../types/models';

export async function listUsers(req: Request, res: Response): Promise<void> {
  const { page = '1', limit = '50' } = req.query as Record<string, string>;
  const offset = (Number(page) - 1) * Number(limit);
  const { rows } = await query<User>(
    'SELECT id, device_id, role, is_banned, country_code, isp, app_version, last_seen_at, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  ok(res, rows);
}

export async function banUser(req: Request, res: Response): Promise<void> {
  const { is_banned } = req.body;
  const { rows } = await query<User>(
    'UPDATE users SET is_banned=$1, updated_at=NOW() WHERE id=$2 RETURNING id, is_banned',
    [is_banned, req.params.id]
  );
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}

export async function setUserRole(req: Request, res: Response): Promise<void> {
  const { role } = req.body;
  const { rows } = await query<User>(
    'UPDATE users SET role=$1, updated_at=NOW() WHERE id=$2 RETURNING id, role',
    [role, req.params.id]
  );
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}

export async function emergencyRedirect(req: Request, res: Response): Promise<void> {
  const { streamId, newUrl, label } = req.body;
  if (!streamId || !newUrl) { badRequest(res, 'streamId and newUrl required'); return; }
  const { encryptAES } = await import('../utils/crypto');
  const enc = encryptAES(newUrl);
  await query('UPDATE mirrors SET is_enabled=false WHERE stream_id=$1', [streamId]);
  const { rows } = await query(
    `INSERT INTO mirrors (stream_id, url_encrypted, url_iv, url_tag, label, server_region, priority) VALUES ($1,$2,$3,$4,$5,'cdn',1) RETURNING id`,
    [streamId, enc.encrypted, enc.iv, enc.tag, label ?? 'Emergency CDN']
  );
  ok(res, { message: 'Emergency redirect applied', mirrorId: rows[0].id });
}

export async function setMaintenance(req: Request, res: Response): Promise<void> {
  const { enabled, message } = req.body;
  await query("UPDATE app_config SET value=$1, updated_at=NOW() WHERE key='maintenance_mode'", [JSON.stringify(enabled)]);
  if (message) {
    await query("UPDATE app_config SET value=$1, updated_at=NOW() WHERE key='maintenance_message'", [JSON.stringify(message)]);
  }
  ok(res, null, `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`);
}
