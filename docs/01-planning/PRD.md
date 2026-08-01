# Product Requirements Document (PRD)
## SmartBiz ERP Lite

**Version:** 1.0
**Date:** July 2026
**Author:** SmartBiz Engineering Team
**Status:** Planning Phase

---

## 1. Business Problem

Small and Medium Enterprises (SMEs) in Ethiopia and similar emerging markets face critical operational challenges:

- **Manual Record-Keeping:** Most shops use paper-based systems or basic spreadsheets, leading to lost data, pricing errors, and inventory discrepancies.
- **Customer Credit Management:** Informal credit (buy-now-pay-later) is pervasive but poorly tracked, resulting in significant revenue loss. Business owners cannot reliably track who owes money or how much.
- **Inaccurate Pricing:** Without systematic cost tracking (base cost + transport + taxes), businesses often sell at losses or miscalculate margins.
- **No Real-Time Visibility:** Owners have no dashboard to understand daily sales, stock levels, or cash flow without physically visiting the shop.
- **Limited Tech Literacy:** Target users are not software engineers; solutions requiring technical setup fail adoption.
- **Internet Unreliability:** Ethiopian internet infrastructure is inconsistent; cloud-only solutions fail during outages.

**Core Pain Point:** SME owners spend 3-5 hours daily on tasks that should take minutes (counting stock, calculating debts, reconciling cash), and still lose 10-20% of potential revenue to tracking errors.

---

## 2. Product Vision

**SmartBiz ERP Lite** is a Progressive Web Application (PWA) that digitizes the complete retail operations of Ethiopian SMEs — from inventory to point-of-sale to credit management — with an offline-first architecture that works without reliable internet, designed for non-technical users who need a tool as simple as a calculator but as powerful as an ERP.

**Vision Statement:** "Every Ethiopian shop owner should have the operational intelligence of a corporation, delivered through a tool as simple as WhatsApp."

---

## 3. Goals

### Business Goals
| Goal | Target | Timeline |
|:-----|:-------|:---------|
| Reduce inventory tracking errors | < 2% discrepancy | MVP launch |
| Enable 100% customer credit tracking | Zero untracked debts | MVP launch |
| Reduce daily reconciliation time | From 3 hours to 15 minutes | MVP launch |
| Achieve offline-first reliability | 99.5% uptime without internet | MVP launch |
| Support multi-tenant SaaS model | Ready for 100+ tenants | Phase 2 |

### Technical Goals
| Goal | Target | Timeline |
|:-----|:-------|:---------|
| First Contentful Paint | < 1.5 seconds | MVP launch |
| Time to Interactive | < 3 seconds | MVP launch |
| Bundle Size | < 200KB gzipped | MVP launch |
| Lighthouse PWA Score | > 90 | MVP launch |
| API Response Time (p95) | < 200ms | MVP launch |

### User Experience Goals
| Goal | Target | Timeline |
|:-----|:-------|:---------|
| Time to complete first sale | < 2 minutes | MVP launch |
| Onboarding time (new cashier) | < 10 minutes | MVP launch |
| User satisfaction (NPS) | > 50 | Post-MVP |

---

## 4. Target Users

### Primary Market
- **Geography:** Ethiopia (Addis Ababa, secondary cities)
- **Business Type:** Retail shops, mini-markets, pharmacies, hardware stores
- **Business Size:** 1-10 employees
- **Revenue:** 50,000 - 5,000,000 ETB monthly
- **Tech Profile:** Smartphone users (Android 70%, iOS 30%), limited computer literacy

### Secondary Market
- Small wholesale distributors
- Restaurant/food service businesses
- Service businesses with inventory (auto parts, electronics repair)

---

## 5. User Personas

### Persona 1: Alem (Business Owner)
| Attribute | Detail |
|:----------|:-------|
| **Age** | 35-55 |
| **Role** | Owner of a mini-market with 2-3 employees |
| **Tech Comfort** | Uses WhatsApp daily, struggles with complex apps |
| **Daily Needs** | Check daily sales, track customer debts, monitor stock levels |
| **Pain Points** | Can't be at shop all day; trusts staff but needs visibility; loses money on untracked credit |
| **Success Looks Like** | "I can check my phone and know exactly how much money came in today, who owes me, and what needs restocking." |
| **Device** | Android phone (mid-range), occasional laptop use |

