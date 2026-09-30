import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import multer from 'multer';
import { query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../../uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
  },
});

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No file uploaded' });
  }
  const url = `/uploads/${req.file.filename}`;
  const result = await query(
    `INSERT INTO media_assets (filename, original_name, mime_type, size_bytes, url)
     VALUES (?, ?, ?, ?, ?)`,
    [req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, url],
  );
  res.status(201).json({
    ok: true,
    asset: {
      id: result.insertId,
      url,
      filename: req.file.filename,
      originalName: req.file.originalname,
    },
  });
});

router.get('/', requireAuth, async (_req, res) => {
  const rows = await query(
    'SELECT id, filename, original_name AS originalName, mime_type AS mimeType, size_bytes AS sizeBytes, url, created_at AS createdAt FROM media_assets ORDER BY id DESC LIMIT 100',
  );
  res.json({ ok: true, assets: rows });
});

export default router;
