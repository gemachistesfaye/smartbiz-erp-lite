# Product Requirements Document (PRD)
## SmartBiz ERP Lite

**Version:** 1.0 | **Date:** July 2026 | **Status:** Planning Phase

---

## 1. Business Problem

SMEs in Ethiopia face critical operational challenges:

| Problem | Impact |
|:--------|:-------|
| **Manual Record-Keeping** | Paper/spreadsheet systems → lost data, pricing errors, inventory discrepancies |
| **Customer Credit Tracking** | Informal buy-now-pay-later poorly tracked → significant revenue loss |
| **Inaccurate Pricing** | No systematic cost tracking → selling at losses, miscalculated margins |
| **No Real-Time Visibility** | Owners can't see daily sales/stock without visiting the shop |
| **Limited Tech Literacy** | Target users aren't engineers; complex tools fail adoption |
| **Internet Unreliability** | Cloud-only solutions fail during Ethiopian internet outages |

**Core Pain:** SME owners spend 3-5 hours daily on tasks that should take minutes, and lose 10-20% revenue to tracking errors.

---

## 2. Product Vision

**SmartBiz ERP Lite** is an offline-first PWA that digitizes retail operations — inventory to POS to credit management — for non-technical users who need a tool as simple as WhatsApp.

> "Every Ethiopian shop owner should have the operational intelligence of a corporation, delivered through a tool as simple as WhatsApp."

---

## 3. Goals

| Category | Goal | Target | Timeline |
|:---------|:-----|:-------|:---------|
| **Business** | Reduce inventory tracking errors | < 2% discrepancy | MVP |
| | Enable 100% customer credit tracking | Zero untracked debts | MVP |
| | Reduce daily reconciliation time | 3h → 15min | MVP |
| | Offline-first reliability | 99.5% uptime without internet | MVP |
| | Multi-tenant SaaS model | Ready for 100+ tenants | Phase 2 |
| **Technical** | First Contentful Paint | < 1.5s | MVP |
| | Time to Interactive | < 3s | MVP |
| | Bundle Size (gzipped) | < 200KB | MVP |
| | Lighthouse PWA Score | > 90 | MVP |
| | API Response (p95) | < 200ms | MVP |
| **UX** | Time to first sale | < 2min | MVP |
| | Cashier onboarding | < 10min | MVP |
| | NPS | > 50 | Post-MVP |

---

## 4. Target Users

| | Primary | Secondary |
|:--|:--------|:----------|
| **Geography** | Ethiopia (Addis Ababa, secondary cities) | Same |
| **Business Type** | Retail shops, mini-markets, pharmacies, hardware | Wholesale, restaurants, auto parts |
| **Size** | 1-10 employees | Same |
| **Revenue** | 50K-5M ETB/month | Same |
| **Devices** | Android 70%, iOS 30%, budget phones (2GB RAM) | Same |
| **Tech Level** | WhatsApp-level, limited computer literacy | Same |

---

## 5. User Personas

| | Alem (Owner) | Dawit (Manager) | Fatima (Cashier) |
|:--|:-------------|:----------------|:-----------------|
| **Age** | 35-55 | 25-35 | 18-28 |
| **Role** | Mini-market owner, 2-3 employees | Store manager, daily ops | Front-line sales |
| **Tech** | WhatsApp only, struggles with complex apps | Comfortable with mobile apps | Familiar with POS |
| **Daily Needs** | Check sales, track debts, monitor stock | Manage cashiers, process sales, inventory | Process sales fast, look up prices |
| **Pain Point** | Can't be at shop all day; loses money on untracked credit | Coordinates owner directives with shop floor | Slow manual entry → queues, pricing errors |
| **Success** | "Check phone → know sales, debts, restocking" | "Manage whole shop from phone" | "Search, price, payment, next customer in <1min" |
| **Device** | Android (mid-range), occasional laptop | Android (good), occasional laptop | Android (budget-mid) |

---

## 6. Functional Requirements

### Auth & User Management
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-AUTH-01 | Owner registers business (tenant) + admin account | P0 |
| FR-AUTH-02 | Email/password login → JWT token | P0 |
| FR-AUTH-03 | Owner creates Manager/Cashier accounts | P0 |
| FR-AUTH-04 | Deactivate/reactivate staff accounts | P1 |
| FR-AUTH-05 | bcrypt password hashing | P0 |
| FR-AUTH-06 | JWT 24h expiry + refresh mechanism | P0 |

### Products & Catalog
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-PROD-01 | Create product (name, category, SKU, barcode) | P0 |
| FR-PROD-02 | Set base cost, overhead, selling price | P0 |
| FR-PROD-03 | Landed cost = baseCost + overheadCost (auto) | P0 |
| FR-PROD-04 | Category management | P0 |
| FR-PROD-05 | Search by name/SKU/barcode | P0 |
| FR-PROD-06 | Delete products (Owner only) | P1 |
| FR-PROD-07 | Product image upload | P2 |

