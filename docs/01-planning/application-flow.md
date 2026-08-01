# Application Flow
## SmartBiz ERP Lite

This document describes every major user journey from login through daily business operations.

---

## 1. Application Entry Points

```
┌─────────────────────────────────────────────────────┐
│                   First Launch                       │
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐  │
│  │  PWA     │    │  Login   │    │  Register    │  │
│  │  Install │───►│  Screen  │───►│  (New Owner) │  │
│  │  Prompt  │    │          │    │              │  │
│  └──────────┘    └────┬─────┘    └──────────────┘  │
│                       │                             │
│              ┌────────┴────────┐                    │
│              │                 │                    │
│              ▼                 ▼                    │
│     ┌──────────────┐  ┌──────────────┐             │
│     │   Dashboard  │  │   POS Screen │             │
│     │  (Owner/Mgr) │  │  (Cashier)   │             │
│     └──────────────┘  └──────────────┘             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 2. Owner Onboarding Journey

### Step 1: Registration
```
User opens app → Register page
    │
    ├─► Enters: Business name, Email, Password, First name, Last name
    │
    ├─► Clicks "Register"
    │
    ├─► Frontend validates input
    │
    ├─► POST /api/auth/register
    │
    ├─► Backend creates Tenant + Owner user
    │
    ├─► Returns JWT token
    │
    └─► Redirect to Dashboard
```

### Step 2: Initial Setup (Dashboard)
```
Owner sees empty dashboard
    │
    ├─► "Welcome! Set up your business" card
    │
    ├─► Quick actions:
    │   ├── Add your first category
    │   ├── Add your first product
    │   └── Add a cashier
    │
    └─► Dashboard shows placeholder values
```

### Step 3: Add Staff
```
Owner navigates to Users page
    │
    ├─► Clicks "Add Staff"
    │
    ├─► Enters: Email, First name, Last name, Role
    │
    ├─► Clicks "Create"
    │
    ├─► POST /api/users
    │
    ├─► Staff member created
    │
    └─► Owner shares credentials with staff verbally
```

### Step 4: Add Products
```
Owner navigates to Products page
    │
    ├─► Clicks "Add Product"
    │
    ├─► Enters:
    │   ├── Product name
    │   ├── Category (select or create)
    │   ├── SKU (optional)
    │   ├── Barcode (optional)
    │   ├── Base cost (ETB)
    │   ├── Overhead cost (ETB)
    │   └── Selling price (ETB)
    │
    ├─► System auto-calculates: Landed cost = base + overhead
    │
    ├─► Clicks "Save"
    │
    ├─► POST /api/products
    │
    ├─► Product created with inventory = 0
    │
    └─► Owner adds initial stock via Inventory adjustment
```

---

## 3. Daily Operations Flow (Manager)

### Morning Opening
```
Manager logs in → Dashboard
    │
    ├─► Reviews dashboard:
    │   ├── Yesterday's total sales
    │   ├── Current low-stock items
    │   ├── Outstanding customer debts
    │   └── Today's pending tasks
    │
    ├─► Checks inventory alerts
    │
    └─► Acknowledges any sync status indicators
```

### Processing a Sale (POS Flow)
```
Customer brings items to counter
    │
    ├─► Manager opens POS screen
    │
    ├─► Searches product by name:
    │   ├── Types "milk" in search box
    │   ├── Results appear in < 1 second
    │   └── Shows: product name, price, stock level
    │
    ├─► Taps product to add to cart
    │   ├── Product appears in cart panel
    │   ├── Shows: name, quantity (1), unit price, line total
    │   └── Running total updates at bottom
    │
    ├─► Can adjust quantity (tap +/- or enter number)
    │
    ├─► Can add more products (repeat search + add)
    │
    ├─► When all items added:
    │   ├── Reviews cart
    │   ├── Sees subtotal and total
    │   └── Selects payment method
    │
    ├─► Payment method selection:
    │   ├── CASH → Enter amount tendered → Calculate change
    │   ├── MOBILE_MONEY → Enter reference number → Confirm
    │   └── CREDIT → Select or create customer → Confirm
    │
    ├─► Clicks "Complete Sale"
    │
    ├─► POST /api/sales/checkout
    │   ├── Validates stock availability
    │   ├── Creates Sale + SaleItems
    │   ├── Decrements inventory
    │   ├── If credit: updates customer balance
    │   └── Returns sale confirmation
    │
    ├─► Screen shows "Sale Complete" with checkmark
    │
    ├─► Cart resets automatically
    │
    └─► Ready for next customer
