# Responsive Design & Accessibility
## SmartBiz ERP Lite

**Version:** 1.0
**Date:** August 2026

---

## 1. Responsive Design

### 1.1 Breakpoints

| Name | Width | Target |
|:-----|:------|:-------|
| **Mobile** | < 768px | Android phones, budget devices |
| **Tablet** | 768px - 1023px | iPads, Android tablets, landscape phones |
| **Desktop** | ≥ 1024px | Laptops, desktop monitors |
| **Large Desktop** | ≥ 1440px | Large monitors, ultrawide |

### 1.2 Component Behavior by Breakpoint

| Component | Mobile | Tablet | Desktop |
|:----------|:-------|:-------|:--------|
| **Navigation** | Bottom bar (5 items) | Bottom bar (5 items) | Sidebar (240px) |
| **Page padding** | 16px | 24px | 32px |
| **Card grid** | 1 column | 2 columns | 4 columns |
| **Table** | Card view | Reduced table | Full table |
| **Modal** | Full-screen | Centered (max 480px) | Centered (max 560px) |
| **Charts** | Full-width, tall | Full-width, medium | Half-width, side-by-side |
| **Forms** | Single column | Single column | Two-column groups |
| **POS screen** | Stacked | Side-by-side | Three-column |

### 1.3 Touch Targets

| Element | Minimum Size | Why |
|:--------|:-------------|:----|
| **Buttons** | 44px × 44px | WCAG 2.1 minimum |
| **Links** | 44px × 44px (hit area) | Prevents mis-taps |
| **Table rows** | 48px height | Easy row selection |
| **Checkboxes** | 24px × 24px | Standard checkbox size |
| **Dropdown items** | 44px height | Easy selection |
| **POS product tiles** | 80px × 80px | Quick product selection |

### 1.4 Typography Scaling

| Element | Mobile | Tablet | Desktop |
|:--------|:-------|:-------|:--------|
| **Page title** | 20px | 24px | 30px |
| **Section title** | 16px | 18px | 20px |
| **Body text** | 14px | 14px | 14px |
| **Small text** | 12px | 12px | 12px |
| **Table header** | 12px | 12px | 14px |
| **Table data** | 14px | 14px | 14px |

### 1.5 Layout Adaptations

#### Desktop → Tablet
- Sidebar collapses to bottom navigation
- Two-column layouts become single column
- Charts stack vertically
- Tables reduce visible columns

#### Tablet → Mobile
- Bottom navigation simplified (5 items max)
- All multi-column layouts become single column
- Tables become card views
- Modals become full-screen
- Floating action button (FAB) for primary action

---

## 2. Accessibility

### 2.1 Keyboard Navigation

| Requirement | Implementation |
|:------------|:---------------|
| **Tab order** | Logical, left-to-right, top-to-bottom |
| **Focus visible** | 2px blue outline on all interactive elements |
| **Skip link** | "Skip to main content" link at top |
| **Modal focus trap** | Tab cycles within modal only |
| **Escape** | Closes modals, dropdowns, cancels actions |
| **Enter/Space** | Activates buttons and links |
| **Arrow keys** | Navigates within menus, tables, tabs |

### 2.2 ARIA Labels

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

### 2.3 Color Contrast

| Element | Foreground | Background | Ratio | WCAG AA | WCAG AAA |
|:--------|:-----------|:-----------|:------|:--------|:---------|
| **Body text** | `#0A0A0A` | `#FFFFFF` | 19.3:1 | ✅ Pass | ✅ Pass |
| **Secondary text** | `#374151` | `#FFFFFF` | 10.4:1 | ✅ Pass | ✅ Pass |
| **Muted text** | `#6B7280` | `#FFFFFF` | 5.0:1 | ✅ Pass | ❌ Fail |
| **Primary button** | `#FFFFFF` | `#2563EB` | 4.6:1 | ✅ Pass | ❌ Fail |
| **Error text** | `#DC2626` | `#FFFFFF` | 4.5:1 | ✅ Pass | ❌ Fail |
| **Success badge** | `#166534` | `#DCFCE7` | 7.1:1 | ✅ Pass | ✅ Pass |

### 2.4 Screen Reader Support

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

### 2.5 Focus States

| Element | Focus Style |
|:--------|:------------|
| **Buttons** | 2px blue outline, 2px offset |
| **Inputs** | Blue border, subtle blue glow |
| **Links** | Underline + blue color |
| **Table rows** | Light blue background |
| **Navigation items** | Blue left border + blue text |
| **Modal close button** | Standard focus ring |
