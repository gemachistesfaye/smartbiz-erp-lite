# SmartBiz ERP Lite

A production-ready Offline-First ERP Progressive Web Application designed for Ethiopian SMEs.

## Features

- **Dashboard** - KPI overview, charts, quick actions, activity feed
- **Products** - Complete product catalog with pricing engine
- **Categories** - Product category management with soft delete
- **Units** - Measurement unit management (Piece, Kg, Liter, etc.)
- **Pricing Engine** - Automatic selling price calculation with cost breakdown
- **Inventory** - Stock tracking and management
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
- Recharts (charts)
- Lucide Icons

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
│   │   ├── app/       # App shell and providers
│   │   ├── components/
│   │   │   ├── ui/        # Reusable UI primitives (Shadcn)
│   │   │   ├── layout/    # Sidebar, Navbar, DashboardLayout
│   │   │   ├── dashboard/ # Dashboard widgets and charts
│   │   │   └── shared/    # Shared components (DataTable, errors)
│   │   ├── features/  # Domain-driven modules
│   │   │   ├── auth/      # Authentication (store, hooks, forms)
│   │   │   ├── dashboard/ # Dashboard page
│   │   │   ├── products/  # Products (CRUD, form, detail, hooks)
│   │   │   ├── categories/# Categories (CRUD, form, list, hooks)
│   │   │   ├── units/     # Units (CRUD, form, list, hooks)
│   │   │   ├── inventory/ # Inventory (placeholder)
│   │   │   ├── customers/ # Customers (placeholder)
│   │   │   ├── sales/     # Sales (placeholder)
│   │   │   ├── expenses/  # Expenses (placeholder)
│   │   │   ├── reports/   # Reports (placeholder)
│   │   │   ├── settings/  # Settings (placeholder)
│   │   │   └── profile/   # Profile (placeholder)
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utilities, API client, constants
│   │   ├── routes/    # TanStack Router routes
│   │   ├── stores/    # Zustand stores
│   │   └── types/     # TypeScript types
│   └── ...
├── backend/           # NestJS API
│   ├── src/
│   │   ├── common/    # Guards, decorators, filters, interceptors
│   │   ├── config/    # Configuration module
│   │   ├── modules/   # Feature modules
│   │   │   ├── auth/      # Authentication
│   │   │   ├── users/     # User management
│   │   │   ├── categories/# Category CRUD
│   │   │   ├── units/     # Unit CRUD
│   │   │   ├── products/  # Product CRUD
│   │   │   ├── pricing/   # Pricing engine service
│   │   │   └── health/    # Health check
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

## Dashboard Architecture

### Layout Components

- **DashboardLayout** — Main layout with sidebar, navbar, and content area
- **Sidebar** — Collapsible navigation with active states, mobile drawer support
- **Navbar** — Top bar with search, notifications, theme toggle, user menu
- **Breadcrumbs** — Auto-generated from current route path

### Dashboard Widgets

- **StatCard** — KPI cards with trend indicators (up/down arrows, percentages)
- **ChartCard** — Wrapper for chart components with title and description
- **TableCard** — Card wrapper for table lists with "View All" link
- **ActivityCard** — Timeline-style activity feed with colored type indicators
- **QuickActionCard** — Clickable action cards for common operations

### Charts (Recharts)

- **SalesTrendChart** — Area chart (sales vs expenses over time)
- **RevenueChart** — Bar chart (monthly revenue)
- **InventoryDistributionChart** — Donut chart (inventory by category)
- **TopProductsChart** — Horizontal bar chart (best-selling products)
- **ExpenseBreakdownChart** — Pie chart (expense categories)

### DataTable

Reusable data table with:
- Column-based sorting (ascending/descending)
- Full-text search with filtering
- Pagination with page navigation
- Empty state, loading state
- Accessible markup (ARIA labels, roles)

## Routing Structure

