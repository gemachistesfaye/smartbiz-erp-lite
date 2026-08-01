# 05 - Performance & Security
## SmartBiz ERP Lite Database

---

## Indexing Strategy

### Products

| Index | Columns | Purpose |
|:------|:--------|:--------|
| product_pkey | id | Primary key lookup |
| product_business_idx | businessId | Tenant isolation |
| product_sku_unique | businessId, sku | SKU lookup |
| product_barcode_unique | businessId, barcode | Barcode scanning |
| product_category_idx | businessId, categoryId | Category filtering |
| product_name_idx | businessId, name | Name search |
| product_barcode_idx | barcode | Global barcode scan |
| product_sku_idx | sku | Global SKU lookup |

### Sales

| Index | Columns | Purpose |
|:------|:--------|:--------|
| sale_pkey | id | Primary key lookup |
| sale_business_idx | businessId | Tenant isolation |
| sale_cashier_idx | cashierId | Cashier-specific queries |
| sale_customer_idx | customerId | Customer purchase history |
| sale_date_idx | businessId, createdAt | Date range reports |
| sale_status_idx | businessId, status | Voided/refunded queries |
| sale_payment_idx | businessId, paymentMethod | Payment method reports |

### Inventory

| Index | Columns | Purpose |
|:------|:--------|:--------|
| inventory_pkey | id | Primary key lookup |
| inventory_product_idx | productId | Product stock lookup |
| inventory_quantity_idx | quantity | Low stock queries |

### Customers

| Index | Columns | Purpose |
|:------|:--------|:--------|
| customer_pkey | id | Primary key lookup |
| customer_business_idx | businessId | Tenant isolation |
| customer_phone_idx | businessId, phone | Phone lookup |
| customer_name_idx | businessId, firstName | Name search |
| customer_credit_idx | creditBalance | Debt reports |

---

## Query Optimization

### Dashboard Queries

```sql
-- Today's sales summary
SELECT
  COUNT(*) as totalTransactions,
  COALESCE(SUM(totalAmount), 0) as totalRevenue,
  COALESCE(AVG(totalAmount), 0) as averageSale
FROM sale
WHERE businessId = ?
  AND createdAt >= CURRENT_DATE
  AND status = 'COMPLETED';

-- Low stock count
SELECT COUNT(*) as lowStockCount
FROM inventory i
JOIN product p ON i.productId = p.id
WHERE p.businessId = ?
  AND i.quantity < i.minThreshold
  AND p.isActive = true;

-- Total outstanding credit
SELECT COALESCE(SUM(creditBalance), 0) as totalOwed
FROM customer
WHERE businessId = ?
  AND creditBalance > 0;
```

### Inventory Reports

```sql
-- Low stock items
SELECT p.id, p.name, i.quantity, i.minThreshold
FROM product p
JOIN inventory i ON p.id = i.productId
WHERE p.businessId = ?
  AND i.quantity < i.minThreshold
  AND p.isActive = true
ORDER BY i.quantity ASC;
```

### Sales Reports

```sql
-- Sales by date range
SELECT
  DATE(createdAt) as date,
  COUNT(*) as transactions,
  SUM(totalAmount) as revenue
FROM sale
WHERE businessId = ?
  AND createdAt BETWEEN ? AND ?
  AND status = 'COMPLETED'
GROUP BY DATE(createdAt)
ORDER BY date DESC;
```

### Profit Reports

```sql
-- Profit per product
SELECT
  p.name,
  SUM(si.quantity) as unitsSold,
  SUM(si.totalPrice) as revenue,
  SUM(si.quantity * (p.baseCost + p.overheadCost)) as costOfGoods,
  SUM(si.totalPrice) - SUM(si.quantity * (p.baseCost + p.overheadCost)) as profit
FROM saleItem si
JOIN product p ON si.productId = p.id
JOIN sale s ON si.saleId = s.id
WHERE s.businessId = ?
  AND s.createdAt BETWEEN ? AND ?
  AND s.status = 'COMPLETED'
GROUP BY p.id, p.name
ORDER BY profit DESC;
```

### Credit Reports

```sql
-- Customer debt summary
SELECT
  c.id,
  c.firstName || ' ' || COALESCE(c.lastName, '') as name,
  c.phone,
  c.creditBalance,
  MAX(s.createdAt) as lastSaleDate
FROM customer c
LEFT JOIN sale s ON c.id = s.customerId
WHERE c.businessId = ?
  AND c.creditBalance > 0
GROUP BY c.id, c.firstName, c.lastName, c.phone, c.creditBalance
ORDER BY c.creditBalance DESC;
```

### Top Products

