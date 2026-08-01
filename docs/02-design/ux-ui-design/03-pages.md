# Page Structures
## SmartBiz ERP Lite

**Version:** 1.0
**Date:** August 2026

---

## 1. Dashboard

### Purpose
Business overview at a glance — the first screen owners and managers see after login.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Dashboard                                              Today ▼ │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ 💰 25,000│  │ 📦 120   │  │ 👥 8     │  │ ⚠️ 5     │        │
│  │ Today's  │  │ Products │  │ Customers│  │ Low Stock│        │
│  │ Sales    │  │          │  │ w/ Credit│  │ Alerts   │        │
│  │ ↑ 12%    │  │ ↑ 3 new  │  │ ↓ 2,000  │  │          │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐   │
│  │  Sales This Week            │  │  Top Selling Products    │   │
│  │  ┌─────────────────────┐   │  │  1. Milk 1L      (120)  │   │
│  │  │   [Line Chart]      │   │  │  2. Bread        (95)   │   │
│  │  └─────────────────────┘   │  │  3. Sugar 1kg    (80)   │   │
│  └─────────────────────────────┘  └─────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐   │
│  │  Recent Sales               │  │  Customer Credit Summary │   │
│  │                             │  │                         │   │
│  │  10:32  Milk x2    90 ETB  │  │  Total Owed: 15,000 ETB │   │
│  │  10:28  Bread x1   25 ETB  │  │  ┌─────────────────┐    │   │
│  │  10:15  Sugar x3   255 ETB │  │  │ [Bar Chart]     │    │   │
│  │  10:02  Rice x1    320 ETB │  │  └─────────────────┘    │   │
│  │                             │  │                         │   │
│  │  [View All Sales →]         │  │  [View All Customers →] │   │
│  └─────────────────────────────┘  └─────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Quick Actions                                            │   │
│  │  [ + New Sale ]  [ + Add Product ]  [ + Add Customer ]   │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### Components
- Summary cards (4 cards)
- Sales trend chart (line)
- Top selling products (horizontal bar)
- Recent sales list
- Customer credit summary (bar chart)
- Quick action buttons

### Primary Buttons
- "New Sale" (center, most prominent)
- "Add Product"
- "Add Customer"

### Loading Behavior
- Skeleton cards while dashboard loads
- Charts show loading spinner
- Data refreshes every 30 seconds

### Empty State
```
┌─────────────────────────────────────────────┐
│           [Store illustration]              │
│        Welcome to SmartBiz!                 │
│   Your dashboard will show business         │
│   insights once you start making sales.     │
│   [ + Add Product ]  [ + Add Customer ]    │
└─────────────────────────────────────────────┘
```

### Responsive Behavior
- **Desktop:** 4-column summary cards, 2-column charts section
- **Tablet:** 2-column summary cards, 1-column charts (stacked)
- **Mobile:** 1-column cards (horizontal scroll), charts stacked vertically

---

## 2. Products Page