```

### Inventory Management
```
Manager notices low stock (or sees alert)
    │
    ├─► Navigates to Inventory page
    │
    ├─► Sees low-stock items highlighted
    │
    ├─► To adjust stock:
    │   ├── Clicks on product
    │   ├── Sees current stock level
    │   ├── Enters new quantity or delta
    │   ├── Provides reason (e.g., "Restocked from supplier")
    │   └── Confirms adjustment
    │
    ├─► POST /api/inventory/adjust
    │
    ├─► Stock updated
    │
    └─► Adjustment logged in history
```

### Customer Credit Payment
```
Customer comes to pay their debt
    │
    ├─► Manager opens Customers page
    │
    ├─► Searches customer by name or phone
    │
    ├─► Clicks on customer → Customer detail page
    │   ├── Shows: name, phone, credit balance
    │   ├── Shows: transaction history
    │   └── Shows: "Record Payment" button
    │
    ├─► Clicks "Record Payment"
    │
    ├─► Enters payment amount (ETB)
    │
    ├─► System validates: amount <= outstanding balance
    │
    ├─► Clicks "Confirm"
    │
    ├─► POST /api/customers/:id/payment
    │
    ├─► Customer's credit balance reduced
    │
    └─► Payment appears in history
```

---

## 4. Cashier Daily Flow

### Cashier Login → POS
```
Cashier logs in → POS screen (default landing)
    │
    ├─► No access to dashboard or reports
    │
    ├─► Can only:
    │   ├── Process sales
    │   ├── Search products
    │   └── Register new customers
    │
    └─► Navigation limited to POS-related pages
```

### Quick Cash Sale
```
Customer: "I need 2 bottles of water and 1 bread"
    │
    ├─► Cashier searches "water"
    │
    ├─► Taps product → Added to cart
    │
    ├─► Adjusts quantity to 2
    │
    ├─► Searches "bread"
    │
    ├─► Taps product → Added to cart
    │
    ├─► Reviews cart: total = 150 ETB
    │
    ├─► Selects "Cash" payment
    │
    ├─► Customer hands 200 ETB
    │
    ├─► Cashier enters 200 → System shows change: 50 ETB
    │
    ├─► Clicks "Complete Sale"
    │
    ├─► Sale recorded, stock decremented
    │
    └─► Cashier gives 50 ETB change to customer
```

### Credit Sale Flow
```
Regular customer: "Put it on my tab"
    │
    ├─► Cashier processes items as normal
    │
    ├─► At payment: Selects "Credit"
    │
    ├─► System prompts: Select Customer
    │
    ├─► Cashier searches customer name
    │
    ├─► Selects customer from results
    │
    ├─► System shows: current outstanding balance
    │
    ├─► Cashier confirms credit sale
    │
    ├─► POST /api/sales/checkout
    │   ├── paymentMethod: CREDIT
    │   └── customerId: customer-uuid
    │
    ├─► Sale recorded, stock decremented
    │
    ├─► Customer's credit balance increased
    │
    └─► Cashier hands items to customer
```

### Registering New Customer (During Sale)
```
New customer: "I don't have an account yet"
    │
    ├─► At credit payment step
    │
    ├─► Cashier clicks "New Customer"
    │
    ├─► Modal opens with form:
    │   ├── First name (required)
    │   ├── Phone number (required)
    │   └── Last name (optional)
    │
    ├─► Cashier fills form
    │
    ├─► Clicks "Create"
    │
    ├─► POST /api/customers
    │
    ├─► Customer created
    │
    └─► Cashier selects new customer → Credit sale proceeds
