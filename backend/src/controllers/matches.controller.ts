import { Request, Response } from 'express';
import { query } from '../config/database';
import { ok, created, notFound } from '../utils/response';
import { Match } from '../types/models';

export async function listMatches(req: Request, res: Response): Promise<void> {
  const { status, date } = req.query as Record<string, string>;
  const params: unknown[] = [];
  const conditions: string[] = [];
  if (status) { params.push(status); conditions.push(`status=$${params.length}`); }
  if (date) { params.push(date); conditions.push(`DATE(scheduled_at)=$${params.length}`); }
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const { rows } = await query<Match>(`SELECT * FROM matches ${where} ORDER BY scheduled_at ASC`, params);
  ok(res, rows);
}

export async function getLiveMatches(req: Request, res: Response): Promise<void> {
  const { rows } = await query<Match>("SELECT * FROM matches WHERE status='live' ORDER BY started_at DESC");
  ok(res, rows);
}

export async function getMatch(req: Request, res: Response): Promise<void> {
  const { rows } = await query<Match>('SELECT * FROM matches WHERE id=$1', [req.params.id]);
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}

export async function createMatch(req: Request, res: Response): Promise<void> {
  const { title, home_team, away_team, home_logo, away_logo, tournament, venue, stream_id, scheduled_at, is_featured } = req.body;
  const { rows } = await query<Match>(
    `INSERT INTO matches (title,home_team,away_team,home_logo,away_logo,tournament,venue,stream_id,scheduled_at,is_featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [title, home_team, away_team, home_logo, away_logo, tournament, venue, stream_id, scheduled_at, is_featured ?? false]
  );
  created(res, rows[0]);
}

export async function updateMatch(req: Request, res: Response): Promise<void> {
  const { title, home_team, away_team, home_logo, away_logo, tournament, venue, stream_id, scheduled_at, is_featured, stats, standings } = req.body;
  const { rows } = await query<Match>(
    `UPDATE matches SET title=COALESCE($1,title), home_team=COALESCE($2,home_team), away_team=COALESCE($3,away_team),
     home_logo=COALESCE($4,home_logo), away_logo=COALESCE($5,away_logo), tournament=COALESCE($6,tournament),
     venue=COALESCE($7,venue), stream_id=COALESCE($8,stream_id), scheduled_at=COALESCE($9,scheduled_at),
     is_featured=COALESCE($10,is_featured), stats=COALESCE($11,stats), standings=COALESCE($12,standings), updated_at=NOW()
     WHERE id=$13 RETURNING *`,
    [title, home_team, away_team, home_logo, away_logo, tournament, venue, stream_id, scheduled_at, is_featured,
     stats ? JSON.stringify(stats) : null, standings ? JSON.stringify(standings) : null, req.params.id]
  );
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}

export async function patchScore(req: Request, res: Response): Promise<void> {
  const { home_score, away_score } = req.body;
  const { rows } = await query<Match>(
    'UPDATE matches SET home_score=$1, away_score=$2, updated_at=NOW() WHERE id=$3 RETURNING *',
    [home_score, away_score, req.params.id]
  );
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}

export async function patchMatchStatus(req: Request, res: Response): Promise<void> {
  const { status } = req.body;
  const extra: Record<string, string> = {};
  if (status === 'live') extra.started_at = 'NOW()';
  if (status === 'finished') extra.ended_at = 'NOW()';
  const extraSql = Object.entries(extra).map(([k]) => `${k}=NOW()`).join(',');
  const { rows } = await query<Match>(
    `UPDATE matches SET status=$1, updated_at=NOW() ${extraSql ? ', ' + extraSql : ''} WHERE id=$2 RETURNING *`,
    [status, req.params.id]
  );
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}

export async function deleteMatch(req: Request, res: Response): Promise<void> {
  const { rowCount } = await query('DELETE FROM matches WHERE id=$1', [req.params.id]);
  if (!rowCount) { notFound(res); return; }
  ok(res, null, 'Match deleted');
}
