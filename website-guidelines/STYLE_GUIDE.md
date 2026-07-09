# Style Guide — Traqqy

## Overview

This guide documents the design system used in the Traqqy admin dashboard. The project uses shadcn/ui with the `radix-nova` style, Tailwind CSS v4, and OKLCH color tokens.

---

## Color System

### Token Architecture

Colors use OKLCH format with CSS custom properties mapped to Tailwind utilities.

**Semantic Tokens:**

| Token | Purpose |
|-------|---------|
| `--background` / `--foreground` | Page background and text |
| `--card` / `--card-foreground` | Card surfaces |
| `--popover` / `--popover-foreground` | Popovers, dropdowns |
| `--primary` / `--primary-foreground` | Primary actions, active states |
| `--secondary` / `--secondary-foreground` | Secondary actions |
| `--muted` / `--muted-foreground` | Subtle backgrounds, captions |
| `--accent` / `--accent-foreground` | Hover/focus states |
| `--destructive` | Errors, delete actions |
| `--border` | Dividers, card borders |
| `--input` | Input field borders |
| `--ring` | Focus indicators |
| `--chart-1` to `--chart-5` | Chart data series |

### Usage Patterns

- **Primary**: Buttons, links, active states, focus rings
- **Secondary**: Badges, subtle backgrounds
- **Muted**: Descriptions, disabled text, `bg-muted/50`
- **Accent**: Hover states in dropdowns, selects
- **Destructive**: Error states, delete actions, `aria-invalid:border-destructive`

---

## Typography

### Font Stack

- **Default**: Geist (`--font-geist`)
- **Mono**: Geist Mono (`--font-geist-mono`)
- 18 fonts available via `data-font` attribute switching

### Type Scale

| Size | Usage |
|------|-------|
| `text-xs` (12px) | Badges, labels, small annotations |
| `text-sm` (14px) | Base content, descriptions, body text |
| `text-base` (16px) | Titles, headings |
| `text-3xl` (30px) | Large metrics/KPIs |

### Font Weights

- `font-medium` — Card titles, labels, metric values
- `font-normal` — Body text, descriptions

### Heading Pattern

```tsx
<h2 className="font-heading text-base leading-snug font-medium">
```

---

## Spacing & Layout

### Dashboard Shell

- **Sidebar width**: `272px` expanded, `48px` icon-only, `288px` mobile
- **Header height**: `48px` (`h-12`)
- **Content padding**: `p-4` mobile, `md:p-6` desktop
- **Max width**: `max-w-screen-2xl` (centered mode)

### Spacing Tokens

- Card internal: `16px` (default), `12px` (compact)
- Gap between cards: `gap-4` (16px) or `gap-6` (24px)
- Component gaps: `gap-1` to `gap-4`

### Grid Patterns

```tsx
{/* KPI strip */}
<div className="grid grid-cols-1 xl:grid-cols-12">

{/* Metric cards */}
<div className="grid grid-cols-1 gap-4 xl:grid-cols-4">

{/* Card grid */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
```

### Responsive Breakpoints

- Mobile: `< 768px`
- Desktop: `>= 768px` (`md:`)
- Large: `>= 1024px` (`lg:`)

---

## Radius System

Base radius: `0.625rem`

```
--radius-sm: calc(var(--radius) - 4px)
--radius-md: calc(var(--radius) - 2px)
--radius-lg: var(--radius)
--radius-xl: calc(var(--radius) + 4px)
--radius-2xl: calc(var(--radius) + 8px)
```

---

## Components

### Core Utilities

- `cn()` — Merges class names with `clsx` + `tailwind-merge`
- All components use `data-slot="component-name"` attributes

### Button Variants

| Variant | Use Case |
|---------|----------|
| `default` | Primary actions |
| `outline` | Secondary actions |
| `ghost` | Tertiary, icon-only |
| `destructive` | Delete/danger actions |
| `link` | Inline text links |

Sizes: `xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`

### Card

- Border: `ring-1 ring-foreground/10`
- Uses `--card-spacing` for internal padding
- Sub-components: `CardHeader`, `CardContent`, `CardFooter`, `CardAction`

### Badge

- Height: `h-5`, pill shape (`rounded-4xl`)
- Text: `text-xs font-medium`
- Variants: `default`, `secondary`, `destructive`, `outline`, `ghost`

### Input/Textarea

- Height: `h-8`
- Mobile: `text-base`, Desktop: `md:text-sm`
- Focus: `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`
- Dark: `dark:bg-input/30`

### Tabs

- Variants: `default` (pill), `line` (underline)
- Supports horizontal/vertical orientation

---

## Focus States

Consistent across all interactive elements:

```tsx
className="focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
```

---

## Animations

- Transitions: `transition-colors duration-100` or `duration-200`
- Enter/exit: `data-open:animate-in data-closed:animate-out` with `fade-in-0`, `zoom-in-95`
- Loading: `animate-pulse` (skeletons), `animate-spin` (spinners)

---

## Dark Mode

- Class-based: `.dark` on `<html>`
- Custom variant: `@custom-variant dark (&:is(.dark *))`
- Each theme preset defines light + dark variants

---

## Theme Presets

Four presets available, activated via `data-theme-preset` attribute:

| Preset | Style |
|--------|-------|
| `default` | Neutral, `0.625rem` radius |
| `brutalist` | Zero radius, high contrast, hard shadows |
| `soft-pop` | `1rem` radius, purple/cyan palette |
| `tangerine` | Warm orange primary, blue-tinted backgrounds |

---

## Shadows

Each preset defines `--shadow-2xs` through `--shadow-2xl` tokens. Non-default presets override Tailwind shadow utilities:

```css
[data-theme-preset]:not([data-theme-preset="default"]) .shadow-sm {
  box-shadow: var(--shadow-sm);
}
```

---

## Code Style (Biome)

- Indentation: 2 spaces
- Quotes: Double quotes
- Semicolons: Always
- Line width: 120 characters
- Trailing commas: All
- Import sorting: Enabled
- Tailwind class sorting: Enabled
