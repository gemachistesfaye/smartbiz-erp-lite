# 02 - Table Design
## SmartBiz ERP Lite Database

---

## ENUM Definitions

| Enum | Values | Usage |
|:-----|:-------|:------|
| UserRole | OWNER, MANAGER, CASHIER | User role assignment |
| PaymentMethod | CASH, MOBILE_MONEY, CREDIT | How payment is made |
| InventoryTransactionType | SALE, PURCHASE, ADJUSTMENT, RETURN | Stock movement type |
| SaleStatus | COMPLETED, VOIDED, REFUNDED | Sale lifecycle |
| PurchaseStatus | PENDING, RECEIVED, CANCELLED | Purchase lifecycle |
| PaymentType | INCOMING, OUTGOING | Money direction |
| CustomerStatus | ACTIVE, INACTIVE, BLOCKED | Customer lifecycle |
| NotificationType | LOW_STOCK, CREDIT_PAYMENT, SYNC_COMPLETE, SYNC_CONFLICT, SYSTEM_ALERT | Alert type |
| AuditAction | CREATE, UPDATE, DELETE, LOGIN, LOGOUT | Tracked action |

---

## Business Table

**Purpose:** The tenant/organization. Top-level entity.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| name | VARCHAR(200) | No | -- | Business name |
| slug | VARCHAR(200) | No | -- | URL-friendly identifier (unique) |
| phone | VARCHAR(20) | Yes | -- | Business phone |
| address | TEXT | Yes | -- | Business address |
| currency | VARCHAR(3) | No | 'ETB' | ISO currency code |
| isActive | BOOLEAN | No | true | Account status |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |

---

## User Table

**Purpose:** People who operate the system.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| email | VARCHAR(255) | No | -- | Login email (unique globally) |
| password | VARCHAR(255) | No | -- | bcrypt hash |
| firstName | VARCHAR(100) | No | -- | First name |
| lastName | VARCHAR(100) | No | -- | Last name |
| role | ENUM | No | 'CASHIER' | OWNER, MANAGER, CASHIER |
| isActive | BOOLEAN | No | true | Account status |
| lastLoginAt | TIMESTAMPTZ | Yes | -- | Last login time |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |
| deletedAt | TIMESTAMPTZ | Yes | -- | Soft delete timestamp |

---

## Category Table

**Purpose:** Product classification.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| name | VARCHAR(100) | No | -- | Category name |
| description | TEXT | Yes | -- | Optional description |
| isActive | BOOLEAN | No | true | Active status |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |

**Unique:** (businessId, name) -- prevent duplicate names per tenant

---

## Unit Table

**Purpose:** Measurement units.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| name | VARCHAR(50) | No | -- | Unit name (Kilogram) |
| symbol | VARCHAR(10) | No | -- | Unit symbol (kg) |
| isActive | BOOLEAN | No | true | Active status |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |

**Unique:** (businessId, symbol) -- prevent duplicate symbols per tenant

---

## Product Table

**Purpose:** Items sold by the business.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| categoryId | UUID | Yes | -- | FK to Category |
| unitId | UUID | Yes | -- | FK to Unit |
| name | VARCHAR(200) | No | -- | Product name |
| sku | VARCHAR(50) | Yes | -- | Stock keeping unit |
| barcode | VARCHAR(100) | Yes | -- | Barcode number |
| description | TEXT | Yes | -- | Product description |
| baseCost | NUMERIC(12,2) | No | 0 | Raw cost of item |
| overheadCost | NUMERIC(12,2) | No | 0 | Transport, tax, etc. |
| sellingPrice | NUMERIC(12,2) | No | 0 | Selling price |
| isActive | BOOLEAN | No | true | Active status |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |
| deletedAt | TIMESTAMPTZ | Yes | -- | Soft delete timestamp |

**Computed:** landedCost = baseCost + overheadCost (calculated in application layer)

**Unique:** (businessId, sku), (businessId, barcode)

**Check:** baseCost >= 0, overheadCost >= 0, sellingPrice >= 0

---

## Inventory Table

**Purpose:** Current stock level per product.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| productId | UUID | No | -- | FK to Product (unique) |
| quantity | INTEGER | No | 0 | Current stock quantity |
| minThreshold | INTEGER | No | 5 | Low stock alert threshold |
| maxThreshold | INTEGER | Yes | -- | Optional max level |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |

**Check:** quantity >= 0, minThreshold >= 0

---

## InventoryTransaction Table

