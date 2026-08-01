# Design System
## SmartBiz ERP Lite

---

## 1. Design Philosophy

| Principle | Description |
|:----------|:------------|
| **Clarity over cleverness** | Every element immediately understandable |
| **Progressive disclosure** | Show only what's needed at each step |
| **Consistency** | Same patterns everywhere |
| **Forgiveness** | Easy to undo, hard to break |
| **Speed** | Every interaction under 3 clicks |
| **Mobile-first** | Design for phone, enhance for desktop |

**Tone:** Professional, trustworthy, approachable, efficient, calm.

**Inspiration:** Stripe (clean data), Notion (typography), Linear (minimal chrome), Shopify (POS simplicity), Vercel (status indicators).

---

## 2. Colors

### Primary
| Color | Hex | Usage |
|:------|:----|:------|
| Primary Blue | `#2563EB` | Primary buttons, links, active states |
| Primary Blue Dark | `#1D4ED8` | Button hover |
| Primary Blue Light | `#DBEAFE` | Selected rows, highlights |

### Neutrals
| Color | Hex | Usage |
|:------|:----|:------|
| Gray 950 | `#0A0A0A` | Primary text |
| Gray 700 | `#374151` | Secondary text |
| Gray 500 | `#6B7280` | Placeholder, captions |
| Gray 300 | `#D1D5DB` | Borders, dividers |
| Gray 100 | `#F3F4F6` | Backgrounds, table stripes |
| Gray 50 | `#F9FAFB` | Card backgrounds |
| White | `#FFFFFF` | Page background |

### Semantic
| Color | Hex | Usage |
|:------|:----|:------|
| Green 600 | `#16A34A` | Success, profit, in-stock |
| Green 50 | `#F0DF4` | Success backgrounds |
| Red 600 | `#DC2626` | Errors, delete |
| Red 50 | `#FEF2F2` | Error backgrounds |
| Amber 600 | `#D97706` | Warnings, low stock |
| Amber 50 | `#FFFBEB` | Warning backgrounds |

**Why this palette:** High contrast (budget phones), blue primary (professional, no cultural issues in Ethiopia), green for success (universal), avoids red/green together (colorblind accessible).

---

## 3. Typography

| Level | Size | Weight | Line Height | Usage |
|:------|:-----|:-------|:------------|:------|
| Display | 30px | 700 | 1.2 | Page titles (rare) |
| H1 | 24px | 700 | 1.3 | Section headers |
| H2 | 20px | 600 | 1.4 | Sub-sections |
| H3 | 16px | 600 | 1.5 | Card titles |
| Body | 14px | 400 | 1.6 | Default text |
| Small | 12px | 400 | 1.5 | Captions |
| Micro | 10px | 500 | 1.4 | Badges |

**Font:** Inter, system-ui, -apple-system, sans-serif

---

## 4. Spacing (4px base)

| Token | Value | Usage |
|:------|:------|:------|
| space-1 | 4px | Tight (icon padding) |
| space-2 | 8px | Small (input padding) |
| space-3 | 12px | Medium-small (card padding) |
| space-4 | 16px | Default (section gaps) |
| space-5 | 20px | Medium (form field gaps) |
| space-6 | 24px | Large (section separators) |
| space-8 | 32px | Extra large (page padding) |
| space-10 | 40px | Section breaks |
| space-12 | 48px | Major page sections |

---

## 5. Border Radius

| Token | Value | Usage |
|:------|:------|:------|
| radius-sm | 4px | Badges, small elements |
| radius-md | 6px | Inputs, buttons, cards |
| radius-lg | 8px | Modals, dropdowns |
| radius-xl | 12px | Large cards |
| radius-full | 9999px | Avatars, pills |

---

## 6. Shadows

| Token | Value | Usage |
|:------|:------|:------|
| shadow-xs | `0 1px 2px rgba(0,0,0,0.05)` | Subtle borders |
| shadow-sm | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards |
| shadow-md | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Modals |
| shadow-lg | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Dialogs |

**Why subtle:** Heavy shadows lag on budget phone GPUs.

---

## 7. Icons

**Library:** Lucide Icons (open source, consistent style, comprehensive, tree-shakeable, accessible)

| Size | Pixels | Usage |
|:-----|:-------|:------|
| icon-sm | 16px | Inline with text, badges |
| icon-md | 20px | Buttons, navigation |
| icon-lg | 24px | Standalone, headers |
| icon-xl | 32px | Empty states |

**Rule:** Always pair icons with text in nav/buttons. Icons alone only for back, close, search toggle.

---

## 8. Buttons

