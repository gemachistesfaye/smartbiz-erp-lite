# User Journeys
## SmartBiz ERP Lite

**Version:** 1.0
**Date:** August 2026

---

## 1. Business Owner Journey

### Journey 1: First-Time Setup
```
Owner downloads/opens PWA
    │
    ├─► Sees welcome screen
    │
    ├─► Taps "Register"
    │
    ├─► Fills: Business name, Email, Password, Name
    │
    ├─► Account created → Redirect to Dashboard
    │
    ├─► Dashboard shows empty state with onboarding cards
    │
    ├─► Taps "Add your first category"
    │
    ├─► Creates category "Grocery"
    │
    ├─► Taps "Add your first product"
    │
    ├─► Creates product with pricing
    │
    ├─► Taps "Add a cashier"
    │
    ├─► Creates cashier account
    │
    ├─► Shares credentials with cashier
    │
    └─► Setup complete → Dashboard shows data
```

### Journey 2: Daily Monitoring
```
Owner opens app (morning)
    │
    ├─► Logs in → Dashboard
    │
    ├─► Reviews summary cards:
    │   ├── Today's sales: 25,000 ETB ↑12%
    │   ├── Products: 120
    │   ├── Customers with credit: 8
    │   └── Low stock alerts: 5
    │
    ├─► Checks sales trend chart
    │
    ├─► Reviews top selling products
    │
    ├─► Taps "Low Stock" card
    │
    ├─► Sees 5 items below threshold
    │
    ├─► Notes items to reorder
    │
    ├─► Taps "Customer Credit" card
    │
    ├─► Reviews outstanding debts
    │
    ├─► Sees Sara Mohammed owes 7,500 ETB (11 days overdue)
    │
    ├─► Taps customer → Views details
    │
    ├─► Sends WhatsApp message to Sara (outside app)
    │
    └─► Returns to dashboard → Satisfied with visibility
```

### Journey 3: Product Management
```
Owner wants to add new product
    │
    ├─► Navigates to Products page
    │
    ├─► Taps "+ Add Product"
    │
    ├─► Fills form:
    │   ├── Name: "Organic Honey"
    │   ├── Category: "Beverage"
    │   ├── Base Cost: 150 ETB
    │   ├── Overhead: 20 ETB
    │   ├── Selling Price: 250 ETB
    │   └── Min Threshold: 5
    │
    ├─► System shows:
    │   ├── Landed Cost: 170 ETB (auto-calculated)
    │   └── Profit Margin: 47% (auto-calculated)
    │
    ├─► Taps "Save Product"
    │
    ├─► Success toast: "Product saved successfully"
    │
    ├─► Redirect to products list
    │
    └─► New product appears in table
```

### Journey 4: Credit Management
```
Customer comes to pay debt
    │
    ├─► Owner navigates to Customers
    │
    ├─► Searches "Abdi Ahmed"
    │
    ├─► Taps customer → Customer Details
    │
    ├─► Sees: Credit Balance 5,000 ETB
    │
    ├─► Taps "Record Payment"
    │
    ├─► Enters: 2,000 ETB
    │
    ├─► System validates: 2,000 ≤ 5,000 ✓
    │
    ├─► Taps "Confirm"
    │
    ├─► Success toast: "Payment recorded"
    │
    ├─► Balance updates: 3,000 ETB
    │
    ├─► Transaction history shows new entry
    │
    └─► Owner gives receipt to customer
```

---

## 2. Manager Journey

### Journey 1: Morning Opening
```
Manager logs in → Dashboard
    │
    ├─► Reviews dashboard
    │
    ├─► Checks low-stock alerts
    │
    ├─► Navigates to Inventory
    │
    ├─► Sees Bread at 5 units (below threshold)
    │
    ├─► Calls supplier to reorder
    │
    ├─► Adjusts stock after delivery:
    │   ├── Product: Bread
    │   ├── Adjustment: +50
    │   ├── Reason: "Restocked from Merkato supplier"
    │   └── Confirms
    │
    ├─► Stock updates: 55 units
    │
    └─► Ready for day's operations
```

