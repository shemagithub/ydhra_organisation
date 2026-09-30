import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool, getDbConfig } from './lib/db.js';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ensureDatabase() {
  const cfg = getDbConfig();
  const connection = await mysql.createConnection({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    multipleStatements: true,
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();
}

async function runSchema() {
  const schemaPath = path.resolve(__dirname, '../schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  // Skip CREATE DATABASE / USE — already handled
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('CREATE DATABASE') && !s.startsWith('USE '));

  const pool = await getPool();
  for (const statement of statements) {
    await pool.query(statement);
  }
}

async function ensureColumn(table, column, definition) {
  const pool = await getPool();
  const cfg = getDbConfig();
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [cfg.database, table, column],
  );
  if (rows.length) return;
  await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
}

export async function initDatabase() {
  await ensureDatabase();
  await runSchema();
  await ensureColumn('payment_collections', 'notice_sent', 'VARCHAR(20) NULL');
  await ensureColumn('payment_payouts', 'notice_sent', 'VARCHAR(20) NULL');

  const pool = await getPool();
  const [admins] = await pool.query('SELECT id FROM admins LIMIT 1');
  if (!admins.length) {
    const email = process.env.ADMIN_EMAIL || 'admin@creationcare.org';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMeCCF2026';
    const name = process.env.ADMIN_NAME || 'CCF Admin';
    const hash = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hash],
    );
    console.log(`Created default admin: ${email}`);
  }

  const [contentRows] = await pool.query('SELECT id FROM site_content LIMIT 1');
  if (!contentRows.length) {
    const candidates = [
      path.resolve(__dirname, '../seed-content.json'),
      path.resolve(__dirname, '../../public/content/site-content.json'),
    ];
    const file = candidates.find((candidate) => fs.existsSync(candidate));
    if (!file) {
      const error = new Error(
        `site_content is empty and seed-content.json was not found. Upload seed-content.json next to app.js, then restart.`,
      );
      error.code = 'ENOENT';
      throw error;
    }
    const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
    await pool.execute('INSERT INTO site_content (version, payload) VALUES (?, CAST(? AS JSON))', [
      payload.version || 1,
      JSON.stringify(payload),
    ]);
    console.log('Seeded site_content from', path.basename(file));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__dirname, 'init-db.js')) {
  initDatabase()
    .then(() => {
      console.log('Database ready.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
