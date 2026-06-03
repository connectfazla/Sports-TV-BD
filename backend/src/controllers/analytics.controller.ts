import { Request, Response } from 'express';
import { query } from '../config/database';
import { ok, created } from '../utils/response';

export async function ingestEvents(req: Request, res: Response): Promise<void> {
  const events = req.body as Array<{
    event_type: string;
    stream_id?: string;
    mirror_id?: string;
    session_id?: string;
    quality?: string;
    buffering_ms?: number;
    duration_ms?: number;
    metadata?: Record<string, unknown>;
  }>;

  for (const ev of events) {
    await query(
      `INSERT INTO analytics (event_type, user_id, stream_id, mirror_id, session_id, quality, buffering_ms, duration_ms, metadata)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [ev.event_type, req.user!.id, ev.stream_id, ev.mirror_id, ev.session_id, ev.quality, ev.buffering_ms ?? 0, ev.duration_ms ?? 0, JSON.stringify(ev.metadata ?? {})]
    );
  }
  ok(res, { ingested: events.length });
}

export async function getDashboard(req: Request, res: Response): Promise<void> {
  const [viewers, bufferingAvg, ispBreakdown] = await Promise.all([
    query(`SELECT COUNT(DISTINCT user_id) as active_viewers FROM analytics WHERE event_type='stream_start' AND created_at > NOW() - INTERVAL '1 hour'`),
    query(`SELECT AVG(buffering_ms) as avg_buffering FROM analytics WHERE event_type='buffer' AND created_at > NOW() - INTERVAL '1 hour'`),
    query(`SELECT isp, COUNT(*) as count FROM analytics WHERE created_at > NOW() - INTERVAL '24 hours' AND isp IS NOT NULL GROUP BY isp ORDER BY count DESC LIMIT 10`),
  ]);
  ok(res, {
    activeViewers: Number(viewers.rows[0]?.active_viewers ?? 0),
    avgBufferingMs: Number(bufferingAvg.rows[0]?.avg_buffering ?? 0),
    ispBreakdown: ispBreakdown.rows,
  });
}

export async function getIspBreakdown(req: Request, res: Response): Promise<void> {
  const { rows } = await query(
    `SELECT isp, COUNT(*) as sessions FROM analytics WHERE event_type='stream_start' AND created_at > NOW() - INTERVAL '7 days' AND isp IS NOT NULL GROUP BY isp ORDER BY sessions DESC`
  );
  ok(res, rows);
}

export async function getStreamStats(req: Request, res: Response): Promise<void> {
  const { rows } = await query(
    `SELECT s.name, s.id, COUNT(a.id) as views, AVG(a.duration_ms) as avg_duration
     FROM streams s LEFT JOIN analytics a ON a.stream_id = s.id AND a.event_type='stream_start' AND a.created_at > NOW() - INTERVAL '24 hours'
     GROUP BY s.id, s.name ORDER BY views DESC LIMIT 20`
  );
  ok(res, rows);
}
