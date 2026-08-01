# MVP Scope Definition
## SmartBiz ERP Lite

**Timeline:** 2-week internship (10 working days)
**Team:** 1-2 developers
**Goal:** A working PWA that handles the core retail loop: products → sales → credit tracking

---

## Feature Prioritization Framework

Features are categorized using the **MoSCoW** method:

| Category | Definition | Timeline |
|:---------|:-----------|:---------|
| **Must Have** | System is non-functional without it; core value proposition | MVP (2 weeks) |
| **Should Have** | Important but can workarounds exist; adds significant value | Phase 2 (weeks 3-6) |
| **Could Have** | Nice-to-have; enhances experience but not critical | Phase 3 (weeks 7-12) |
| **Won't Have** | Explicitly excluded from this project scope | Future SaaS Vision |

---

## MVP Features (Must Have) — 2-Week Sprint

### 1. Authentication & Tenant Setup
**Why MVP:** Without this, there's no way to create accounts or isolate data between businesses. This is the foundation of multi-tenancy.

| Feature | Details |
|:--------|:--------|
| Owner registration | Creates tenant + admin account |
| User login/logout | JWT-based authentication |
| Create Manager/Cashier accounts | Owner-only functionality |
| Role-based route protection | Frontend guards |

**Effort Estimate:** 1 day

---

### 2. Product & Category Management
**Why MVP:** The POS needs products to sell. Without a product catalog, the core sales flow doesn't work.

| Feature | Details |
|:--------|:--------|
| CRUD for categories | Owner/Manager only |
| CRUD for products | Name, SKU, barcode, costs, price |
| Auto-calculate landed cost | baseCost + overheadCost |
| Product search | By name, SKU, barcode |
| Product list with filtering | By category, search term |

**Effort Estimate:** 1.5 days

---

### 3. Inventory Management
**Why MVP:** Sales must decrement stock. Without inventory tracking, the system can't prevent overselling.

| Feature | Details |
|:--------|:--------|
| Auto-create inventory on product creation | quantity = 0 |
| Decrement on sale | Atomic operation |
| Low-stock alerts | Below minThreshold |
| Manual adjustment | Owner/Manager with reason logging |

**Effort Estimate:** 1 day

---

### 4. Point of Sale (POS)
**Why MVP:** This is the core revenue-generating feature. Without it, the app has no daily utility.

| Feature | Details |
|:--------|:--------|
| Product search in POS | Fast, responsive |
| Cart management | Add, remove, adjust quantity |
| Multiple payment methods | Cash, Mobile Money, Credit |
| Checkout flow | Deduct stock, record sale |
| Sale linked to cashier | Automatic from session |

**Effort Estimate:** 2 days

---

### 5. Customer & Credit Management
**Why MVP:** Credit tracking is the #1 pain point. Without it, the app doesn't solve the core business problem.

| Feature | Details |
|:--------|:--------|
| Register customers | Name, phone, optional last name |
| Credit sales | Link sale to customer, update balance |
| Log payments | Reduce customer debt |
| Customer list with balances | Searchable, sortable |

**Effort Estimate:** 1 day

---

### 6. Dashboard & Basic Reports
**Why MVP:** Owners need visibility. Without a dashboard, the app is just a POS — the value proposition is "ERP intelligence."

| Feature | Details |
|:--------|:--------|
| Today's sales summary | Revenue, transactions, average |
| Outstanding credit total | Across all customers |
| Low-stock item count | Alert count |
| Sales history | Date range filtering |
| Sales by payment method | Breakdown |

**Effort Estimate:** 1 day

---

### 7. Offline-First PWA
**Why MVP:** Ethiopian internet is unreliable. Without offline support, the app fails in real-world conditions.

| Feature | Details |
|:--------|:--------|
| Service worker caching | Static assets + API responses |
| IndexedDB for offline data | Products, customers, pending sales |
| Background sync | Queue offline sales |
| Online/offline indicator | Visual status |

**Effort Estimate:** 1.5 days

---

### MVP Total Estimate: ~9 days + 1 day buffer = 10 days

---

## Phase 2 Features (Should Have) — Weeks 3-6

### Why Phase 2?
These features add significant value but the MVP is functional without them. They can be developed iteratively after validating the core loop.

| Feature | Why Not MVP | Effort |
|:--------|:------------|:-------|
| **Receipt generation (PDF)** | Nice but not critical; manual receipts work | 1 day |
| **Barcode scanning via camera** | Most shops don't have scanners yet; search works | 1 day |
| **Customer transaction history** | Useful but owner can check sale records directly | 1 day |
| **Top-selling products report** | Insightful but not essential for daily operations | 1 day |
| **Adjustment audit log** | Important for accountability but not for functionality | 1 day |
| **User profile management** | Can update details in database directly for now | 0.5 day |
| **Password change functionality** | Security concern but not blocking | 0.5 day |
| **Sale void/return processing** | Important but manual workarounds exist | 1 day |

**Phase 2 Total: ~7 days**

---

## Phase 3 Features (Could Have) — Weeks 7-12

### Why Phase 3?
These are enhancement features that improve UX and add power-user capabilities. They're important for scaling but not for initial validation.

| Feature | Why Not Earlier | Effort |
|:--------|:----------------|:-------|
| **Profit margin reports** | Requires accumulated sales data to be meaningful | 2 days |
| **Export to CSV/PDF** | Useful but users can screenshot for now | 1 day |
| **Credit limit per customer** | Requires understanding credit patterns first | 1 day |
| **Multi-language (Amharic)** | English works for tech-literate early adopters | 3 days |
| **Product images** | Adds complexity; text catalog works initially | 1 day |
| **Push notifications** | Requires user base to be valuable | 1 day |
| **Advanced search/filtering** | Basic search works for small catalogs | 1 day |

**Phase 3 Total: ~10 days**

---

## Future SaaS Vision (Won't Have — Current Scope)

### Why Future Vision?
These features represent the full SaaS product vision but are out of scope for the internship and initial launch.

| Feature | Why Future | Dependencies |
|:--------|:-----------|:-------------|
| **Multi-location/inventory transfer** | Most SMEs have single location | Multi-store architecture |
| **Supplier management & PO** | Requires supplier network integration | External API integrations |
| **Accounting integration** | Complex regulatory requirements | Ethiopian accounting standards |
| **Mobile native apps (iOS/Android)** | PWA covers 90% of use cases | React Native or Flutter |
| **Payment gateway integration** | Requires business licenses and bank partnerships | Ethiopian banking APIs |
| **Employee attendance tracking** | Different module entirely | HR domain expertise |
| **Advanced analytics & BI** | Requires large dataset | Data warehouse architecture |
| **White-label SaaS** | Requires mature platform | Multi-tenant architecture at scale |
| **API marketplace** | Requires developer ecosystem | Platform business model |

---

## Scope Boundary Rules

To protect the 2-week timeline, the following rules apply:

1. **If it's not listed in MVP, it's not in MVP.** No "just one more feature" additions.
2. **If a feature requires external integration (APIs, payments, SMS), it's Phase 2+.**
3. **If a feature requires native mobile capabilities, it's Future.**
4. **If a feature requires regulatory compliance research, it's Future.**
5. **UI polish beyond basic functionality is Phase 3.** (Animations, dark mode, themes)
6. **Admin features beyond Owner management are Phase 2.** (Audit logs, system settings)
