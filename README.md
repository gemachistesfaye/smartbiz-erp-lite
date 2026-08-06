# SmartBiz ERP Lite

A production-ready Offline-First ERP Progressive Web Application designed for Ethiopian SMEs.

## Features

- **Products** - Product catalog management
- **Inventory** - Stock tracking and management
- **Pricing** - Dynamic pricing engine
- **Customers** - Customer management with credit tracking
- **Sales** - Point of Sale (POS) and sales management
- **Expenses** - Expense tracking and categorization
- **Reports** - Business analytics and reporting
- **Offline-First** - Works without internet connection

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Zustand
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL 15
- JWT Authentication
- Passport
- bcrypt
- Swagger

### DevOps
- Docker
- GitHub Actions CI/CD
- ESLint
- Prettier
- Husky
- lint-staged

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+
- Docker (optional)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/smartbiz-erp-lite.git
cd smartbiz-erp-lite
```

### 2. Run setup script

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 3. Start development

```bash
npm run dev
```

### 4. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Swagger Docs: http://localhost:3001/docs

## Project Structure

```
smartbiz-erp-lite/
├── frontend/          # React PWA (Vite + TypeScript)
│   ├── src/
│   │   ├── app/       # Shell, providers, routes, layout
│   │   ├── components/ # Shared: ui/ (Shadcn), layout/, shared/
│   │   ├── features/  # Domain-driven modules
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utilities, API client, constants
│   │   ├── routes/    # TanStack Router routes
│   │   └── types/     # TypeScript types
│   └── ...
├── backend/           # NestJS API
│   ├── src/
│   │   ├── common/    # Guards, decorators, filters, interceptors
│   │   ├── config/    # Configuration module
│   │   ├── modules/   # Feature modules (auth, users, health)
│   │   └── prisma/    # Prisma service
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── ...
├── docker/            # Docker configuration
├── docs/              # Project documentation
├── scripts/           # Development scripts
├── database/          # Database scripts
├── .github/           # GitHub Actions workflows
└── docker-compose.yml # Local development database
```

## Available Scripts

### Root

```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both frontend and backend
npm run lint             # Lint both frontend and backend
npm run typecheck        # Type check both frontend and backend
npm run test             # Test both frontend and backend
npm run format           # Format all files
```

### Frontend

```bash
npm run dev:frontend     # Start frontend only
npm run build:frontend   # Build frontend only
npm run lint:frontend    # Lint frontend only
npm run test:frontend    # Test frontend only
```

### Backend

```bash
npm run dev:backend      # Start backend only
npm run build:backend    # Build backend only
npm run lint:backend     # Lint backend only
npm run test:backend     # Test backend only
```

### Database

```bash
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
```

### Docker

```bash
npm run docker:up        # Start Docker containers
npm run docker:down      # Stop Docker containers
npm run docker:logs      # View Docker logs
```

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=SmartBiz ERP Lite
VITE_APP_VERSION=1.0.0
```

### Backend (.env)

```env
NODE_ENV=development
PORT=3001
API_PREFIX=api
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smartbiz_erp_lite?schema=public
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
```

## API Documentation

Once the backend is running, access the Swagger documentation at:
http://localhost:3001/docs

## Database

### ER Diagram

The database schema follows a multi-tenant architecture with the following core models:
- Business (tenant)
- User
- Product
- Inventory
- Customer
- Sale
- Expense

See `docs/02-design/database-design/04-er-diagrams.md` for the complete ER diagram.

### Migrations

```bash
# Create a new migration
cd backend
npx prisma migrate dev --name migration_name

# Apply migrations in production
npm run prisma:migrate:prod
```

## Development Guidelines

### Code Style

- Follow the engineering standards in `docs/01-planning/engineering-standards.md`
- Use TypeScript strict mode
- Follow Clean Architecture principles
- Use functional components for React
- Use NestJS patterns (Controller → Service → Prisma)

### Git Workflow

- Branch naming: `feature/`, `bugfix/`, `hotfix/`, `docs/`
- Commit messages follow Conventional Commits
- PR targets `develop` branch
- Squash merge for clean history

### Testing

- Unit tests for services
- Integration tests for API endpoints
- Component tests for UI components
- E2E tests for critical flows

## Deployment

### Frontend (Vercel)

```bash
# Build and deploy
cd frontend
npm run build
vercel deploy
```

### Backend (Railway)

```bash
# Build and deploy
cd backend
npm run build
railway deploy
```

### Database (Railway/Supabase)

1. Create a PostgreSQL instance
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `npm run prisma:migrate:prod`

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

For support, email support@smartbiz.com or create an issue on GitHub.
