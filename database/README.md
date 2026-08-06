# Database Scripts

This directory contains database-related scripts and configurations.

## Structure

```
database/
├── migrations/     # Database migration files (managed by Prisma)
└── README.md       # This file
```

## Usage

### Generate Prisma Client

```bash
npm run db:generate
```

### Run Migrations

```bash
# Development
npm run db:migrate

# Production
npm run prisma:migrate:prod --prefix backend
```

### Seed Database

```bash
npm run db:seed
```

### Open Prisma Studio

```bash
npm run db:studio
```

## Connection

The database connection is managed through the `DATABASE_URL` environment variable. See the `.env.example` file for the connection string format.
