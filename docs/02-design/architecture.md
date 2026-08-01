# System Architecture
## SmartBiz ERP Lite

**Version:** 1.0
**Architecture Style:** Offline-First Progressive Web Application with Monolithic Backend

---

## 1. High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser/PWA)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   React UI  │  │ State Mgmt  │  │  IndexedDB  │  │  Service   │ │
│  │   (TanStack │  │ (Zustand/   │  │  (Offline   │  │  Worker    │ │
│  │    Router)  │  │  Context)   │  │   Storage)  │  │  (PWA)     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ REST API (JSON)
                               │ + Service Worker Cache
┌──────────────────────────────┴──────────────────────────────────────┐
│                        API GATEWAY (Reverse Proxy)                    │
│                   Nginx / Vercel Edge / Cloudflare                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                      BACKEND (NestJS Monolith)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   Auth      │  │   Product   │  │   Sales     │  │   Report   │ │
│  │   Module    │  │   Module    │  │   Module    │  │   Module   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │  Customer   │  │  Inventory  │  │  User       │                 │
│  │  Module     │  │  Module     │  │  Module     │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                        ORM LAYER (Prisma)                             │
│              Tenant Isolation Enforced Here                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                     DATABASE (PostgreSQL 15)                           │
│                   Managed (Supabase / Railway)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Technology Stack

| Technology | Purpose | Version |
|:-----------|:--------|:--------|
| React | UI framework | 19.x |
| TanStack Router | File-based routing | Latest |
| TanStack Query | Server state management | Latest |
| Tailwind CSS | Utility-first styling | 3.x |
| Shadcn UI | Component library | Latest |
| Zustand | Client state management | Latest |
| Vite | Build tool & dev server | 6.x |
| TypeScript | Type safety | 5.x |

### 2.2 Frontend Directory Structure

