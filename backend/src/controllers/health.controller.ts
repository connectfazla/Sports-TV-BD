import { Request, Response } from 'express';
import { query } from '../config/database';
import { ok } from '../utils/response';
import { probeMirror } from '../services/serverHealth.service';

export async function liveness(req: Request, res: Response): Promise<void> {
  ok(res, { status: 'ok', timestamp: new Date().toISOString() });
}

export async function getServerHealth(req: Request, res: Response): Promise<void> {
  const { rows } = await query(`
    SELECT m.id, m.label, m.server_region, m.is_bdix, m.health_score, m.last_checked,
           sh.latency_ms, sh.is_reachable
    FROM mirrors m
    LEFT JOIN LATERAL (
      SELECT latency_ms, is_reachable FROM server_health WHERE mirror_id = m.id ORDER BY checked_at DESC LIMIT 1
    ) sh ON true
    WHERE m.is_enabled = true ORDER BY m.health_score DESC
  `);
  ok(res, rows);
}

export async function getBestServer(req: Request, res: Response): Promise<void> {
  const { rows } = await query(`
    SELECT id, label, server_region, is_bdix, health_score
    FROM mirrors WHERE is_enabled = true AND health_score > 50 ORDER BY is_bdix DESC, health_score DESC LIMIT 5
  `);
  ok(res, rows);
}
