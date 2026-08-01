# Design System
## SmartBiz ERP Lite

**Version:** 1.0
**Date:** August 2026

---

## 1. Design Philosophy

### Core Principles

| Principle | Description | Why It Matters |
|:----------|:------------|:---------------|
| **Clarity over cleverness** | Every element must be immediately understandable | Target users have limited tech literacy; confusion = abandonment |
| **Progressive disclosure** | Show only what's needed at each step | Reduces cognitive load for non-technical users |
| **Consistency** | Same patterns everywhere | Users learn once, apply everywhere |
| **Forgiveness** | Easy to undo, hard to break | Reduces anxiety about making mistakes |
| **Speed** | Every interaction under 3 clicks | Shop owners are time-poor; speed = adoption |
| **Mobile-first** | Design for phone, enhance for desktop | 70% of Ethiopian users are on Android phones |

### Design Inspiration (Not Copying)

| Product | What We Take | What We Don't Take |
|:--------|:-------------|:-------------------|
| **Stripe Dashboard** | Clean data presentation, summary cards, professional feel | Complex developer-oriented layout |
| **Notion** | Clean typography, generous whitespace, block-based layout | Extensive customization complexity |
| **Linear** | Minimal chrome, fast interactions, keyboard shortcuts | Developer-focused workflows |
| **Shopify Admin** | E-commerce patterns, product management, POS simplicity | Full e-commerce complexity |
| **Vercel Dashboard** | Status indicators, real-time updates, modern aesthetic | Technical deployment focus |

### Design Tone

- **Professional** — Not playful or toy-like; this handles real money
- **Trustworthy** — Clean, organized; users trust it with their business data
- **Approachable** — Not intimidating; feels like a well-designed calculator
- **Efficient** — Every pixel serves a purpose; no decorative elements
- **Calm** — Not busy or overwhelming; reduces stress in fast-paced retail

---

## 2. Color Palette

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

---

## 3. Typography

### Font Family

| Usage | Font | Why |
|:------|:-----|:----|
| **Primary** | `Inter` | Designed for screens; excellent readability at all sizes; supports Latin and Ethiopic scripts |
| **Fallback** | `system-ui, -apple-system, sans-serif` | Fast loading; native feel on each device |

### Font Scale

| Level | Size | Weight | Line Height | Usage |
|:------|:-----|:-------|:------------|:------|
| **Display** | 30px | 700 | 1.2 | Page titles (rare) |
| **H1** | 24px | 700 | 1.3 | Section headers |
| **H2** | 20px | 600 | 1.4 | Sub-sections |
| **H3** | 16px | 600 | 1.5 | Card titles, labels |
| **Body** | 14px | 400 | 1.6 | Default text |
| **Small** | 12px | 400 | 1.5 | Captions, timestamps |
| **Micro** | 10px | 500 | 1.4 | Badges, tags |

### Why This Scale

- **14px base** — Optimal for mobile readability without zooming
- **60% weight variation** — Clear hierarchy without multiple font families
- **Consistent line heights** — Prevents text feeling cramped on small screens
- **Inter font** — Free, open-source, excellent for both English and Amharic characters when Amharic support is added

---

## 4. Spacing System

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

---

## 5. Border Radius

| Token | Value | Usage | Why |
|:------|:------|:------|:----|
| `radius-none` | 0px | — | — |
| `radius-sm` | 4px | Badges, small elements | Subtle rounding, not distracting |
| `radius-md` | 6px | Inputs, buttons, cards | Standard UI element rounding |
| `radius-lg` | 8px | Modals, dropdowns | Slightly softer for overlay elements |
| `radius-xl` | 12px | Large cards, containers | Comfortable, modern feel |
| `radius-full` | 9999px | Avatars, pills | Perfect circle for profile images |

---

## 6. Shadows

| Token | Value | Usage |
|:------|:------|:------|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle borders, input focus |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards, dropdowns |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Modals, popovers |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Dialogs, side panels |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Full-screen overlays |

### Why Subtle Shadows

- **Budget phones** — Heavy shadows cause rendering lag on low-end GPUs
- **Professional feel** — Subtle shadows feel more refined
- **Clear hierarchy** — Shadows indicate elevation levels without overwhelming content

---

## 7. Icons

### Icon Library: Lucide Icons

| Reason | Explanation |
|:-------|:------------|
| **Open source** | No licensing issues for SaaS |
| **Consistent style** | Same stroke width, same grid, same optical sizing |
| **Comprehensive** | Covers all ERP use cases |
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

---

## 8. Button Styles

### Button Variants

| Variant | Background | Text | Border | Usage |
|:--------|:-----------|:-----|:-------|:------|
| **Primary** | `#2563EB` | White | None | Main actions (Save, Submit, Complete Sale) |
| **Secondary** | White | `#374151` | `#D1D5DB` | Secondary actions (Cancel, Close) |
| **Danger** | `#DC2626` | White | None | Destructive actions (Delete, Deactivate) |
| **Ghost** | Transparent | `#374151` | None | Tertiary actions, table row actions |
| **Link** | Transparent | `#2563EB` | None | Inline actions ("View details", "Edit") |

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

---

## 9. Form Styles

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

---

## 10. Card Styles

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

---

## 11. Table Design

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

---

## 12. Badge Styles

| Badge | Background | Text | Usage |
|:------|:-----------|:-----|:------|
| **Success** | `#DCFCE7` | `#166534` | In stock, active, paid |
| **Warning** | `#FEF3C7` | `#92400E` | Low stock, pending |
| **Danger** | `#FEE2E2` | `#991B1B` | Out of stock, overdue, inactive |
| **Info** | `#DBEAFE` | `#1E40AF` | Credit, mobile money |
| **Neutral** | `#F3F4F6` | `#374151` | Default, draft |

---

## 13. Toast Notifications

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

---

## 14. Empty States

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

## 15. Loading States

| State | Implementation | When |
|:------|:---------------|:-----|
| **Skeleton** | Gray placeholders matching content shape | Page load, data fetch |
| **Spinner** | Centered circle animation | Button loading, small operations |
| **Progress bar** | Top of page, indeterminate | Route transitions |
| **Pulse** | Subtle opacity animation on skeletons | Data loading |

---

## 16. Error States

| State | Implementation | When |
|:------|:---------------|:-----|
| **Page error** | Illustration + message + retry button | Full page failure |
| **Inline error** | Red border + message below field | Form validation |
| **API error** | Toast notification | API call failure |
| **Network error** | Banner at top + offline indicator | No internet connection |

---

## 17. Design Tokens Summary

### Colors
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

### Typography
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

### Spacing (4px base)
```
space-1:  4px      space-6:  24px
space-2:  8px      space-8:  32px
space-3:  12px     space-10: 40px
space-4:  16px     space-12: 48px
space-5:  20px     space-16: 64px
```

### Border Radius
```
radius-sm:   4px     (badges, small elements)
radius-md:   6px     (inputs, buttons, cards)
radius-lg:   8px     (modals, dropdowns)
radius-xl:   12px    (large cards, containers)
radius-full: 9999px  (avatars, pills)
```

### Shadows
```
shadow-xs: 0 1px 2px rgba(0,0,0,0.05)
shadow-sm: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)
```
