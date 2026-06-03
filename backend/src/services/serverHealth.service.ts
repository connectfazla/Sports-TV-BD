import fetch from 'node-fetch';
import { query } from '../config/database';
import { decryptAES } from '../utils/crypto';
import { logger } from '../utils/logger';

export async function probeMirror(mirrorId: string): Promise<{ latency: number; reachable: boolean }> {
  const { rows } = await query(
    'SELECT url_encrypted, url_iv, url_tag FROM mirrors WHERE id = $1',
    [mirrorId]
  );
  if (!rows.length) return { latency: 0, reachable: false };

  const url = decryptAES(rows[0].url_encrypted, rows[0].url_iv, rows[0].url_tag);
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return { latency: Date.now() - start, reachable: true };
  } catch {
    return { latency: 0, reachable: false };
  }
}

export async function runHealthCheck(): Promise<void> {
  const { rows: mirrors } = await query(
    'SELECT id, health_score FROM mirrors WHERE is_enabled = true'
  );

  for (const mirror of mirrors) {
    const { latency, reachable } = await probeMirror(mirror.id);
    const delta = reachable ? 5 : -20;
    const newScore = Math.min(100, Math.max(0, (mirror.health_score ?? 100) + delta));

    await query(
      `UPDATE mirrors SET health_score = $1, last_checked = NOW() WHERE id = $2`,
      [newScore, mirror.id]
    );
    await query(
      `INSERT INTO server_health (mirror_id, latency_ms, is_reachable) VALUES ($1, $2, $3)`,
      [mirror.id, latency, reachable]
    );
  }
  logger.debug('Health check complete');
}
