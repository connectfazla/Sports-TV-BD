import { Request, Response } from 'express';
import { query } from '../config/database';
import { ok, created } from '../utils/response';
import { sendPushNotification } from '../services/notification.service';

export async function listNotifications(req: Request, res: Response): Promise<void> {
  const { rows } = await query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
  ok(res, rows);
}

export async function sendNotification(req: Request, res: Response): Promise<void> {
  const { title, body, type, imageUrl, deepLink, targetRoles } = req.body;

  const sentCount = await sendPushNotification({ title, body, imageUrl, deepLink, targetRoles });

  const { rows } = await query(
    `INSERT INTO notifications (title, body, type, image_url, deep_link, target_roles, sent_count, sent_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *`,
    [title, body, type ?? 'general', imageUrl, deepLink, targetRoles ?? ['user', 'premium'], sentCount]
  );
  created(res, rows[0]);
}

export async function deleteNotification(req: Request, res: Response): Promise<void> {
  await query('DELETE FROM notifications WHERE id=$1', [req.params.id]);
  ok(res, null, 'Deleted');
}
