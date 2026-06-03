import fs from 'fs';
import path from 'path';
import { pool } from '../config/database';

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const migDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      const { rows } = await client.query('SELECT id FROM migrations WHERE filename = $1', [file]);
      if (rows.length > 0) {
        console.log(`Skipping ${file} (already applied)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migDir, file), 'utf8');
      console.log(`Applying ${file}...`);
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`Applied ${file}`);
    }

    console.log('Migrations complete');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
