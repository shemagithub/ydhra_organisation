import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/stats', requireAuth, async (_req, res) => {
  const contentRows = await query(
    'SELECT payload, updated_at FROM site_content ORDER BY id DESC LIMIT 1',
  );
  const content =
    contentRows[0] &&
    (typeof contentRows[0].payload === 'string'
      ? JSON.parse(contentRows[0].payload)
      : contentRows[0].payload);

  const messageStats = await query(`
    SELECT
      COUNT(*) AS total,
      SUM(status = 'new') AS unread,
      SUM(status = 'read') AS read_count,
      SUM(status = 'archived') AS archived
    FROM contact_messages
  `);

  const mediaCount = await query('SELECT COUNT(*) AS total FROM media_assets');
  const activity = await activitySeries();
  const giftRows = await query(`
    SELECT status, COUNT(*) AS total, COALESCE(SUM(amount), 0) AS amount
    FROM payment_collections
    GROUP BY status
  `);
  const payoutRows = await query(`
    SELECT COALESCE(SUM(amount + COALESCE(txn_charge, 0)), 0) AS total
    FROM payment_payouts
    WHERE status IN ('PENDING', 'SUCCESS', 'SUCCESSFUL', 'COMPLETED')
  `);

  const gifts = summarizeGifts(giftRows, Number(payoutRows[0]?.total || 0));
  const categories = Object.entries(
    (content?.blogPosts || []).reduce((counts, post) => {
      const label = post.category || 'General';
      counts[label] = (counts[label] || 0) + 1;
      return counts;
    }, {}),
  ).map(([label, count]) => ({ label, count }));

  const stats = {
    blogPosts: content?.blogPosts?.length ?? 0,
    programs: content?.programs?.length ?? 0,
    teamRoles: content?.teamRoles?.length ?? 0,
    socialLinks: content?.socialLinks?.length ?? 0,
    messages: {
      total: Number(messageStats[0]?.total || 0),
      unread: Number(messageStats[0]?.unread || 0),
      read: Number(messageStats[0]?.read_count || 0),
      archived: Number(messageStats[0]?.archived || 0),
    },
    media: Number(mediaCount[0]?.total || 0),
    contentUpdatedAt: contentRows[0]?.updated_at ?? null,
    contentVersion: content?.version ?? 0,
    activity,
    gifts,
    categories,
  };

  res.json({ ok: true, stats });
});

function asDay(value) {
  if (value instanceof Date) return dayKey(value);
  return String(value || '').slice(0, 10);
}

function dayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function summarizeGifts(rows, reserved) {
  const receivedStatuses = new Set(['SUCCESS', 'SUCCESSFUL', 'COMPLETED']);
  const missedStatuses = new Set(['FAILED', 'REVERSED', 'DECLINED', 'CANCELLED']);
  let received = 0;
  let waiting = 0;
  let missed = 0;
  let collected = 0;
  for (const row of rows) {
    const status = String(row.status || '').toUpperCase();
    const count = Number(row.total || 0);
    const amount = Number(row.amount || 0);
    if (receivedStatuses.has(status)) {
      received += count;
      collected += amount;
    } else if (missedStatuses.has(status)) {
      missed += count;
    } else {
      waiting += count;
    }
  }
  return {
    received,
    waiting,
    missed,
    collected,
    reserved,
    available: Math.max(0, collected - reserved),
  };
}

async function activitySeries() {
  const messageRows = await query(`
    SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, COUNT(*) AS total
    FROM contact_messages
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
  `);
  const giftRows = await query(`
    SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, COALESCE(SUM(amount), 0) AS total
    FROM payment_collections
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
      AND status IN ('SUCCESS', 'SUCCESSFUL', 'COMPLETED')
    GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
  `);
  const messages = new Map(messageRows.map((row) => [asDay(row.day), Number(row.total || 0)]));
  const gifts = new Map(giftRows.map((row) => [asDay(row.day), Number(row.total || 0)]));
  const days = [];
  for (let offset = 13; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    const key = dayKey(date);
    days.push({
      date: key,
      label: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      messages: messages.get(key) || 0,
      collected: gifts.get(key) || 0,
    });
  }
  return days;
}

export default router;
