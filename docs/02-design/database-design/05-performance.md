# Performance & Security
## SmartBiz ERP Lite Database

---

## Indexing Strategy

### Products
| Index | Columns | Purpose |
|:------|:--------|:--------|
| product_pkey | id | PK lookup |
| product_business_idx | businessId | Tenant isolation |
| product_sku_unique | businessId, sku | SKU lookup |
| product_barcode_unique | businessId, barcode | Barcode scanning |
| product_category_idx | businessId, categoryId | Category filter |
| product_name_idx | businessId, name | Name search |
| product_barcode_idx | barcode | Global barcode scan |
| product_sku_idx | sku | Global SKU lookup |

### Sales
| Index | Columns | Purpose |
|:------|:--------|:--------|
| sale_pkey | id | PK lookup |
| sale_business_idx | businessId | Tenant isolation |
| sale_cashier_idx | cashierId | Cashier queries |
| sale_customer_idx | customerId | Customer history |
| sale_date_idx | businessId, createdAt | Date range reports |
| sale_status_idx | businessId, status | Voided/refunded |
| sale_payment_idx | businessId, paymentMethod | Payment reports |

### Inventory / Customers
| Table | Index | Columns | Purpose |
|:------|:------|:--------|:--------|
| Inventory | inventory_product_idx | productId | Stock lookup |
| Inventory | inventory_quantity_idx | quantity | Low stock queries |
| Customer | customer_business_idx | businessId | Tenant isolation |
| Customer | customer_phone_idx | businessId, phone | Phone lookup |
| Customer | customer_name_idx | businessId, firstName | Name search |
| Customer | customer_credit_idx | creditBalance | Debt reports |

---

## Query Optimization

```sql
-- Dashboard: Today's sales summary
SELECT COUNT(*) as totalTransactions,
       COALESCE(SUM(totalAmount), 0) as totalRevenue,
       COALESCE(AVG(totalAmount), 0) as averageSale
FROM sale WHERE businessId = ? AND createdAt >= CURRENT_DATE AND status = 'COMPLETED';

-- Dashboard: Low stock count
SELECT COUNT(*) as lowStockCount FROM inventory i
JOIN product p ON i.productId = p.id
WHERE p.businessId = ? AND i.quantity < i.minThreshold AND p.isActive = true;

-- Dashboard: Total outstanding credit
SELECT COALESCE(SUM(creditBalance), 0) as totalOwed
FROM customer WHERE businessId = ? AND creditBalance > 0;

-- Sales by date range
SELECT DATE(createdAt) as date, COUNT(*) as transactions, SUM(totalAmount) as revenue
FROM sale WHERE businessId = ? AND createdAt BETWEEN ? AND ? AND status = 'COMPLETED'
GROUP BY DATE(createdAt) ORDER BY date DESC;

-- Profit per product
SELECT p.name, SUM(si.quantity) as unitsSold, SUM(si.totalPrice) as revenue,
       SUM(si.quantity * (p.baseCost + p.overheadCost)) as costOfGoods,
       SUM(si.totalPrice) - SUM(si.quantity * (p.baseCost + p.overheadCost)) as profit
FROM saleItem si JOIN product p ON si.productId = p.id JOIN sale s ON si.saleId = s.id
WHERE s.businessId = ? AND s.createdAt BETWEEN ? AND ? AND s.status = 'COMPLETED'
GROUP BY p.id, p.name ORDER BY profit DESC;

-- Top selling products
SELECT p.id, p.name, SUM(si.quantity) as totalSold, SUM(si.totalPrice) as totalRevenue
FROM saleItem si JOIN product p ON si.productId = p.id JOIN sale s ON si.saleId = s.id
WHERE s.businessId = ? AND s.createdAt BETWEEN ? AND ? AND s.status = 'COMPLETED'
GROUP BY p.id, p.name ORDER BY totalSold DESC LIMIT 10;

-- Customer debt summary
SELECT c.id, c.firstName || ' ' || COALESCE(c.lastName, '') as name,
       c.phone, c.creditBalance, MAX(s.createdAt) as lastSaleDate
FROM customer c LEFT JOIN sale s ON c.id = s.customerId
WHERE c.businessId = ? AND c.creditBalance > 0
GROUP BY c.id, c.firstName, c.lastName, c.phone, c.creditBalance
ORDER BY c.creditBalance DESC;
```

