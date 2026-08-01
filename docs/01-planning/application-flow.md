# Application Flow
## SmartBiz ERP Lite

---

## 1. Entry Points

```mermaid
graph LR
    A[PWA Install] --> B[Login Screen]
    B --> C{Role?}
    C -->|Owner/Manager| D[Dashboard]
    C -->|Cashier| E[POS Screen]
    B --> F[Register - New Owner]
    F --> D
```

---

## 2. Owner Onboarding

```mermaid
graph TD
    A[Register] --> B[Create Tenant + Owner]
    B --> C[Dashboard - Empty State]
    C --> D[Add Category]
    C --> E[Add Product]
    C --> F[Add Cashier]
    D --> G[Setup Complete]
    E --> G
    F --> G
```

**Steps:**
1. **Register** → POST `/api/auth/register` → creates Tenant + Owner → JWT returned
2. **Dashboard** → empty state with onboarding cards
3. **Add Category** → POST `/api/categories`
4. **Add Product** → POST `/api/products` (inventory auto-created at 0)
5. **Add Staff** → POST `/api/users` → share credentials verbally

---

## 3. POS Sale Flow

```mermaid
graph TD
    A[Search Product] --> B[Add to Cart]
    B --> C[Adjust Qty]
    C --> D[Add More?]
    D -->|Yes| A
    D -->|No| E[Select Payment]
    E --> F{Method?}
    F -->|Cash| G[Enter Tendered → Calculate Change]
    F -->|Mobile Money| H[Enter Reference]
    F -->|Credit| I[Select Customer]
    I --> J[Complete Sale]
    G --> J
    H --> J
    J --> K[POST /api/sales/checkout]
    K --> L[Validate Stock]
    L -->|OK| M[Create Sale + Items]
    L -->|Fail| N[Error: Insufficient Stock]
    M --> O[Decrement Inventory]
    O -->|Credit| P[Update Customer Balance]
    O --> Q[Sale Complete ✓]
    P --> Q
```

**Checkout steps (backend):**
1. Validate products exist + belong to tenant
2. Validate sufficient stock for each item
3. If credit: validate customer + credit limit
4. BEGIN TRANSACTION → Create Sale → Create SaleItems → Decrement inventory
5. If credit: update customer `creditBalance`
6. COMMIT TRANSACTION

---

## 4. Offline Sale Flow

```mermaid
sequenceDiagram
    participant C as Cashier
    participant App as PWA (IndexedDB)
    participant Server as Backend API

    Note over C,App: Internet goes down
    C->>App: Process sale normally
    App->>App: Save to IndexedDB (pending queue)
    Note over App: "Saved offline" indicator

    Note over App,Server: Internet reconnects
    App->>Server: POST /api/sales/sync (batch)
    Server->>Server: Validate + Process each sale
    Server-->>App: Return server IDs
    App->>App: Update IndexedDB with server IDs
```

---

## 5. Customer Credit Payment

```mermaid
sequenceDiagram
    participant M as Manager
    participant API as Backend
    participant DB as Database

    M->>API: POST /api/customers/:id/payment {amount}
    API->>DB: Validate amount ≤ outstanding balance
    API->>DB: UPDATE creditBalance
    API->>DB: INSERT Payment record
    API-->>M: Success ✓
```

---

## 6. Inventory Adjustment

```mermaid
sequenceDiagram
    participant M as Manager
    participant API as Backend
    participant DB as Database

    M->>API: POST /api/inventory/adjust {productId, delta, reason}
    API->>DB: Get current quantity
    API->>DB: UPDATE quantity (quantity + delta)
    API->>DB: INSERT InventoryTransaction (audit log)
    API-->>M: Stock updated ✓
```

---

## 7. Error Flows

| Scenario | Trigger | Response |
|:---------|:--------|:---------|
| **Insufficient stock** | qty > available | Error: "Not enough stock for [product]. Available: [qty]" |
| **Expired JWT** | Any API call after 24h | 401 → Clear token → Redirect to login |
| **Credit limit exceeded** | balance + amount > limit | Error: "Credit limit exceeded for this customer" |
| **Sync conflict** | Two offline sales exceed stock | Server flags for review → Manager sees alert |
