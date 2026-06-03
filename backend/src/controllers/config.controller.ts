import { Request, Response } from 'express';
import { query } from '../config/database';
import { ok, notFound } from '../utils/response';
import { encryptAES } from '../utils/crypto';

export async function getAppConfig(req: Request, res: Response): Promise<void> {
  const { rows } = await query('SELECT key, value FROM app_config ORDER BY key');
  const config: Record<string, unknown> = {};
  for (const row of rows) {
    config[row.key] = row.value;
  }
  const enc = encryptAES(JSON.stringify(config));
  ok(res, { payload: enc.encrypted, iv: enc.iv, tag: enc.tag });
}

export async function getAdConfig(req: Request, res: Response): Promise<void> {
  const { rows } = await query('SELECT * FROM ad_config WHERE is_enabled = true ORDER BY provider, ad_type');
  const enc = encryptAES(JSON.stringify(rows));
  ok(res, { payload: enc.encrypted, iv: enc.iv, tag: enc.tag });
}

export async function updateAppConfig(req: Request, res: Response): Promise<void> {
  const { key } = req.params;
  const { value } = req.body;
  const { rowCount } = await query(
    'UPDATE app_config SET value=$1, updated_at=NOW() WHERE key=$2',
    [JSON.stringify(value), key]
  );
  if (!rowCount) { notFound(res, 'Config key not found'); return; }
  ok(res, null, 'Config updated');
}

export async function updateAdConfig(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { ad_unit_id, is_enabled, frequency_cap, cooldown_sec, geo_rules } = req.body;
  const { rows } = await query(
    `UPDATE ad_config SET ad_unit_id=COALESCE($1,ad_unit_id), is_enabled=COALESCE($2,is_enabled),
     frequency_cap=COALESCE($3,frequency_cap), cooldown_sec=COALESCE($4,cooldown_sec),
     geo_rules=COALESCE($5,geo_rules), updated_at=NOW() WHERE id=$6 RETURNING *`,
    [ad_unit_id, is_enabled, frequency_cap, cooldown_sec, geo_rules ? JSON.stringify(geo_rules) : null, id]
  );
  if (!rows.length) { notFound(res); return; }
  ok(res, rows[0]);
}
