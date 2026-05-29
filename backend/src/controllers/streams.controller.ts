import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { ok, created, notFound, badRequest } from '../utils/response';
import { encryptAES, decryptAES } from '../utils/crypto';
import { signStreamUrl } from '../services/streamToken.service';
import { Stream, Mirror } from '../types/models';

export async function listStreams(req: Request, res: Response): Promise<void> {
  const { category, page = '1', limit = '20' } = req.query as Record<string, string>;
  const offset = (Number(page) - 1) * Number(limit);
  const isAdmin = req.user?.role === 'admin' || req.user?.role === 'superadmin';

  const params: unknown[] = [Number(limit), offset];
  let whereClause = isAdmin ? '' : "WHERE status = 'active'";
  if (category) {
    whereClause += (whereClause ? ' AND' : 'WHERE') + ` category = $${params.length + 1}`;
    params.unshift(Number(limit), offset);
    params[params.length - 1] = category;
  }

  const { rows } = await query<Stream>(
    `SELECT id, name, slug, logo_url, category, sort_order, status, is_premium, is_featured, metadata
     FROM streams ${whereClause} ORDER BY sort_order ASC, name ASC LIMIT $1 OFFSET $2`,
    params
  );
  ok(res, rows);
}

export async function getStream(req: Request, res: Response): Promise<void> {
  const { rows } = await query<Stream>('SELECT * FROM streams WHERE id = $1', [req.params.id]);
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}

export async function getStreamPlayUrls(req: Request, res: Response): Promise<void> {
  const { rows: streamRows } = await query<Stream>(
    "SELECT * FROM streams WHERE id = $1 AND status = 'active'",
    [req.params.id]
  );
  if (!streamRows.length) { notFound(res, 'Stream not found or inactive'); return; }

  const stream = streamRows[0];
  if (stream.is_premium && req.user?.role === 'user') {
    res.status(403).json({ success: false, message: 'Premium required' });
    return;
  }

  const { rows: mirrors } = await query<Mirror>(
    `SELECT * FROM mirrors WHERE stream_id = $1 AND is_enabled = true ORDER BY priority ASC, health_score DESC`,
    [req.params.id]
  );

  const signed = mirrors.map((m) => {
    const rawUrl = decryptAES(m.url_encrypted, m.url_iv, m.url_tag);
    return {
      id: m.id,
      label: m.label,
      signedUrl: signStreamUrl(rawUrl, req.user!.id, m.id),
      isBdix: m.is_bdix,
      region: m.server_region,
      priority: m.priority,
      healthScore: m.health_score,
    };
  });

  ok(res, { mirrors: signed, tokenExpiresIn: 3600 });
}

export async function createStream(req: Request, res: Response): Promise<void> {
  const { name, slug, logo_url, category, sort_order, is_premium, is_featured, metadata } = req.body;
  const { rows } = await query<Stream>(
    `INSERT INTO streams (name, slug, logo_url, category, sort_order, is_premium, is_featured, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, slug, logo_url, category ?? 'sports', sort_order ?? 0, is_premium ?? false, is_featured ?? false, JSON.stringify(metadata ?? {})]
  );
  created(res, rows[0]);
}

export async function updateStream(req: Request, res: Response): Promise<void> {
  const { name, slug, logo_url, category, sort_order, is_premium, is_featured, metadata } = req.body;
  const { rows } = await query<Stream>(
    `UPDATE streams SET name=COALESCE($1,name), slug=COALESCE($2,slug), logo_url=COALESCE($3,logo_url),
     category=COALESCE($4,category), sort_order=COALESCE($5,sort_order), is_premium=COALESCE($6,is_premium),
     is_featured=COALESCE($7,is_featured), metadata=COALESCE($8,metadata), updated_at=NOW()
     WHERE id=$9 RETURNING *`,
    [name, slug, logo_url, category, sort_order, is_premium, is_featured, metadata ? JSON.stringify(metadata) : null, req.params.id]
  );
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}

export async function patchStreamStatus(req: Request, res: Response): Promise<void> {
  const { status } = req.body;
  const { rows } = await query<Stream>(
    'UPDATE streams SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
    [status, req.params.id]
  );
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}

export async function deleteStream(req: Request, res: Response): Promise<void> {
  const { rowCount } = await query('DELETE FROM streams WHERE id=$1', [req.params.id]);
  if (!rowCount) { notFound(res); return; }
  ok(res, null, 'Stream deleted');
}

export async function reorderStreams(req: Request, res: Response): Promise<void> {
  const { order } = req.body as { order: Array<{ id: string; sort_order: number }> };
  if (!Array.isArray(order)) { badRequest(res, 'order array required'); return; }
  for (const item of order) {
    await query('UPDATE streams SET sort_order=$1, updated_at=NOW() WHERE id=$2', [item.sort_order, item.id]);
  }
  ok(res, null, 'Reordered');
}

export async function addMirror(req: Request, res: Response): Promise<void> {
  const { stream_id, url, label, server_region, is_bdix, priority } = req.body;
  const enc = encryptAES(url);
  const { rows } = await query<Mirror>(
    `INSERT INTO mirrors (stream_id, url_encrypted, url_iv, url_tag, label, server_region, is_bdix, priority)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [stream_id, enc.encrypted, enc.iv, enc.tag, label ?? 'Primary', server_region ?? 'bd', is_bdix ?? false, priority ?? 1]
  );
  created(res, { ...rows[0], url_encrypted: undefined, url_iv: undefined, url_tag: undefined });
}

export async function updateMirror(req: Request, res: Response): Promise<void> {
  const { url, label, server_region, is_bdix, priority, is_enabled } = req.body;
  const updates: string[] = [];
  const params: unknown[] = [];
  if (url) {
    const enc = encryptAES(url);
    updates.push(`url_encrypted=$${params.length+1}`, `url_iv=$${params.length+2}`, `url_tag=$${params.length+3}`);
    params.push(enc.encrypted, enc.iv, enc.tag);
  }
  if (label !== undefined) { updates.push(`label=$${params.length+1}`); params.push(label); }
  if (server_region !== undefined) { updates.push(`server_region=$${params.length+1}`); params.push(server_region); }
  if (is_bdix !== undefined) { updates.push(`is_bdix=$${params.length+1}`); params.push(is_bdix); }
  if (priority !== undefined) { updates.push(`priority=$${params.length+1}`); params.push(priority); }
  if (is_enabled !== undefined) { updates.push(`is_enabled=$${params.length+1}`); params.push(is_enabled); }
  if (!updates.length) { badRequest(res, 'Nothing to update'); return; }
  params.push(req.params.id);
  const { rows } = await query<Mirror>(`UPDATE mirrors SET ${updates.join(',')} WHERE id=$${params.length} RETURNING id,label,server_region,is_bdix,priority,is_enabled,health_score`, params);
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}

export async function deleteMirror(req: Request, res: Response): Promise<void> {
  const { rowCount } = await query('DELETE FROM mirrors WHERE id=$1', [req.params.id]);
  if (!rowCount) { notFound(res); return; }
  ok(res, null, 'Mirror deleted');
}

export async function getMirrorHealth(req: Request, res: Response): Promise<void> {
  const { rows } = await query(`
    SELECT m.id, m.label, m.server_region, m.is_bdix, m.health_score, m.last_checked,
           sh.latency_ms, sh.is_reachable
    FROM mirrors m
    LEFT JOIN LATERAL (
      SELECT latency_ms, is_reachable FROM server_health WHERE mirror_id = m.id ORDER BY checked_at DESC LIMIT 1
    ) sh ON true
    ORDER BY m.health_score DESC
  `);
  ok(res, rows);
}
