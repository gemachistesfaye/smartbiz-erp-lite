# Table Design
## SmartBiz ERP Lite Database

---

## ENUM Definitions

| Enum | Values | Usage |
|:-----|:-------|:------|
| UserRole | OWNER, MANAGER, CASHIER | User role |
| PaymentMethod | CASH, MOBILE_MONEY, CREDIT | Payment type |
| InventoryTransactionType | SALE, PURCHASE, ADJUSTMENT, RETURN | Stock movement |
| SaleStatus | COMPLETED, VOIDED, REFUNDED | Sale lifecycle |
| PurchaseStatus | PENDING, RECEIVED, CANCELLED | Purchase lifecycle |
| PaymentType | INCOMING, OUTGOING | Money direction |
| CustomerStatus | ACTIVE, INACTIVE, BLOCKED | Customer lifecycle |
| NotificationType | LOW_STOCK, CREDIT_PAYMENT, SYNC_COMPLETE, SYNC_CONFLICT, SYSTEM_ALERT | Alert type |
| AuditAction | CREATE, UPDATE, DELETE, LOGIN, LOGOUT | Tracked action |

---

## Core Tables

### Business
The tenant/organization. Top-level entity.

| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| name | VARCHAR(200) | No | — | Business name |
| slug | VARCHAR(200) | No | — | URL-friendly, unique |
| phone | VARCHAR(20) | Yes | — | |
| address | TEXT | Yes | — | |
| currency | VARCHAR(3) | No | 'ETB' | ISO code |
| isActive | BOOLEAN | No | true | |
| createdAt | TIMESTAMPTZ | No | now() | |
| updatedAt | TIMESTAMPTZ | No | now() | |

### User
People operating the system.

| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| email | VARCHAR(255) | No | — | Global unique |
| password | VARCHAR(255) | No | — | bcrypt hash |
| firstName | VARCHAR(100) | No | — | |
| lastName | VARCHAR(100) | No | — | |
| role | ENUM | No | 'CASHIER' | OWNER/MANAGER/CASHIER |
| isActive | BOOLEAN | No | true | |
| lastLoginAt | TIMESTAMPTZ | Yes | — | |
| createdAt | TIMESTAMPTZ | No | now() | |
| updatedAt | TIMESTAMPTZ | No | now() | |
| deletedAt | TIMESTAMPTZ | Yes | — | Soft delete |

---

## Catalog Tables

### Category
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| name | VARCHAR(100) | No | — | |
| description | TEXT | Yes | — | |
| isActive | BOOLEAN | No | true | |
| createdAt/updatedAt | TIMESTAMPTZ | No | now() | |

**Unique:** (businessId, name)

### Unit
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| name | VARCHAR(50) | No | — | e.g. "Kilogram" |
| symbol | VARCHAR(10) | No | — | e.g. "kg" |
| isActive | BOOLEAN | No | true | |

**Unique:** (businessId, symbol)

### Product
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| categoryId | UUID | Yes | — | FK→Category |
| unitId | UUID | Yes | — | FK→Unit |
| name | VARCHAR(200) | No | — | |
| sku | VARCHAR(50) | Yes | — | |
| barcode | VARCHAR(100) | Yes | — | |
| description | TEXT | Yes | — | |
| baseCost | NUMERIC(12,2) | No | 0 | Raw cost |
| overheadCost | NUMERIC(12,2) | No | 0 | Transport, tax |
| sellingPrice | NUMERIC(12,2) | No | 0 | |
| isActive | BOOLEAN | No | true | |
| createdAt/updatedAt | TIMESTAMPTZ | No | now() | |
| deletedAt | TIMESTAMPTZ | Yes | — | Soft delete |

**Computed:** landedCost = baseCost + overheadCost
**Unique:** (businessId, sku), (businessId, barcode)
**Check:** baseCost ≥ 0, overheadCost ≥ 0, sellingPrice ≥ 0

---

