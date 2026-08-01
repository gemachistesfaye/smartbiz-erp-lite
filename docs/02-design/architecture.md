# System Architecture
## SmartBiz ERP Lite

**Style:** Offline-First PWA + Monolithic Backend

---

## High-Level Overview

```mermaid
graph TB
    subgraph Client["Client (PWA)"]
        UI[React UI]
        SW[Service Worker]
        IDB[(IndexedDB - Dexie.js)]
    end

    subgraph API["API Gateway"]
        GW[Nginx / Vercel Edge]
    end

    subgraph Backend["Backend (NestJS)"]
        Auth[Auth Module]
        Users[Users Module]
        Products[Products Module]
        Inventory[Inventory Module]
        Customers[Customers Module]
        Sales[Sales Module]
        Reports[Reports Module]
    end

    subgraph DB["Database"]
        Prisma[Prisma ORM]
        PG[(PostgreSQL 15)]
    end

    UI -->|REST API + JSON| GW
    SW --> IDB
    GW --> Auth
    Auth --> Users
    Auth --> Products
    Products --> Inventory
    Sales --> Products
    Sales --> Inventory
    Sales --> Customers
    Reports --> Sales
    Reports --> Customers
    Backend --> Prisma
    Prisma --> PG
```

---

## Tech Stack

| Layer | Tech | Version |
|:------|:-----|:--------|
| **Frontend** | React, TanStack Router, TanStack Query, Zustand, Tailwind, Shadcn UI, Vite, TypeScript | 19.x, 6.x, 3.x, 5.x |
| **Backend** | NestJS, Prisma, PostgreSQL, JWT, bcrypt, class-validator | 10.x, 5.x, 15 |
| **PWA** | Workbox (Service Worker), Dexie.js (IndexedDB) | Latest |
| **Deploy** | Vercel (frontend), Railway (backend), Cloudflare (DNS) | - |

---

## Frontend Structure

```
frontend/src/
├── app/              # Shell, providers, routes, layout
├── components/       # Shared: ui/ (Shadcn), layout/, shared/
├── features/         # Domain-driven modules:
│   ├── auth/         #   pages/, components/, hooks/, api/
│   ├── products/
│   ├── pos/
│   ├── customers/
│   ├── inventory/
│   ├── dashboard/
│   └── settings/
├── lib/              # api.ts, auth.ts, db.ts (IndexedDB), offline.ts
├── hooks/            # useOnlineStatus, useSync
└── types/            # api.ts, models.ts
```

**Key decisions:**
- **TanStack Router** → file-based, type-safe nested layouts
- **TanStack Query** → caching, background refetch, optimistic updates
- **Zustand** → lightweight client state + persistence
- **Dexie.js** → IndexedDB wrapper for offline storage + sync

---

## Backend Structure

```
backend/
├── prisma/           # schema.prisma, seed.ts, migrations/
├── src/
│   ├── common/       # Guards (auth, roles, tenant), decorators, interceptors, filters, pipes
│   ├── modules/
│   │   ├── auth/     # controller, service, JWT strategy, DTOs
│   │   ├── users/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── customers/
│   │   ├── sales/
│   │   └── reports/
│   └── config/       # environment config
```

---

## Module Dependencies

```mermaid
graph TD
    Auth[Auth Module] --> Users[Users Module]
    Auth --> Products[Products Module]
    Auth --> Customers[Customers Module]

    Products --> Inventory[Inventory Module]
    Sales[Sales Module] --> Products
    Sales --> Inventory
    Sales --> Customers
    Reports[Reports Module] --> Sales
    Reports --> Customers
    Reports --> Products
```

---

## Offline-First Strategy

```mermaid
graph LR
    subgraph Online["Online Mode"]
        A[User Action] --> B[API Call] --> C[Server Confirms] --> D[Update Cache]
    end

    subgraph Offline["Offline Mode"]
        E[User Action] --> F[Save to IndexedDB] --> G["Saved offline" Indicator]
    end

    subgraph Sync["Sync on Reconnect"]
        H[Service Worker detects online] --> I[Process pending queue]
        I --> J[POST /api/sales/sync batch]
        J --> K[Server returns IDs]
        K --> L[Update IndexedDB]
    end
```

- **Static assets:** Precached by Service Worker
- **API:** Network-first, fallback to cache
- **Data:** Products/customers cached in IndexedDB; pending sales queued

---

## API Design

### RESTful Conventions

| Method | Pattern | Example |
|:-------|:--------|:--------|
| GET | `/api/{resource}` | GET `/api/products` |
| GET | `/api/{resource}/:id` | GET `/api/products/abc-123` |
| POST | `/api/{resource}` | POST `/api/products` |
| PUT | `/api/{resource}/:id` | PUT `/api/products/abc-123` |
| DELETE | `/api/{resource}/:id` | DELETE `/api/products/abc-123` |
| POST | `/api/{resource}/{action}` | POST `/api/sales/checkout` |

