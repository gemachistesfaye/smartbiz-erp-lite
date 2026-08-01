# UX/UI Design System & Product Design
## SmartBiz ERP Lite

**Version:** 1.0
**Date:** August 2026
**Author:** SmartBiz Design Team
**Status:** Design Phase — No Implementation Code

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design System](#2-design-system)
3. [Application Layout](#3-application-layout)
4. [Page Structure](#4-page-structure)
5. [Dashboard Design](#5-dashboard-design)
6. [Form Design](#6-form-design)
7. [Table Design](#7-table-design)
8. [Component Library](#8-component-library)
9. [User Journeys](#9-user-journeys)
10. [Responsive Design](#10-responsive-design)
11. [Accessibility](#11-accessibility)

---

# 1. Design Philosophy

## 1.1 Core Principles

| Principle | Description | Why It Matters |
|:----------|:------------|:---------------|
| **Clarity over cleverness** | Every element must be immediately understandable | Target users have limited tech literacy; confusion = abandonment |
| **Progressive disclosure** | Show only what's needed at each step | Reduces cognitive load for non-technical users |
| **Consistency** | Same patterns everywhere | Users learn once, apply everywhere |
| **Forgiveness** | Easy to undo, hard to break | Reduces anxiety about making mistakes |
| **Speed** | Every interaction under 3 clicks | Shop owners are time-poor; speed = adoption |
| **Mobile-first** | Design for phone, enhance for desktop | 70% of Ethiopian users are on Android phones |

## 1.2 Design Inspiration (Not Copying)

| Product | What We Take | What We Don't Take |
|:--------|:-------------|:-------------------|
| **Stripe Dashboard** | Clean data presentation, summary cards, professional feel | Complex developer-oriented layout |
| **Notion** | Clean typography, generous whitespace, block-based layout | Extensive customization complexity |
| **Linear** | Minimal chrome, fast interactions, keyboard shortcuts | Developer-focused workflows |
| **Shopify Admin** | E-commerce patterns, product management, POS simplicity | Full e-commerce complexity |
| **Vercel Dashboard** | Status indicators, real-time updates, modern aesthetic | Technical deployment focus |

## 1.3 Design Tone

The application should feel:
- **Professional** — Not playful or toy-like; this handles real money
- **Trustworthy** — Clean, organized; users trust it with their business data
- **Approachable** — Not intimidating; feels like a well-designed calculator
- **Efficient** — Every pixel serves a purpose; no decorative elements
- **Calm** — Not busy or overwhelming; reduces stress in fast-paced retail

---

# 2. Design System

## 2.1 Color Palette

### Primary Colors

| Color | Hex | Usage | Rationale |
|:------|:----|:------|:----------|
| **Primary Blue** | `#2563EB` | Primary buttons, links, active states | Professional, trustworthy; universally associated with business/finance |
| **Primary Blue Dark** | `#1D4ED8` | Button hover, emphasis | Provides clear hover feedback |
| **Primary Blue Light** | `#DBEAFE` | Selected rows, subtle highlights | Non-intrusive selection indication |

### Neutral Colors

| Color | Hex | Usage | Rationale |
|:------|:----|:------|:----------|
| **Gray 950** | `#0A0A0A` | Primary text | Maximum readability on white |
| **Gray 700** | `#374151` | Secondary text, labels | Reduced emphasis without losing legibility |
| **Gray 500** | `#6B7280` | Placeholder text, captions | Clearly "not primary" information |
| **Gray 300** | `#D1D5DB` | Borders, dividers | Subtle separation without visual noise |
| **Gray 100** | `#F3F4F6` | Backgrounds, table stripes | Alternating rows without harsh contrast |
| **Gray 50** | `#F9FAFB` | Card backgrounds | Subtle elevation from white page |
| **White** | `#FFFFFF` | Page background, cards | Clean, fresh canvas |

### Semantic Colors

| Color | Hex | Usage | Rationale |
|:------|:----|:------|:----------|
| **Green 600** | `#16A34A` | Success, profit, in-stock | Universal success indicator |
| **Green 50** | `#F0FDF4` | Success backgrounds | Soft success without visual aggression |
| **Red 600** | `#DC2626` | Errors, losses, delete actions | Clear danger/destruction signal |
| **Red 50** | `#FEF2F2` | Error backgrounds | Soft error without alarming |
| **Amber 600** | `#D97706` | Warnings, low stock, pending | Attention-grabbing without panic |
| **Amber 50** | `#FFFBEB` | Warning backgrounds | Gentle alert |
| **Blue 600** | `#2563EB` | Information, links | Consistent with primary |
| **Blue 50** | `#EFF6FF` | Info backgrounds | Soft information |

### Why This Palette Works for Ethiopian SMEs

1. **High contrast** — Works on budget phone screens with lower brightness
2. **Blue primary** — Professional; no cultural negative associations in Ethiopia
3. **Green for success** — Universally understood; also aligns with Ethiopian flag colors subtly
4. **Warm neutrals** — Feels approachable, not clinical
5. **Avoids red/green together** — Colorblind accessible for the ~8% of males with color vision deficiency

## 2.2 Typography

### Font Family

| Usage | Font | Why |
|:------|:-----|:----|
| **Primary** | `Inter` | Designed for screens; excellent readability at all sizes; supports Latin and Ethiopic scripts |
| **Fallback** | `system-ui, -apple-system, sans-serif` | Fast loading; native feel on each device |

### Font Scale

| Level | Size | Weight | Line Height | Usage | Why |
|:------|:-----|:-------|:------------|:------|:----|
| **Display** | 30px | 700 | 1.2 | Page titles (rare) | Attention for key moments |
| **H1** | 24px | 700 | 1.3 | Section headers | Clear page hierarchy |
| **H2** | 20px | 600 | 1.4 | Sub-sections | Secondary grouping |
| **H3** | 16px | 600 | 1.5 | Card titles, labels | Component-level hierarchy |
| **Body** | 14px | 400 | 1.6 | Default text | Comfortable reading |
| **Small** | 12px | 400 | 1.5 | Captions, timestamps | Supplementary info only |
| **Micro** | 10px | 500 | 1.4 | Badges, tags | Minimal space, maximum info |

### Why This Scale

- **14px base** — Optimal for mobile readability without zooming
- **60% weight variation** — Clear hierarchy without multiple font families
- **Consistent line heights** — Prevents text feeling cramped on small screens
- **Inter font** — Free, open-source, excellent for both English and Amharic characters when Amharic support is added

## 2.3 Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|:------|:------|:------|
| `space-0` | 0px | No spacing |
| `space-1` | 4px | Tight spacing (icon padding, inline elements) |
| `space-2` | 8px | Small spacing (input padding, badge padding) |
| `space-3` | 12px | Medium-small (card padding, list gaps) |
| `space-4` | 16px | Default spacing (section gaps) |
| `space-5` | 20px | Medium spacing (form field gaps) |
| `space-6` | 24px | Large spacing (section separators) |
| `space-8` | 32px | Extra large (page padding, major sections) |
| `space-10` | 40px | Section breaks |
| `space-12` | 48px | Major page sections |
| `space-16` | 64px | Hero sections, landing areas |

### Why 4px Base

- **Mathematical harmony** — All spacing is a multiple; no arbitrary values
- **Consistent rhythm** — Creates visual predictability
- **Easy to remember** — Developers can mentally calculate spacing
- **Mobile-friendly** — Fine-grained control for tight mobile layouts

## 2.4 Border Radius

| Token | Value | Usage | Why |
|:------|:------|:------|:----|
| `radius-none` | 0px | — | — |
| `radius-sm` | 4px | Badges, small elements | Subtle rounding, not distracting |
| `radius-md` | 6px | Inputs, buttons, cards | Standard UI element rounding |
| `radius-lg` | 8px | Modals, dropdowns | Slightly softer for overlay elements |
| `radius-xl` | 12px | Large cards, containers | Comfortable, modern feel |
| `radius-full` | 9999px | Avatars, pills | Perfect circle for profile images |

### Why This Scale

- **Consistent rounding** — No visual jarring from different radius values
- **Modern but professional** — Rounded enough to feel current, not so round it feels playful
- **Budget phone performance** — Simple border-radius is GPU-friendly

## 2.5 Shadows

| Token | Value | Usage | Why |
|:------|:------|:------|:----|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle borders, input focus | Almost invisible; defines edges |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards, dropdowns | Creates depth without drama |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Modals, popovers | Clearly elevated elements |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Dialogs, side panels | Focus-attracting elevation |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Full-screen overlays | Maximum depth indication |

### Why Subtle Shadows

- **Budget phones** — Heavy shadows cause rendering lag on low-end GPUs
- **Professional feel** — Subtle shadows feel more refined than heavy ones
- **Clear hierarchy** — Shadows indicate elevation levels without overwhelming content

## 2.6 Icons

### Icon Library: Lucide Icons

| Reason | Explanation |
|:-------|:------------|
| **Open source** | No licensing issues for SaaS |
| **Consistent style** | Same stroke width, same grid, same optical sizing |
| **Comprehensive** | Covers all ERP use cases (products, sales, users, settings) |
| **Lightweight** | Tree-shakeable; only import what's used |
| **Accessible** | SVG-based; screen reader friendly |

### Icon Sizes

| Size | Pixels | Usage |
|:-----|:-------|:------|
| `icon-sm` | 16px | Inline with text, badges |
| `icon-md` | 20px | Buttons, navigation items |
| `icon-lg` | 24px | Standalone icons, headers |
| `icon-xl` | 32px | Empty states, feature highlights |

### Icon + Label Rule

- **Always pair icons with text** in navigation and buttons
- **Icons alone** only for: back button, close button, search toggle
- **Why:** Non-technical users don't know icon meanings; labels prevent confusion

## 2.7 Button Styles

### Button Variants

| Variant | Background | Text | Border | Usage | Why |
|:--------|:-----------|:-----|:-------|:------|:----|
| **Primary** | `#2563EB` | White | None | Main actions (Save, Submit, Complete Sale) | Clear visual hierarchy; primary action stands out |
| **Secondary** | White | `#374151` | `#D1D5DB` | Secondary actions (Cancel, Close) | Available but not dominant |
| **Danger** | `#DC2626` | White | None | Destructive actions (Delete, Deactivate) | Clear warning; prevents accidental deletion |
| **Ghost** | Transparent | `#374151` | None | Tertiary actions, table row actions | Minimal visual weight |
| **Link** | Transparent | `#2563EB` | None | Inline actions ("View details", "Edit") | Feels like a link, acts like a button |

### Button Sizes

| Size | Height | Padding | Font Size | Usage |
|:-----|:-------|:--------|:----------|:------|
| `sm` | 32px | 8px 12px | 12px | Table actions, inline |
| `md` | 36px | 10px 16px | 14px | Default forms, dialogs |
| `lg` | 44px | 12px 24px | 16px | Primary page actions, POS buttons |

### Why This Button System

- **44px minimum touch target** — WCAG accessibility requirement; critical for mobile
- **5 variants** — Covers all use cases without overwhelming choices
- **Consistent sizing** — Predictable spacing across the application
- **Danger variant** — Prevents accidental destructive actions

## 2.8 Form Styles

### Input Field Design

```
┌─────────────────────────────────────┐
│ Product Name *                       │
│ ┌─────────────────────────────────┐ │
│ │ Enter product name              │ │
│ └─────────────────────────────────┘ │
│ Helpful text or error message here  │
└─────────────────────────────────────┘
```

### Input States

| State | Border | Background | Description |
|:------|:-------|:-----------|:------------|
| **Default** | `#D1D5DB` | White | Normal state |
| **Focus** | `#2563EB` | White | User is typing; clear indicator |
| **Error** | `#DC2626` | `#FEF2F2` | Validation error; needs attention |
| **Success** | `#16A34A` | `#F0FDF4` | Validated successfully |
| **Disabled** | `#E5E7EB` | `#F9FAFB` | Cannot be edited |
| **Loading** | `#D1D5DB` | White | Content loading |

### Input Sizes

| Size | Height | Padding | Font Size | Usage |
|:-----|:-------|:--------|:----------|:------|
| `sm` | 32px | 8px 12px | 12px | Compact forms, filters |
| `md` | 36px | 10px 14px | 14px | Standard forms |
| `lg` | 44px | 12px 16px | 16px | POS search, primary inputs |

### Why This Form Design

- **Labels above inputs** — Faster scanning than left-aligned labels
- **Clear focus state** — Blue border removes ambiguity about which field is active
- **Error + success states** — Users get immediate feedback; no guessing
- **Consistent sizing** — Same visual rhythm across all forms

## 2.9 Card Styles

### Card Variants

| Variant | Background | Border | Shadow | Usage |
|:--------|:-----------|:-------|:-------|:------|
| **Default** | White | `#E5E7EB` | `shadow-sm` | Data cards, list items |
| **Elevated** | White | None | `shadow-md` | Featured cards, dashboard summaries |
| **Interactive** | White | `#E5E7EB` | `shadow-sm` → `shadow-md` on hover | Clickable cards, product cards |

### Card Padding

| Size | Padding | Usage |
|:-----|:--------|:------|
| `sm` | 12px | Compact cards, badges |
| `md` | 16px | Standard cards |
| `lg` | 24px | Featured cards, dashboard cards |

## 2.10 Table Design

### Table Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ 🔍 Search products...                    Filter ▼    Export ▼   │
├──────────────────────────────────────────────────────────────────┤
│ ☐  Name          Category    Price     Stock    Status    Actions│
├──────────────────────────────────────────────────────────────────┤
│ ☐  Milk 1L       Dairy       45 ETB    120      ✅ In Stock  ⋮  │
│ ☐  Bread         Bakery      25 ETB    5        ⚠️ Low Stock ⋮  │
│ ☐  Sugar 1kg     Grocery     85 ETB    0        ❌ Out of Stock⋮│
│ ☐  Rice 5kg      Grocery     320 ETB   45       ✅ In Stock  ⋮  │
├──────────────────────────────────────────────────────────────────┤
│ Showing 1-20 of 150 products              ‹ 1 2 3 4 5 ... 8 ›  │
└──────────────────────────────────────────────────────────────────┘
```

### Table Features

| Feature | Implementation | Why |
|:--------|:---------------|:----|
| **Row hover** | `#F9FAFB` background | Clear row identification |
| **Striped rows** | Alternating `white` / `#F9FAFB` | Prevents eye-tracking errors on wide tables |
| **Checkbox column** | Left-aligned, always visible | Enables bulk operations |
| **Sortable columns** | Click header → arrow indicator | User control over data order |
| **Sticky header** | `position: sticky; top: 0` | Headers always visible during scroll |
| **Empty state** | Illustration + message + CTA | Guided next step when no data |

## 2.11 Badge Styles

| Badge | Background | Text | Usage |
|:------|:-----------|:-----|:------|
| **Success** | `#DCFCE7` | `#166534` | In stock, active, paid |
| **Warning** | `#FEF3C7` | `#92400E` | Low stock, pending |
| **Danger** | `#FEE2E2` | `#991B1B` | Out of stock, overdue, inactive |
| **Info** | `#DBEAFE` | `#1E40AF` | Credit, mobile money |
| **Neutral** | `#F3F4F6` | `#374151` | Default, draft |

## 2.12 Toast Notifications

### Position

- **Top-right** corner on desktop
- **Top-center** on mobile
- **Stacking** — newest on top; auto-dismiss after 5 seconds

### Toast Variants

| Type | Icon | Border Left | Usage |
|:-----|:-----|:------------|:------|
| **Success** | ✓ Checkmark | `#16A34A` | Sale completed, product saved |
| **Error** | ✕ Cross | `#DC2626` | API error, validation failure |
| **Warning** | ⚠ Triangle | `#D97706` | Low stock, sync conflict |
| **Info** | ℹ Circle | `#2563EB` | Sync status, tips |

### Why Toast Notifications

- **Non-blocking** — User can continue working while seeing feedback
- **Auto-dismiss** — No manual dismissal needed for success messages
- **Persistent for errors** — Error toasts require manual dismissal
- **Consistent position** — Users know where to look for feedback

## 2.13 Empty States

### Design Pattern

```
┌─────────────────────────────────────────────┐
│                                             │
│           [Illustration/Icon]               │
│                                             │
│        No products yet                      │
│                                             │
│   Add your first product to start           │
│   selling to customers.                     │
│                                             │
│        [ + Add Product ]                    │
│                                             │
└─────────────────────────────────────────────┘
```

### Empty State Types

| Type | Illustration | Message | Action |
|:-----|:-------------|:--------|:-------|
| **No data** | Folder with plus | "No [items] yet" | "Add your first [item]" |
| **No search results** | Magnifying glass | "No results found" | "Try a different search" |
| **No filter results** | Funnel | "No items match filters" | "Clear all filters" |
| **Coming soon** | Rocket | "This feature is coming soon" | "Stay tuned" |

---

# 3. Application Layout

## 3.1 Desktop Layout (1024px+)

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
│            │              │                             │     │
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

## 3.2 Tablet Layout (768px - 1023px)

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

## 3.3 Mobile Layout (< 768px)

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

## 3.4 Navigation Hierarchy

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

## 3.5 Top Navigation Bar

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

# 4. Page Structure

## 4.1 Login Screen

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

### Empty State
- N/A (always has form)

### Responsive Behavior
- **Desktop:** Centered card on gray background
- **Tablet:** Same centered card, slightly smaller
- **Mobile:** Full-width card, minimal padding

---

## 4.2 Forgot Password

### Purpose
Allow users to reset their password via email.

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

### Components
- Page title "Reset Password"
- Descriptive text
- Email input field
- "Send Reset Link" primary button
- "Back to Login" link

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

### Responsive Behavior
- Same as login screen (centered card)

---

## 4.3 Reset Password

### Purpose
Allow users to set a new password after clicking the reset link.

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

### Components
- New password input (with strength indicator)
- Confirm password input
- "Reset Password" primary button

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

## 4.4 Dashboard

### Purpose
Business overview at a glance — the first screen owners and managers see after login.

### Main Components

```
┌──────────────────────────────────────────────────────────────────┐
│  Dashboard                                              Today ▼ │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ 💰 25,000│  │ 📦 120   │  │ 👥 8     │  │ ⚠️ 5     │        │
│  │ Today's  │  │ Products │  │ Customers│  │ Low Stock│        │
│  │ Sales    │  │          │  │ w/ Credit│  │ Alerts   │        │
│  │ ↑ 12%    │  │ ↑ 3 new  │  │ ↓ 2,000  │  │          │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐   │
│  │  Sales This Week            │  │  Top Selling Products    │   │
│  │  ┌─────────────────────┐   │  │  1. Milk 1L      (120)  │   │
│  │  │                     │   │  │  2. Bread        (95)   │   │
│  │  │   [Line Chart]      │   │  │  3. Sugar 1kg    (80)   │   │
│  │  │                     │   │  │  4. Rice 5kg     (45)   │   │
│  │  └─────────────────────┘   │  │  5. Coffee       (40)   │   │
│  └─────────────────────────────┘  └─────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐   │
│  │  Recent Sales               │  │  Customer Credit Summary │   │
│  │                             │  │                         │   │
│  │  10:32  Milk x2    90 ETB  │  │  Total Owed: 15,000 ETB │   │
│  │  10:28  Bread x1   25 ETB  │  │  ┌─────────────────┐    │   │
│  │  10:15  Sugar x3   255 ETB │  │  │ [Bar Chart]     │    │   │
│  │  10:02  Rice x1    320 ETB │  │  │ Top 5 debtors   │    │   │
│  │  09:45  Coffee x2  160 ETB │  │  └─────────────────┘    │   │
│  │                             │  │                         │   │
│  │  [View All Sales →]         │  │  [View All Customers →] │   │
│  └─────────────────────────────┘  └─────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Quick Actions                                            │   │
│  │  [ + New Sale ]  [ + Add Product ]  [ + Add Customer ]   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Summary Cards

| Card | Icon | Value | Subtext | Color |
|:-----|:-----|:------|:--------|:------|
| Today's Sales | 💰 | 25,000 ETB | ↑ 12% vs yesterday | Green |
| Products | 📦 | 120 | ↑ 3 new this week | Blue |
| Customers w/ Credit | 👥 | 8 | ↓ 2,000 ETB total owed | Amber |
| Low Stock Alerts | ⚠️ | 5 | Items below threshold | Red |

### Charts

| Chart | Type | Data | Why |
|:------|:-----|:-----|:----|
| Sales This Week | Line chart | 7-day sales trend | Visual revenue pattern |
| Top Selling Products | Horizontal bar | Top 5 by quantity sold | Quick inventory insight |
| Customer Debt Summary | Bar chart | Top 5 debtors by amount | Credit management focus |

### Quick Actions

| Button | Icon | Destination | Why |
|:-------|:-----|:------------|:----|
| New Sale | ➕ | `/pos` | Most frequent action |
| Add Product | 📦 | `/products/new` | Core setup action |
| Add Customer | 👥 | `/customers/new` | Credit tracking setup |

### Information Displayed
- Today's total sales (ETB)
- Number of products in catalog
- Number of customers with outstanding credit
- Number of products below minimum stock threshold
- Weekly sales trend (visual)
- Top 5 selling products
- 5 most recent sales
- Top 5 customers by debt amount
- Quick action buttons

### Primary Buttons
- "New Sale" (center, most prominent)
- "Add Product"
- "Add Customer"

### Secondary Buttons
- "View All Sales"
- "View All Customers"
- "View Low Stock Items"

### Loading Behavior
- Skeleton cards while dashboard loads
- Charts show loading spinner
- Data refreshes every 30 seconds (or on pull-to-refresh on mobile)

### Empty State
```
┌─────────────────────────────────────────────┐
│                                             │
│           [Store illustration]              │
│                                             │
│        Welcome to SmartBiz!                 │
│                                             │
│   Your dashboard will show business         │
│   insights once you start making sales.     │
│                                             │
│   Get started:                              │
│   [ + Add Product ]  [ + Add Customer ]    │
│                                             │
└─────────────────────────────────────────────┘
```

### Responsive Behavior
- **Desktop:** 4-column summary cards, 2-column charts section
- **Tablet:** 2-column summary cards, 1-column charts (stacked)
- **Mobile:** 1-column cards (horizontal scroll), charts stacked vertically

---

## 4.5 Products Page

### Purpose
Browse, search, and manage the product catalog.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Products                                         + Add Product │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search products...    Category ▼    Status ▼    Sort ▼      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ☐  Product      Category   Price    Stock    Status  ⋮  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ ☐  Milk 1L      Dairy      45 ETB   120     ✅ In Stock │   │
│  │ ☐  Bread        Bakery     25 ETB   5       ⚠️ Low     │   │
│  │ ☐  Sugar 1kg    Grocery    85 ETB   0       ❌ Out      │   │
│  │ ☐  Rice 5kg     Grocery    320 ETB  45      ✅ In Stock │   │
│  │ ☐  Coffee 500g  Beverage   180 ETB  30      ✅ In Stock │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Showing 1-20 of 150              ‹ 1 2 3 4 5 ... 8 ›          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components
- Page header with title and "Add Product" button
- Search bar with real-time filtering
- Category filter dropdown
- Status filter dropdown (In Stock / Low Stock / Out of Stock)
- Sort dropdown (Name, Price, Stock, Recently Added)
- Data table with product rows
- Pagination

### Actions
- Click product row → View/Edit product
- Click "Add Product" → Open add product form
- Click row actions (⋮) → Edit, Delete, Adjust Stock
- Checkbox → Bulk delete (Owner only)

### Primary Button
- "+ Add Product" (top right, primary blue)

### Secondary Buttons
- "Export" (dropdown: CSV, PDF)
- "Bulk Actions" (when items selected)

### Validation Messages
- Search: No results → "No products found matching '[search term]'"
- Delete confirmation: "Are you sure you want to delete '[product name]'? This action cannot be undone."

### Loading Behavior
- Skeleton rows while products load
- Search has 300ms debounce (no API call per keystroke)

### Empty State
```
┌─────────────────────────────────────────────┐
│                                             │
│           [Package icon]                    │
│                                             │
│        No products yet                      │
│                                             │
│   Add your first product to start           │
│   managing your inventory.                  │
│                                             │
│        [ + Add Product ]                    │
│                                             │
└─────────────────────────────────────────────┘
```

### Responsive Behavior
- **Desktop:** Full table with all columns
- **Tablet:** Table with some columns hidden (barcode, SKU)
- **Mobile:** Card view instead of table; each product as a card

---

## 4.6 Add/Edit Product

### Purpose
Create or modify a product in the catalog.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Products        Add Product                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Basic Information                                        │   │
│  │                                                          │   │
│  │  Product Name *          Category *                       │   │
│  │  ┌──────────────────┐   ┌──────────────────┐            │   │
│  │  │                  │   │ Select category ▼│            │   │
│  │  └──────────────────┘   └──────────────────┘            │   │
│  │                                                          │   │
│  │  SKU (optional)            Barcode (optional)            │   │
│  │  ┌──────────────────┐   ┌──────────────────┐            │   │
│  │  │                  │   │                  │            │   │
│  │  └──────────────────┘   └──────────────────┘            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Pricing                                                  │   │
│  │                                                          │   │
│  │  Base Cost (ETB) *     Overhead Cost (ETB) *             │   │
│  │  ┌──────────────────┐   ┌──────────────────┐            │   │
│  │  │ 0.00             │   │ 0.00             │            │   │
│  │  └──────────────────┘   └──────────────────┘            │   │
│  │                                                          │   │
│  │  Landed Cost (auto): 0.00 ETB                            │   │
│  │                                                          │   │
│  │  Selling Price (ETB) *                                    │   │
│  │  ┌──────────────────┐                                    │   │
│  │  │ 0.00             │                                    │   │
│  │  └──────────────────┘                                    │   │
│  │                                                          │   │
│  │  ⚠️ Warning: Selling price is below landed cost          │   │
│  │                                                          │   │
│  │  Profit Margin: 15.5%                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Inventory                                                │   │
│  │                                                          │   │
│  │  Minimum Stock Threshold *                                │   │
│  │  ┌──────────────────┐                                    │   │
│  │  │ 5                │                                    │   │
│  │  └──────────────────┘                                    │   │
│  │  Alert when stock drops below this level                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│          [ Cancel ]                    [ Save Product ]          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Field Grouping

| Group | Fields | Why Grouped |
|:------|:-------|:------------|
| **Basic Information** | Name, Category, SKU, Barcode | Core identity; fill first |
| **Pricing** | Base Cost, Overhead Cost, Selling Price | Financial info; related calculations |
| **Inventory** | Minimum Stock Threshold | Operational setting; separate concern |

### Validation Messages

| Field | Validation | Error Message |
|:------|:-----------|:--------------|
| Product Name | Required | "Product name is required" |
| Product Name | Max 200 chars | "Product name must be under 200 characters" |
| Category | Required | "Please select a category" |
| Base Cost | Required, ≥ 0 | "Base cost must be 0 or more" |
| Overhead Cost | Required, ≥ 0 | "Overhead cost must be 0 or more" |
| Selling Price | Required, > 0 | "Selling price must be greater than 0" |
| Selling Price | < Landed Cost | "Selling price is below landed cost. You will lose money on each sale." |
| Min Threshold | Required, ≥ 0 | "Minimum threshold must be 0 or more" |

### Success Feedback
- Toast: "Product saved successfully"
- Redirect to products list
- New product appears in table

### Keyboard Accessibility
- Tab order: Name → Category → SKU → Barcode → Base Cost → Overhead → Selling Price → Min Threshold → Save
- Enter on any field → Move to next field
- Escape → Cancel form

### Responsive Behavior
- **Desktop:** Two-column layout (Basic Info | Pricing)
- **Tablet:** Single column, all groups stacked
- **Mobile:** Single column, groups collapsible

---

## 4.7 Categories Page

### Purpose
Manage product categories.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Categories                                     + Add Category │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search categories...                                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Category Name        Products    Status          Actions │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Dairy                15          ✅ Active        ⋮      │   │
│  │  Bakery               8           ✅ Active        ⋮      │   │
│  │  Grocery              45          ✅ Active        ⋮      │
│  │  Beverage             12          ✅ Active        ⋮      │   │
│  │  Electronics          20          ✅ Active        ⋮      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components
- Page header with "Add Category" button
- Search bar
- Data table with category rows
- Row actions menu (Edit, Delete)

### Validation Messages
- Duplicate category: "A category with this name already exists"
- Delete with products: "Cannot delete category with existing products. Move products first."

### Responsive Behavior
- **Desktop:** Full table
- **Tablet:** Table with hidden columns
- **Mobile:** Simple list view

---

## 4.8 Units Page

### Purpose
Manage measurement units (kg, liters, pieces, boxes, etc.).

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Units                                            + Add Unit   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Unit Name        Symbol    Products          Actions    │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Piece            pc        45                 ⋮         │   │
│  │  Kilogram         kg        30                 ⋮         │   │
│  │  Liter            L         20                 ⋮         │   │
│  │  Box              box       15                 ⋮         │   │
│  │  Pack             pack      10                 ⋮         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4.9 Inventory Page

### Purpose
Overview of all stock levels with low-stock alerts.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Inventory                                     Adjust Stock ▼   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search...    Status ▼ (All / Low Stock / Out of Stock)     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Product        Current Stock   Min Threshold   Status   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Milk 1L        120             10              ✅ OK    │   │
│  │  Bread          5               10              ⚠️ Low   │   │
│  │  Sugar 1kg      0               10              ❌ Out   │   │
│  │  Rice 5kg       45              10              ✅ OK    │   │
│  │  Coffee 500g    30              10              ✅ OK    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ⚠️ 5 items below minimum threshold                             │
│  [ View Low Stock Items → ]                                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components
- Page header with "Adjust Stock" button
- Search bar
- Status filter
- Data table with stock levels
- Low-stock alert banner

### Actions
- Click row → Adjust stock for that product
- "Adjust Stock" → Opens adjustment modal/page

### Responsive Behavior
- **Desktop:** Full table
- **Tablet:** Table with reduced columns
- **Mobile:** Card view with stock status prominent

---

## 4.10 Stock Movement Page

### Purpose
View history of all stock adjustments and movements.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Stock Movement History                                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search...    Date Range ▼    Type ▼ (All / Sale / Adjust)  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Date/Time      Product     Type     Qty    Before→After │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Jul 31 10:32   Milk 1L     Sale     -2     122→120     │   │
│  │  Jul 31 10:15   Sugar 1kg   Sale     -3     5→2         │   │
│  │  Jul 31 09:00   Bread       Adjust   +50    0→50        │   │
│  │  Jul 30 16:45   Rice 5kg    Sale     -5     50→45       │   │
│  │  Jul 30 14:20   Coffee      Sale     -2     32→30       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4.11 Customers Page

### Purpose
Manage customer profiles and view credit status.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Customers                                     + Add Customer  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search customers...    Credit Status ▼                      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Name            Phone           Credit Balance   Actions│   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Abdi Ahmed      +251911234567   5,000 ETB        ⋮     │   │
│  │  Fatuma Hassan   +251922345678   0 ETB            ⋮     │   │
│  │  Tesfaye D.      +251933456789   2,500 ETB        ⋮     │   │
│  │  Sara Mohammed   +251944567890   7,500 ETB        ⋮     │   │
│  │  Kemal Ali       +251955678901   0 ETB            ⋮     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Total Outstanding Credit: 15,000 ETB                           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components
- Page header with "Add Customer" button
- Search bar (name or phone)
- Credit status filter (All / Has Debt / No Debt)
- Data table with customer rows
- Total outstanding credit summary

### Actions
- Click customer → View customer details
- Row actions → Edit, Record Payment, View History
- "+ Add Customer" → Create new customer

### Responsive Behavior
- **Desktop:** Full table
- **Tablet:** Table with some columns hidden
- **Mobile:** Card view; phone number prominent

---

## 4.12 Customer Details Page

### Purpose
View complete customer profile, transaction history, and credit status.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Customers       Customer Details                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  👤 Abdi Ahmed                                           │   │
│  │  📱 +251911234567                                        │   │
│  │                                                          │   │
│  │  Credit Balance: 5,000 ETB                               │   │
│  │  Total Purchases: 25,000 ETB                             │   │
│  │  Member Since: Jan 2026                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │  [ Record Payment ] │  │  [ Edit Customer ]              │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Transaction History                                     │   │
│  │                                                          │   │
│  │  Date        Type        Amount      Balance             │   │
│  │  ─────────────────────────────────────────────────       │   │
│  │  Jul 31      Sale        +500 ETB    5,000 ETB           │   │
│  │  Jul 30      Payment     -1,000 ETB  4,500 ETB           │   │
│  │  Jul 28      Sale        +1,500 ETB  5,500 ETB           │   │
│  │  Jul 25      Payment     -2,000 ETB  4,000 ETB           │   │
│  │  Jul 20      Sale        +3,000 ETB  6,000 ETB           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components
- Customer profile card (name, phone, balance, stats)
- Action buttons (Record Payment, Edit)
- Transaction history table
- Running balance column

### Primary Button
- "Record Payment" (prominent, green for positive action)

### Secondary Button
- "Edit Customer"

---

## 4.13 Credit Management Page

### Purpose
Overview of all customer debts and payment tracking.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Credit Management                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Total    │  │ Owed by  │  │ Paid     │  │ Overdue  │       │
│  │ Owed     │  │ Top 5    │  │ This Month│  │ Accounts │       │
│  │ 15,000   │  │ 12,000   │  │ 8,000    │  │ 2        │       │
│  │ ETB      │  │ ETB      │  │ ETB      │  │ accounts │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Outstanding Debts                                       │   │
│  │                                                          │   │
│  │  Customer       Balance     Last Payment    Status      │   │
│  │  ───────────────────────────────────────────────────     │   │
│  │  Sara Mohammed  7,500 ETB   Jul 20          ⚠️ 11 days  │   │
│  │  Abdi Ahmed     5,000 ETB   Jul 30          ✅ Recent   │   │
│  │  Tesfaye D.     2,500 ETB   Jul 25          ✅ Recent   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Summary Cards
| Card | Value | Why |
|:-----|:------|:----|
| Total Owed | 15,000 ETB | At-a-glance debt total |
| Owed by Top 5 | 12,000 ETB | Concentration of debt |
| Paid This Month | 8,000 ETB | Payment collection progress |
| Overdue Accounts | 2 | Attention needed |

---

## 4.14 Sales Page

### Purpose
View all sales history with filtering.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Sales History                              + New Sale          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search...    Date Range ▼    Payment Method ▼    Cashier ▼ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ID       Date         Cashier    Total      Method  ⋮  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  #1001    Jul 31 10:32 Fatima     90 ETB     Cash    ⋮  │   │
│  │  #1000    Jul 31 10:28 Dawit      25 ETB     Cash    ⋮  │   │
│  │  #0999    Jul 31 10:15 Fatima     255 ETB    Mobile  ⋮  │   │
│  │  #0998    Jul 31 10:02 Dawit      320 ETB    Credit  ⋮  │   │
│  │  #0997    Jul 31 09:45 Fatima     160 ETB    Cash    ⋮  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Showing 1-20 of 1,500              ‹ 1 2 3 4 5 ... 75 ›      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components
- Page header with "New Sale" button
- Search bar (by sale ID or customer name)
- Date range filter
- Payment method filter
- Cashier filter (Owner/Manager only)
- Data table with sales rows
- Pagination

### Actions
- Click sale → View invoice details
- Row actions → View, Print, Void (Manager+)
- "New Sale" → Opens POS screen

### Responsive Behavior
- **Desktop:** Full table
- **Tablet:** Table with reduced columns
- **Mobile:** Card view; total and date prominent

---

## 4.15 New Sale (POS Screen)

### Purpose
Process a new sale — the core revenue-generating screen.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back        Point of Sale                     👤 Fatima      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────┐  ┌─────────────────────────────┐  │
│  │  🔍 Search products...   │  │  🛒 Cart                    │  │
│  │                          │  │                             │  │
│  │  ┌────┐ ┌────┐ ┌────┐  │  │  Milk 1L x2     90 ETB     │  │
│  │  │Milk│ │Bred│ │Suga│  │  │  Bread x1        25 ETB     │  │
│  │  │45  │ │25  │ │85  │  │  │  Sugar 1kg x3   255 ETB    │  │
│  │  └────┘ └────┘ └────┘  │  │                             │  │
│  │  ┌────┐ ┌────┐ ┌────┐  │  │  ─────────────────────────  │  │
│  │  │Rice│ │Coff│ │Tea │  │  │  Subtotal:      370 ETB     │  │
│  │  │320 │ │180 │ │60  │  │  │  Tax (0%):        0 ETB     │  │
│  │  └────┘ └────┘ └────┘  │  │  ─────────────────────────  │  │
│  │                          │  │  TOTAL:         370 ETB     │  │
│  │  [ 📷 Scan Barcode ]    │  │                             │  │
│  │                          │  │  [ 🗑 Clear Cart ]          │  │
│  └──────────────────────────┘  └─────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Payment                                                 │   │
│  │                                                          │   │
│  │  [ 💵 Cash ]  [ 📱 Mobile Money ]  [ 🏷 Credit ]       │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  Amount Tendered: ___________                    │   │   │
│  │  │  Change:          0 ETB                          │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  [ ========== Complete Sale ========== ]                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Components
- Product search (text + barcode scan)
- Product grid (tap to add)
- Cart panel (items, quantities, totals)
- Payment method selector
- Amount tendered input (for cash)
- Change calculation (automatic)
- "Complete Sale" primary button

### Actions
- Search product → Add to cart
- Tap product tile → Add to cart (quantity 1)
- Adjust quantity in cart (+/- buttons)
- Remove item from cart
- Select payment method
- Enter amount tendered (cash)
- Complete sale

### Validation Messages

| Scenario | Message |
|:---------|:--------|
| Empty cart | "Add items to the cart before completing sale" |
| Insufficient stock | "Not enough stock for [product]. Available: [qty]" |
| Credit without customer | "Please select a customer for credit sales" |
| Amount < total (cash) | "Amount tendered is less than total" |

### Success State
- Green checkmark animation
- "Sale Complete! #1001"
- Cart clears automatically
- Ready for next customer in 2 seconds

### Loading Behavior
- Product search: instant (from cached data)
- Checkout: spinner on "Complete Sale" button
- Receipt generation: brief loading indicator

### Responsive Behavior
- **Desktop:** Side-by-side (products left, cart right, payment bottom)
- **Tablet:** Same layout, slightly compressed
- **Mobile:** Stacked layout; product search top, cart middle, payment bottom

---

## 4.16 Invoice Details Page

### Purpose
View a complete invoice for a specific sale.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Sales        Invoice #1001                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  🏪 SmartBiz ERP Lite                                    │   │
│  │  ─────────────────────────────────────────────────       │   │
│  │  Invoice: #1001              Date: Jul 31, 2026 10:32   │   │
│  │  Cashier: Fatima             Payment: Cash              │   │
│  │  Customer: Walk-in                                   │   │
│  │  ─────────────────────────────────────────────────       │   │
│  │                                                          │   │
│  │  Item          Qty    Unit Price    Total                │   │
│  │  ─────────────────────────────────────────────           │   │
│  │  Milk 1L       2      45 ETB        90 ETB              │   │
│  │  Bread         1      25 ETB        25 ETB              │   │
│  │  Sugar 1kg     3      85 ETB        255 ETB             │   │
│  │  ─────────────────────────────────────────────           │   │
│  │                    Subtotal:     370 ETB                │   │
│  │                    Total:        370 ETB                │   │
│  │  ─────────────────────────────────────────────────       │   │
│  │                    Paid:         400 ETB                │   │
│  │                    Change:       30 ETB                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [ 🖨 Print Invoice ]  [ 📧 Share ]  [ ↩️ Void Sale ]         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4.17 Reports Page

### Purpose
Business analytics and reporting.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Reports                                                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐  │
│  │ Sales      │  │ Debt       │  │ Products   │  │ Profit   │  │
│  │ Report     │  │ Summary    │  │ Report     │  │ Report   │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Sales Report                                            │   │
│  │                                                          │   │
│  │  Date Range: [Jul 1] to [Jul 31]         [ Apply ]      │   │
│  │                                                          │   │
│  │  Total Revenue: 750,000 ETB                              │   │
│  │  Total Transactions: 1,500                               │   │
│  │  Average Sale: 500 ETB                                   │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────┐                │   │
│  │  │  [Sales Trend Chart - Line]         │                │   │
│  │  └─────────────────────────────────────┘                │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────┐                │   │
│  │  │  [Sales by Payment Method - Pie]    │                │   │
│  │  └─────────────────────────────────────┘                │   │
│  │                                                          │   │
│  │  [ 📥 Export CSV ]  [ 📄 Export PDF ]                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Report Cards

| Report | Icon | Description |
|:-------|:-----|:------------|
| Sales Report | 📊 | Revenue, transactions, trends |
| Debt Summary | 💰 | Customer credit overview |
| Products Report | 📦 | Inventory, top sellers, slow movers |
| Profit Report | 📈 | Revenue vs. landed cost analysis |

---

## 4.18 Business Settings Page

### Purpose
Configure business-level settings.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Business Settings                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Business Information                                     │   │
│  │                                                          │   │
│  │  Business Name *                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ Alem's Mini Market                                │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  Phone Number                                            │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ +251911234567                                     │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  Address                                                 │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ Bole, Addis Ababa                                │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Currency                                                │   │
│  │                                                          │   │
│  │  Currency: ETB (Ethiopian Birr)                          │   │
│  │  Currency Symbol: Br                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│          [ Save Changes ]                                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4.19 User Profile Page

### Purpose
Manage personal profile and password.

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
│  │                                                          │   │
│  │  Email *                                                  │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ alem@example.com                                  │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
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
│  │                                                          │   │
│  │  Confirm New Password                                    │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ ••••••••                                          │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [ Save Profile ]          [ Change Password ]                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4.20 Notifications Page

### Purpose
View system notifications and alerts.

### Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Notifications                         [ Mark All as Read ]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ⚠️ Low Stock Alert                                       │   │
│  │  Bread is below minimum threshold (5/10)                 │   │
│  │  2 hours ago                                    [ View ]  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  💰 Credit Payment Received                               │   │
│  │  Abdi Ahmed paid 1,000 ETB on their credit balance       │   │
│  │  5 hours ago                                    [ View ]  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ✅ Sync Complete                                         │   │
│  │  3 offline sales have been synced successfully           │   │
│  │  Yesterday                                    [ View ]   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

# 5. Dashboard Design (Detailed)

## 5.1 Summary Cards

### Card Layout
```
┌──────────────────────────────────┐
│  💰                              │
│  25,000 ETB                      │
│  Today's Sales                   │
│  ↑ 12% vs yesterday             │
└──────────────────────────────────┘
```

### Card Components
| Element | Style | Why |
|:--------|:------|:----|
| Icon | 24px, colored background | Quick visual identification |
| Value | 24px bold, primary text | Most important number |
| Label | 14px, secondary text | Context for the value |
| Trend | 12px, colored (green/red) | Comparison to previous period |

### Card Behavior
- **Hover:** Slight elevation increase (shadow-md)
- **Click:** Navigates to relevant detailed page
- **Loading:** Skeleton placeholder with pulse animation
- **Error:** Shows last known value with "stale data" indicator

## 5.2 Charts

### Sales Trend Chart (Line)
- **X-axis:** Days of the week
- **Y-axis:** Revenue in ETB
- **Line color:** Primary blue (#2563EB)
- **Fill:** Light blue gradient below line
- **Tooltip:** Shows exact value on hover
- **Period selector:** This Week / This Month / This Year

### Top Products Chart (Horizontal Bar)
- **Y-axis:** Product names
- **X-axis:** Quantity sold
- **Bar color:** Primary blue
- **Max items shown:** 5
- **Sorting:** Descending by quantity

### Payment Method Distribution (Donut/Pie)
- **Segments:** Cash (green), Mobile Money (blue), Credit (amber)
- **Center text:** Total transactions
- **Tooltip:** Shows count and percentage

### Customer Debt Chart (Bar)
- **Y-axis:** Customer names
- **X-axis:** Amount owed in ETB
- **Bar color:** Amber (warning) or red (overdue)
- **Max items shown:** 5

## 5.3 Recent Sales List

### Layout
```
┌─────────────────────────────────────────────┐
│  Recent Sales                    View All →  │
│  ──────────────────────────────────────────  │
│  10:32  Fatima    Milk x2      90 ETB  Cash │
│  10:28  Dawit     Bread x1     25 ETB  Cash │
│  10:15  Fatima    Sugar x3    255 ETB Mobile│
│  10:02  Dawit     Rice x1     320 ETB Credit│
│  09:45  Fatima    Coffee x2   160 ETB  Cash │
└─────────────────────────────────────────────┘
```

### Components per Row
- Timestamp (relative: "10:32")
- Cashier name
- Items summary ("Milk x2")
- Total amount
- Payment method badge

## 5.4 Quick Actions

### Layout
```
┌──────────────────────────────────────────────────────────┐
│  Quick Actions                                            │
│                                                          │
│  [ + New Sale ]    [ + Add Product ]    [ + Add Customer ]│
└──────────────────────────────────────────────────────────┘
```

### Button Styling
- All primary blue
- Equal width (1/3 each)
- Icon + text label
- Touch-friendly size (44px height)

---

# 6. Form Design (Detailed)

## 6.1 Field Grouping Strategy

| Group Type | When to Use | Example |
|:-----------|:------------|:--------|
| **Card groups** | Related fields (Basic Info, Pricing) | Product form |
| **Section headers** | Visual separation between concerns | Settings pages |
| **Inline groups** | Fields that belong together (First/Last name) | Any form with name fields |
| **Stepper** | Sequential steps (Registration) | Multi-step forms |

## 6.2 Required vs Optional Fields

| Indicator | Implementation | Why |
|:----------|:---------------|:----|
| **Required** | Red asterisk (*) after label | Universal convention |
| **Optional** | "(optional)" text after label | Reduces form anxiety |
| **Never required by default** | Always explicitly mark | Prevents confusion |

## 6.3 Validation Strategy

### Real-Time Validation

| Timing | Trigger | Example |
|:-------|:--------|:--------|
| **On blur** | User leaves field | Email format check |
| **On change** | User types (debounced) | Password strength |
| **On submit** | Form submission attempt | All required fields |

### Validation Message Placement
- **Below the field** (not in a popup)
- **Red text** for errors
- **Green text** for success
- **Amber text** for warnings
- **Persistent** until fixed (not just on submit)

## 6.4 Keyboard Accessibility

| Key | Action |
|:----|:-------|
| `Tab` | Move to next field |
| `Shift + Tab` | Move to previous field |
| `Enter` | Submit form or move to next field |
| `Escape` | Cancel/close form |
| `Space` | Toggle checkbox/radio |
| `Arrow keys` | Navigate within dropdowns |

---

# 7. Table Design (Detailed)

## 7.1 Search

| Feature | Behavior |
|:--------|:---------|
| **Position** | Top-left of table |
| **Placeholder** | "Search [resource]..." |
| **Debounce** | 300ms after last keystroke |
| **Clear button** | X icon when text entered |
| **Search scope** | All visible columns + related fields |

## 7.2 Sorting

| Feature | Behavior |
|:--------|:---------|
| **Trigger** | Click column header |
| **Indicator** | Arrow up/down icon |
| **Default sort** | Recently created (newest first) |
| **Multi-sort** | Shift+click for secondary sort |
| **Visual feedback** | Active sort column highlighted |

## 7.3 Filtering

| Feature | Behavior |
|:--------|:---------|
| **Position** | Below search bar |
| **Types** | Dropdown (single select), Date range, Checkbox group |
| **Active filters** | Shown as removable chips/badges |
| **Clear all** | "Clear filters" button when any active |
| **URL sync** | Filters reflected in URL params (bookmarkable) |

## 7.4 Pagination

| Feature | Behavior |
|:--------|:---------|
| **Items per page** | 20 (default), options: 10, 20, 50, 100 |
| **Position** | Bottom-right |
| **Info text** | "Showing 1-20 of 150 products" |
| **Page navigation** | Previous / Page numbers / Next |
| **Keyboard** | Arrow keys when focused |

## 7.5 Bulk Actions

| Feature | Behavior |
|:--------|:---------|
| **Selection** | Checkbox column (first column) |
| **Select all** | Header checkbox |
| **Bulk bar** | Appears at bottom when items selected |
| **Actions** | Delete, Export, Status change |
| **Confirmation** | Required for destructive bulk actions |

## 7.6 Responsive Tables

| Breakpoint | Strategy |
|:-----------|:---------|
| **Desktop (1024px+)** | Full table, all columns visible |
| **Tablet (768-1023px)** | Table with hidden columns (controlled by column visibility) |
| **Mobile (< 768px)** | Card view; each row becomes a card |

### Mobile Card View
```
┌─────────────────────────────────────┐
│  Milk 1L                    ⚠️ Low │
│  Dairy • 45 ETB                     │
│  Stock: 5                           │
│  [ Edit ]  [ Adjust Stock ]        │
└─────────────────────────────────────┘
```

---

# 8. Component Library

## 8.1 Modal Dialog

### Layout
```
┌─────────────────────────────────────┐
│  Modal Title                 ✕     │
├─────────────────────────────────────┤
│                                     │
│  Modal content here                 │
│                                     │
├─────────────────────────────────────┤
│         [ Cancel ]  [ Confirm ]    │
└─────────────────────────────────────┘
```

### Behavior
- **Backdrop:** Semi-transparent black overlay
- **Focus trap:** Tab cycles within modal only
- **Escape:** Closes modal
- **Click outside:** Does NOT close (prevents accidental dismissal)
- **Stacking:** Only one modal at a time

## 8.2 Dropdown Menu

### Behavior
- **Position:** Below trigger element
- **Alignment:** Left-aligned (or right-aligned if near edge)
- **Max height:** 300px with scroll
- **Keyboard:** Arrow keys to navigate, Enter to select
- **Close:** Click outside, Escape, or select item

## 8.3 Toast Notification

### Layout
```
┌─────────────────────────────────────┐
│  ✅  Sale completed successfully   ✕ │
└─────────────────────────────────────┘
```

### Behavior
- **Position:** Top-right (desktop), Top-center (mobile)
- **Auto-dismiss:** 5 seconds (success), 8 seconds (info)
- **Manual dismiss:** Click X or swipe (mobile)
- **Stacking:** Newest on top, max 3 visible
- **Queue:** If more than 3, queue and show when slot opens

## 8.4 Loading States

| State | Implementation | When |
|:------|:---------------|:-----|
| **Skeleton** | Gray placeholders matching content shape | Page load, data fetch |
| **Spinner** | Centered circle animation | Button loading, small operations |
| **Progress bar** | Top of page, indeterminate | Route transitions |
| **Pulse** | Subtle opacity animation on skeletons | Data loading |

## 8.5 Error States

| State | Implementation | When |
|:------|:---------------|:-----|
| **Page error** | Illustration + message + retry button | Full page failure |
| **Inline error** | Red border + message below field | Form validation |
| **API error** | Toast notification | API call failure |
| **Network error** | Banner at top + offline indicator | No internet connection |

## 8.6 Empty States

| Type | Illustration | Message | Action |
|:-----|:-------------|:--------|:-------|
| **No data** | Folder with + | "No [items] yet" | "Add your first [item]" |
| **No results** | Magnifying glass | "No results found" | "Try different search" |
| **No filter match** | Funnel | "No items match" | "Clear filters" |
| **Coming soon** | Rocket | "Coming soon" | "Stay tuned" |
| **Error** | Broken link | "Something went wrong" | "Try again" |

---

# 9. User Journeys

## 9.1 Business Owner Journey

### Journey 1: First-Time Setup
```
Owner downloads/opens PWA
    │
    ├─► Sees welcome screen
    │
    ├─► Taps "Register"
    │
    ├─► Fills: Business name, Email, Password, Name
    │
    ├─► Account created → Redirect to Dashboard
    │
    ├─► Dashboard shows empty state with onboarding cards
    │
    ├─► Taps "Add your first category"
    │
    ├─► Creates category "Grocery"
    │
    ├─► Taps "Add your first product"
    │
    ├─► Creates product with pricing
    │
    ├─► Taps "Add a cashier"
    │
    ├─► Creates cashier account
    │
    ├─► Shares credentials with cashier
    │
    └─► Setup complete → Dashboard shows data
```

### Journey 2: Daily Monitoring
```
Owner opens app (morning)
    │
    ├─► Logs in → Dashboard
    │
    ├─► Reviews summary cards:
    │   ├── Today's sales: 25,000 ETB ↑12%
    │   ├── Products: 120
    │   ├── Customers with credit: 8
    │   └── Low stock alerts: 5
    │
    ├─► Checks sales trend chart
    │
    ├─► Reviews top selling products
    │
    ├─► Taps "Low Stock" card
    │
    ├─► Sees 5 items below threshold
    │
    ├─► Notes items to reorder
    │
    ├─► Taps "Customer Credit" card
    │
    ├─► Reviews outstanding debts
    │
    ├─► Sees Sara Mohammed owes 7,500 ETB (11 days overdue)
    │
    ├─► Taps customer → Views details
    │
    ├─► Sends WhatsApp message to Sara (outside app)
    │
    └─► Returns to dashboard → Satisfied with visibility
```

### Journey 3: Product Management
```
Owner wants to add new product
    │
    ├─► Navigates to Products page
    │
    ├─► Taps "+ Add Product"
    │
    ├─► Fills form:
    │   ├── Name: "Organic Honey"
    │   ├── Category: "Beverage"
    │   ├── Base Cost: 150 ETB
    │   ├── Overhead: 20 ETB
    │   ├── Selling Price: 250 ETB
    │   └── Min Threshold: 5
    │
    ├─► System shows:
    │   ├── Landed Cost: 170 ETB (auto-calculated)
    │   └── Profit Margin: 47% (auto-calculated)
    │
    ├─► Taps "Save Product"
    │
    ├─► Success toast: "Product saved successfully"
    │
    ├─► Redirect to products list
    │
    └─► New product appears in table
```

### Journey 4: Credit Management
```
Customer comes to pay debt
    │
    ├─► Owner navigates to Customers
    │
    ├─► Searches "Abdi Ahmed"
    │
    ├─► Taps customer → Customer Details
    │
    ├─► Sees: Credit Balance 5,000 ETB
    │
    ├─► Taps "Record Payment"
    │
    ├─► Enters: 2,000 ETB
    │
    ├─► System validates: 2,000 ≤ 5,000 ✓
    │
    ├─► Taps "Confirm"
    │
    ├─► Success toast: "Payment recorded"
    │
    ├─► Balance updates: 3,000 ETB
    │
    ├─► Transaction history shows new entry
    │
    └─► Owner gives receipt to customer
```

## 9.2 Manager Journey

### Journey 1: Morning Opening
```
Manager logs in → Dashboard
    │
    ├─► Reviews dashboard
    │
    ├─► Checks low-stock alerts
    │
    ├─► Navigates to Inventory
    │
    ├─► Sees Bread at 5 units (below threshold)
    │
    ├─► Calls supplier to reorder
    │
    ├─► Adjusts stock after delivery:
    │   ├── Product: Bread
    │   ├── Adjustment: +50
    │   ├── Reason: "Restocked from Merkato supplier"
    │   └── Confirms
    │
    ├─► Stock updates: 55 units
    │
    └─► Ready for day's operations
```

### Journey 2: Processing Credit Sale
```
Regular customer wants to buy on credit
    │
    ├─► Manager opens POS
    │
    ├─► Searches products, adds to cart
    │
    ├─► Cart total: 500 ETB
    │
    ├─► Selects "Credit" payment method
    │
    ├─► System prompts: Select Customer
    │
    ├─► Searches "Tesfaye D."
    │
    ├─► System shows: Current balance 2,500 ETB
    │
    ├─► Manager confirms credit sale
    │
    ├─► Checkout processes:
    │   ├── Sale recorded
    │   ├── Inventory decremented
    │   └── Customer balance: 2,500 + 500 = 3,000 ETB
    │
    ├─► Success: "Sale Complete"
    │
    └─► Hands items to customer
```

### Journey 3: End-of-Day Reconciliation
```
Manager reviews day's performance
    │
    ├─► Dashboard shows today's summary
    │
    ├─► Navigates to Sales History
    │
    ├─► Filters: Today, All cashiers
    │
    ├─► Reviews:
    │   ├── Total sales: 25,000 ETB
    │   ├── Cash: 15,000 ETB
    │   ├── Mobile Money: 5,000 ETB
    │   └── Credit: 5,000 ETB
    │
    ├─► Exports CSV for records
    │
    └─► Closes shop
```

## 9.3 Cashier Journey

### Journey 1: Quick Cash Sale
```
Customer: "Give me 2 milk and 1 bread"
    │
    ├─► Cashier opens POS (default screen)
    │
    ├─► Searches "milk"
    │
    ├─► Taps product → Added to cart
    │
    ├─► Adjusts quantity to 2
    │
    ├─► Searches "bread"
    │
    ├─► Taps product → Added to cart
    │
    ├─► Reviews cart:
    │   ├── Milk 1L x2 = 90 ETB
    │   ├── Bread x1 = 25 ETB
    │   └── Total = 115 ETB
    │
    ├─► Selects "Cash"
    │
    ├─► Customer gives 150 ETB
    │
    ├─► Enters 150 → Change: 35 ETB
    │
    ├─► Taps "Complete Sale"
    │
    ├─► Green checkmark: "Sale Complete!"
    │
    ├─► Cart clears
    │
    └─► Ready for next customer
```

### Journey 2: Processing Offline Sale
```
Internet goes down during rush hour
    │
    ├─► App detects offline status
    │
    ├─► Banner: "You are offline. Sales will sync when connected."
    │
    ├─► POS continues working:
    │   ├── Products from IndexedDB cache
    │   ├── Search works locally
    │   └── Cart functions normally
    │
    ├─► Sale completed → Saved locally
    │
    ├─► Multiple sales processed offline
    │
    ├─► Internet reconnects
    │
    ├─► Status: "Syncing 3 offline sales..."
    │
    ├─► Each sale sent to server
    │
    ├─► Server assigns IDs
    │
    ├─► IndexedDB updated
    │
    └─► Status: "All sales synced ✓"
```

### Journey 3: Customer Credit Sale
```
Customer: "Put it on my tab"
    │
    ├─► Cashier processes items normally
    │
    ├─► At payment: Selects "Credit"
    │
    ├─► System: "Select a customer"
    │
    ├─► Cashier searches customer name
    │
    ├─► Selects customer
    │
    ├─► System shows: Current balance 1,000 ETB
    │
    ├─► Cashier confirms
    │
    ├─► Sale completes
    │
    ├─► Customer balance: 1,000 + sale amount
    │
    └─► Cashier hands items to customer
```

### Journey 4: Registering New Customer During Sale
```
New customer: "I don't have an account"
    │
    ├─► At credit payment step
    │
    ├─► Cashier taps "New Customer"
    │
    ├─► Modal opens:
    │   ├── First name: "Mohammed"
    │   ├── Phone: "+251911111111"
    │   └── Last name: (optional)
    │
    ├─► Taps "Create"
    │
    ├─► Customer created
    │
    ├─► New customer auto-selected
    │
    └─► Credit sale proceeds
```

---

# 10. Responsive Design

## 10.1 Breakpoints

| Name | Width | Target |
|:-----|:------|:-------|
| **Mobile** | < 768px | Android phones, budget devices |
| **Tablet** | 768px - 1023px | iPads, Android tablets, landscape phones |
| **Desktop** | ≥ 1024px | Laptops, desktop monitors |
| **Large Desktop** | ≥ 1440px | Large monitors, ultrawide |

## 10.2 Component Behavior by Breakpoint

| Component | Mobile | Tablet | Desktop |
|:----------|:-------|:-------|:--------|
| **Navigation** | Bottom bar (5 items) | Bottom bar (5 items) | Sidebar (240px) |
| **Page padding** | 16px | 24px | 32px |
| **Card grid** | 1 column | 2 columns | 4 columns |
| **Table** | Card view | Reduced table | Full table |
| **Modal** | Full-screen | Centered (max 480px) | Centered (max 560px) |
| **Charts** | Full-width, tall | Full-width, medium | Half-width, side-by-side |
| **Forms** | Single column | Single column | Two-column groups |
| **POS screen** | Stacked (search → cart → payment) | Side-by-side (products | cart) | Three-column (products | cart | payment) |

## 10.3 Touch Targets

| Element | Minimum Size | Why |
|:--------|:-------------|:----|
| **Buttons** | 44px × 44px | WCAG 2.1 minimum |
| **Links** | 44px × 44px (hit area) | Prevents mis-taps |
| **Table rows** | 48px height | Easy row selection |
| **Checkboxes** | 24px × 24px | Standard checkbox size |
| **Dropdown items** | 44px height | Easy selection |
| **POS product tiles** | 80px × 80px | Quick product selection |

## 10.4 Typography Scaling

| Element | Mobile | Tablet | Desktop |
|:--------|:-------|:-------|:--------|
| **Page title** | 20px | 24px | 30px |
| **Section title** | 16px | 18px | 20px |
| **Body text** | 14px | 14px | 14px |
| **Small text** | 12px | 12px | 12px |
| **Table header** | 12px | 12px | 14px |
| **Table data** | 14px | 14px | 14px |

## 10.5 Layout Adaptations

### Desktop → Tablet
- Sidebar collapses to bottom navigation
- Two-column layouts become single column
- Charts stack vertically
- Tables reduce visible columns

### Tablet → Mobile
- Bottom navigation simplified (5 items max)
- All multi-column layouts become single column
- Tables become card views
- Modals become full-screen
- Floating action button (FAB) for primary action

---

# 11. Accessibility

## 11.1 Keyboard Navigation

| Requirement | Implementation |
|:------------|:---------------|
| **Tab order** | Logical, left-to-right, top-to-bottom |
| **Focus visible** | 2px blue outline on all interactive elements |
| **Skip link** | "Skip to main content" link at top |
| **Modal focus trap** | Tab cycles within modal only |
| **Escape** | Closes modals, dropdowns, cancels actions |
| **Enter/Space** | Activates buttons and links |
| **Arrow keys** | Navigates within menus, tables, tabs |

## 11.2 ARIA Labels

| Element | ARIA Attribute | Value |
|:--------|:---------------|:------|
| **Navigation** | `role="navigation"` | "Main navigation" |
| **Search** | `role="search"` | "Search products" |
| **Modal** | `role="dialog"`, `aria-modal="true"` | Modal title |
| **Button (icon only)** | `aria-label` | "Delete product" |
| **Status badge** | `aria-label` | "In stock" / "Low stock" |
| **Toast** | `role="alert"`, `aria-live="polite"` | Toast message |
| **Loading** | `role="status"`, `aria-busy="true"` | "Loading products" |
| **Empty state** | `role="status"` | Empty state message |

## 11.3 Color Contrast

| Element | Foreground | Background | Ratio | WCAG AA | WCAG AAA |
|:--------|:-----------|:-----------|:------|:--------|:---------|
| **Body text** | `#0A0A0A` | `#FFFFFF` | 19.3:1 | ✅ Pass | ✅ Pass |
| **Secondary text** | `#374151` | `#FFFFFF` | 10.4:1 | ✅ Pass | ✅ Pass |
| **Muted text** | `#6B7280` | `#FFFFFF` | 5.0:1 | ✅ Pass | ❌ Fail |
| **Primary button** | `#FFFFFF` | `#2563EB` | 4.6:1 | ✅ Pass | ❌ Fail |
| **Error text** | `#DC2626` | `#FFFFFF` | 4.5:1 | ✅ Pass | ❌ Fail |
| **Success badge** | `#166534` | `#DCFCE7` | 7.1:1 | ✅ Pass | ✅ Pass |

## 11.4 Screen Reader Support

| Feature | Implementation |
|:--------|:---------------|
| **Page titles** | Dynamic `<title>` tags per page |
| **Heading hierarchy** | H1 → H2 → H3 (never skip levels) |
| **Image alt text** | Descriptive alt text for all images |
| **Form labels** | Every input has an associated `<label>` |
| **Error announcements** | `aria-live="polite"` for validation errors |
| **Status updates** | `aria-live="assertive"` for critical updates |
| **Data tables** | Proper `<th>`, `<caption>`, `scope` attributes |
| **List semantics** | `<ul>`, `<ol>`, `<li>` for lists |

## 11.5 Focus States

| Element | Focus Style |
|:--------|:------------|
| **Buttons** | 2px blue outline, 2px offset |
| **Inputs** | Blue border, subtle blue glow |
| **Links** | Underline + blue color |
| **Table rows** | Light blue background |
| **Navigation items** | Blue left border + blue text |
| **Modal close button** | Standard focus ring |

---

# Appendix A: Design Tokens Summary

## Colors
```
Primary:        #2563EB (Blue 600)
Primary Dark:   #1D4ED8 (Blue 700)
Primary Light:  #DBEAFE (Blue 100)

Success:        #16A34A (Green 600)
Success BG:     #F0FDF4 (Green 50)

Warning:        #D97706 (Amber 600)
Warning BG:     #FFFBEB (Amber 50)

Error:          #DC2626 (Red 600)
Error BG:       #FEF2F2 (Red 50)

Text Primary:   #0A0A0A (Gray 950)
Text Secondary: #374151 (Gray 700)
Text Muted:     #6B7280 (Gray 500)

Border:         #D1D5DB (Gray 300)
Border Light:   #E5E7EB (Gray 200)

Background:     #FFFFFF (White)
Surface:        #F9FAFB (Gray 50)
Surface Alt:    #F3F4F6 (Gray 100)
```

## Typography
```
Font Family:    Inter, system-ui, -apple-system, sans-serif
Base Size:      14px
Line Height:    1.6

Display:        30px / 700 / 1.2
H1:             24px / 700 / 1.3
H2:             20px / 600 / 1.4
H3:             16px / 600 / 1.5
Body:           14px / 400 / 1.6
Small:          12px / 400 / 1.5
Micro:          10px / 500 / 1.4
```

## Spacing (4px base)
```
space-1:  4px      space-6:  24px
space-2:  8px      space-8:  32px
space-3:  12px     space-10: 40px
space-4:  16px     space-12: 48px
space-5:  20px     space-16: 64px
```

## Border Radius
```
radius-sm:   4px     (badges, small elements)
radius-md:   6px     (inputs, buttons, cards)
radius-lg:   8px     (modals, dropdowns)
radius-xl:   12px    (large cards, containers)
radius-full: 9999px  (avatars, pills)
```

## Shadows
```
shadow-xs: 0 1px 2px rgba(0,0,0,0.05)
shadow-sm: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)
```

## Breakpoints
```
Mobile:    < 768px
Tablet:    768px - 1023px
Desktop:   1024px - 1439px
Large:     ≥ 1440px
```