### Purpose
Browse, search, and manage the product catalog.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Products                                         + Add Product │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search products...    Category ▼    Status ▼    Sort ▼      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ☐  Product      Category   Price    Stock    Status  ⋮  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ ☐  Milk 1L      Dairy      45 ETB   120     ✅ In Stock │   │
│  │ ☐  Bread        Bakery     25 ETB   5       ⚠️ Low     │   │
│  │ ☐  Sugar 1kg    Grocery    85 ETB   0       ❌ Out      │   │
│  │ ☐  Rice 5kg     Grocery    320 ETB  45      ✅ In Stock │   │
│  │ ☐  Coffee 500g  Beverage   180 ETB  30      ✅ In Stock │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Showing 1-20 of 150              ‹ 1 2 3 4 5 ... 8 ›          │
└──────────────────────────────────────────────────────────────────┘
```

### Components
- Search bar with real-time filtering
- Category filter dropdown
- Status filter dropdown
- Sort dropdown
- Data table with product rows
- Pagination

### Actions
- Click product row → View/Edit product
- Click "Add Product" → Open add product form
- Click row actions (⋮) → Edit, Delete, Adjust Stock
- Checkbox → Bulk delete (Owner only)

### Empty State
```
┌─────────────────────────────────────────────┐
│           [Package icon]                    │
│        No products yet                      │
│   Add your first product to start           │
│   managing your inventory.                  │
│        [ + Add Product ]                    │
└─────────────────────────────────────────────┘
```

### Responsive Behavior
- **Desktop:** Full table with all columns
- **Tablet:** Table with some columns hidden
- **Mobile:** Card view instead of table

---

## 3. Add/Edit Product

### Purpose
Create or modify a product in the catalog.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Products        Add Product                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Basic Information                                        │   │
│  │                                                          │   │
│  │  Product Name *          Category *                       │   │
│  │  ┌──────────────────┐   ┌──────────────────┐            │   │
│  │  │                  │   │ Select category ▼│            │   │
│  │  └──────────────────┘   └──────────────────┘            │   │
│  │                                                          │   │
│  │  SKU (optional)            Barcode (optional)            │   │
│  │  ┌──────────────────┐   ┌──────────────────┐            │   │
│  │  │                  │   │                  │            │   │
│  │  └──────────────────┘   └──────────────────┘            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Pricing                                                  │   │
│  │                                                          │   │
│  │  Base Cost (ETB) *     Overhead Cost (ETB) *             │   │
│  │  ┌──────────────────┐   ┌──────────────────┐            │   │
│  │  │ 0.00             │   │ 0.00             │            │   │
│  │  └──────────────────┘   └──────────────────┘            │   │
│  │                                                          │   │
│  │  Landed Cost (auto): 0.00 ETB                            │   │
│  │                                                          │   │
│  │  Selling Price (ETB) *                                    │   │
│  │  ┌──────────────────┐                                    │   │
│  │  │ 0.00             │                                    │   │
│  │  └──────────────────┘                                    │   │
│  │                                                          │   │
│  │  ⚠️ Warning: Selling price is below landed cost          │   │
│  │  Profit Margin: 15.5%                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Inventory                                                │   │
│  │                                                          │   │
│  │  Minimum Stock Threshold *                                │   │
│  │  ┌──────────────────┐                                    │   │
│  │  │ 5                │                                    │   │
│  │  └──────────────────┘                                    │   │
│  │  Alert when stock drops below this level                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│          [ Cancel ]                    [ Save Product ]          │
└──────────────────────────────────────────────────────────────────┘
```

### Field Grouping

| Group | Fields |
|:------|:-------|
| **Basic Information** | Name, Category, SKU, Barcode |
| **Pricing** | Base Cost, Overhead Cost, Selling Price |
| **Inventory** | Minimum Stock Threshold |

### Validation Messages

| Field | Validation | Error Message |
|:------|:-----------|:--------------|
| Product Name | Required | "Product name is required" |
| Product Name | Max 200 chars | "Product name must be under 200 characters" |
| Category | Required | "Please select a category" |
| Base Cost | Required, ≥ 0 | "Base cost must be 0 or more" |
| Overhead Cost | Required, ≥ 0 | "Overhead cost must be 0 or more" |
| Selling Price | Required, > 0 | "Selling price must be greater than 0" |
| Selling Price | < Landed Cost | "Selling price is below landed cost" |
| Min Threshold | Required, ≥ 0 | "Minimum threshold must be 0 or more" |

### Success Feedback
- Toast: "Product saved successfully"
- Redirect to products list

### Responsive Behavior
- **Desktop:** Two-column layout
- **Tablet:** Single column, all groups stacked
- **Mobile:** Single column, groups collapsible

---

## 4. Categories Page

### Purpose
Manage product categories.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Categories                                     + Add Category │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search categories...                                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Category Name        Products    Status          Actions │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Dairy                15          ✅ Active        ⋮      │   │
│  │  Bakery               8           ✅ Active        ⋮      │   │
│  │  Grocery              45          ✅ Active        ⋮      │   │
│  │  Beverage             12          ✅ Active        ⋮      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Units Page

### Purpose
Manage measurement units (kg, liters, pieces, boxes, etc.).

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Units                                            + Add Unit   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Unit Name        Symbol    Products          Actions    │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Piece            pc        45                 ⋮         │   │
│  │  Kilogram         kg        30                 ⋮         │   │
│  │  Liter            L         20                 ⋮         │   │
│  │  Box              box       15                 ⋮         │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. Inventory Page

### Purpose
Overview of all stock levels with low-stock alerts.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Inventory                                     Adjust Stock ▼   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search...    Status ▼ (All / Low Stock / Out of Stock)     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Product        Current Stock   Min Threshold   Status   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Milk 1L        120             10              ✅ OK    │   │
│  │  Bread          5               10              ⚠️ Low   │   │
│  │  Sugar 1kg      0               10              ❌ Out   │   │
│  │  Rice 5kg       45              10              ✅ OK    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ⚠️ 5 items below minimum threshold                             │
│  [ View Low Stock Items → ]                                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Stock Movement Page

