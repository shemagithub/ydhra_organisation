import { Router } from 'express';
import { query } from '../lib/db.js';
import { sendContactNotices } from '../lib/mail.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const status = req.query.status ? String(req.query.status) : null;
  const q = req.query.q ? `%${String(req.query.q)}%` : null;

  let sql =
    'SELECT id, name, email, phone, subject, message, status, created_at, updated_at FROM contact_messages WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (q) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR subject LIKE ? OR message LIKE ?)';
    params.push(q, q, q, q, q);
  }
  sql += ' ORDER BY created_at DESC LIMIT 200';

  const rows = await query(sql, params);
  res.json({ ok: true, messages: rows });
});

router.post('/', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const phone = String(req.body?.phone || '').trim() || null;
  const subject = String(req.body?.subject || '').trim() || null;
  const message = String(req.body?.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email, and message are required' });
  }

  const result = await query(
    'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, subject, message],
  );

  let emailSent = false;
  try {
    emailSent = await sendContactNotices({ name, email, phone, subject, message });
  } catch (error) {
    console.error('Contact email failed:', error.message);
  }

  res.status(201).json({ ok: true, id: result.insertId, emailSent });
});

router.patch('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const status = String(req.body?.status || '');
  if (!['new', 'read', 'archived'].includes(status)) {
    return res.status(400).json({ ok: false, error: 'Invalid status' });
  }
  await query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, async (req, res) => {
  await query('DELETE FROM contact_messages WHERE id = ?', [Number(req.params.id)]);
  res.json({ ok: true });
});

export default router;
