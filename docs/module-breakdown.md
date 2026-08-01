# Module Breakdown
## SmartBiz ERP Lite

Each module represents a cohesive unit of functionality. Modules are defined by domain boundaries and have clear responsibilities, dependencies, and priority levels.

---

## Module Dependency Graph

```
                        ┌─────────────┐
                        │    Auth     │
                        │   Module    │
                        └──────┬──────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │  Users   │    │ Products │    │Customers │
        │  Module  │    │  Module  │    │  Module  │
        └──────────┘    └────┬─────┘    └────┬─────┘
                             │               │
                             ▼               │
                       ┌──────────┐          │
                       │Inventory │          │
                       │  Module  │          │
                       └──────────┘          │
                             │               │
                             ▼               ▼
                       ┌──────────────────────────┐
                       │        Sales Module       │
                       │  (POS + Checkout Logic)   │
                       └────────────┬─────────────┘
                                    │
                                    ▼
                       ┌──────────────────────────┐
                       │      Reports Module       │
                       │  (Dashboard + Analytics)  │
                       └──────────────────────────┘
```

---

## Module 1: Auth Module

### Purpose
Handles user authentication, JWT token management, and session lifecycle.

### Responsibilities
- User registration (creates Tenant + Owner)
- User login (returns JWT)
- JWT token verification
- Password hashing and comparison
- Token refresh mechanism (future)

### Main Features
| Feature | API Endpoint | Priority |
|:--------|:-------------|:---------|
| Register (Tenant + Owner) | POST /api/auth/register | P0 |
| Login | POST /api/auth/login | P0 |
| Get current user | GET /api/auth/me | P0 |
| Refresh token | POST /api/auth/refresh | P1 |

### Dependencies
- Prisma (User, Tenant models)
- bcrypt (password hashing)
- @nestjs/jwt (token generation)
- @nestjs/passport (JWT strategy)

### Priority
**P0 — MVP Required.** Foundation for all other modules.

---

## Module 2: Users Module

### Purpose
Staff management for the Owner — creating, updating, and deactivating Manager and Cashier accounts.

### Responsibilities
- Create new user (Manager/Cashier)
- List all users for the tenant
- Update user details
- Deactivate/activate user accounts
- Role assignment

### Main Features
| Feature | API Endpoint | Priority |
|:--------|:-------------|:---------|
| List users | GET /api/users | P0 |
| Create user | POST /api/users | P0 |
| Update user | PUT /api/users/:id | P0 |
| Deactivate user | DELETE /api/users/:id | P1 |

### Dependencies
- Auth Module (JWT validation)
- Prisma (User model)

### Priority
**P0 — MVP Required.** Enables multi-user operations.

---

## Module 3: Products Module

### Purpose
Product catalog management including categories, pricing, and product CRUD.

### Responsibilities
- CRUD operations for products
- Category management
- Landed cost calculation (baseCost + overheadCost)
- Product search (name, SKU, barcode)
- Product validation (unique SKU per tenant)

### Main Features
| Feature | API Endpoint | Priority |
|:--------|:-------------|:---------|
| List products | GET /api/products | P0 |
| Get product | GET /api/products/:id | P0 |
| Create product | POST /api/products | P0 |
| Update product | PUT /api/products/:id | P0 |
| Delete product | DELETE /api/products/:id | P1 |
| Search products | GET /api/products?search= | P0 |
| List categories | GET /api/categories | P0 |
| Create category | POST /api/categories | P0 |

### Dependencies
- Auth Module (JWT validation, tenantId)
- Prisma (Product, Category models)

### Priority
**P0 — MVP Required.** Core data for POS and inventory.

---

## Module 4: Inventory Module

### Purpose
Stock level management, low-stock alerts, and manual stock adjustments.

### Responsibilities
- Auto-create inventory on product creation
- Track stock quantities
- Decrement stock on sale (atomic operation)
- Low-stock detection and alerts
- Manual stock adjustment with audit logging