```
frontend/
├── public/
│   ├── icons/              # PWA icons (192x192, 512x512)
│   ├── favicon.svg         # Browser tab icon
│   └── manifest.json       # PWA manifest
├── src/
│   ├── app/                # App shell, providers, routing
│   │   ├── providers.tsx    # Context providers wrapper
│   │   ├── routes.tsx       # Route definitions
│   │   └── layout.tsx       # Main layout with navigation
│   ├── components/          # Shared UI components
│   │   ├── ui/             # Shadcn UI primitives
│   │   ├── layout/         # Header, Sidebar, BottomNav
│   │   └── shared/         # Reusable business components
│   ├── features/            # Feature modules (domain-driven)
│   │   ├── auth/
│   │   │   ├── pages/      # Login, Register
│   │   │   ├── components/ # LoginForm, RegisterForm
│   │   │   ├── hooks/      # useAuth, useLogin
│   │   │   └── api/        # auth.api.ts
│   │   ├── products/
│   │   │   ├── pages/      # ProductList, ProductForm
│   │   │   ├── components/ # ProductCard, ProductSearch
│   │   │   ├── hooks/      # useProducts, useProduct
│   │   │   └── api/        # products.api.ts
│   │   ├── pos/
│   │   │   ├── pages/      # POSScreen
│   │   │   ├── components/ # Cart, ProductGrid, Checkout
│   │   │   ├── hooks/      # useCart, useCheckout
│   │   │   └── api/        # sales.api.ts
│   │   ├── customers/
│   │   │   ├── pages/      # CustomerList, CustomerDetail
│   │   │   ├── components/ # CustomerCard, PaymentForm
│   │   │   ├── hooks/      # useCustomers
│   │   │   └── api/        # customers.api.ts
│   │   ├── inventory/
│   │   │   ├── pages/      # InventoryDashboard
│   │   │   ├── components/ # StockAdjustment, LowStockAlert
│   │   │   ├── hooks/      # useInventory
│   │   │   └── api/        # inventory.api.ts
│   │   ├── dashboard/
│   │   │   ├── pages/      # DashboardPage
│   │   │   ├── components/ # SalesSummary, DebtOverview
│   │   │   └── hooks/      # useDashboard
│   │   └── settings/
│   │       └── pages/      # Profile, BusinessSettings
│   ├── lib/                 # Utilities and helpers
│   │   ├── api.ts          # Axios/fetch wrapper
│   │   ├── auth.ts         # JWT handling
│   │   ├── db.ts           # IndexedDB setup (Dexie)
│   │   ├── offline.ts      # Offline detection & sync
│   │   └── utils.ts        # General utilities
│   ├── hooks/               # Global custom hooks
│   │   ├── useOnlineStatus.ts
│   │   └── useSync.ts
│   └── types/               # TypeScript type definitions
│       ├── api.ts          # API response types
│       ├── models.ts       # Domain model types
│       └── index.ts        # Re-exports
├── index.html               # Entry HTML
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

### 2.3 Frontend Key Decisions

| Decision | Choice | Rationale |
|:---------|:-------|:----------|
| Routing | TanStack Router | File-based, type-safe, nested layouts |
| Server State | TanStack Query | Caching, background refetch, optimistic updates |
| Client State | Zustand | Lightweight, no boilerplate, works with persistence |
| UI Components | Shadcn UI | Copy-paste components, Tailwind-native, customizable |
| Build Tool | Vite | Fast HMR, ESM-native, excellent DX |
| Offline Storage | Dexie.js | IndexedDB wrapper, relational queries, sync support |

### 2.4 PWA Strategy

```
┌─────────────────────────────────────────────┐
│              PWA Architecture                │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐    ┌──────────────────┐   │
│  │   Service    │    │   App Shell      │   │
│  │   Worker     │◄───│   (HTML/CSS/JS)  │   │
│  │   (Workbox)  │    │   Cached First   │   │
│  └──────┬──────┘    └──────────────────┘   │
│         │                                   │
│  ┌──────┴──────┐    ┌──────────────────┐   │
│  │   Cache     │    │   IndexedDB      │   │
│  │   Strategy  │    │   (Dexie.js)     │   │
│  │             │    │                  │   │
│  │ Static:     │    │ Products         │   │
│  │ Precache    │    │ Customers        │   │
│  │             │    │ PendingSales     │   │
│  │ API:        │    │ UserPreferences  │   │
│  │ Network     │    │                  │   │
│  │ First,      │    │                  │   │
│  │ Fallback    │    │                  │   │
│  └─────────────┘    └──────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │         Background Sync              │   │
│  │                                      │   │
│  │  Queue: POST /api/sales/sync         │   │
│  │  Retry: Exponential backoff          │   │
│  │  Conflict: Last-write-wins           │   │
│  └──────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Offline-First Data Flow:**

1. **Online Mode:**
   - User performs action → API call → Server confirms → Update local cache
   - TanStack Query caches API responses for instant re-renders

2. **Offline Mode:**
   - User performs action → Save to IndexedDB (pending queue)
   - Show "Saved offline" indicator
   - Product/customer data served from IndexedDB cache

3. **Sync on Reconnection:**
   - Service Worker detects online event
   - Background sync processes pending queue
   - POST /api/sales/sync with batch of offline sales
   - Server processes and returns results
   - IndexedDB updated with server-assigned IDs
   - UI updates via TanStack Query invalidation

---

## 3. Backend Architecture

### 3.1 Technology Stack

| Technology | Purpose | Version |
|:-----------|:--------|:--------|
| NestJS | Framework (Node.js) | 10.x |
| Prisma | ORM | 5.x |
| PostgreSQL | Database | 15 |
| JWT | Authentication | - |
| class-validator | Request validation | - |
| bcrypt | Password hashing | - |

