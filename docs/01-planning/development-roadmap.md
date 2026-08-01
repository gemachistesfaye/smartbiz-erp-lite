# Development Roadmap
## SmartBiz ERP Lite

**Total:** 30 days | **Used:** 6 days | **Remaining:** 24 days

---

## Progress

```
Planning & Docs   ████████████████████  6/6 days ✓ DONE
Implementation    ░░░░░░░░░░░░░░░░░░░░  0/24 days
```

---

## Phase 1: Foundation (3 days)

**Goal:** Project running locally, database ready, auth working.

- [ ] Monorepo setup (NestJS + React + Docker Compose + PostgreSQL)
- [ ] Prisma schema deployed, seeded with test data
- [ ] Auth module: register (tenant + owner), login, JWT
- [ ] Users module: CRUD for staff

**Exit criteria:** Can register a business, login, create a cashier account.

---

## Phase 2: Core Backend (4 days)

**Goal:** All API endpoints working.

- [ ] Products + Categories: CRUD, search, landed cost calc
- [ ] Inventory: auto-create, adjust, low-stock query
- [ ] Customers: CRUD, credit balance
- [ ] Sales: checkout (stock deduction + credit update)
- [ ] Reports: dashboard summary, sales history

**Exit criteria:** Can create product → sell it → stock decrements → see on dashboard.

---

## Phase 3: Frontend (5 days)

**Goal:** Full UI working end-to-end.

- [ ] Auth pages (login, register)
- [ ] Product management (list, form, categories)
- [ ] POS screen (search, cart, checkout)
- [ ] Customer management (list, payment)
- [ ] Dashboard (summary cards, sales history)

**Exit criteria:** Can process a sale from the UI, see results on dashboard.

---

## Phase 4: Offline + PWA (3 days)

**Goal:** Works without internet.

- [ ] Service worker (static asset caching)
- [ ] IndexedDB (products, customers, pending sales)
- [ ] Background sync (offline sales → server)
- [ ] Online/offline indicator

**Exit criteria:** Turn off WiFi → process sales → reconnect → syncs.

---

## Phase 5: Deploy + Polish (4 days)

**Goal:** Live on the internet.

- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Environment variables, CORS, HTTPS
- [ ] End-to-end testing
- [ ] Bug fixes

**Exit criteria:** App accessible via public URL on mobile.

---

## Phase 6: Buffer (5 days)

Reserved for:
- Bug fixes from testing
- Phase 2 features (receipts, barcode, advanced reports)
- Performance optimization
- Documentation updates

---

## Milestones

| Milestone | After | Days Used | Status |
|:----------|:------|:----------|:-------|
| Planning & Design | 6 | 6 | ✓ Done |
| Foundation | 3 | 9 | Pending |
| Core Backend | 4 | 13 | Pending |
| Frontend | 5 | 18 | Pending |
| Offline + PWA | 3 | 21 | Pending |
| Deploy | 4 | 25 | Pending |
| Buffer | 5 | 30 | Pending |

---

## Scope Rules

1. **MVP first** — POS + sales + credit + offline. Everything else is Phase 2+.
2. **No new features during implementation** — only bug fixes.
3. **If it's not working by Day 25, cut scope** — deploy what works.
4. **No Amharic, no dark mode, no advanced analytics** — defer all.
