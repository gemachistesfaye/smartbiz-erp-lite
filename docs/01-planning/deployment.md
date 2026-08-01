# Deployment & DevOps Strategy

This document outlines the infrastructure, CI/CD, and deployment strategy for SmartBiz ERP Lite.

## 1. Local Development
The project uses Docker Compose to provide a seamless local development experience without needing to manually install PostgreSQL.

### `docker-compose.yml` (Local)
- **Service:** `postgres` (PostgreSQL 15)
- **Port:** `5432`
- **Volume:** Persisted to `./.docker-data/postgres`

Developers simply run `docker-compose up -d` to start the database, and then run the frontend and backend development servers via `npm run dev`.

## 2. Continuous Integration (CI)
GitHub Actions is configured to run on every Pull Request to `main`.
- **Workflow Steps:**
  1. Checkout code.
  2. Setup Node.js.
  3. Install dependencies (`npm ci`).
  4. Run Backend Unit Tests (Jest).
  5. Run Frontend Linting and Type Checking.
  6. Ensure Prisma schema generates correctly.

## 3. Production Deployment

Given the target audience (SMEs in Ethiopia), keeping hosting costs low while ensuring high availability is critical.

### Frontend (PWA)
- **Host:** Vercel (or Cloudflare Pages).
- **Reason:** Outstanding global CDN, out-of-the-box support for TanStack Start / Vite, auto-deploy on push to `main`, and free SSL. The frontend will be served extremely fast, which is critical for the PWA Service Worker installation.

### Backend (NestJS API)
- **Host:** Railway or Render.
- **Reason:** Easy deployment of Dockerized Node.js applications, predictable pricing, and managed PostgreSQL databases.
- **Environment Variables:**
  - `DATABASE_URL`: Connection string for the managed PostgreSQL instance.
  - `JWT_SECRET`: Secure key for signing tokens.
  - `FRONTEND_URL`: CORS configuration to only allow requests from the Vercel app.

### Database
- **Host:** Managed PostgreSQL provided by Railway or Supabase.
- **Reason:** Automated backups, easy scaling, and built-in connection pooling (important for serverless/edge environments if we migrate the backend in the future).

## 4. Release Process
1. Development happens on `feature/*` branches.
2. PR is merged into `main` after CI passes.
3. GitHub Actions triggers a deploy hook to Vercel (Frontend) and Railway (Backend).
4. Prisma database migrations run automatically during the backend build step (`npx prisma migrate deploy`).
