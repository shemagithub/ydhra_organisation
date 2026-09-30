# Creation Care Foundation

Christian organization website for Creation Care Foundation (CCF) — mentoring, protecting, educating, and empowering communities while faithfully caring for God’s creation.

## Local development

### 1. Frontend

```bash
npm install
npm run dev
```

Site: http://localhost:5173  
Admin UI: http://localhost:5173/admin

### 2. Backend (Node.js + MySQL)

```bash
cd backend
cp .env.example .env   # if needed
npm install
npm run db:init
npm run dev
```

API: http://localhost:4000

Default admin login:

- Email: `admin@creationcare.org`
- Password: `ChangeMeCCF2026`

Change these in `backend/.env` before production.

The Vite dev server proxies `/api` and `/uploads` to the backend.

## Admin capabilities

- Dashboard overview (posts, programs, team, inbox)
- Edit contact + social links
- Edit home / about / donate / get-involved copy
- Manage programs and team roles
- Full blog editor (cover + multiple body images)
- Contact inbox from the public form
- Saves to MySQL and syncs `public/content/site-content.json`

## Production notes

- Host the Vite `dist/` build on cPanel (static) or any static host
- Run `backend` on a Node host (cPanel Node.js app, VPS, Railway, etc.)
- Point the frontend API base / proxy to that backend URL
- Keep MySQL credentials and `JWT_SECRET` private