### Journey 2: Processing Credit Sale
```
Regular customer wants to buy on credit
    │
    ├─► Manager opens POS
    │
    ├─► Searches products, adds to cart
    │
    ├─► Cart total: 500 ETB
    │
    ├─► Selects "Credit" payment method
    │
    ├─► System prompts: Select Customer
    │
    ├─► Searches "Tesfaye D."
    │
    ├─► System shows: Current balance 2,500 ETB
    │
    ├─► Manager confirms credit sale
    │
    ├─► Checkout processes:
    │   ├── Sale recorded
    │   ├── Inventory decremented
    │   └── Customer balance: 2,500 + 500 = 3,000 ETB
    │
    ├─► Success: "Sale Complete"
    │
    └─► Hands items to customer
```

### Journey 3: End-of-Day Reconciliation
```
Manager reviews day's performance
    │
    ├─► Dashboard shows today's summary
    │
    ├─► Navigates to Sales History
    │
    ├─► Filters: Today, All cashiers
    │
    ├─► Reviews:
    │   ├── Total sales: 25,000 ETB
    │   ├── Cash: 15,000 ETB
    │   ├── Mobile Money: 5,000 ETB
    │   └── Credit: 5,000 ETB
    │
    ├─► Exports CSV for records
    │
    └─► Closes shop
```

---

## 3. Cashier Journey

### Journey 1: Quick Cash Sale
```
Customer: "Give me 2 milk and 1 bread"
    │
    ├─► Cashier opens POS (default screen)
    │
    ├─► Searches "milk"
    │
    ├─► Taps product → Added to cart
    │
    ├─► Adjusts quantity to 2
    │
    ├─► Searches "bread"
    │
    ├─► Taps product → Added to cart
    │
    ├─► Reviews cart:
    │   ├── Milk 1L x2 = 90 ETB
    │   ├── Bread x1 = 25 ETB
    │   └── Total = 115 ETB
    │
    ├─► Selects "Cash"
    │
    ├─► Customer gives 150 ETB
    │
    ├─► Enters 150 → Change: 35 ETB
    │
    ├─► Taps "Complete Sale"
    │
    ├─► Green checkmark: "Sale Complete!"
    │
    ├─► Cart clears
    │
    └─► Ready for next customer
```

### Journey 2: Processing Offline Sale
```
Internet goes down during rush hour
    │
    ├─► App detects offline status
    │
    ├─► Banner: "You are offline. Sales will sync when connected."
    │
    ├─► POS continues working:
    │   ├── Products from IndexedDB cache
    │   ├── Search works locally
    │   └── Cart functions normally
    │
    ├─► Sale completed → Saved locally
    │
    ├─► Multiple sales processed offline
    │
    ├─► Internet reconnects
    │
    ├─► Status: "Syncing 3 offline sales..."
    │
    ├─► Each sale sent to server
    │
    ├─► Server assigns IDs
    │
    ├─► IndexedDB updated
    │
    └─► Status: "All sales synced ✓"
```

### Journey 3: Customer Credit Sale
```
Customer: "Put it on my tab"
    │
    ├─► Cashier processes items normally
    │
    ├─► At payment: Selects "Credit"
    │
    ├─► System: "Select a customer"
    │
    ├─► Cashier searches customer name
    │
    ├─► Selects customer
    │
    ├─► System shows: Current balance 1,000 ETB
    │
    ├─► Cashier confirms
    │
    ├─► Sale completes
    │
    ├─► Customer balance: 1,000 + sale amount
    │
    └─► Cashier hands items to customer
```

### Journey 4: Registering New Customer During Sale
```
New customer: "I don't have an account"
    │
    ├─► At credit payment step
    │
    ├─► Cashier taps "New Customer"
    │
    ├─► Modal opens:
    │   ├── First name: "Mohammed"
    │   ├── Phone: "+251911111111"
    │   └── Last name: (optional)
    │
    ├─► Taps "Create"
    │
    ├─► Customer created
    │
    ├─► New customer auto-selected
    │
    └─► Credit sale proceeds
```