---

## Audit & Security

### Audit Log Strategy
Every write on critical entities generates an audit entry:

| Entity | Audit Level | Reason |
|:-------|:------------|:-------|
| Product | Full (old + new) | Pricing affects profit |
| Sale | Full (esp. void/refund) | Revenue protection |
| Customer | Full (esp. credit changes) | Debt tracking |
| User | Full (esp. role changes) | Security |
| Inventory | Full (esp. adjustments) | Stock integrity |
| Expense | Full | Financial accuracy |

### Security Measures
| Measure | Implementation |
|:--------|:---------------|
| Passwords | bcrypt, 12 salt rounds |
| JWT expiry | 24h access tokens |
| Refresh tokens | 30 days |
| Password reset | 1 hour expiry |
| Rate limiting | 100 req/min/user |
| Tenant isolation | ORM middleware + API guards |
| Soft delete | `deletedAt` column, never hard delete |
| Audit trail | Every critical change logged |
| IP logging | Captured on login + sensitive ops |

---

## Backup & Recovery

| Type | Frequency | Retention | Method |
|:-----|:----------|:----------|:-------|
| Full backup | Daily 2:00 AM | 30 days | pg_dump |
| Incremental | Every 6 hours | 7 days | WAL archiving |
| Point-in-time | Continuous | 7 days | WAL + pg_basebackup |

| Scenario | Method | RPO | RTO |
|:---------|:-------|:----|:----|
| Accidental deletion | Point-in-time recovery | < 5 min | < 30 min |
| Data corruption | Full restore | < 6 hours | < 1 hour |
| Disaster | Cross-region replica | < 1 min | < 5 min |

### Migration Strategy
| Phase | Command |
|:------|:--------|
| Development | `prisma migrate dev` |
| Staging/Prod | `prisma migrate deploy` |
| Rollback | Keep previous migration; reverse if needed |

### Seed Data
| Seed | Content | When |
|:-----|:--------|:-----|
| Default categories | Grocery, Beverage, Dairy, etc. | New business |
| Default units | Piece, Kilogram, Liter, Box | New business |
| Default expense categories | Rent, Utilities, Salaries | New business |

---

## Constraints Summary

### Check Constraints
| Table | Column | Constraint |
|:------|:-------|:-----------|
| Product | baseCost, overheadCost, sellingPrice | ≥ 0 |
| Inventory | quantity, minThreshold | ≥ 0 |
| Sale | totalAmount | > 0 |
| SaleItem | quantity | > 0 |
| Customer | creditBalance | ≥ 0 |
| Payment, Expense | amount | > 0 |

### Unique Constraints
| Table | Columns | Scope |
|:------|:--------|:------|
| Business | slug | Global |
| User | email | Global |
| Category | businessId, name | Per tenant |
| Unit | businessId, symbol | Per tenant |
| Product | businessId, sku / barcode | Per tenant |
| ExpenseCategory | businessId, name | Per tenant |
| Inventory | productId | Global |
| RefreshToken, PasswordResetToken | token | Global |
| BusinessSettings | businessId | Per tenant |

---

## Future SaaS Expansion

| Feature | Current | SaaS Upgrade |
|:--------|:--------|:-------------|
| Multi-tenancy | businessId column | Schema-per-tenant |
| Subscriptions | — | Subscription table |
| Billing | — | Invoice table |
| Rate limiting | Application-level | Redis-based |
| Analytics | PostgreSQL queries | Read replicas |
| Search | PostgreSQL ILIKE | Elasticsearch |