| Route | Page | Auth Required |
|-------|------|:------------:|
| `/` | Redirects to `/dashboard` | No |
| `/login` | Login page | No |
| `/register` | Register page | No |
| `/dashboard` | Dashboard homepage | Yes |
| `/products` | Products list | Yes |
| `/products/:id` | Product detail with pricing | Yes |
| `/categories` | Categories list | Yes |
| `/units` | Units list | Yes |
| `/inventory` | Inventory management | Yes |
| `/customers` | Customer management | Yes |
| `/sales` | Sales / POS | Yes |
| `/expenses` | Expense tracking | Yes |
| `/reports` | Reports & analytics | Yes |
| `/settings` | Business settings | Yes |
| `/profile` | User profile | Yes |
| `*` | 404 Not Found | No |

## Product Management Module

### API Endpoints

#### Categories
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/categories` | List all categories | Owner, Manager, Cashier |
| GET | `/api/categories/:id` | Get category by ID | Owner, Manager, Cashier |
| POST | `/api/categories` | Create category | Owner, Manager |
| PATCH | `/api/categories/:id` | Update category | Owner, Manager |
| DELETE | `/api/categories/:id` | Soft delete category | Owner |
| PATCH | `/api/categories/:id/restore` | Restore deleted category | Owner |

#### Units
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/units` | List all units | Owner, Manager, Cashier |
| GET | `/api/units/:id` | Get unit by ID | Owner, Manager, Cashier |
| POST | `/api/units` | Create unit | Owner, Manager |
| PATCH | `/api/units/:id` | Update unit | Owner, Manager |
| DELETE | `/api/units/:id` | Soft delete unit | Owner |
| PATCH | `/api/units/:id/restore` | Restore deleted unit | Owner |

#### Products
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/products` | List products (filterable) | Owner, Manager, Cashier |
| GET | `/api/products/stats` | Get product statistics | Owner, Manager |
| GET | `/api/products/:id` | Get product with pricing | Owner, Manager, Cashier |
| POST | `/api/products` | Create product | Owner, Manager |
| PATCH | `/api/products/:id` | Update product | Owner, Manager |
| DELETE | `/api/products/:id` | Soft delete product | Owner |
| PATCH | `/api/products/:id/restore` | Restore deleted product | Owner |

#### Pricing
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/api/pricing/calculate` | Calculate pricing breakdown | Owner, Manager, Cashier |

### Pricing Engine

The pricing engine automatically calculates selling prices based on:

1. **Buying Price** - Base cost of the product
2. **Additional Costs** - Transportation, loading, packaging, storage, labor, customs, other
3. **VAT** - Value Added Tax percentage
4. **Profit Margin** - Desired profit percentage

**Formula:**
```
Total Cost = Buying Price + Sum(Additional Costs)
Cost Per Unit = Total Cost / Quantity Purchased
VAT Per Unit = Cost Per Unit * (VAT% / 100)
Cost + VAT = Cost Per Unit + VAT Per Unit
Selling Price = Cost + VAT * (1 + Profit% / 100)
```

The engine also supports **manual selling price override** for special pricing scenarios.

### Database Schema

**Category** - `id`, `businessId`, `name`, `description`, `color`, `icon`, `isActive`, `deletedAt`
- Unique constraint: `(businessId, name)`

**Unit** - `id`, `businessId`, `name`, `symbol`, `description`, `isActive`, `deletedAt`
- Unique constraint: `(businessId, symbol)`

**Product** - All pricing fields, relationships to Category and Unit, `ProductStatus` enum
- Unique constraints: `(businessId, sku)`, `(businessId, barcode)`
- Indexes: `businessId`, `businessId+categoryId`, `businessId+name`, `businessId+status`

**ProductImage** - `id`, `productId`, `url`, `alt`, `isPrimary`, `sortOrder`

## Theme Support

- **Light mode** — Default theme
- **Dark mode** — Via toggle in navbar
- **System preference** — Auto-detected on first visit
- **Persistence** — Saved to localStorage

Toggle the theme using the sun/moon icon in the top navigation bar.

## Reusable UI Components