### Response Format

```json
{ "success": true, "data": {...}, "meta": { "page": 1, "limit": 20, "total": 150 } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
```

### Auth Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as Database

    C->>S: POST /auth/login {email, password}
    S->>DB: Find user by email
    DB-->>S: User data
    S->>S: bcrypt compare
    S->>S: Generate JWT {userId, role, tenantId}
    S-->>C: {token}
    C->>S: GET /api/products (Bearer token)
    S->>S: Verify JWT, extract tenantId
    S->>DB: SELECT * WHERE tenantId = ?
    DB-->>S: Products
    S-->>C: Products list
```

### Tenant Isolation

Every query auto-filtered by `tenantId` via Prisma middleware:
```typescript
prisma.$use(async (params, next) => {
  if (params.args.where) params.args.where.tenantId = params.context.tenantId;
  return next(params);
});
```

---

## Database Relationships

```mermaid
erDiagram
    BUSINESS ||--o{ USER : has
    BUSINESS ||--o{ PRODUCT : owns
    BUSINESS ||--o{ CATEGORY : owns
    BUSINESS ||--o{ CUSTOMER : owns
    BUSINESS ||--o{ SALE : owns
    BUSINESS ||--o{ PURCHASE : owns
    BUSINESS ||--o{ EXPENSE : owns
    BUSINESS ||--o{ EXPENSE_CATEGORY : owns
    BUSINESS ||--|| BUSINESS_SETTINGS : has

    CATEGORY ||--o{ PRODUCT : classifies
    PRODUCT ||--|| INVENTORY : has
    PRODUCT ||--o{ SALE_ITEM : appears_in
    PRODUCT ||--o{ PURCHASE_ITEM : appears_in
    PRODUCT ||--o{ INVENTORY_TRANSACTION : tracked_in

    USER ||--o{ SALE : processes
    USER ||--o{ EXPENSE : records
    USER ||--o{ AUDIT_LOG : generates

    CUSTOMER ||--o{ SALE : makes
    CUSTOMER ||--o{ PAYMENT : makes

    SALE ||--o{ SALE_ITEM : contains
    SALE ||--o{ PAYMENT : has
    SUPPLIER ||--o{ PURCHASE : supplies
    PURCHASE ||--o{ PURCHASE_ITEM : contains
    EXPENSE_CATEGORY ||--o{ EXPENSE : classifies
```

### Indexing

| Table | Index | Purpose |
|:------|:------|:--------|
| User | `tenantId`, `email` (unique) | Isolation + login |
| Product | `tenantId`, `barcode` | Isolation + scanning |
| Category | `tenantId, name` (unique) | Prevent duplicates |
| Customer | `tenantId` | Isolation |
| Sale | `tenantId`, `createdAt` | Isolation + date queries |
| SaleItem | `saleId` | Sale detail lookups |

---

## Service Layer Pattern

```mermaid
graph TB
    A[Controller] -->|HTTP request| B[Service]
    B -->|Business logic| C[Prisma Repository]
    C -->|Queries| D[(PostgreSQL)]

    A -.->|Validates input| A
    B -.->|Validates rules| B
    C -.->|Auto-filtered by tenantId| C
```

### Key Business Logic

**Sales Checkout:** validate products → validate stock → BEGIN TX → create Sale → create SaleItems → decrement inventory → (if credit) update balance → COMMIT

**Offline Sync:** receive batch → for each: validate products → validate stock → process like checkout → assign server IDs → return offlineId→serverId mapping

---

## Security Layers

| Layer | Implementation |
|:------|:---------------|
| Transport | HTTPS (TLS 1.3) |
| Auth | JWT (24h expiry) |
| Authorization | Role-based guards (RBAC) |
| Tenant Isolation | ORM-level filtering + DB constraints |
| Input Validation | class-validator on all DTOs |
| Passwords | bcrypt (12 salt rounds) |
| Rate Limiting | 100 req/min per user |
| SQL Injection | Prisma parameterized queries |
| XSS | React auto-escaping + CSP headers |

---

## Deployment

```mermaid
graph LR
    V[Vercel - Frontend CDN + SSL] --> CF[Cloudflare DNS]
    R[Railway - Backend Docker] --> CF
    PG[(Supabase/Railway - PostgreSQL)] --> R
    GH[GitHub Actions CI/CD] --> V
    GH --> R
```

**CI/CD:** PR → Lint → Type Check → Test → Build → Deploy

---

## Scalability (MVP → Growth)

| Phase | Change |
|:------|:-------|
| MVP | Monolith + single PostgreSQL + static CDN |
| Growth | Read replicas, extract hot services, Redis cache, BullMQ jobs, Elasticsearch |