### Variants
| Variant | Background | Text | Border | Usage |
|:--------|:-----------|:-----|:-------|:------|
| Primary | `#2563EB` | White | None | Main actions |
| Secondary | White | `#374151` | `#D1D5DB` | Cancel, Close |
| Danger | `#DC2626` | White | None | Delete, Deactivate |
| Ghost | Transparent | `#374151` | None | Tertiary, table actions |
| Link | Transparent | `#2563EB` | None | Inline actions |

### Sizes
| Size | Height | Padding | Font |
|:-----|:-------|:--------|:-----|
| sm | 32px | 8px 12px | 12px |
| md | 36px | 10px 16px | 14px |
| lg | 44px | 12px 24px | 16px |

**44px minimum touch target** — WCAG requirement.

---

## 9. Forms

### Input States
| State | Border | Background |
|:------|:-------|:-----------|
| Default | `#D1D5DB` | White |
| Focus | `#2563EB` | White |
| Error | `#DC2626` | `#FEF2F2` |
| Success | `#16A34A` | `#F0FDF4` |
| Disabled | `#E5E7EB` | `#F9FAFB` |

### Input Sizes
| Size | Height | Padding | Font |
|:-----|:-------|:--------|:-----|
| sm | 32px | 8px 12px | 12px |
| md | 36px | 10px 14px | 14px |
| lg | 44px | 12px 16px | 16px |

---

## 10. Cards

| Variant | Border | Shadow | Usage |
|:--------|:-------|:-------|:------|
| Default | `#E5E7EB` | shadow-sm | Data cards |
| Elevated | None | shadow-md | Dashboard summaries |
| Interactive | `#E5E7EB` → hover | shadow-sm → shadow-md | Clickable cards |

| Padding | Value | Usage |
|:--------|:------|:------|
| sm | 12px | Compact cards |
| md | 16px | Standard cards |
| lg | 24px | Featured cards |

---

## 11. Tables

```
┌──────────────────────────────────────────────────────────────────┐
│ 🔍 Search...                       Filter ▼    Export ▼          │
├──────────────────────────────────────────────────────────────────┤
│ ☐  Name          Category    Price     Stock    Status    Actions│
│ ☐  Milk 1L       Dairy       45 ETB    120      ✅ In Stock  ⋮  │
│ ☐  Bread         Bakery      25 ETB    5        ⚠️ Low Stock ⋮  │
├──────────────────────────────────────────────────────────────────┤
│ Showing 1-20 of 150              ‹ 1 2 3 4 5 ... 8 ›           │
└──────────────────────────────────────────────────────────────────┘
```

**Features:** Row hover (`#F9FAFB`), striped rows, checkbox column, sortable headers, sticky header, empty state with illustration + CTA.

---

## 12. Badges

| Badge | Background | Text | Usage |
|:------|:-----------|:-----|:------|
| Success | `#DCFCE7` | `#166534` | In stock, active, paid |
| Warning | `#FEF3C7` | `#92400E` | Low stock, pending |
| Danger | `#FEE2E2` | `#991B1B` | Out of stock, overdue |
| Info | `#DBEAFE` | `#1E40AF` | Credit, mobile money |
| Neutral | `#F3F4F6` | `#374151` | Default, draft |

---

## 13. Toasts

**Position:** Top-right (desktop), top-center (mobile). Newest on top, auto-dismiss 5s.

| Type | Icon | Border Left | Usage |
|:-----|:-----|:------------|:------|
| Success | ✓ | `#16A34A` | Sale completed, saved |
| Error | ✕ | `#DC2626` | API error, validation |
| Warning | ⚠ | `#D97706` | Low stock, sync conflict |
| Info | ℹ | `#2563EB` | Sync status, tips |

---

## 14. Empty States

| Type | Illustration | Message | Action |
|:-----|:-------------|:--------|:-------|
| No data | Folder + plus | "No [items] yet" | "Add your first [item]" |
| No results | Magnifying glass | "No results found" | "Try different search" |
| No filter match | Funnel | "No items match" | "Clear all filters" |
| Coming soon | Rocket | "Coming soon" | "Stay tuned" |

---

## 15. Loading & Error States

**Loading:** Skeleton placeholders, centered spinner, top progress bar, pulse animation.

**Errors:** Page error (illustration + retry), inline (red border + message), API (toast), network (banner + offline indicator).

---

## 16. Design Tokens Summary

```
Colors:     Primary #2563EB | Success #16A34A | Warning #D97706 | Error #DC2626
            Text #0A0A0A | Secondary #374151 | Muted #6B7280
            Border #D1D5DB | Background #FFFFFF | Surface #F9FAFB

Typography: Inter, 14px base, 1.6 line height
            Display 30/700 | H1 24/700 | H2 20/600 | H3 16/600 | Body 14/400

Spacing:    4px base — 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

Radius:     sm 4px | md 6px | lg 8px | xl 12px | full 9999px
```
