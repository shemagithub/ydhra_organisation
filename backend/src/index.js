import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initDatabase } from './init-db.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import messageRoutes from './routes/messages.js';
import dashboardRoutes from './routes/dashboard.js';
import uploadRoutes from './routes/upload.js';
import paymentRoutes, { handleXentriWebhook } from './routes/payments.js';
import { query } from './lib/db.js';
import { writePublicSitemap } from './lib/sitemap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

app.set('trust proxy', 1);
app.use(compression());
app.use(
  cors({
    origin(requestOrigin, callback) {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
    exposedHeaders: ['ETag'],
  }),
);
app.post('/api/webhooks/xentripay', express.raw({ type: 'application/json' }), (req, res, next) => {
  handleXentriWebhook(req, res).catch(next);
});
app.use(express.json({ limit: '4mb' }));
app.use(cookieParser());
app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '../uploads'), {
    maxAge: '7d',
    etag: true,
  }),
);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ccf-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ ok: false, error: err.message || 'Server error' });
});

async function start() {
  try {
    await initDatabase();
  } catch (err) {
    console.error('Database init failed:', err.message);
    if (err.code === 'ENOENT' || /seed-content\.json/.test(err.message)) {
      console.error('Upload seed-content.json into the same folder as app.js, then restart the Node.js app.');
    } else {
      console.error('Check DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in .env');
    }
    process.exit(1);
  }

  try {
    const rows = await query('SELECT payload FROM site_content ORDER BY id DESC LIMIT 1');
    const payload = rows[0]?.payload;
    const content = typeof payload === 'string' ? JSON.parse(payload) : payload;
    writePublicSitemap(content?.blogPosts || []);
  } catch (err) {
    console.warn('Could not refresh sitemap:', err.message);
  }

  app.listen(port, () => {
    console.log(`CCF backend listening on http://localhost:${port}`);
  });
}

start();
