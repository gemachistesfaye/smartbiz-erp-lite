# User Stories
## SmartBiz ERP Lite

---

## Business Owner (Alem)

### Story 1: Business Registration
**As a** business owner,
**I want to** register my business on the platform with my business name and create my admin account,
**So that** I can set up my digital shop and start managing operations.

**Acceptance Criteria:**
- [ ] Owner enters business name, email, password, first name, last name
- [ ] System creates a Tenant and links Owner user to it
- [ ] Owner receives a JWT token and is redirected to the dashboard
- [ ] Password must be at least 8 characters with one number
- [ ] Email must be unique across the system
- [ ] Registration completes in < 30 seconds

**Priority:** P0 (MVP)

---

### Story 2: Staff Management
**As a** business owner,
**I want to** create accounts for my manager and cashiers,
**So that** they can use the system to process sales and manage inventory.

**Acceptance Criteria:**
- [ ] Owner can create a new user with email, name, and role (Manager or Cashier)
- [ ] New user receives credentials (shared verbally or via message)
- [ ] Owner can view list of all staff with their roles and active status
- [ ] Owner can deactivate a staff member (they can no longer log in)
- [ ] Owner can reactivate a previously deactivated staff member
- [ ] Owner cannot delete their own account
- [ ] Only Owner role can access staff management

**Priority:** P0 (MVP)

---

### Story 3: View Business Dashboard
**As a** business owner,
**I want to** see a summary of today's sales, outstanding debts, and low-stock alerts on a single screen,
**So that** I can understand my business health at a glance without digging through reports.

**Acceptance Criteria:**
- [ ] Dashboard displays: total sales today, number of transactions, average sale value
- [ ] Dashboard displays: total outstanding customer credit
- [ ] Dashboard displays: count of low-stock items
- [ ] Dashboard updates in real-time (or within 5 seconds of new data)
- [ ] Dashboard loads in < 2 seconds
- [ ] Dashboard is accessible to Owner and Manager roles

**Priority:** P0 (MVP)

---

### Story 4: Product Catalog Management
**As a** business owner,
**I want to** add products with their costs and selling prices,
**So that** I can maintain an accurate catalog and track my profit margins.

**Acceptance Criteria:**
- [ ] Owner can create a product with: name, category, SKU (optional), barcode (optional)
- [ ] Owner enters base cost and overhead cost; system auto-calculates landed cost
- [ ] Owner sets selling price; system flags if selling price < landed cost
- [ ] Owner can edit any product details
- [ ] Owner can organize products into categories
- [ ] Owner can delete products (with confirmation dialog)
- [ ] Products are searchable by name, SKU, or barcode
- [ ] Each product automatically gets an inventory record with quantity = 0

**Priority:** P0 (MVP)

---

### Story 5: Customer Credit Management
**As a** business owner,
**I want to** track which customers owe me money and how much,
**So that** I can follow up on debts and reduce revenue loss.

**Acceptance Criteria:**
- [ ] Owner can view list of all customers with their outstanding balances
- [ ] Owner can see total outstanding credit across all customers
- [ ] Owner can filter customers by name or phone
- [ ] Owner can click into a customer to see their transaction history
- [ ] Owner can log a payment against a customer's debt
- [ ] Payment logging reduces the customer's credit balance
- [ ] Owner can see running balance after each payment

**Priority:** P0 (MVP)

---

### Story 6: Sales Reports
**As a** business owner,
**I want to** see sales reports filtered by date range,
**So that** I can understand my revenue trends and make informed decisions.

**Acceptance Criteria:**
- [ ] Owner can view sales history with date range picker
- [ ] Report shows: total revenue, total transactions, average sale value
- [ ] Report breaks down by payment method (Cash, Mobile Money, Credit)
- [ ] Owner can see top-selling products in the selected period
- [ ] Owner can filter by specific cashier
- [ ] Report loads in < 3 seconds

**Priority:** P1 (MVP)

---

## Manager (Dawit)

### Story 7: Process Sale (POS)
**As a** manager,
**I want to** process customer sales quickly using the POS interface,
**So that** I can serve customers efficiently and maintain accurate records.

**Acceptance Criteria:**
- [ ] Manager can search products by name or scan barcode
- [ ] Selected products appear in a cart with quantity, unit price, and line total
- [ ] Manager can adjust quantity or remove items from cart
- [ ] Cart shows subtotal, and final total
- [ ] Manager selects payment method: Cash, Mobile Money, or Credit
- [ ] If Credit is selected, Manager must select or create a customer
- [ ] Checkout deducts inventory quantities
- [ ] Checkout creates a Sale record linked to the cashier (Manager in this case)
- [ ] Sale completes in < 2 minutes from start
- [ ] Screen resets for next customer after sale completes

**Priority:** P0 (MVP)

---

### Story 8: Inventory Adjustment
**As a** manager,
**I want to** manually adjust stock levels when there are discrepancies (breakage, theft, returns),
**So that** my inventory records remain accurate.