### Main Features
| Feature | API Endpoint | Priority |
|:--------|:-------------|:---------|
| Get low-stock items | GET /api/inventory/low-stock | P0 |
| Adjust stock | POST /api/inventory/adjust | P0 |
| Get inventory for product | GET /api/inventory/:productId | P1 |

### Dependencies
- Products Module (product existence, creation hooks)
- Prisma (Inventory model)

### Priority
**P0 — MVP Required.** Prevents overselling, enables stock alerts.

---

## Module 5: Customers Module

### Purpose
Customer registration, credit tracking, and payment management.

### Responsibilities
- Register new customers
- Track credit balances
- Process credit payments
- Customer search and listing
- Credit balance calculations

### Main Features
| Feature | API Endpoint | Priority |
|:--------|:-------------|:---------|
| List customers | GET /api/customers | P0 |
| Create customer | POST /api/customers | P0 |
| Get customer | GET /api/customers/:id | P0 |
| Log payment | POST /api/customers/:id/payment | P0 |
| Customer search | GET /api/customers?search= | P0 |

### Dependencies
- Auth Module (JWT validation, tenantId)
- Prisma (Customer model)

### Priority
**P0 — MVP Required.** Core of credit tracking feature.

---

## Module 6: Sales Module

### Purpose
Point-of-sale operations, checkout processing, and offline sales synchronization.

### Responsibilities
- Process sales (checkout)
- Validate stock availability
- Create Sale and SaleItem records
- Decrement inventory atomically
- Handle credit sales (update customer balance)
- Bulk sync offline sales
- Sale history retrieval

### Main Features
| Feature | API Endpoint | Priority |
|:--------|:-------------|:---------|
| Process checkout | POST /api/sales/checkout | P0 |
| Sync offline sales | POST /api/sales/sync | P0 |
| Get sales history | GET /api/sales | P0 |
| Get sale details | GET /api/sales/:id | P1 |

### Dependencies
- Products Module (product data, pricing)
- Inventory Module (stock validation, deduction)
- Customers Module (credit operations)
- Prisma (Sale, SaleItem models)

### Priority
**P0 — MVP Required.** The core revenue-generating feature.

---

## Module 7: Reports Module

### Purpose
Dashboard data, sales analytics, and business intelligence queries.

### Responsibilities
- Daily sales summary
- Sales history with date filtering
- Top-selling products
- Customer debt summaries
- Profit margin calculations (future)

### Main Features
| Feature | API Endpoint | Priority |
|:--------|:-------------|:---------|
| Dashboard summary | GET /api/reports/dashboard | P0 |
| Sales by date range | GET /api/reports/sales | P0 |
| Top products | GET /api/reports/top-products | P1 |
| Debt summary | GET /api/reports/debts | P1 |
| Export CSV | GET /api/reports/export | P2 |

### Dependencies
- Sales Module (sale data)
- Customers Module (debt data)
- Products Module (product data)
- Prisma (aggregation queries)

### Priority
**P0 — MVP Required** (basic dashboard). **P1** for advanced reports.

---

## Module Summary Table

| Module | Priority | MVP | Dependencies | Complexity |
|:-------|:---------|:----|:-------------|:-----------|
| Auth | P0 | Yes | None | Low |
| Users | P0 | Yes | Auth | Low |
| Products | P0 | Yes | Auth | Medium |
| Inventory | P0 | Yes | Products | Medium |
| Customers | P0 | Yes | Auth | Low |
| Sales | P0 | Yes | Products, Inventory, Customers | High |
| Reports | P0 | Yes | Sales, Customers, Products | Medium |

---

## Module Communication Patterns

### Synchronous (API calls)
- Frontend → Backend REST APIs
- Backend module → Backend module (direct function calls within NestJS)

### Asynchronous (Future)
- Offline sync queue → Background processor
- Report generation → Background job queue

### Event-Driven Hooks (within NestJS)
```
Product Created → Inventory Record Auto-Created
Sale Completed  → Inventory Decrement + Customer Credit Update
Stock Adjusted  → Low-Stock Check Triggered
User Deactivated → Invalidate all their JWTs (future)
```