### Purpose
View history of all stock adjustments and movements.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Stock Movement History                                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search...    Date Range ▼    Type ▼ (All / Sale / Adjust)  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Date/Time      Product     Type     Qty    Before→After │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Jul 31 10:32   Milk 1L     Sale     -2     122→120     │   │
│  │  Jul 31 10:15   Sugar 1kg   Sale     -3     5→2         │   │
│  │  Jul 31 09:00   Bread       Adjust   +50    0→50        │   │
│  │  Jul 30 16:45   Rice 5kg    Sale     -5     50→45       │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. Customers Page

### Purpose
Manage customer profiles and view credit status.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Customers                                     + Add Customer  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search customers...    Credit Status ▼                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Name            Phone           Credit Balance   Actions│   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Abdi Ahmed      +251911234567   5,000 ETB        ⋮     │   │
│  │  Fatuma Hassan   +251922345678   0 ETB            ⋮     │   │
│  │  Tesfaye D.      +251933456789   2,500 ETB        ⋮     │   │
│  │  Sara Mohammed   +251944567890   7,500 ETB        ⋮     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Total Outstanding Credit: 15,000 ETB                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 9. Customer Details Page

### Purpose
View complete customer profile, transaction history, and credit status.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Customers       Customer Details                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  👤 Abdi Ahmed                                           │   │
│  │  📱 +251911234567                                        │   │
│  │                                                          │   │
│  │  Credit Balance: 5,000 ETB                               │   │
│  │  Total Purchases: 25,000 ETB                             │   │
│  │  Member Since: Jan 2026                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [ Record Payment ]          [ Edit Customer ]                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Transaction History                                     │   │
│  │                                                          │   │
│  │  Date        Type        Amount      Balance             │   │
│  │  ─────────────────────────────────────────────────       │   │
│  │  Jul 31      Sale        +500 ETB    5,000 ETB           │   │
│  │  Jul 30      Payment     -1,000 ETB  4,500 ETB           │   │
│  │  Jul 28      Sale        +1,500 ETB  5,500 ETB           │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 10. Credit Management Page

### Purpose
Overview of all customer debts and payment tracking.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Credit Management                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Total    │  │ Owed by  │  │ Paid     │  │ Overdue  │       │
│  │ Owed     │  │ Top 5    │  │ This Month│  │ Accounts │       │
│  │ 15,000   │  │ 12,000   │  │ 8,000    │  │ 2        │       │
│  │ ETB      │  │ ETB      │  │ ETB      │  │ accounts │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Outstanding Debts                                       │   │
│  │                                                          │   │
│  │  Customer       Balance     Last Payment    Status      │   │
│  │  ───────────────────────────────────────────────────     │   │
│  │  Sara Mohammed  7,500 ETB   Jul 20          ⚠️ 11 days  │   │
│  │  Abdi Ahmed     5,000 ETB   Jul 30          ✅ Recent   │   │
│  │  Tesfaye D.     2,500 ETB   Jul 25          ✅ Recent   │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 11. Sales Page

### Purpose
View all sales history with filtering.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Sales History                              + New Sale          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search...    Date Range ▼    Payment Method ▼    Cashier ▼ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ID       Date         Cashier    Total      Method  ⋮  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  #1001    Jul 31 10:32 Fatima     90 ETB     Cash    ⋮  │   │
│  │  #1000    Jul 31 10:28 Dawit      25 ETB     Cash    ⋮  │   │
│  │  #0999    Jul 31 10:15 Fatima     255 ETB    Mobile  ⋮  │   │
│  │  #0998    Jul 31 10:02 Dawit      320 ETB    Credit  ⋮  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Showing 1-20 of 1,500              ‹ 1 2 3 4 5 ... 75 ›      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 12. New Sale (POS Screen)

### Purpose
Process a new sale — the core revenue-generating screen.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back        Point of Sale                     👤 Fatima      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────┐  ┌─────────────────────────────┐  │
│  │  🔍 Search products...   │  │  🛒 Cart                    │  │
│  │                          │  │                             │  │
│  │  ┌────┐ ┌────┐ ┌────┐  │  │  Milk 1L x2     90 ETB     │  │
│  │  │Milk│ │Bred│ │Suga│  │  │  Bread x1        25 ETB     │  │
│  │  │45  │ │25  │ │85  │  │  │  Sugar 1kg x3   255 ETB    │  │
│  │  └────┘ └────┘ └────┘  │  │                             │  │
│  │  ┌────┐ ┌────┐ ┌────┐  │  │  ─────────────────────────  │  │
│  │  │Rice│ │Coff│ │Tea │  │  │  Subtotal:      370 ETB     │  │
│  │  │320 │ │180 │ │60  │  │  │  Total:         370 ETB     │  │
│  │  └────┘ └────┘ └────┘  │  │                             │  │
│  │                          │  │  [ 🗑 Clear Cart ]          │  │
│  │  [ 📷 Scan Barcode ]    │  │                             │  │
│  └──────────────────────────┘  └─────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Payment                                                 │   │
│  │                                                          │   │
│  │  [ 💵 Cash ]  [ 📱 Mobile Money ]  [ 🏷 Credit ]       │   │
│  │                                                          │   │
│  │  Amount Tendered: ___________    Change: 0 ETB          │   │
│  │                                                          │   │
│  │  [ ========== Complete Sale ========== ]                │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### Validation Messages

