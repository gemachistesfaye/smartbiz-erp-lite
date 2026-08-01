# Page Structures
## SmartBiz ERP Lite

---

## 1. Dashboard

**Purpose:** Business overview — first screen for Owner/Manager.

```
┌──────────────────────────────────────────────────────────────────┐
│  Dashboard                                              Today ▼ │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ 💰 25,000│  │ 📦 120   │  │ 👥 8     │  │ ⚠️ 5     │        │
│  │ Today's  │  │ Products │  │ Customers│  │ Low Stock│        │
│  │ Sales ↑12│  │ ↑ 3 new  │  │ w/Credit │  │ Alerts   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│  ┌─────────────────────────┐  ┌─────────────────────────┐       │
│  │  Sales This Week        │  │  Top Selling Products    │       │
│  │  [Line Chart]           │  │  1. Milk 1L (120)        │       │
│  └─────────────────────────┘  │  2. Bread (95)           │       │
│  ┌─────────────────────────┐  │  3. Sugar 1kg (80)       │       │
│  │  Recent Sales           │  └─────────────────────────┘       │
│  │  10:32 Milk x2 90 ETB  │  ┌─────────────────────────┐       │
│  │  10:28 Bread x1 25 ETB │  │  Credit Summary          │       │
│  │  [View All Sales →]     │  │  Total Owed: 15,000 ETB  │       │
│  └─────────────────────────┘  │  [Bar Chart]             │       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  [ + New Sale ]  [ + Add Product ]  [ + Add Customer ]   │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

- **Empty state:** Welcome card with onboarding actions
- **Responsive:** 4-col → 2-col → 1-col cards; charts stacked on mobile

---

## 2. Products Page

**Purpose:** Browse, search, manage product catalog.

```
┌──────────────────────────────────────────────────────────────────┐
│  Products                                         + Add Product │
├──────────────────────────────────────────────────────────────────┤
│  🔍 Search...    Category ▼    Status ▼    Sort ▼               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ☐  Product      Category   Price    Stock    Status  ⋮  │   │
│  │ ☐  Milk 1L      Dairy      45 ETB   120     ✅ In Stock │   │
│  │ ☐  Bread        Bakery     25 ETB   5       ⚠️ Low     │   │
│  │ ☐  Sugar 1kg    Grocery    85 ETB   0       ❌ Out      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  Showing 1-20 of 150              ‹ 1 2 3 4 5 ... 8 ›          │
└──────────────────────────────────────────────────────────────────┘
```

- **Desktop:** Full table | **Tablet:** Some columns hidden | **Mobile:** Card view
- Click row → Edit | `⋮` → Edit, Delete, Adjust Stock

---

## 3. Add/Edit Product

**Purpose:** Create or modify a product.

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Products        Add Product                          │
├──────────────────────────────────────────────────────────────────┤
│  Basic Information                                              │
│  Product Name *          Category *                              │
│  SKU (optional)          Barcode (optional)                      │
│                                                                  │
│  Pricing                                                         │
│  Base Cost (ETB) *       Overhead Cost (ETB) *                  │
│  Landed Cost (auto): 0.00 ETB                                   │
│  Selling Price (ETB) *                                          │
│  ⚠️ Warning if below landed cost  |  Profit Margin: %           │
│                                                                  │
│  Inventory                                                       │
│  Min Stock Threshold *                                           │
│                                                                  │
│          [ Cancel ]                    [ Save Product ]          │
└──────────────────────────────────────────────────────────────────┘
```

**Validation:** Name required (max 200), Category required, Base/Overhead ≥ 0, Selling Price > 0, Min Threshold ≥ 0

---

## 4. Categories / Units Pages

**Purpose:** Manage product categories and measurement units (kg, L, pc, box).

```
┌──────────────────────────────────────────────────────────────────┐
│  Categories                                     + Add Category │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Category Name     Products    Status          Actions   │   │
│  │  Dairy             15          ✅ Active        ⋮        │   │
│  │  Bakery            8           ✅ Active        ⋮        │   │
│  │  Grocery           45          ✅ Active        ⋮        │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Inventory Page

**Purpose:** Stock levels overview with low-stock alerts.

```
┌──────────────────────────────────────────────────────────────────┐
│  Inventory                                     Adjust Stock ▼   │
│  🔍 Search...    Status ▼ (All / Low / Out)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Product        Current Stock   Min Threshold   Status   │   │
│  │  Milk 1L        120             10              ✅ OK    │   │
│  │  Bread          5               10              ⚠️ Low   │   │
│  │  Sugar 1kg      0               10              ❌ Out   │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ⚠️ 5 items below threshold  |  [ View Low Stock Items → ]     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. Customers Page

**Purpose:** Manage customers and credit status.

