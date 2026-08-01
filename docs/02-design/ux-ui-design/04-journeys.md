# User Journeys
## SmartBiz ERP Lite

---

## 1. Owner Journeys

### 1.1 First-Time Setup

```mermaid
graph TD
    A[Open PWA] --> B[Register]
    B --> C[Fill: Business name, Email, Password, Name]
    C --> D[Account Created → Dashboard]
    D --> E[Empty State + Onboarding Cards]
    E --> F[Add Category]
    E --> G[Add Product with Pricing]
    E --> H[Add Cashier Account]
    F --> I[Setup Complete]
    G --> I
    H --> I
```

### 1.2 Daily Monitoring

```mermaid
graph TD
    A[Login → Dashboard] --> B[Review Summary Cards]
    B --> C[Today's Sales: 25,000 ETB ↑12%]
    B --> D[Products: 120]
    B --> E[Customers w/ Credit: 8]
    B --> F[Low Stock Alerts: 5]
    A --> G[Sales Trend Chart]
    A --> H[Top Selling Products]
    A --> I[Tap Low Stock Card]
    I --> J[5 items below threshold]
    A --> K[Tap Customer Credit Card]
    K --> L[Sara owes 7,500 ETB - 11 days overdue]
    L --> M[View Details → WhatsApp outside app]
```

### 1.3 Product Management

```mermaid
graph TD
    A[Products Page] --> B["+ Add Product"]
    B --> C[Fill Form]
    C --> D[Name: Organic Honey]
    C --> E[Category: Beverage]
    C --> F[Base Cost: 150, Overhead: 20 ETB]
    C --> G[Selling Price: 250 ETB]
    C --> H[Min Threshold: 5]
    D --> I[System Auto-Calculates]
    F --> I
    I --> J[Landed Cost: 170 ETB]
    I --> K[Profit Margin: 47%]
    G --> I
    J --> L[Save Product]
    K --> L
    L --> M[Toast: Saved ✓ → Products List]
```

### 1.4 Credit Payment

```mermaid
sequenceDiagram
    participant O as Owner
    participant API as Backend
    participant C as Customer

    O->>API: Search "Abdi Ahmed"
    API-->>O: Customer details (Balance: 5,000 ETB)
    O->>O: Tap "Record Payment"
    O->>API: Enter 2,000 ETB
    API->>API: Validate 2,000 ≤ 5,000 ✓
    API-->>O: Payment recorded
    Note over O: Balance: 3,000 ETB
    O->>C: Give receipt
```

---

## 2. Manager Journeys

### 2.1 Morning Opening + Restock

```mermaid
graph TD
    A[Login → Dashboard] --> B[Check Low-Stock Alerts]
    B --> C[Bread: 5 units below threshold]
    C --> D[Call Supplier]
    D --> E[Receive Delivery]
    E --> F[Inventory Adjustment: +50 units]
    F --> G[Reason: Restocked from Merkato supplier]
    G --> H[Stock: 55 units ✓]
```

### 2.2 Credit Sale

```mermaid
graph TD
    A[Open POS] --> B[Search + Add Items to Cart]
    B --> C[Cart Total: 500 ETB]
    C --> D[Select "Credit" Payment]
    D --> E[Search Customer: Tesfaye D.]
    E --> F[Current Balance: 2,500 ETB]
    F --> G[Confirm Sale]
    G --> H[POST /api/sales/checkout]
    H --> I[Sale Recorded + Inventory Decremented]
    I --> J[Customer Balance: 3,000 ETB]
```

### 2.3 End-of-Day

```mermaid
graph TD
    A[Dashboard] --> B[Sales History - Filter: Today]
    B --> C[Total: 25,000 ETB]
    C --> D[Cash: 15,000]
    C --> E[Mobile: 5,000]
    C --> F[Credit: 5,000]
    B --> G[Export CSV]
```

---

## 3. Cashier Journeys

### 3.1 Quick Cash Sale

```mermaid
graph TD
    A[POS - Default Screen] --> B[Search "milk" → Add x2]
    B --> C[Search "bread" → Add x1]
    C --> D[Cart: Milk 90 + Bread 25 = 115 ETB]
    D --> E[Select Cash]
    E --> F[Customer gives 150 ETB]
    F --> G[Change: 35 ETB]
    G --> H[Complete Sale ✓]
```

### 3.2 Offline Sale

```mermaid
sequenceDiagram
    participant C as Cashier
    participant App as IndexedDB
    participant S as Server

    Note over C,App: Internet down
    C->>App: Process sale (products from cache)
    App->>App: Save to pending queue
    Note over App: Banner: "Offline - syncs later"

    Note over App,S: Internet back
    App->>S: Sync batch of offline sales
    S-->>App: Server IDs assigned
    App->>App: Update local data
```

### 3.3 Credit Sale + New Customer

```mermaid
graph TD
    A[Process Items in Cart] --> B[Select "Credit"]
    B --> C{Customer exists?}
    C -->|Yes| D[Search + Select Customer]
    C -->|No| E[Tap "New Customer"]
    E --> F[Modal: Name, Phone]
    F --> G[Create Customer]
    G --> D
    D --> H[Confirm Sale]
    H --> I[Balance updated]
```