**Purpose:** Complete history of every stock movement.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| productId | UUID | No | -- | FK to Product |
| type | ENUM | No | -- | SALE, PURCHASE, ADJUSTMENT, RETURN |
| quantity | INTEGER | No | -- | Positive = in, Negative = out |
| quantityBefore | INTEGER | No | -- | Stock before movement |
| quantityAfter | INTEGER | No | -- | Stock after movement |
| referenceId | UUID | Yes | -- | Sale ID or Purchase ID |
| referenceType | VARCHAR(20) | Yes | -- | 'SALE' or 'PURCHASE' or 'ADJUSTMENT' |
| reason | TEXT | Yes | -- | Reason for adjustment |
| userId | UUID | No | -- | FK to User (who made the change) |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |

---

## Supplier Table

**Purpose:** Whom the business buys from.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| name | VARCHAR(200) | No | -- | Supplier name |
| contactName | VARCHAR(200) | Yes | -- | Contact person |
| phone | VARCHAR(20) | Yes | -- | Phone number |
| email | VARCHAR(255) | Yes | -- | Email address |
| address | TEXT | Yes | -- | Physical address |
| isActive | BOOLEAN | No | true | Active status |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |

---

## Purchase Table

**Purpose:** Records when the business buys goods from suppliers.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| supplierId | UUID | Yes | -- | FK to Supplier |
| invoiceNumber | VARCHAR(50) | Yes | -- | Supplier's invoice number |
| subtotal | NUMERIC(12,2) | No | -- | Sum of item totals |
| taxAmount | NUMERIC(12,2) | No | 0 | Tax amount |
| totalAmount | NUMERIC(12,2) | No | -- | Final amount |
| status | ENUM | No | 'RECEIVED' | PENDING, RECEIVED, CANCELLED |
| notes | TEXT | Yes | -- | Purchase notes |
| createdAt | TIMESTAMPTZ | No | now() | Purchase timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |

---

## PurchaseItem Table

**Purpose:** Line items within a purchase.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| purchaseId | UUID | No | -- | FK to Purchase |
| productId | UUID | No | -- | FK to Product |
| quantity | INTEGER | No | -- | Quantity purchased |
| unitCost | NUMERIC(12,2) | No | -- | Cost per unit |
| totalCost | NUMERIC(12,2) | No | -- | quantity x unitCost |

---

## Customer Table

**Purpose:** People who buy from the business.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| firstName | VARCHAR(100) | No | -- | First name |
| lastName | VARCHAR(100) | Yes | -- | Last name |
| phone | VARCHAR(20) | Yes | -- | Phone number |
| email | VARCHAR(255) | Yes | -- | Email address |
| address | TEXT | Yes | -- | Physical address |
| creditBalance | NUMERIC(12,2) | No | 0 | Outstanding debt |
| creditLimit | NUMERIC(12,2) | Yes | -- | Max credit allowed |
| status | ENUM | No | 'ACTIVE' | ACTIVE, INACTIVE, BLOCKED |
| notes | TEXT | Yes | -- | Internal notes |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |
| deletedAt | TIMESTAMPTZ | Yes | -- | Soft delete timestamp |

**Check:** creditBalance >= 0, creditLimit >= 0 (when provided)

---

## Sale Table

**Purpose:** A transaction record.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| cashierId | UUID | No | -- | FK to User |
| customerId | UUID | Yes | -- | FK to Customer (optional) |
| paymentMethod | ENUM | No | -- | CASH, MOBILE_MONEY, CREDIT |
| subtotal | NUMERIC(12,2) | No | -- | Sum of item totals |
| taxAmount | NUMERIC(12,2) | No | 0 | Tax amount |
| discountAmount | NUMERIC(12,2) | No | 0 | Discount amount |
| totalAmount | NUMERIC(12,2) | No | -- | Final amount |
| amountTendered | NUMERIC(12,2) | Yes | -- | Cash given (for cash sales) |
| changeAmount | NUMERIC(12,2) | Yes | -- | Change returned |
| status | ENUM | No | 'COMPLETED' | COMPLETED, VOIDED, REFUNDED |
| notes | TEXT | Yes | -- | Sale notes |
| createdAt | TIMESTAMPTZ | No | now() | Sale timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |

**Check:** totalAmount > 0, subtotal >= 0, taxAmount >= 0, discountAmount >= 0

**Business Rule:** customerId required when paymentMethod = 'CREDIT'

---

## SaleItem Table

**Purpose:** Line items within a sale.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| saleId | UUID | No | -- | FK to Sale |
| productId | UUID | No | -- | FK to Product |
| quantity | INTEGER | No | -- | Quantity sold |
| unitPrice | NUMERIC(12,2) | No | -- | Price at time of sale |
| totalPrice | NUMERIC(12,2) | No | -- | quantity x unitPrice |

**Check:** quantity > 0, unitPrice >= 0, totalPrice = quantity * unitPrice

