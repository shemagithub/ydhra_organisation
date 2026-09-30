import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../lib/db.js';
import {
  clearAuthCookie,
  COOKIE_NAME,
  getJwtSecret,
  requireAuth,
  setAuthCookie,
  signAdminToken,
} from '../middleware/auth.js';

const router = Router();

router.get('/me', async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.json({ ok: true, authenticated: false });
  }
  try {
    const payload = jwt.verify(token, getJwtSecret());
    return res.json({
      ok: true,
      authenticated: true,
      admin: { id: payload.sub, email: payload.email, name: payload.name },
    });
  } catch {
    return res.json({ ok: true, authenticated: false });
  }
});

router.post('/login', async (req, res) => {
  const emailInput = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!password) {
    return res.status(400).json({ ok: false, error: 'Password is required' });
  }

  let admin = null;
  if (emailInput) {
    const rows = await query(
      'SELECT id, name, email, password_hash FROM admins WHERE email = ? LIMIT 1',
      [emailInput],
    );
    admin = rows[0];
  } else {
    const rows = await query(
      'SELECT id, name, email, password_hash FROM admins ORDER BY id ASC LIMIT 1',
    );
    admin = rows[0];
  }

  if (!admin) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials' });
  }

  const token = signAdminToken(admin);
  setAuthCookie(res, token);
  return res.json({
    ok: true,
    authenticated: true,
    admin: { id: admin.id, email: admin.email, name: admin.name },
  });
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true, authenticated: false });
});

router.get('/profile', requireAuth, async (req, res) => {
  res.json({
    ok: true,
    authenticated: true,
    admin: req.admin,
  });
});

export default router;