## Inventory Tables

### Inventory
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| productId | UUID | No | — | FK→Product (unique) |
| quantity | INTEGER | No | 0 | Current stock |
| minThreshold | INTEGER | No | 5 | Low stock alert |
| maxThreshold | INTEGER | Yes | — | Optional max |
| createdAt/updatedAt | TIMESTAMPTZ | No | now() | |

**Check:** quantity ≥ 0, minThreshold ≥ 0

### InventoryTransaction
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| productId | UUID | No | — | FK→Product |
| type | ENUM | No | — | SALE/PURCHASE/ADJUSTMENT/RETURN |
| quantity | INTEGER | No | — | +in, -out |
| quantityBefore | INTEGER | No | — | |
| quantityAfter | INTEGER | No | — | |
| referenceId | UUID | Yes | — | Sale or Purchase ID |
| referenceType | VARCHAR(20) | Yes | — | |
| reason | TEXT | Yes | — | For adjustments |
| userId | UUID | No | — | FK→User |
| createdAt | TIMESTAMPTZ | No | now() | |

---

## Procurement Tables

### Supplier
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| name | VARCHAR(200) | No | — | |
| contactName | VARCHAR(200) | Yes | — | |
| phone | VARCHAR(20) | Yes | — | |
| email | VARCHAR(255) | Yes | — | |
| address | TEXT | Yes | — | |
| isActive | BOOLEAN | No | true | |

### Purchase
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| supplierId | UUID | Yes | — | FK→Supplier |
| invoiceNumber | VARCHAR(50) | Yes | — | |
| subtotal | NUMERIC(12,2) | No | — | |
| taxAmount | NUMERIC(12,2) | No | 0 | |
| totalAmount | NUMERIC(12,2) | No | — | |
| status | ENUM | No | 'RECEIVED' | PENDING/RECEIVED/CANCELLED |
| notes | TEXT | Yes | — | |

### PurchaseItem
| Column | Type | Nullable | Notes |
|:-------|:-----|:---------|:------|
| id | UUID | No | PK |
| purchaseId | UUID | No | FK→Purchase |
| productId | UUID | No | FK→Product |
| quantity | INTEGER | No | |
| unitCost | NUMERIC(12,2) | No | |
| totalCost | NUMERIC(12,2) | No | qty × unitCost |

---

## Sales Tables

### Customer
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| firstName | VARCHAR(100) | No | — | |
| lastName | VARCHAR(100) | Yes | — | |
| phone | VARCHAR(20) | Yes | — | |
| email | VARCHAR(255) | Yes | — | |
| address | TEXT | Yes | — | |
| creditBalance | NUMERIC(12,2) | No | 0 | Outstanding debt |
| creditLimit | NUMERIC(12,2) | Yes | — | Max credit |
| status | ENUM | No | 'ACTIVE' | ACTIVE/INACTIVE/BLOCKED |
| notes | TEXT | Yes | — | |
| deletedAt | TIMESTAMPTZ | Yes | — | Soft delete |

**Check:** creditBalance ≥ 0, creditLimit ≥ 0 (when provided)

### Sale
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| cashierId | UUID | No | — | FK→User |
| customerId | UUID | Yes | — | FK→Customer (optional) |
| paymentMethod | ENUM | No | — | CASH/MOBILE_MONEY/CREDIT |
| subtotal | NUMERIC(12,2) | No | — | |
| taxAmount | NUMERIC(12,2) | No | 0 | |
| discountAmount | NUMERIC(12,2) | No | 0 | |
| totalAmount | NUMERIC(12,2) | No | — | |
| amountTendered | NUMERIC(12,2) | Yes | — | Cash given |
| changeAmount | NUMERIC(12,2) | Yes | — | Change returned |
| status | ENUM | No | 'COMPLETED' | COMPLETED/VOIDED/REFUNDED |
| notes | TEXT | Yes | — | |

