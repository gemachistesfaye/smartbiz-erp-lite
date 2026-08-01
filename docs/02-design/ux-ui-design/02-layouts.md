# Application Layouts & Navigation
## SmartBiz ERP Lite

**Version:** 1.0
**Date:** August 2026

---

## 1. Desktop Layout (1024px+)

```
┌──────────────────────────────────────────────────────────────────┐
│  🏪 SmartBiz    🔍 Search...         🔔 3    👤 Alem M.    ⚙️  │  ← Top Nav (56px)
├────────────┬─────────────────────────────────────────────────────┤
│            │                                                     │
│  📊 Dashboard│              Content Area                         │
│  📦 Products │              (scrollable)                         │
│  📋 Inventory│              ┌─────────────────────────────┐     │
│  👥 Customers│              │                             │     │
│  💰 Sales   │              │                             │     │
│  📈 Reports │              │                             │     │
│            │              └─────────────────────────────┘     │
│            │                                                     │
│  ───────── │                                                     │
│  ⚙️ Settings│                                                     │
│  👤 Profile │                                                     │
│            │                                                     │
├────────────┴─────────────────────────────────────────────────────┤
│  SmartBiz ERP Lite v1.0              © 2026 Sof Omar Technologies │  ← Footer (40px)
└──────────────────────────────────────────────────────────────────┘
     ↑
  Sidebar (240px)
```

### Desktop Dimensions

| Element | Width/Height | Behavior |
|:--------|:-------------|:---------|
| **Sidebar** | 240px fixed | Always visible; collapses to 64px on toggle |
| **Top Nav** | Full width, 56px height | Fixed at top |
| **Content Area** | Remaining width | Scrollable |
| **Footer** | Full width, 40px height | Fixed at bottom |

---

## 2. Tablet Layout (768px - 1023px)

```
┌──────────────────────────────────────────────────────────────────┐
│  ☰  🏪 SmartBiz        🔍 Search...      🔔  👤 Alem    ⚙️    │  ← Top Nav
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    Content Area                                  │
│                    (full width, scrollable)                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  📊    📦    👥    💰    📈    ⚙️                                 │  ← Bottom Nav (64px)
└──────────────────────────────────────────────────────────────────┘
```

### Tablet Changes from Desktop

| Change | Reason |
|:-------|:-------|
| Sidebar → Bottom navigation | Touch-friendly; thumb-reachable |
| Hamburger menu for secondary pages | Keeps primary nav accessible |
| Content area full width | Maximizes usable space |
| Footer simplified | Less needed on tablet |

---

## 3. Mobile Layout (< 768px)

```
┌─────────────────────────────────┐
│  ☰  🏪 SmartBiz      🔔  👤   │  ← Top Nav (56px)
├─────────────────────────────────┤
│                                 │
│        Content Area             │
│        (full width)             │
│                                 │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  📊   📦   ➕   👥   💰        │  ← Bottom Nav (64px)
└─────────────────────────────────┘
     ↑
  Center = Quick Action (POS)
```

### Mobile Changes from Tablet

| Change | Reason |
|:-------|:-------|
| No sidebar at all | Screen real estate too valuable |
| Bottom nav with 5 items | Maximum 5 primary destinations |
| Center = Quick action (POS) | Most common task gets prominent placement |
| Hamburger for all secondary pages | Only primary nav in bottom bar |
| Simplified tables | Cards or list view instead |

---

## 4. Navigation Hierarchy

### Primary Navigation (Bottom Bar - Mobile/Tablet)

| Position | Icon | Label | Page | Why This Position |
|:---------|:-----|:------|:-----|:------------------|
| 1 | 📊 | Dashboard | `/dashboard` | First thing owner/manager checks |
| 2 | 📦 | Products | `/products` | Core data; frequently accessed |
| 3 | ➕ | New Sale | `/pos` | Center = most used action |
| 4 | 👥 | Customers | `/customers` | Credit tracking is core value |
| 5 | 💰 | Sales | `/sales` | Recent transaction history |

### Secondary Navigation (Sidebar/Menu)

| Section | Pages |
|:--------|:------|
| **Inventory** | Inventory Dashboard, Stock Movements, Low Stock Alerts |
| **Reports** | Sales Reports, Debt Summary, Top Products |
| **Settings** | Business Settings, User Management, Notifications |
| **Profile** | My Profile, Change Password |

---

## 5. Top Navigation Bar

### Desktop Top Nav

```
┌──────────────────────────────────────────────────────────────────┐
│  🏪 SmartBiz    │  🔍 Search products, customers...    │  🔔 3  👤 Alem ⚙️ │
└──────────────────────────────────────────────────────────────────┘
```

| Element | Position | Action |
|:--------|:---------|:-------|
| **Logo/Brand** | Left | Click → Dashboard |
| **Global Search** | Center | Search across products, customers, sales |
| **Notification Bell** | Right | Click → Notification dropdown |
| **User Avatar** | Right | Click → Profile dropdown |
| **Settings Icon** | Far right | Click → Settings page |

### Mobile Top Nav

```
┌─────────────────────────────────────┐
│  ☰  🏪 SmartBiz          🔔  👤   │
└─────────────────────────────────────┘
```

| Element | Position | Action |
|:--------|:---------|:-------|
| **Hamburger Menu** | Left | Opens slide-out menu (all pages) |
| **Logo** | Center-left | Click → Dashboard |
| **Notification Bell** | Right | Opens notification panel |
| **User Avatar** | Far right | Opens profile dropdown |

