# User Stories
## SmartBiz ERP Lite

---

## Story Overview

| # | Story | Role | Priority |
|:--|:------|:-----|:---------|
| 1 | Business Registration | Owner | P0 |
| 2 | Staff Management | Owner | P0 |
| 3 | View Dashboard | Owner | P0 |
| 4 | Product Catalog | Owner | P0 |
| 5 | Customer Credit Management | Owner | P0 |
| 6 | Sales Reports | Owner | P1 |
| 7 | Process Sale (POS) | Manager | P0 |
| 8 | Inventory Adjustment | Manager | P0 |
| 9 | Low Stock Monitoring | Manager | P0 |
| 10 | Customer Payment Processing | Manager | P0 |
| 11 | Quick Sale Processing | Cashier | P0 |
| 12 | Product Price Lookup | Cashier | P0 |
| 13 | Customer Registration | Cashier | P0 |
| 14 | View Daily Sales | Cashier | P1 |
| 15 | Offline Sale Processing | Cashier | P0 |
| 16 | Authentication & Session | Any | P0 |
| 17 | Responsive Mobile UI | Any | P0 |

---

## Owner Stories

### S1: Business Registration
**As a** business owner, **I want to** register my business and create my admin account, **so that** I can start managing operations.

- [ ] Enter business name, email, password, first/last name
- [ ] System creates Tenant + Owner user
- [ ] JWT returned → redirect to dashboard
- [ ] Password: min 8 chars, 1 number; Email unique
- [ ] Registration completes in < 30s

### S2: Staff Management
**As a** business owner, **I want to** create accounts for manager and cashiers, **so that** they can process sales and manage inventory.

- [ ] Create user with email, name, role (Manager/Cashier)
- [ ] View all staff with roles + active status
- [ ] Deactivate/reactivate staff (can't delete own account)
- [ ] Only Owner can access staff management

### S3: View Dashboard
**As a** business owner, **I want to** see today's sales, debts, and low-stock alerts on one screen, **so that** I can understand business health at a glance.

- [ ] Shows: total sales today, transaction count, avg sale value
- [ ] Shows: total outstanding customer credit
- [ ] Shows: count of low-stock items
- [ ] Updates in real-time (< 5s), loads in < 2s
- [ ] Accessible to Owner + Manager

### S4: Product Catalog
**As a** business owner, **I want to** add products with costs and selling prices, **so that** I maintain accurate catalog and track margins.

- [ ] Create product: name, category, SKU (opt), barcode (opt)
- [ ] Enter base cost + overhead → system auto-calculates landed cost
- [ ] Set selling price; flag if < landed cost
- [ ] Edit/delete products, organize by categories
- [ ] Search by name/SKU/barcode
- [ ] Auto-create inventory record (qty = 0)

### S5: Customer Credit Management
**As a** business owner, **I want to** track who owes me money and how much, **so that** I can follow up on debts.

- [ ] View all customers with outstanding balances
- [ ] See total outstanding credit
- [ ] Filter by name/phone, click into transaction history
- [ ] Log payments against debt → balance reduces
- [ ] See running balance after each payment

### S6: Sales Reports
**As a** business owner, **I want to** see sales reports by date range, **so that** I can understand revenue trends.

- [ ] Sales history with date range picker
- [ ] Total revenue, transactions, avg sale
- [ ] Breakdown by payment method (Cash/Mobile/Credit)
- [ ] Top-selling products, filter by cashier
- [ ] Loads in < 3s

---

## Manager Stories

### S7: Process Sale (POS)
**As a** manager, **I want to** process sales quickly via POS, **so that** I serve customers efficiently.

- [ ] Search products by name/barcode
- [ ] Cart with items, qty, unit price, line total
- [ ] Adjust qty, remove items
- [ ] Payment: Cash / Mobile Money / Credit
- [ ] Credit → must select/create customer
- [ ] Checkout → deduct inventory + create sale
- [ ] Completes in < 2min, resets for next customer

### S8: Inventory Adjustment
**As a** manager, **I want to** manually adjust stock for discrepancies (breakage, theft, returns), **so that** records stay accurate.

- [ ] Select product → see current stock
- [ ] Enter new qty or delta (+/-) + reason
- [ ] Logged with timestamp, user, old/new values
- [ ] Updates immediately, view history per product

### S9: Low Stock Monitoring
**As a** manager, **I want to** get alerts when stock falls below threshold, **so that** I can reorder before running out.

- [ ] System flags qty < minThreshold
- [ ] Low-stock page + highlighted on product list
- [ ] Set/adjust min threshold per product
- [ ] Low-stock count on dashboard

### S10: Customer Payment Processing
**As a** manager, **I want to** record customer credit payments, **so that** debt records stay accurate.

- [ ] Search customer by name/phone
- [ ] See outstanding balance
- [ ] Enter payment amount (validated ≤ balance)
- [ ] CreditBalance reduced, payment logged
- [ ] View payment history per customer

---

## Cashier Stories

### S11: Quick Sale Processing
**As a** cashier, **I want to** quickly find products and process sales, **so that** I serve customers without long waits.

- [ ] Type to search (< 1s results)
- [ ] Add to cart with one tap
- [ ] Barcode scanning (if scanner available)
- [ ] Running total in cart
- [ ] Complete cash sale in < 3 taps
- [ ] Screen resets automatically, can void before completion

### S12: Product Price Lookup
**As a** cashier, **I want to** quickly look up prices, **so that** I answer customer questions without guessing.

- [ ] Search by name → results show name, price, stock
- [ ] Responsive (results as you type)
- [ ] Works offline (cached data)

### S13: Customer Registration
**As a** cashier, **I want to** register a new customer during a credit sale, **so that** I process credit without interrupting flow.

- [ ] Create customer from POS screen
- [ ] Required: first name, phone | Optional: last name
- [ ] Immediately available for selection
- [ ] Takes < 30s

### S14: View Daily Sales
**As a** cashier, **I want to** see my own sales today, **so that** I reconcile my cash drawer.

- [ ] List of today's sales (time, total, method, items)
- [ ] Running total for the day
- [ ] Filter by payment method
- [ ] Cannot see other cashiers' sales

### S15: Offline Sale Processing
**As a** cashier, **I want to** process sales when internet is down, **so that** the shop never stops.

- [ ] POS works fully offline (cached products)
- [ ] Sales saved to IndexedDB
- [ ] Auto-sync when connection resumes
- [ ] Progress indicator + notification when back online
- [ ] No data loss on conflicts

---

## Cross-Role Stories

### S16: Authentication & Session
**As any** user, **I want to** log in securely and stay logged in, **so that** I access the system without re-entering credentials.

- [ ] Email + password → JWT stored in localStorage
- [ ] Token attached to all API requests
- [ ] Expires after 24h → redirect to login
- [ ] See name + role in header
- [ ] Logout clears token

### S17: Responsive Mobile UI
**As any** user, **I want to** use the app on my phone, **so that** I manage operations from anywhere.

- [ ] Usable on 360px screen
- [ ] Touch targets ≥ 44px
- [ ] Bottom nav / hamburger (thumb reach)
- [ ] Min 14px text, mobile keyboard-friendly forms
- [ ] PWA install prompt on supported devices
