import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

type DevSession = { authenticated: boolean };

/**
 * Local stand-in for the cPanel PHP admin API so /admin works under `npm run dev`.
 */
export function adminApiDevPlugin(rootDir: string): Plugin {
  const contentFile = path.join(rootDir, 'public/content/site-content.json');
  const configFile = path.join(rootDir, 'public/api/config.php');
  const session: DevSession = { authenticated: false };

  const readPassword = () => {
    try {
      const raw = fs.readFileSync(configFile, 'utf8');
      const match = raw.match(/'password'\s*=>\s*'([^']*)'/);
      return match?.[1] ?? 'ChangeMeCCF2026';
    } catch {
      return 'ChangeMeCCF2026';
    }
  };

  const sendJson = (res: import('http').ServerResponse, status: number, body: unknown) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(body));
  };

  const readBody = async (req: import('http').IncomingMessage) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    const raw = Buffer.concat(chunks).toString('utf8');
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, unknown>;
  };

  return {
    name: 'ccf-admin-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';
        if (!url.startsWith('/api/')) return next();

        try {
          if (url === '/api/me.php' && req.method === 'GET') {
            return sendJson(res, 200, { ok: true, authenticated: session.authenticated });
          }

          if (url === '/api/login.php' && req.method === 'POST') {
            const body = await readBody(req);
            const password = String(body.password ?? '');
            if (password !== readPassword()) {
              return sendJson(res, 401, { ok: false, error: 'Invalid password' });
            }
            session.authenticated = true;
            return sendJson(res, 200, { ok: true, authenticated: true });
          }

          if (url === '/api/logout.php' && req.method === 'POST') {
            session.authenticated = false;
            return sendJson(res, 200, { ok: true, authenticated: false });
          }

          if (url === '/api/content.php' && req.method === 'GET') {
            const raw = fs.readFileSync(contentFile, 'utf8');
            return sendJson(res, 200, { ok: true, content: JSON.parse(raw) });
          }

          if (url === '/api/content.php' && (req.method === 'PUT' || req.method === 'POST')) {
            if (!session.authenticated) {
              return sendJson(res, 401, { ok: false, error: 'Unauthorized' });
            }
            const body = await readBody(req);
            const content = (body.content ?? body) as Record<string, unknown>;
            if (!content.version || !content.contact || !content.blogPosts) {
              return sendJson(res, 400, { ok: false, error: 'Content missing required fields' });
            }
            fs.mkdirSync(path.dirname(contentFile), { recursive: true });
            fs.writeFileSync(contentFile, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
            return sendJson(res, 200, { ok: true, saved: true });
          }

          return sendJson(res, 405, { ok: false, error: 'Method not allowed' });
        } catch (error) {
          return sendJson(res, 500, {
            ok: false,
            error: error instanceof Error ? error.message : 'Server error',
          });
        }
      });
    },
  };
}