---

## 6. Login Screen Layout

### Purpose
Secure authentication entry point for all users.

### Layout
```
┌─────────────────────────────────────────────────┐
│                                                  │
│          ┌─────────────────────┐                 │
│          │                     │                 │
│          │    🏪 SmartBiz      │                 │
│          │       ERP Lite      │                 │
│          │                     │                 │
│          │  ┌───────────────┐  │                 │
│          │  │ Email         │  │                 │
│          │  └───────────────┘  │                 │
│          │  ┌───────────────┐  │                 │
│          │  │ Password      │  │                 │
│          │  └───────────────┘  │                 │
│          │                     │                 │
│          │  [    Log In    ]   │                 │
│          │                     │                 │
│          │  Forgot password?   │                 │
│          │                     │                 │
│          │  Don't have an      │                 │
│          │  account? Register  │                 │
│          └─────────────────────┘                 │
│                                                  │
│   © 2026 Sof Omar Technologies                   │
└─────────────────────────────────────────────────┘
```

### Components
- Brand logo and name
- Email input field
- Password input field (with show/hide toggle)
- "Log In" primary button
- "Forgot password?" link
- "Register" link (for new business owners)

### Validation Messages

| Field | Validation | Error Message |
|:------|:-----------|:--------------|
| Email | Required | "Email is required" |
| Email | Invalid format | "Please enter a valid email address" |
| Password | Required | "Password is required" |
| Password | Wrong credentials | "Invalid email or password" |

### Loading Behavior
- Button shows spinner during authentication
- Form fields disabled during submission
- Redirect to dashboard on success

### Responsive Behavior
- **Desktop:** Centered card on gray background
- **Tablet:** Same centered card, slightly smaller
- **Mobile:** Full-width card, minimal padding

---

## 7. Forgot Password Layout

### Layout
```
┌─────────────────────────────────────────────────┐
│                                                  │
│          ┌─────────────────────┐                 │
│          │                     │                 │
│          │   Reset Password    │                 │
│          │                     │                 │
│          │  Enter your email   │                 │
│          │  to receive a reset │                 │
│          │  link.              │                 │
│          │                     │                 │
│          │  ┌───────────────┐  │                 │
│          │  │ Email         │  │                 │
│          │  └───────────────┘  │                 │
│          │                     │                 │
│          │  [ Send Reset Link ]│                 │
│          │                     │                 │
│          │  ← Back to Login    │                 │
│          └─────────────────────┘                 │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Validation Messages

| Field | Validation | Error Message |
|:------|:-----------|:--------------|
| Email | Required | "Email is required" |
| Email | Invalid format | "Please enter a valid email address" |
| Email | Not found | "No account found with this email" |

### Success State
- Show success message: "Reset link sent! Check your email."
- Disable form
- Show "Back to Login" link

---

## 8. Reset Password Layout

### Layout
```
┌─────────────────────────────────────────────────┐
│                                                  │
│          ┌─────────────────────┐                 │
│          │                     │                 │
│          │   Set New Password  │                 │
│          │                     │                 │
│          │  ┌───────────────┐  │                 │
│          │  │ New Password  │  │                 │
│          │  └───────────────┘  │                 │
│          │  ┌───────────────┐  │                 │
│          │  │ Confirm Pass  │  │                 │
│          │  └───────────────┘  │                 │
│          │                     │                 │
│          │  [ Reset Password ] │                 │
│          └─────────────────────┘                 │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Validation Messages

| Field | Validation | Error Message |
|:------|:-----------|:--------------|
| Password | Required | "Password is required" |
| Password | < 8 chars | "Password must be at least 8 characters" |
| Password | No number | "Password must contain at least one number" |
| Confirm | Doesn't match | "Passwords do not match" |

### Success State
- Redirect to login with success message: "Password reset successful. Please log in."

---

## 9. Settings Layout

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Settings                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌─────────────────────────────────────────┐  │
│  │              │  │                                         │  │
│  │ Business     │  │  Business Information                   │  │
│  │ Info       ► │  │                                         │  │
│  │              │  │  Business Name *                         │  │
│  │ Currency     │  │  ┌─────────────────────────────────┐   │  │
│  │              │  │  │ Alem's Mini Market               │   │  │
│  │ Users        │  │  └─────────────────────────────────┘   │  │
│  │              │  │                                         │  │
│  │ Notifications│  │  Phone Number                           │  │
│  │              │  │  ┌─────────────────────────────────┐   │  │
│  │              │  │  │ +251911234567                    │   │  │
│  │              │  │  └─────────────────────────────────┘   │  │
│  │              │  │                                         │  │
│  │              │  │          [ Save Changes ]               │  │
│  └──────────────┘  └─────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 10. Profile Layout

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  My Profile                                                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  👤                                                      │   │
│  │  Alem Mengistu                                           │   │
│  │  alem@example.com                                        │   │
│  │  Owner                                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Personal Information                                     │   │
│  │                                                          │   │
│  │  First Name *          Last Name *                        │   │
│  │  ┌──────────────────┐  ┌──────────────────┐             │   │
│  │  │ Alem             │  │ Mengistu         │             │   │
│  │  └──────────────────┘  └──────────────────┘             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Change Password                                         │   │
│  │                                                          │   │
│  │  Current Password                                        │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ ••••••••                                          │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  New Password                                            │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ ••••••••                                          │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [ Save Profile ]          [ Change Password ]                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```