```
┌──────────────────────────────────────────────────────────────────┐
│  Customers                                     + Add Customer   │
│  🔍 Search...    Credit Status ▼                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Name            Phone           Credit Balance   Actions│   │
│  │  Abdi Ahmed      +251911234567   5,000 ETB        ⋮     │   │
│  │  Fatuma Hassan   +251922345678   0 ETB            ⋮     │   │
│  │  Tesfaye D.      +251933456789   2,500 ETB        ⋮     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  Total Outstanding Credit: 15,000 ETB                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Customer Details

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back       Customer Details                                  │
│  👤 Abdi Ahmed | 📱 +251911234567                               │
│  Credit: 5,000 ETB | Purchases: 25,000 ETB | Since: Jan 2026   │
│  [ Record Payment ]  [ Edit Customer ]                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Transaction History                                     │   │
│  │  Jul 31  Sale      +500 ETB    Balance: 5,000 ETB        │   │
│  │  Jul 30  Payment   -1,000 ETB  Balance: 4,500 ETB        │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. POS Screen

**Purpose:** Process sales — core revenue screen.

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back        Point of Sale                     👤 Fatima      │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐  ┌─────────────────────────────┐  │
│  │  🔍 Search products...   │  │  🛒 Cart                    │  │
│  │  ┌────┐ ┌────┐ ┌────┐  │  │  Milk 1L x2     90 ETB     │  │
│  │  │Milk│ │Bred│ │Suga│  │  │  Bread x1        25 ETB     │  │
│  │  │45  │ │25  │ │85  │  │  │  ─────────────────────────  │  │
│  │  └────┘ └────┘ └────┘  │  │  Total:         370 ETB     │  │
│  │  [ 📷 Scan Barcode ]    │  │  [ 🗑 Clear Cart ]          │  │
│  └──────────────────────────┘  └─────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  [ 💵 Cash ]  [ 📱 Mobile Money ]  [ 🏷 Credit ]       │   │
│  │  Amount Tendered: ___________    Change: 0 ETB          │   │
│  │  [ ========== Complete Sale ========== ]                │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

- **Responsive:** Desktop → side-by-side; Mobile → stacked (search top, cart mid, payment bottom)
- **Success:** Green checkmark "Sale Complete! #1001" → cart clears

---

## 9. Sales History

```
┌──────────────────────────────────────────────────────────────────┐
│  Sales History                              + New Sale          │
│  🔍 Search...    Date Range ▼    Payment Method ▼    Cashier ▼ │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ID       Date         Cashier    Total      Method  ⋮  │   │
│  │  #1001    Jul 31 10:32 Fatima     90 ETB     Cash    ⋮  │   │
│  │  #1000    Jul 31 10:28 Dawit      25 ETB     Cash    ⋮  │   │
│  │  #0999    Jul 31 10:15 Fatima     255 ETB    Mobile  ⋮  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  Showing 1-20 of 1,500              ‹ 1 2 3 4 5 ... 75 ›      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 10. Invoice Details

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back        Invoice #1001                                    │
│  🏪 SmartBiz ERP Lite | Jul 31, 2026 10:32 | Cashier: Fatima   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Item          Qty    Unit Price    Total                │   │
│  │  Milk 1L       2      45 ETB        90 ETB              │   │
│  │  Bread         1      25 ETB        25 ETB              │   │
│  │  Sugar 1kg     3      85 ETB        255 ETB             │   │
│  │  ─────────────────────────────────────────────           │   │
│  │  Subtotal: 370 ETB | Paid: 400 ETB | Change: 30 ETB    │   │
│  └──────────────────────────────────────────────────────────┘   │
│  [ 🖨 Print ]  [ 📧 Share ]  [ ↩️ Void ]                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 11. Reports Page

```
┌──────────────────────────────────────────────────────────────────┐
│  Reports                                                         │
│  [ Sales ]  [ Debt ]  [ Products ]  [ Profit ]                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Date Range: [Jul 1] to [Jul 31]         [ Apply ]      │   │
│  │  Revenue: 750,000 ETB | Transactions: 1,500 | Avg: 500  │   │
│  │  [Sales Trend Chart]                                     │   │
│  │  [ 📥 Export CSV ]  [ 📄 Export PDF ]                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 12. Settings / Notifications

**Settings:** Business name, phone, address, currency (ETB) — edit + save.

**Notifications:** Low stock alerts, credit payments received, sync status — mark all read.

---

## 13. Login / Forgot Password

**Login:** Centered card — email, password, "Log In" button, links to Register + Forgot Password.

**Forgot Password:** Enter email → "Reset link sent!" → Back to Login.

**Reset Password:** New password + confirm → Redirect to login.

**Validation:** Email required/valid, Password required, min 8 chars, must have number.