```

### Offline Sale Processing
```
Internet goes down
    │
    ├─► App detects offline status
    │
    ├─► Banner appears: "You are offline. Sales will sync when connected."
    │
    ├─► POS continues to work:
    │   ├── Products loaded from IndexedDB cache
    │   ├── Search uses local data
    │   └── Cart works normally
    │
    ├─► Sale completed → Saved to IndexedDB (not sent to server)
    │
    ├─► Multiple sales processed offline
    │
    ├─► Internet reconnects
    │
    ├─► Background sync begins:
    │   ├── Status indicator: "Syncing 5 offline sales..."
    │   ├── Each sale sent to POST /api/sales/sync
    │   ├── Server processes batch
    │   ├── Returns server IDs
    │   └── IndexedDB updated with server IDs
    │
    ├─► Sync complete
    │
    └─► Status: "All sales synced" + Green indicator
```

---

## 5. End-of-Day Reconciliation Flow

### Cashier End of Day
```
Cashier finishes shift
    │
    ├─► Navigates to "My Sales" page
    │
    ├─► Views today's sales list:
    │   ├── 15 transactions
    │   ├── Total: 4,500 ETB
    │   ├── Cash: 3,000 ETB
    │   ├── Mobile Money: 1,000 ETB
    │   └── Credit: 500 ETB
    │
    ├─► Counts physical cash in drawer
    │
    ├─► Verifies: Cash in drawer ≈ Cash sales total
    │
    └─► Hands over to Manager or next shift
```

### Manager End of Day
```
Manager reviews day
    │
    ├─► Dashboard shows today's summary
    │
    ├─► Reviews all cashier sales
    │
    ├─► Checks inventory levels
    │
    ├─► Reviews customer payments received
    │
    └─► Notes items to reorder tomorrow
```

### Owner Remote Monitoring
```
Owner checks phone (from anywhere)
    │
    ├─► Opens dashboard
    │
    ├─► Sees real-time data:
    │   ├── Today's total sales: 25,000 ETB
    │   ├── 45 transactions processed
    │   ├── 2,000 ETB in customer payments
    │   ├── 8 items below minimum stock
    │   └── 3 pending sync items
    │
    ├─► Taps on "Sales Report" for details
    │
    └─► Knows exactly how business performed today
```

---

## 6. Error & Edge Case Flows

### Insufficient Stock
```
Cashier tries to sell 10 units of product with 5 in stock
    │
    ├─► Clicks "Complete Sale"
    │
    ├─► Backend validates: quantity > available
    │
    ├─► Returns error: "Insufficient stock for 'Product X'. Available: 5"
    │
    ├─► POS shows error message
    │
    └─► Cashier adjusts quantity to 5 or selects different product
```

### Expired JWT
```
User's token expires after 24 hours
    │
    ├─► User makes any API call
    │
    ├─► Backend returns 401 Unauthorized
    │
    ├─► Frontend intercepts 401
    │
    ├─► Clears stored token
    │
    └─► Redirects to login page with message: "Session expired. Please log in again."
```

### Credit Limit Exceeded
```
Customer tries to put 50,000 ETB on credit (Phase 3 feature)
    │
    ├─► Manager selects credit payment
    │
    ├─► System checks: current balance + new amount > credit limit
    │
    ├─► Returns error: "Credit limit exceeded for this customer"
    │
    └─► Manager asks customer for partial payment first
```

### Sync Conflict
```
Two cashiers process same product offline simultaneously
    │
    ├─► Both sales saved to IndexedDB
    │
    ├─► Both sync when online
    │
    ├─► Server processes both (stock was sufficient for both)
    │
    ├─► Stock goes negative if total exceeds available
    │
    ├─► Server flags for review
    │
    └─► Manager sees "Stock discrepancy" alert
```