### 3.2 Backend Directory Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed data
│   └── migrations/            # Migration files
├── src/
│   ├── main.ts                # Application entry point
│   ├── app.module.ts          # Root module
│   ├── common/                # Shared utilities
│   │   ├── guards/
│   │   │   ├── auth.guard.ts         # JWT authentication guard
│   │   │   ├── roles.guard.ts        # RBAC authorization guard
│   │   │   └── tenant.guard.ts       # Tenant isolation guard
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts    # @Roles() decorator
│   │   │   ├── tenant.decorator.ts   # @TenantId() decorator
│   │   │   └── current-user.decorator.ts
│   │   ├── interceptors/
│   │   │   ├── tenant.interceptor.ts # Auto-filter by tenantId
│   │   │   └── logging.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── dto/
│   │       └── pagination.dto.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── register.dto.ts
│   │   │       └── login.dto.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   ├── products/
│   │   │   ├── products.module.ts
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   └── dto/
│   │   │       ├── create-product.dto.ts
│   │   │       └── update-product.dto.ts
│   │   ├── inventory/
│   │   │   ├── inventory.module.ts
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.service.ts
│   │   │   └── dto/
│   │   │       └── adjust-stock.dto.ts
│   │   ├── customers/
│   │   │   ├── customers.module.ts
│   │   │   ├── customers.controller.ts
│   │   │   ├── customers.service.ts
│   │   │   └── dto/
│   │   │       ├── create-customer.dto.ts
│   │   │       └── payment.dto.ts
│   │   ├── sales/
│   │   │   ├── sales.module.ts
│   │   │   ├── sales.controller.ts
│   │   │   ├── sales.service.ts
│   │   │   └── dto/
│   │   │       ├── checkout.dto.ts
│   │   │       └── sync.dto.ts
│   │   └── reports/
│   │       ├── reports.module.ts
│   │       ├── reports.controller.ts
│   │       └── reports.service.ts
│   └── config/
│       └── configuration.ts   # Environment config
├── test/                      # Test files
│   ├── unit/
│   └── integration/
├── Dockerfile
├── docker-compose.yml
├── nest-cli.json
├── tsconfig.json
└── package.json
```

### 3.3 Backend Module Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                      AppModule                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │  Users   │  │ Products │  │Inventory │   │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │             │             │           │
│       │             │             │             │           │
│  ┌────┴─────┐  ┌────┴─────┐  ┌───┴──────┐  ┌───┴──────┐   │
│  │ Customers│  │  Sales   │  │ Reports  │  │          │   │
│  │  Module  │◄─│  Module  │─►│  Module  │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  Dependencies:                                              │
│  - Sales → Products (check stock, get prices)              │
│  - Sales → Customers (credit sales)                        │
│  - Sales → Inventory (deduct stock)                        │
│  - Reports → Sales (aggregate data)                        │
│  - Reports → Customers (debt summaries)                    │
│  - Users → Auth (JWT validation)                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. API Layer Design

### 4.1 RESTful API Convention

| HTTP Method | Endpoint Pattern | Action | Example |
|:------------|:-----------------|:-------|:--------|
| GET | `/api/{resource}` | List | GET /api/products |
| GET | `/api/{resource}/:id` | Get one | GET /api/products/abc-123 |
| POST | `/api/{resource}` | Create | POST /api/products |
| PUT | `/api/{resource}/:id` | Update | PUT /api/products/abc-123 |
| DELETE | `/api/{resource}/:id` | Delete | DELETE /api/products/abc-123 |
| POST | `/api/{resource}/{action}` | Action | POST /api/sales/checkout |

### 4.2 API Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "price", "message": "Price must be a positive number" }
    ]
  }
}
```

### 4.3 Authentication Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │  Server  │         │   DB     │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │
     │  POST /auth/login  │                    │
     │  { email, pass }   │                    │
     │───────────────────►│                    │
     │                    │  Find user by email│
     │                    │───────────────────►│
     │                    │  ◄──── User data   │
     │                    │                    │
     │                    │  Compare password  │
     │                    │  (bcrypt)          │
     │                    │                    │
     │                    │  Generate JWT      │
     │                    │  { userId, role,   │
     │                    │    tenantId }      │
     │                    │                    │
     │  ◄──── { token }  │                    │
     │                    │                    │
     │  GET /api/products │                    │
     │  Authorization:    │                    │
     │  Bearer <token>    │                    │
     │───────────────────►│                    │
     │                    │  Verify JWT        │
     │                    │  Extract tenantId  │
     │                    │  Attach to request│
     │                    │                    │
     │                    │  SELECT * FROM     │
     │                    │  products WHERE    │
     │                    │  tenantId = ?      │
     │                    │───────────────────►│
     │                    │  ◄──── Products    │
     │                    │                    │
     │  ◄──── Products    │                    │
     │                    │                    │