### Persona 2: Dawit (Manager)
| Attribute | Detail |
|:----------|:-------|
| **Age** | 25-35 |
| **Role** | Store manager handling daily operations |
| **Tech Comfort** | Comfortable with mobile apps, can learn new tools quickly |
| **Daily Needs** | Manage cashiers, process sales, handle inventory orders, manage customer accounts |
| **Pain Points** | Needs to coordinate between owner directives and shop floor reality; handles most credit decisions |
| **Success Looks Like** | "I can manage the whole shop from my phone — assign tasks, check stock, and handle customer payments without confusion." |
| **Device** | Android phone (good condition), uses laptop occasionally |

### Persona 3: Fatima (Cashier)
| Attribute | Detail |
|:----------|:-------|
| **Age** | 18-28 |
| **Role** | Front-line cashier processing sales |
| **Tech Comfort** | Comfortable with mobile apps, familiar with POS if used before |
| **Daily Needs** | Process sales quickly, look up product prices, handle customer payments |
| **Pain Points** | Slow manual entry leads to long queues; makes pricing errors; can't remember all prices |
| **Success Looks Like** | "I scan or search a product, see the price immediately, take payment, and move to the next customer in under a minute." |
| **Device** | Android phone (budget to mid-range) |

---

## 6. Functional Requirements

### 6.1 Authentication & User Management
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-AUTH-01 | Owner registers business (tenant) and creates admin account | P0 |
| FR-AUTH-02 | Owner logs in via email/password and receives JWT | P0 |
| FR-AUTH-03 | Owner creates Manager and Cashier accounts | P0 |
| FR-AUTH-04 | Owner can deactivate/reactivate staff accounts | P1 |
| FR-AUTH-05 | Passwords are bcrypt-hashed, never stored in plain text | P0 |
| FR-AUTH-06 | JWT tokens expire after 24 hours; refresh mechanism | P0 |

### 6.2 Product & Catalog Management
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-PROD-01 | Owner/Manager creates product with name, category, SKU, barcode | P0 |
| FR-PROD-02 | Owner/Manager sets base cost, overhead cost, selling price | P0 |
| FR-PROD-03 | Landed cost auto-calculated (baseCost + overheadCost) | P0 |
| FR-PROD-04 | Products organized by categories | P0 |
| FR-PROD-05 | Product search by name, SKU, or barcode | P0 |
| FR-PROD-06 | Owner can delete products | P1 |
| FR-PROD-07 | Product image upload (optional) | P2 |

### 6.3 Inventory Management
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-INV-01 | Inventory record auto-created when product is created | P0 |
| FR-INV-02 | Stock quantity decremented automatically on sale | P0 |
| FR-INV-03 | Low-stock alerts when quantity < minThreshold | P0 |
| FR-INV-04 | Owner/Manager can manually adjust stock levels | P0 |
| FR-INV-05 | Inventory adjustment audit log | P1 |

### 6.4 Point of Sale (POS)
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-POS-01 | Cashier searches/selects products to add to cart | P0 |
| FR-POS-02 | Cart displays items, quantities, unit prices, totals | P0 |
| FR-POS-03 | Supports CASH, MOBILE_MONEY, and CREDIT payment methods | P0 |
| FR-POS-04 | Checkout deducts inventory and records sale | P0 |
| FR-POS-05 | Receipt generation (digital/PDF) | P1 |
| FR-POS-06 | Barcode scanning via camera | P1 |

### 6.5 Customer & Credit Management
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-CUST-01 | Owner/Manager/Cashier registers customer (name, phone) | P0 |
| FR-CUST-02 | Customer linked to credit sales; creditBalance tracked | P0 |
| FR-CUST-03 | Owner/Manager logs payments against customer debt | P0 |
| FR-CUST-04 | Customer list with credit balances visible | P0 |
| FR-CUST-05 | Credit limit configuration per customer | P2 |

### 6.6 Reporting & Dashboard
| ID | Requirement | Priority |
|:---|:------------|:---------|
| FR-RPT-01 | Daily sales summary (total revenue, items sold) | P0 |
| FR-RPT-02 | Sales history with date range filtering | P0 |
| FR-RPT-03 | Top-selling products report | P1 |
| FR-RPT-04 | Customer debt summary report | P1 |
| FR-RPT-05 | Profit margin analysis (revenue vs. landed cost) | P2 |
| FR-RPT-06 | Export reports to CSV/PDF | P2 |