```sql
-- Top selling products by quantity
SELECT
  p.id,
  p.name,
  SUM(si.quantity) as totalSold,
  SUM(si.totalPrice) as totalRevenue
FROM saleItem si
JOIN product p ON si.productId = p.id
JOIN sale s ON si.saleId = s.id
WHERE s.businessId = ?
  AND s.createdAt BETWEEN ? AND ?
  AND s.status = 'COMPLETED'
GROUP BY p.id, p.name
ORDER BY totalSold DESC
LIMIT 10;
```

---

## Audit & Security

### Audit Log Strategy

Every write operation on critical entities generates an audit log entry:

| Entity | Audit Level | Reason |
|:-------|:------------|:-------|
| Product | Full (old + new values) | Pricing changes affect profit |
| Sale | Full (especially void/refund) | Revenue protection |
| Customer | Full (especially credit changes) | Debt tracking |
| User | Full (especially role changes) | Security |
| Inventory | Full (especially adjustments) | Stock integrity |
| Expense | Full | Financial accuracy |

### Security Measures

| Measure | Implementation |
|:--------|:---------------|
| Password hashing | bcrypt with 12 salt rounds |
| JWT expiry | 24 hours for access tokens |
| Refresh token expiry | 30 days |
| Password reset expiry | 1 hour |
| Rate limiting | 100 requests/minute per user |
| Tenant isolation | ORM middleware + API guards |
| Soft delete | Never hard delete; deletedAt column |
| Audit trail | Every critical change logged |
| IP logging | Captured on login and sensitive operations |

---

## Backup & Recovery

### Backup Strategy

| Type | Frequency | Retention | Method |
|:-----|:----------|:----------|:-------|
| Full backup | Daily at 2:00 AM | 30 days | pg_dump |
| Incremental | Every 6 hours | 7 days | WAL archiving |
| Point-in-time | Continuous | 7 days | WAL + pg_basebackup |

### Restore Strategy

| Scenario | Method | RPO | RTO |
|:---------|:-------|:----|:----|
| Accidental deletion | Point-in-time recovery | < 5 min | < 30 min |
| Data corruption | Full restore from backup | < 6 hours | < 1 hour |
| Disaster recovery | Cross-region replica failover | < 1 min | < 5 min |

### Migration Strategy

| Phase | Action |
|:------|:-------|
| Development | prisma migrate dev -- creates migration files |
| Staging | prisma migrate deploy -- applies migrations |
| Production | prisma migrate deploy -- applies during maintenance window |
| Rollback | Keep previous migration; reverse if needed |

### Seed Data Strategy

| Seed Type | Content | When |
|:----------|:--------|:-----|
| Default categories | Grocery, Beverage, Dairy, etc. | New business registration |
| Default units | Piece, Kilogram, Liter, Box | New business registration |
| Default expense categories | Rent, Utilities, Salaries | New business registration |
| Demo data | Sample products, sales | Optional (for testing) |

---

## Database Constraints Summary

### Check Constraints

| Table | Column | Constraint | Reason |
|:------|:-------|:-----------|:-------|
| Product | baseCost | >= 0 | Cost cannot be negative |
| Product | overheadCost | >= 0 | Cost cannot be negative |
| Product | sellingPrice | >= 0 | Price cannot be negative |
| Inventory | quantity | >= 0 | Stock cannot be negative |
| Inventory | minThreshold | >= 0 | Threshold cannot be negative |
| Sale | totalAmount | > 0 | Sale must have value |
| SaleItem | quantity | > 0 | Must sell at least 1 |
| Customer | creditBalance | >= 0 | Debt cannot be negative |
| Payment | amount | > 0 | Payment must have value |
| Expense | amount | > 0 | Expense must have value |

### Unique Constraints

| Table | Columns | Scope |
|:------|:--------|:------|
| Business | slug | Global |
| User | email | Global |
| Category | businessId, name | Per tenant |
| Unit | businessId, symbol | Per tenant |
| Product | businessId, sku | Per tenant |
| Product | businessId, barcode | Per tenant |
| ExpenseCategory | businessId, name | Per tenant |
| Inventory | productId | Global |
| RefreshToken | token | Global |
| PasswordResetToken | token | Global |
| BusinessSettings | businessId | Per tenant |

---

## Future SaaS Expansion

| Feature | Current Design | SaaS Upgrade |
|:--------|:---------------|:-------------|
| Multi-tenancy | businessId column | Schema-per-tenant if needed |
| Subscriptions | Not implemented | Add Subscription table |
| Billing | Not implemented | Add Invoice table |
| API rate limiting | Application-level | Redis-based rate limiting |
| Analytics | PostgreSQL queries | Add read replicas for reporting |
| Search | PostgreSQL ILIKE | Add Elasticsearch for full-text search |