### Inventory
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-INV-01 | Auto-create inventory on product creation | P0 |
| FR-INV-02 | Auto-decrement on sale | P0 |
| FR-POS-03 | Low-stock alerts (qty < threshold) | P0 |
| FR-INV-04 | Manual stock adjustment | P0 |
| FR-INV-05 | Adjustment audit log | P1 |

### Point of Sale
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-POS-01 | Search/select products → cart | P0 |
| FR-POS-02 | Cart with items, qty, prices, totals | P0 |
| FR-POS-03 | Cash, Mobile Money, Credit payments | P0 |
| FR-POS-04 | Checkout → deduct inventory + record sale | P0 |
| FR-POS-05 | Receipt generation (digital/PDF) | P1 |
| FR-POS-06 | Barcode scanning via camera | P1 |

### Customers & Credit
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-CUST-01 | Register customer (name, phone) | P0 |
| FR-CUST-02 | Track credit balance per customer | P0 |
| FR-CUST-03 | Log payments against debt | P0 |
| FR-CUST-04 | Customer list with credit balances | P0 |
| FR-CUST-05 | Credit limit per customer | P2 |

### Reporting
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-RPT-01 | Daily sales summary | P0 |
| FR-RPT-02 | Sales history + date range filter | P0 |
| FR-RPT-03 | Top-selling products | P1 |
| FR-RPT-04 | Customer debt summary | P1 |
| FR-RPT-05 | Profit margin analysis | P2 |
| FR-RPT-06 | Export CSV/PDF | P2 |

---

## 7. Non-Functional Requirements

| Category | ID | Requirement | Target |
|:---------|:---|:------------|:-------|
| **Performance** | NFR-PERF-01 | First Contentful Paint | < 1.5s |
| | NFR-PERF-02 | Time to Interactive | < 3s |
| | NFR-PERF-03 | API response (p95) | < 200ms |
| | NFR-PERF-04 | Bundle size (gzipped) | < 200KB |
| | NFR-PERF-05 | DB query time (p95) | < 50ms |
| **Reliability** | NFR-REL-01 | Uptime (online) | 99.5% |
| | NFR-REL-02 | Offline functionality | Core POS available |
| | NFR-REL-03 | Sync after offline | < 30s |
| | NFR-REL-04 | Sync conflict resolution | Last-write-wins + audit |
| | NFR-REL-05 | DB backups | Daily |
| **Security** | NFR-SEC-01 | Password hashing | bcrypt (12 rounds) |
| | NFR-SEC-02 | JWT auth | Stateless, 24h expiry |
| | NFR-SEC-03 | Tenant isolation | 100% at ORM layer |
| | NFR-SEC-04 | Input validation | All endpoints |
| | NFR-SEC-05 | CORS | Frontend origin only |
| | NFR-SEC-06 | Rate limiting | 100 req/min/user |
| **Usability** | NFR-USE-01 | Mobile-first | 320px+ screens |
| | NFR-USE-02 | Touch targets | Min 44px |
| | NFR-USE-03 | Accessibility | WCAG AA |
| | NFR-USE-04 | Language | English (Amharic Phase 2) |
| | NFR-USE-05 | PWA install prompt | Auto-detect |
| **Scale** | NFR-SCALE-01 | Concurrent users/tenant | 10 |
| | NFR-SCALE-02 | Total tenants | 1,000+ |
| | NFR-SCALE-03 | Products/tenant | 10,000 |
| | NFR-SCALE-04 | Sales retention | 5 years |

---

## 8. Success Metrics

| Phase | Metric | Target |
|:------|:-------|:-------|
| **MVP (2wk)** | Core flow completion | > 90% |
| | Avg sale processing time | < 2min |
| | Offline→online sync success | > 99% |
| | Zero data loss incidents | 0 |
| | Onboarding completion | > 80% |
| **Post-MVP (3mo)** | Monthly Active Users | 50+ |
| | 30-day retention | > 70% |
| | NPS | > 50 |
| | Credit tracking accuracy | > 99% |
| | Avg daily transactions/user | > 10 |

---

## 9. Constraints & Assumptions

| Constraints | Assumptions |
|:------------|:------------|
| 2-week internship for MVP | Users have smartphones with data |
| 1-2 developers | Internet intermittent but available daily |
| Minimal budget (free tiers) | Users can follow WhatsApp-like onboarding |
| Low-bandwidth Ethiopian internet | PostgreSQL acceptable for multi-tenant |
| Android-first, 2GB RAM budget phones | Vercel/Railway free tiers support initial base |

---

## 10. Out of Scope (MVP)

- Multi-language (Amharic)
- Accounting/bookkeeping
- Barcode printing
- Multi-location/inventory transfer
- Employee attendance
- Supplier purchase orders
- Advanced analytics/BI
- Native mobile apps
- Payment gateway integration