| Scenario | Message |
|:---------|:--------|
| Empty cart | "Add items to the cart before completing sale" |
| Insufficient stock | "Not enough stock for [product]. Available: [qty]" |
| Credit without customer | "Please select a customer for credit sales" |
| Amount < total (cash) | "Amount tendered is less than total" |

### Success State
- Green checkmark animation
- "Sale Complete! #1001"
- Cart clears automatically

### Responsive Behavior
- **Desktop:** Side-by-side (products left, cart right, payment bottom)
- **Tablet:** Same layout, slightly compressed
- **Mobile:** Stacked layout; product search top, cart middle, payment bottom

---

## 13. Invoice Details Page

### Purpose
View a complete invoice for a specific sale.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Sales        Invoice #1001                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  🏪 SmartBiz ERP Lite                                    │   │
│  │  ─────────────────────────────────────────────────       │   │
│  │  Invoice: #1001              Date: Jul 31, 2026 10:32   │   │
│  │  Cashier: Fatima             Payment: Cash              │   │
│  │  Customer: Walk-in                                   │   │
│  │  ─────────────────────────────────────────────────       │   │
│  │                                                          │   │
│  │  Item          Qty    Unit Price    Total                │   │
│  │  ─────────────────────────────────────────────           │   │
│  │  Milk 1L       2      45 ETB        90 ETB              │   │
│  │  Bread         1      25 ETB        25 ETB              │   │
│  │  Sugar 1kg     3      85 ETB        255 ETB             │   │
│  │  ─────────────────────────────────────────────           │   │
│  │                    Subtotal:     370 ETB                │   │
│  │                    Total:        370 ETB                │   │
│  │  ─────────────────────────────────────────────────       │   │
│  │                    Paid:         400 ETB                │   │
│  │                    Change:       30 ETB                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [ 🖨 Print Invoice ]  [ 📧 Share ]  [ ↩️ Void Sale ]         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 14. Reports Page

### Purpose
Business analytics and reporting.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Reports                                                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐  │
│  │ Sales      │  │ Debt       │  │ Products   │  │ Profit   │  │
│  │ Report     │  │ Summary    │  │ Report     │  │ Report   │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Sales Report                                            │   │
│  │                                                          │   │
│  │  Date Range: [Jul 1] to [Jul 31]         [ Apply ]      │   │
│  │                                                          │   │
│  │  Total Revenue: 750,000 ETB                              │   │
│  │  Total Transactions: 1,500                               │   │
│  │  Average Sale: 500 ETB                                   │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────┐                │   │
│  │  │  [Sales Trend Chart - Line]         │                │   │
│  │  └─────────────────────────────────────┘                │   │
│  │                                                          │   │
│  │  [ 📥 Export CSV ]  [ 📄 Export PDF ]                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### Report Cards

| Report | Icon | Description |
|:-------|:-----|:------------|
| Sales Report | 📊 | Revenue, transactions, trends |
| Debt Summary | 💰 | Customer credit overview |
| Products Report | 📦 | Inventory, top sellers, slow movers |
| Profit Report | 📈 | Revenue vs. landed cost analysis |

---

## 15. Business Settings Page

### Purpose
Configure business-level settings.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Business Settings                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Business Information                                     │   │
│  │                                                          │   │
│  │  Business Name *                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ Alem's Mini Market                                │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  Phone Number                                            │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ +251911234567                                     │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  Address                                                 │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ Bole, Addis Ababa                                │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Currency                                                │   │
│  │  Currency: ETB (Ethiopian Birr)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│          [ Save Changes ]                                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 16. Notifications Page

### Purpose
View system notifications and alerts.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Notifications                         [ Mark All as Read ]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ⚠️ Low Stock Alert                                       │   │
│  │  Bread is below minimum threshold (5/10)                 │   │
│  │  2 hours ago                                    [ View ]  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  💰 Credit Payment Received                               │   │
│  │  Abdi Ahmed paid 1,000 ETB on their credit balance       │   │
│  │  5 hours ago                                    [ View ]  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ✅ Sync Complete                                         │   │
│  │  3 offline sales have been synced successfully           │   │
│  │  Yesterday                                    [ View ]   │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```