---

## 7. Non-Functional Requirements

### 7.1 Performance
| ID | Requirement | Target |
|:---|:------------|:-------|
| NFR-PERF-01 | First Contentful Paint | < 1.5s |
| NFR-PERF-02 | Time to Interactive | < 3s |
| NFR-PERF-03 | API response time (p95) | < 200ms |
| NFR-PERF-04 | Bundle size (gzipped) | < 200KB |
| NFR-PERF-05 | Database query time (p95) | < 50ms |

### 7.2 Reliability
| ID | Requirement | Target |
|:---|:------------|:-------|
| NFR-REL-01 | Uptime (online mode) | 99.5% |
| NFR-REL-02 | Offline functionality | Core POS operations available |
| NFR-REL-03 | Data sync after offline period | < 30 seconds |
| NFR-REL-04 | Data integrity after sync conflicts | Last-write-wins with audit trail |
| NFR-REL-05 | Automatic database backups | Daily |

### 7.3 Security
| ID | Requirement | Target |
|:---|:------------|:-------|
| NFR-SEC-01 | Password hashing | bcrypt (12 rounds) |
| NFR-SEC-02 | JWT authentication | Stateless, 24h expiry |
| NFR-SEC-03 | Tenant data isolation | 100% enforced at ORM layer |
| NFR-SEC-04 | Input validation | All API endpoints validated |
| NFR-SEC-05 | CORS restriction | Frontend origin only |
| NFR-SEC-06 | Rate limiting | 100 requests/minute per user |

### 7.4 Usability
| ID | Requirement | Target |
|:---|:------------|:-------|
| NFR-USE-01 | Mobile-first responsive design | Works on 320px+ screens |
| NFR-USE-02 | Touch-friendly UI | Min 44px touch targets |
| NFR-USE-03 | Accessibility (WCAG) | Level AA compliance |
| NFR-USE-04 | Language support | English (Amharic Phase 2) |
| NFR-USE-05 | PWA installation prompt | Auto-detect and suggest install |

### 7.5 Scalability
| ID | Requirement | Target |
|:---|:------------|:-------|
| NFR-SCALE-01 | Concurrent users per tenant | 10 |
| NFR-SCALE-02 | Total tenants supported | 1,000+ |
| NFR-SCALE-03 | Product catalog size per tenant | 10,000 |
| NFR-SCALE-04 | Sales history retention | 5 years |

---

## 8. Success Metrics

### MVP Success Metrics (2-week mark)
| Metric | Target | Measurement |
|:-------|:-------|:------------|
| Core flow completion rate | > 90% | User testing sessions |
| Average sale processing time | < 2 minutes | Analytics |
| Offline-to-online sync success | > 99% | Sync logs |
| Zero data loss incidents | 0 | Monitoring |
| User onboarding completion | > 80% | Registration funnel |

### Post-MVP Success Metrics (3-month mark)
| Metric | Target | Measurement |
|:-------|:-------|:------------|
| Monthly Active Users | 50+ | Analytics |
| Customer retention (30-day) | > 70% | Cohort analysis |
| NPS score | > 50 | User surveys |
| Credit tracking accuracy | > 99% | Reconciliation audits |
| Average daily transactions per user | > 10 | Analytics |

---

## 9. Constraints & Assumptions

### Constraints
- **Timeline:** 2-week internship period for MVP
- **Team Size:** 1-2 developers
- **Budget:** Minimal (leverage free tiers of Vercel, Railway, Supabase)
- **Infrastructure:** Must work in low-bandwidth Ethiopian internet conditions
- **Devices:** Android-first; must work on budget phones (2GB RAM)

### Assumptions
- Target users have smartphones with data plans (even if limited)
- Internet connectivity is intermittent but available multiple times daily
- Users can follow simple onboarding flows (similar to WhatsApp onboarding)
- PostgreSQL is acceptable for multi-tenant data storage
- Vercel/Railway free tiers support initial user base

---

## 10. Out of Scope (MVP)

- Multi-language support (Amharic)
- Accounting/bookkeeping integration
- Barcode printing
- Multi-location/inventory transfer
- Employee attendance tracking
- Supplier purchase order management
- Advanced analytics and BI
- Mobile native apps (iOS/Android)
- Payment gateway integration (actual mobile money processing)