| Component | Source | Description |
|-----------|--------|-------------|
| Button | Shadcn UI | Variants: default, destructive, outline, secondary, ghost, link |
| Card | Shadcn UI | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| Input | Shadcn UI | Text input with focus states |
| Badge | Shadcn UI | Status badges with variants |
| Skeleton | Shadcn UI | Loading placeholder |
| Dialog | Radix UI | Modal dialogs |
| DropdownMenu | Radix UI | Dropdown menus |
| Avatar | Radix UI | User avatars with fallbacks |
| Select | Radix UI | Dropdown select |
| Tabs | Radix UI | Tabbed navigation |
| Tooltip | Radix UI | Hover tooltips |
| Popover | Radix UI | Click-triggered popovers |
| Separator | Radix UI | Visual dividers |
| Spinner | Custom | Loading spinner |
| Toast | Custom | Notification toasts |

## Custom Hooks

| Hook | Description |
|------|-------------|
| `useTheme` | Theme management (get, set, toggle) |
| `useOnlineStatus` | Network connectivity status |
| `useMediaQuery` | Responsive breakpoint detection |
| `useIsMobile` | Mobile viewport check |
| `useIsTablet` | Tablet viewport check |
| `useIsDesktop` | Desktop viewport check |
| `useDebounce` | Debounced callback execution |

## Zustand Stores

| Store | Description |
|-------|-------------|
| `useAuthStore` | Authentication state (user, tokens, login/logout) |
| `useUIStore` | UI state (sidebar open/collapsed) |

## Error Pages

| Page | Status Code | Description |
|------|:-----------:|-------------|
| NotFoundPage | 404 | Page not found |
| UnauthorizedPage | 403 | Access denied |
| ServerErrorPage | 500 | Server error with retry option |

## Testing

```bash
# Run all tests
cd frontend && npm run test

# Run specific test suite
npx vitest run src/components/dashboard/
npx vitest run src/components/shared/
npx vitest run src/features/products/
npx vitest run src/features/categories/

# Run backend tests
cd backend && npm run test
```

### Test Coverage

- Dashboard widgets: StatCard, ActivityCard, QuickActionCard
- Shared components: DataTable, error pages
- Auth forms: LoginForm, RegisterForm
- Products: ProductForm validation, ProductList rendering
- Categories: CategoryForm validation
- Backend: PricingService calculations, ProductsService CRUD

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
npm run typecheck        # Type check frontend
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

## Authentication

### Flow

```
Register → Create Business + Owner → Login → JWT Access Token + Refresh Token
                                                              ↓
Dashboard ← Navigate ← setAuth(store) ← API Response
                                                              ↓
                                    Token expires → /auth/refresh → New tokens
                                                              ↓
                                    Logout → Delete refresh token → Clear store → /login
```

### JWT Tokens

| Token | Lifetime | Secret | Purpose |
|-------|----------|--------|---------|
| Access Token | 24 hours | `JWT_SECRET` | Authenticate API requests |
| Refresh Token | 7 days | `JWT_REFRESH_SECRET` | Get new access tokens |

## User Roles & Permissions

| Action | OWNER | MANAGER | CASHIER |
|--------|:-----:|:-------:|:-------:|
| **User Management** | | | |
| Create staff | Yes | No | No |
| View users | Yes | Yes | No |
| Update users | Yes | Yes | No |
| Deactivate users | Yes | No | No |
| Change own password | Yes | Yes | Yes |
| **Business** | | | |
| Full access | Yes | No | No |
| **Categories** | | | |
| Create/Edit categories | Yes | Yes | No |
| Delete/Restore categories | Yes | No | No |
| View categories | Yes | Yes | Yes |
| **Units** | | | |
| Create/Edit units | Yes | Yes | No |
| Delete/Restore units | Yes | No | No |
| View units | Yes | Yes | Yes |
| **Products** | | | |
| Create/Edit products | Yes | Yes | No |
| Delete/Restore products | Yes | No | No |
| View products | Yes | Yes | Yes |
| Calculate pricing | Yes | Yes | Yes |
| **Sales** | | | |
| Process sales | Yes | Yes | Yes |
| View reports | Yes | Yes | No |

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

For support, email support@smartbiz.com or create an issue on GitHub.
