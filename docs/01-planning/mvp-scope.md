# MVP Scope
## SmartBiz ERP Lite

**Goal:** Working PWA — products → sales → credit tracking → offline → deployed.

---

## Must Have (MVP)

| Feature | Why | Effort |
|:--------|:----|:-------|
| Auth (register + login + JWT) | Foundation for everything | 1 day |
| Staff management (CRUD) | Multi-user support | 0.5 day |
| Products + Categories | POS needs products | 1 day |
| Inventory (auto-create, adjust, low-stock) | Prevent overselling | 1 day |
| POS (search, cart, checkout) | Core revenue feature | 2 days |
| Customer credit tracking | #1 pain point | 1 day |
| Dashboard (summary + sales history) | Owner visibility | 1 day |
| Offline sync (IndexedDB + background sync) | Ethiopian internet reality | 1.5 days |
| PWA setup (service worker, manifest) | Installable on phone | 0.5 day |
| **Total** | | **~9 days** |

---

## Should Have (Phase 2 — if time)

| Feature | Effort |
|:--------|:-------|
| Receipt generation (PDF) | 1 day |
| Barcode scanning (camera) | 1 day |
| Customer transaction history | 0.5 day |
| Top-selling products report | 0.5 day |
| Adjustment audit log | 0.5 day |
| Sale void/return | 1 day |

---

## Won't Have (Future)

- Amharic / multi-language
- Dark mode
- Advanced analytics / BI
- Accounting integration
- Payment gateway
- Native mobile apps
- Supplier purchase orders
- Employee attendance

---

## Scope Rules

1. If it's not in "Must Have" → it's not in MVP
2. No external integrations (APIs, payments, SMS) → Phase 2+
3. No native mobile capabilities → Future
4. UI polish beyond basic → Phase 3
5. Cut scope if behind by Day 25
