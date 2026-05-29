import { Request, Response } from 'express';
import { query } from '../config/database';
import { ok, created } from '../utils/response';
import { PremiumSubscription } from '../types/models';

export async function getStatus(req: Request, res: Response): Promise<void> {
  const { rows } = await query<PremiumSubscription>(
    "SELECT * FROM premium_subscriptions WHERE user_id=$1 AND status='active' ORDER BY expires_at DESC LIMIT 1",
    [req.user!.id]
  );
  ok(res, rows[0] ?? { status: 'none' });
}

export async function activatePremium(req: Request, res: Response): Promise<void> {
  const { userId, planType, expiresAt, paymentRef, paymentGateway } = req.body;
  const { rows } = await query<PremiumSubscription>(
    `INSERT INTO premium_subscriptions (user_id, status, plan_type, expires_at, payment_ref, payment_gateway)
     VALUES ($1,'active',$2,$3,$4,$5) RETURNING *`,
    [userId, planType ?? 'monthly', expiresAt, paymentRef, paymentGateway]
  );
  await query("UPDATE users SET role='premium', updated_at=NOW() WHERE id=$1", [userId]);
  created(res, rows[0]);
}

export async function listSubscriptions(req: Request, res: Response): Promise<void> {
  const { rows } = await query(
    `SELECT ps.*, u.device_id, u.country_code FROM premium_subscriptions ps JOIN users u ON u.id=ps.user_id ORDER BY ps.created_at DESC LIMIT 100`
  );
  ok(res, rows);
}
