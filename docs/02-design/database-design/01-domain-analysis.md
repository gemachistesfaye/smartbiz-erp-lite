# 01 - Domain Analysis
## SmartBiz ERP Lite Database

---

## Business Entities

| Entity | Category | Purpose |
|:-------|:---------|:--------|
| Business | Core | Tenant/organization owning all data |
| User | Core | People operating the system |
| Product | Catalog | Items sold by the business |
| Category | Catalog | Product classification |
| Unit | Catalog | Measurement units (kg, liters, pieces) |
| Supplier | Procurement | Whom the business buys from |
| Purchase | Procurement | Buying goods from suppliers |
| Inventory | Stock | Current stock levels per product |
| Customer | Sales | People who buy from the business |
| Sale | Sales | A transaction with a customer |
| Payment | Finance | Money received or paid |
| Expense | Finance | Business expenses |
| Notification | System | Alerts and messages |
| AuditLog | Security | Change tracking |

---

## Entity Relationships

```
Business
  |-- owns --> Users (many)
  |-- owns --> Products (many)
  |-- owns --> Categories (many)
  |-- owns --> Units (many)
  |-- owns --> Suppliers (many)
  |-- owns --> Customers (many)
  |-- owns --> Purchases (many)
  |-- owns --> Sales (many)
  |-- owns --> Expenses (many)

Product
  |-- belongs_to --> Category (one)
  |-- has_one --> Inventory (one)
  |-- appears_in --> SaleItem (many)
  |-- appears_in --> PurchaseItem (many)

Sale
  |-- belongs_to --> User/Cashier (one)
  |-- belongs_to --> Customer (one, optional)
  |-- has_many --> SaleItem (many)
  |-- has_many --> Payment (many)

Customer
  |-- has_many --> Sales (many)
  |-- has_many --> Payment (many)

Purchase
  |-- belongs_to --> Supplier (one)
  |-- has_many --> PurchaseItem (many)
```

---

## Data Flow

```
Purchase (IN) --> Inventory (Stock) --> Sale (OUT) --> Payment (Money)
     |                  |                  |                |
     v                  v                  v                v
 Cost Data        Stock Level        Revenue Data     Cash Flow
```

---

## Multi-Tenancy Strategy

| Aspect | Decision | Rationale |
|:-------|:---------|:----------|
| Isolation method | `businessId` column on every table | Simplest to implement; sufficient for SME scale |
| Enforcement | ORM middleware (Prisma) + API guards | Application-level enforcement; fast |
| Future migration | Can move to schema-per-tenant if needed | Flexible upgrade path |
| Data separation | Every query filtered by tenantId | Impossible to leak data across tenants |

---

## One-to-One Relationships

| Parent | Child | Foreign Key | Cascade |
|:-------|:------|:------------|:--------|
| Product | Inventory | `inventory.productId` | Cascade delete |
| Business | BusinessSettings | `businessSettings.businessId` | Cascade delete |

---

## One-to-Many Relationships

| Parent | Child | Foreign Key | Cascade |
|:-------|:------|:------------|:--------|
| Business | User | `user.businessId` | Cascade delete |
| Business | Product | `product.businessId` | Cascade delete |
| Business | Category | `category.businessId` | Cascade delete |
| Business | Customer | `customer.businessId` | Cascade delete |
| Business | Sale | `sale.businessId` | Cascade delete |
| Business | Purchase | `purchase.businessId` | Cascade delete |
| Business | Expense | `expense.businessId` | Cascade delete |
| Category | Product | `product.categoryId` | Restrict |
| User | Sale | `sale.cashierId` | Restrict |
| Customer | Sale | `sale.customerId` | Restrict |
| Sale | SaleItem | `saleItem.saleId` | Cascade delete |
| Sale | Payment | `payment.saleId` | Cascade delete |
| Supplier | Purchase | `purchase.supplierId` | Restrict |
| Purchase | PurchaseItem | `purchaseItem.purchaseId` | Cascade delete |
| Product | SaleItem | `saleItem.productId` | Restrict |
| Product | PurchaseItem | `purchaseItem.productId` | Restrict |

---

## Many-to-Many Relationships

| Entity A | Entity B | Through Table | Notes |
|:---------|:---------|:--------------|:------|
| Sale | Product | SaleItem | A sale has many products; a product appears in many sales |
| Purchase | Product | PurchaseItem | A purchase has many products; a product appears in many purchases |

---

## Relationship Rules

| Rule | Implementation | Why |
|:-----|:---------------|:----|
| Cascade Delete | Child deleted when parent deleted | Tenant deletion removes all data |
| Restrict Delete | Cannot delete parent if children exist | Prevents orphaned records |
| Optional Relation | Foreign key nullable | Customer on Sale is optional (walk-in) |
| Required Relation | Foreign key not null | Sale must have a cashier |

---

## Data Types

| Category | Type | Usage | Why |
|:---------|:-----|:------|:----|
| IDs | UUID | Primary keys, foreign keys | Globally unique; safe for distributed systems |
| Text | VARCHAR(n) | Names, emails, phone numbers | Bounded length; index-friendly |
| Text | TEXT | Descriptions, notes, addresses | Unbounded; no performance difference in PostgreSQL |
| Numbers | NUMERIC(12,2) | Money, prices, costs | Exact precision; no floating-point errors |
| Numbers | INTEGER | Quantities, counts | Sufficient range; fast operations |
| Boolean | BOOLEAN | Flags (isActive, isRead) | Native PostgreSQL boolean |
| Time | TIMESTAMPTZ | All timestamps | Timezone-aware; handles Ethiopian time correctly |
| Time | DATE | Expense date | Date-only when time is irrelevant |
| JSON | JSONB | Audit log old/new values | Flexible schema; queryable; compressed |

---

## Why UUID Over SERIAL

| Factor | UUID | SERIAL |
|:-------|:-----|:-------|
| Uniqueness | Globally unique across all tenants | Sequential within one table |
| Security | Cannot guess next ID | Sequential IDs are predictable |
| Distributed | Works without coordination | Requires database coordination |
| Offline | Can generate client-side | Requires database connection |
| Storage | 16 bytes | 4-8 bytes |

**Decision:** UUID is the right choice for a multi-tenant SaaS with offline support.

---

## Why NUMERIC Over FLOAT

| Factor | NUMERIC | FLOAT |
|:-------|:--------|:------|
| Precision | Exact (12 digits, 2 decimal) | Approximate (floating point) |
| Money | Correct for financial calculations | Can lose pennies on rounding |
| Example | 0.1 + 0.2 = 0.30 | 0.1 + 0.2 = 0.30000000000000004 |

**Decision:** NUMERIC is mandatory for any money-related column.
