# Creation Care Foundation — Admin API

Node.js + Express + MySQL backend for the CCF admin panel.

## Setup

1. Create `backend/.env` from `.env.example`
2. Start MySQL and set `DB_*` values
3. Install and run:

```bash
cd backend
npm install
npm run db:init
npm run dev
```

Default admin (from `.env`):

- Email: `admin@creationcare.org`
- Password: `ChangeMeCCF2026`

API base: `http://localhost:4000`

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/login` | No | Login (`email`, `password`) |
| POST | `/api/auth/logout` | No | Clear session cookie |
| GET | `/api/auth/me` | Yes | Current admin |
| GET | `/api/content` | No | Public site content |
| PUT | `/api/content` | Yes | Update site content |
| GET | `/api/dashboard/stats` | Yes | Dashboard metrics |
| GET/POST | `/api/messages` | Mixed | Contact inbox |
| POST | `/api/upload` | Yes | Image upload |

Saving content also syncs `public/content/site-content.json` when `SYNC_PUBLIC_JSON=true`.