```

### 4.4 Tenant Isolation Strategy

Every database query is automatically filtered by `tenantId`:

```typescript
// Tenant Isolation Guard (NestJS)
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // From JWT payload
    request.tenantId = user.tenantId; // Attach to request
    return true;
  }
}

// Prisma Middleware (applied to all queries)
prisma.$use(async (params, next) => {
  if (params.args.where) {
    params.args.where.tenantId = params.context.tenantId;
  }
  return next(params);
});
```

---

## 5. Database Layer Design

### 5.1 Schema Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Tenant     │────►│     User     │     │   Category   │
│              │     │              │     │              │
│ id           │     │ id           │     │ id           │
│ name         │     │ tenantId     │     │ tenantId     │
│ createdAt    │     │ email        │     │ name         │
│ updatedAt    │     │ password     │     │ products[]   │
│              │     │ firstName    │     └──────────────┘
│ users[]      │     │ lastName     │
│ products[]   │     │ role         │     ┌──────────────┐
│ categories[] │     │ isActive     │     │   Product    │
│ customers[]  │     │ sales[]      │     │              │
│ sales[]      │     └──────────────┘     │ id           │
└──────────────┘                          │ tenantId     │
                                          │ categoryId   │
┌──────────────┐     ┌──────────────┐     │ name         │
│  Inventory   │     │   Customer   │     │ sku          │
│              │     │              │     │ barcode      │
│ id           │     │ id           │     │ baseCost     │
│ productId    │     │ tenantId     │     │ overheadCost │
│ quantity     │     │ firstName    │     │ landedCost   │
│ minThreshold │     │ lastName     │     │ sellingPrice │
│ updatedAt    │     │ phone        │     │ inventory    │
│              │     │ creditBalance│     │ saleItems[]  │
│ product      │     │ sales[]      │     └──────────────┘
└──────────────┘     └──────────────┘
                                          ┌──────────────┐
┌──────────────┐     ┌──────────────┐     │  SaleItem    │
│     Sale     │────►│  SaleItem    │     │              │
│              │     │              │     │ id           │
│ id           │     │ id           │     │ saleId       │
│ tenantId     │     │ saleId       │     │ productId    │
│ cashierId    │     │ productId    │     │ quantity     │
│ customerId   │     │ quantity     │     │ unitPrice    │
│ paymentMethod│     │ unitPrice    │     │ totalPrice   │
│ totalAmount  │     │ totalPrice   │     └──────────────┘
│ items[]      │     └──────────────┘
│ createdAt    │
└──────────────┘
```

### 5.2 Key Relationships

| Relationship | Type | Cascade |
|:-------------|:-----|:--------|
| Tenant → Users | 1:N | Cascade delete |
| Tenant → Products | 1:N | Cascade delete |
| User → Sales (cashier) | 1:N | Restrict |
| Product → Inventory | 1:1 | Cascade delete |
| Sale → SaleItems | 1:N | Cascade delete |
| Customer → Sales | 1:N | Restrict |
| Category → Products | 1:N | Restrict |

### 5.3 Indexing Strategy

| Table | Index | Purpose |
|:------|:------|:--------|
| User | `tenantId` | Tenant isolation queries |
| User | `email` (unique) | Login lookups |
| Product | `tenantId` | Tenant isolation queries |
| Product | `barcode` | Barcode scanning |
| Category | `tenantId, name` (unique) | Prevent duplicate categories |
| Customer | `tenantId` | Tenant isolation queries |
| Sale | `tenantId` | Tenant isolation queries |
| Sale | `createdAt` | Date range queries |
| SaleItem | `saleId` | Sale detail queries |

---

## 6. Service Layer Design

### 6.1 Service Responsibility Pattern

Each module follows this service pattern:

```
┌─────────────────────────────────────────────────────┐
│                   Controller                         │
│  - Receives HTTP request                            │
│  - Validates input (DTOs + Pipes)                   │
│  - Calls service method                             │
│  - Returns HTTP response                            │
├─────────────────────────────────────────────────────┤
│                    Service                           │
│  - Contains business logic                          │
│  - Validates business rules                         │
│  - Orchestrates database operations                 │
│  - Handles transactions where needed                │
│  - Throws domain-specific exceptions                │
├─────────────────────────────────────────────────────┤
│               Prisma Repository                     │
│  - Database queries                                 │
│  - CRUD operations                                  │
│  - Query optimization                               │
│  - (Auto-filtered by tenantId via middleware)       │
└─────────────────────────────────────────────────────┘
```

### 6.2 Key Business Logic Examples

**Sales Checkout Service:**
```
1. Validate all products exist and belong to tenant
2. Validate sufficient stock for each item
3. If credit sale: validate customer exists and credit limit
4. BEGIN TRANSACTION
5. Create Sale record
6. Create SaleItem records
7. Decrement inventory for each product
8. If credit sale: update customer creditBalance
9. COMMIT TRANSACTION
10. Return sale with items
```

**Offline Sync Service:**
```
1. Receive batch of offline sales
2. For each sale:
   a. Validate products still exist
   b. Validate stock availability
   c. Process like normal checkout
   d. Assign server-generated IDs
3. Return mapping of offlineId → serverId
4. Client updates IndexedDB with server IDs
```

---

## 7. Error Handling Strategy

### 7.1 Exception Hierarchy

```
HttpException (NestJS base)
├── BadRequestException (400) - Validation errors
├── UnauthorizedException (401) - Authentication failures
├── ForbiddenException (403) - Authorization failures
├── NotFoundException (404) - Resource not found
├── ConflictException (409) - Duplicate resources
└── InternalServerErrorException (500) - Unexpected errors
```

### 7.2 Error Response Format

```json
{
  "statusCode": 400,
  "message": ["price must be a positive number"],
  "error": "Bad Request",
  "timestamp": "2026-07-31T10:30:00.000Z",
  "path": "/api/products"
}
```

---

## 8. Security Architecture

### 8.1 Security Layers

| Layer | Implementation |
|:------|:---------------|
| **Transport** | HTTPS only (TLS 1.3) |
| **Authentication** | JWT with 24h expiry |
| **Authorization** | Role-based guards (RBAC) |
| **Tenant Isolation** | ORM-level filtering + DB constraints |
| **Input Validation** | class-validator on all DTOs |
| **Password Security** | bcrypt with 12 salt rounds |
| **CORS** | Restricted to frontend origin |
| **Rate Limiting** | 100 req/min per user |
| **SQL Injection** | Prisma parameterized queries |
| **XSS** | React auto-escaping + CSP headers |

### 8.2 JWT Payload Structure

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "OWNER",
  "tenantId": "tenant-uuid",
  "iat": 1690000000,
  "exp": 1690086400
}
```

---

## 9. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │   Vercel    │     │  Railway /  │     │  Supabase / │   │
│  │  (Frontend) │     │   Render    │     │  Railway    │   │
│  │             │     │  (Backend)  │     │ (PostgreSQL) │   │
│  │  CDN + SSL  │     │  Docker     │     │  Managed DB  │   │
│  │  Edge Cache │     │  Container  │     │  Auto Backup │   │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘   │
│         │                   │                   │           │
│         │     ┌─────────────┴─────────────┐     │           │
│         └────►│       DNS (Cloudflare)     │◄────┘           │
│               │       SSL Termination      │                │
│               └───────────────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              GitHub Actions CI/CD                     │   │
│  │                                                      │   │
│  │  PR → Lint → Type Check → Test → Build → Deploy     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Scalability Considerations

### Current Architecture (MVP)
- **Monolithic backend** - Simple, fast to develop, easy to debug
- **Single PostgreSQL instance** - Sufficient for 1,000 tenants
- **Static frontend on CDN** - Infinite horizontal scaling
- **JWT stateless auth** - No session storage needed

### Growth Path (Phase 2+)
1. **Database:** Add read replicas for reporting queries
2. **Backend:** Extract hot modules into separate services (POS service, Reporting service)
3. **Caching:** Add Redis for session cache and frequent queries
4. **Queue:** Add Bull/BullMQ for background jobs (reports, sync processing)
5. **Search:** Add Elasticsearch for product catalog search at scale
