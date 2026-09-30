import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { buildSitemap, writePublicSitemap } from '../lib/sitemap.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parsePayload(row) {
  if (!row) return null;
  const payload = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;
  return payload;
}

let contentCache = null;

export function clearContentCache() {
  contentCache = null;
}

async function getLatestContent() {
  if (contentCache && Date.now() - contentCache.at < 30_000) return contentCache.row;
  const rows = await query(
    'SELECT id, version, payload, updated_at FROM site_content ORDER BY id DESC LIMIT 1',
  );
  const row = rows[0] ?? null;
  contentCache = { row, at: Date.now() };
  return row;
}

function syncPublicJson(content) {
  if (process.env.SYNC_PUBLIC_JSON === 'false') return;
  const target =
    process.env.PUBLIC_CONTENT_PATH ||
    path.resolve(__dirname, '../../../public/content/site-content.json');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
}

router.get('/', async (req, res) => {
  const row = await getLatestContent();
  if (!row) {
    return res.status(404).json({ ok: false, error: 'Content not found' });
  }
  const updated = row.updated_at ? new Date(row.updated_at).getTime() : 0;
  const etag = `"ccf-${row.id}-${row.version}-${updated}"`;
  res.set('ETag', etag);
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }
  return res.json({
    ok: true,
    content: parsePayload(row),
    updatedAt: row.updated_at,
  });
});

router.get('/sitemap.xml', async (_req, res) => {
  const row = await getLatestContent();
  const content = parsePayload(row);
  res.type('application/xml');
  res.set('Cache-Control', 'public, max-age=300');
  return res.send(buildSitemap(content?.blogPosts || []));
});

router.put('/', requireAuth, async (req, res) => {
  const content = req.body?.content ?? req.body;
  if (!content?.version || !content?.contact || !Array.isArray(content?.blogPosts)) {
    return res.status(400).json({ ok: false, error: 'Content missing required fields' });
  }

  const nextVersion = Number(content.version) + 1;
  content.version = nextVersion;

  clearContentCache();
  const existing = await getLatestContent();
  if (existing) {
    await query(
      'UPDATE site_content SET version = ?, payload = CAST(? AS JSON), updated_by = ? WHERE id = ?',
      [nextVersion, JSON.stringify(content), req.admin.id, existing.id],
    );
  } else {
    await query(
      'INSERT INTO site_content (version, payload, updated_by) VALUES (?, CAST(? AS JSON), ?)',
      [nextVersion, JSON.stringify(content), req.admin.id],
    );
  }

  clearContentCache();
  try {
    syncPublicJson(content);
    writePublicSitemap(content.blogPosts || []);
  } catch (err) {
    console.warn('Could not sync public JSON:', err.message);
  }

  return res.json({ ok: true, saved: true, content });
});

export default router;