---

## Payment Table

**Purpose:** Tracks money received or paid.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| saleId | UUID | Yes | -- | FK to Sale |
| customerId | UUID | Yes | -- | FK to Customer |
| type | ENUM | No | -- | INCOMING, OUTGOING |
| method | ENUM | No | -- | CASH, MOBILE_MONEY, BANK_TRANSFER |
| amount | NUMERIC(12,2) | No | -- | Payment amount |
| reference | VARCHAR(100) | Yes | -- | Transaction reference |
| notes | TEXT | Yes | -- | Payment notes |
| userId | UUID | No | -- | FK to User (who recorded) |
| createdAt | TIMESTAMPTZ | No | now() | Payment timestamp |

**Check:** amount > 0

---

## Expense Table

**Purpose:** Business expenses.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| categoryId | UUID | No | -- | FK to ExpenseCategory |
| amount | NUMERIC(12,2) | No | -- | Expense amount |
| description | TEXT | No | -- | What the expense was for |
| date | DATE | No | CURRENT_DATE | Expense date |
| paymentMethod | ENUM | No | 'CASH' | How it was paid |
| receiptUrl | TEXT | Yes | -- | Receipt image URL |
| userId | UUID | No | -- | FK to User (who recorded) |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |

**Check:** amount > 0

---

## ExpenseCategory Table

**Purpose:** Classifies expenses.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| name | VARCHAR(100) | No | -- | Category name |
| isActive | BOOLEAN | No | true | Active status |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |

**Unique:** (businessId, name)

---

## Notification Table

**Purpose:** System alerts and messages.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| userId | UUID | Yes | -- | FK to User (null = broadcast) |
| type | ENUM | No | -- | LOW_STOCK, CREDIT_PAYMENT, etc. |
| title | VARCHAR(200) | No | -- | Notification title |
| message | TEXT | No | -- | Notification body |
| isRead | BOOLEAN | No | false | Read status |
| link | VARCHAR(500) | Yes | -- | Deep link to relevant page |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |

---

## AuditLog Table

**Purpose:** Tracks who changed what and when.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business |
| userId | UUID | No | -- | FK to User |
| action | ENUM | No | -- | CREATE, UPDATE, DELETE, LOGIN, LOGOUT |
| entity | VARCHAR(50) | No | -- | Product, Sale, Customer, etc. |
| entityId | UUID | No | -- | ID of affected record |
| oldValues | JSONB | Yes | -- | Previous values |
| newValues | JSONB | Yes | -- | New values |
| ipAddress | VARCHAR(45) | Yes | -- | Client IP |
| userAgent | TEXT | Yes | -- | Browser/device info |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |

---

## RefreshToken Table

**Purpose:** Enables long-lived sessions.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| userId | UUID | No | -- | FK to User |
| token | VARCHAR(500) | No | -- | Hashed token (unique) |
| expiresAt | TIMESTAMPTZ | No | -- | Expiration time |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |

---

## PasswordResetToken Table

**Purpose:** Enables password reset via email.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| userId | UUID | No | -- | FK to User |
| token | VARCHAR(500) | No | -- | Hashed token (unique) |
| expiresAt | TIMESTAMPTZ | No | -- | Expiration time |
| usedAt | TIMESTAMPTZ | Yes | -- | When used (null = unused) |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |

---

## BusinessSettings Table

**Purpose:** Business-level configuration.

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| businessId | UUID | No | -- | FK to Business (unique) |
| taxRate | NUMERIC(5,2) | No | 0 | Default tax rate % |
| currency | VARCHAR(3) | No | 'ETB' | Currency code |
| currencySymbol | VARCHAR(5) | No | 'Br' | Currency symbol |
| lowStockThreshold | INTEGER | No | 5 | Default low stock threshold |
| receiptHeader | TEXT | Yes | -- | Receipt header text |
| receiptFooter | TEXT | Yes | -- | Receipt footer text |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
| updatedAt | TIMESTAMPTZ | No | now() | Last update timestamp |

---

## ActivityLog Table

**Purpose:** Records user actions (login, logout, sale processed).

| Column | Type | Nullable | Default | Description |
|:-------|:-----|:---------|:--------|:------------|
| id | UUID | No | gen_random_uuid() | Primary key |
| userId | UUID | No | -- | FK to User |
| action | VARCHAR(50) | No | -- | Action performed |
| description | TEXT | Yes | -- | Action details |
| ipAddress | VARCHAR(45) | Yes | -- | Client IP |
| userAgent | TEXT | Yes | -- | Browser/device info |
| createdAt | TIMESTAMPTZ | No | now() | Creation timestamp |