**Acceptance Criteria:**
- [ ] Manager can select a product and see current stock level
- [ ] Manager enters new quantity or adjustment delta (+/-)
- [ ] Manager must provide a reason for the adjustment
- [ ] Adjustment is logged with timestamp, user, reason, old value, new value
- [ ] Inventory updates immediately
- [ ] Manager can view adjustment history per product

**Priority:** P0 (MVP)

---

### Story 9: Low Stock Monitoring
**As a** manager,
**I want to** receive alerts when product stock falls below a threshold,
**So that** I can reorder before running out of popular items.

**Acceptance Criteria:**
- [ ] System flags products where quantity < minThreshold
- [ ] Low-stock items appear on a dedicated "Low Stock" page
- [ ] Low-stock items are highlighted on the product list
- [ ] Manager can set/adjust the minimum threshold per product
- [ ] Low-stock count appears on the dashboard

**Priority:** P0 (MVP)

---

### Story 10: Customer Payment Processing
**As a** manager,
**I want to** record when customers make payments on their credit balance,
**So that** I can keep debt records accurate and know who has paid.

**Acceptance Criteria:**
- [ ] Manager can search customers by name or phone
- [ ] Manager sees customer's current outstanding balance
- [ ] Manager enters payment amount
- [ ] System validates payment does not exceed outstanding balance
- [ ] Customer's creditBalance is reduced by the payment amount
- [ ] Payment is recorded with timestamp and processed-by user
- [ ] Manager can view payment history for each customer

**Priority:** P0 (MVP)

---

## Cashier (Fatima)

### Story 11: Quick Sale Processing
**As a** cashier,
**I want to** quickly find products and process sales,
**So that** I can serve customers without long waits.

**Acceptance Criteria:**
- [ ] Cashier can type product name to search (results appear in < 1 second)
- [ ] Cashier can add product to cart with one tap/click
- [ ] Cashier can scan barcode to add product (if barcode scanner available)
- [ ] Cart shows running total
- [ ] Cashier can complete sale with cash payment in < 3 taps
- [ ] After sale, screen resets automatically
- [ ] Cashier can void a sale before completion

**Priority:** P0 (MVP)

---

### Story 12: Product Price Lookup
**As a** cashier,
**I want to** quickly look up a product's price,
**So that** I can answer customer questions without guessing.

**Acceptance Criteria:**
- [ ] Cashier can search by product name
- [ ] Search results show product name, price, and stock level
- [ ] Search is responsive (results appear as cashier types)
- [ ] Search works offline (cached product data)

**Priority:** P0 (MVP)

---

### Story 13: Customer Registration
**As a** cashier,
**I want to** register a new customer during a credit sale,
**So that** I can process credit transactions without interrupting the flow.

**Acceptance Criteria:**
- [ ] Cashier can create a new customer from the POS screen
- [ ] Required fields: first name, phone number
- [ ] Optional fields: last name
- [ ] New customer is immediately available for selection
- [ ] Customer registration takes < 30 seconds

**Priority:** P0 (MVP)

---

### Story 14: View Daily Sales
**As a** cashier,
**I want to** see my own sales for the current day,
**So that** I can reconcile my cash drawer at end of shift.

**Acceptance Criteria:**
- [ ] Cashier can view a list of their sales for today
- [ ] Shows: sale time, total amount, payment method, items count
- [ ] Shows: running total for the day
- [ ] Cashier can filter by payment method
- [ ] Cashier cannot see other cashiers' sales

**Priority:** P1 (MVP)

---

### Story 15: Offline Sale Processing
**As a** cashier,
**I want to** process sales even when the internet is down,
**So that** the shop never stops serving customers.

**Acceptance Criteria:**
- [ ] POS interface works fully offline
- [ ] Product search uses cached data
- [ ] Sales are saved to IndexedDB when offline
- [ ] When connection resumes, offline sales sync automatically
- [ ] Sync shows progress indicator
- [ ] Conflicts are resolved gracefully (no data loss)
- [ ] Cashier is notified when back online

**Priority:** P0 (MVP)

---

## Cross-Role Stories

### Story 16: Authentication & Session Management
**As any user,
**I want to** log in securely and stay logged in,
**So that** I can access the system without repeatedly entering credentials.

**Acceptance Criteria:**
- [ ] User logs in with email and password
- [ ] System returns JWT token stored in localStorage
- [ ] Token is attached to all API requests automatically
- [ ] Token expires after 24 hours; user must re-login
- [ ] Invalid/expired token redirects to login page
- [ ] User can see their name and role in the header
- [ ] User can log out (clears token)

**Priority:** P0 (MVP)

---

### Story 17: Responsive Mobile Interface
**As any user,
**I want to** use the application on my phone,
**So that** I can manage operations from anywhere.

**Acceptance Criteria:**
- [ ] All screens are usable on a 360px wide screen
- [ ] Touch targets are at least 44px x 44px
- [ ] Navigation works with thumb reach (bottom nav or hamburger)
- [ ] Text is readable without zooming (min 14px)
- [ ] Forms are easy to fill on mobile keyboards
- [ ] PWA install prompt appears on supported devices

**Priority:** P0 (MVP)
