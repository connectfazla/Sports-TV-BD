# Sports TV BD

Production-grade Android IPTV/sports streaming platform for Bangladesh BDIX users.

## Structure
- `flutter_app/` — Flutter Android app
- `backend/` — Node.js + Express + PostgreSQL API
- `admin/` — Next.js admin dashboard
- `infra/` — Docker, Nginx, CI/CD

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env
# edit .env
npm install
npm run migrate
npm run dev
```

### Admin
```bash
cd admin
cp .env.example .env.local
npm install
npm run dev
```

### Infrastructure
```bash
cd infra
cp .env.example .env
docker-compose up -d
```