**Check:** totalAmount > 0
**Rule:** customerId required when paymentMethod = 'CREDIT'

### SaleItem
| Column | Type | Nullable | Notes |
|:-------|:-----|:---------|:------|
| id | UUID | No | PK |
| saleId | UUID | No | FK→Sale |
| productId | UUID | No | FK→Product |
| quantity | INTEGER | No | > 0 |
| unitPrice | NUMERIC(12,2) | No | Price at time of sale |
| totalPrice | NUMERIC(12,2) | No | qty × unitPrice |

---

## Finance Tables

### Payment
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| saleId | UUID | Yes | — | FK→Sale |
| customerId | UUID | Yes | — | FK→Customer |
| type | ENUM | No | — | INCOMING/OUTGOING |
| method | ENUM | No | — | CASH/MOBILE_MONEY/BANK_TRANSFER |
| amount | NUMERIC(12,2) | No | — | > 0 |
| reference | VARCHAR(100) | Yes | — | Transaction ref |
| notes | TEXT | Yes | — | |
| userId | UUID | No | — | FK→User (who recorded) |

### Expense
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| categoryId | UUID | No | — | FK→ExpenseCategory |
| amount | NUMERIC(12,2) | No | — | > 0 |
| description | TEXT | No | — | |
| date | DATE | No | CURRENT_DATE | |
| paymentMethod | ENUM | No | 'CASH' | |
| receiptUrl | TEXT | Yes | — | |
| userId | UUID | No | — | FK→User |

### ExpenseCategory
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| name | VARCHAR(100) | No | — | |
| isActive | BOOLEAN | No | true | |

**Unique:** (businessId, name)

---

## System Tables

### Notification
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| userId | UUID | Yes | — | null = broadcast |
| type | ENUM | No | — | LOW_STOCK, CREDIT_PAYMENT, etc. |
| title | VARCHAR(200) | No | — | |
| message | TEXT | No | — | |
| isRead | BOOLEAN | No | false | |
| link | VARCHAR(500) | Yes | — | Deep link |

### AuditLog
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business |
| userId | UUID | No | — | FK→User |
| action | ENUM | No | — | CREATE/UPDATE/DELETE/LOGIN/LOGOUT |
| entity | VARCHAR(50) | No | — | e.g. "Product" |
| entityId | UUID | No | — | |
| oldValues | JSONB | Yes | — | Previous state |
| newValues | JSONB | Yes | — | New state |
| ipAddress | VARCHAR(45) | Yes | — | |
| userAgent | TEXT | Yes | — | |

### RefreshToken / PasswordResetToken
| Column | Type | Nullable | Notes |
|:-------|:-----|:---------|:------|
| id | UUID | No | PK |
| userId | UUID | No | FK→User |
| token | VARCHAR(500) | No | Hashed, unique |
| expiresAt | TIMESTAMPTZ | No | |
| usedAt | TIMESTAMPTZ | Yes | PasswordResetToken only |

### ActivityLog
| Column | Type | Nullable | Notes |
|:-------|:-----|:---------|:------|
| id | UUID | No | PK |
| userId | UUID | No | FK→User |
| action | VARCHAR(50) | No | e.g. "sale_processed" |
| description | TEXT | Yes | |
| ipAddress | VARCHAR(45) | Yes | |
| userAgent | TEXT | Yes | |

### BusinessSettings
| Column | Type | Nullable | Default | Notes |
|:-------|:-----|:---------|:--------|:------|
| id | UUID | No | gen_random_uuid() | PK |
| businessId | UUID | No | — | FK→Business (unique) |
| taxRate | NUMERIC(5,2) | No | 0 | % |
| currency | VARCHAR(3) | No | 'ETB' | |
| currencySymbol | VARCHAR(5) | No | 'Br' | |
| lowStockThreshold | INTEGER | No | 5 | |
| receiptHeader | TEXT | Yes | — | |
| receiptFooter | TEXT | Yes | — | |
