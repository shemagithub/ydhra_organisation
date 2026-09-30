import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'ccf_admin_token';

export function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
}

export function signAdminToken(admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, name: admin.name },
    getJwtSecret(),
    { expiresIn: '7d' },
  );
}

function cookieOptions() {
  const production = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: production ? 'none' : 'lax',
    secure: production,
    path: '/',
  };
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME] || bearerToken(req);
  if (!token) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.admin = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
    return next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
}

export function optionalAuth(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME] || bearerToken(req);
  if (!token) return next();
  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.admin = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    // ignore
  }
  return next();
}

function bearerToken(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7);
}

export { COOKIE_NAME };
