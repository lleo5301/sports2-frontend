# Sports2 Frontend – Design System Rules for Figma Integration

> Use this document when integrating Figma designs via Model Context Protocol (MCP) or during design-to-code implementation. It documents tokens, components, patterns, and conventions used in the codebase.

---

## 1. Design Token Definitions

### 1.1 Where Tokens Are Defined

| Location | Purpose |
|----------|---------|
| `v2/src/styles/theme.css` | Primary design tokens for shadcn-based app shell (v2) |
| `src/index.css` | Legacy tokens + HeroUI bridge for `src/` app |
| `src/index.css` `@theme` blocks | Static tokens (fonts, shadows, animations, dataviz colors) |

**Note:** The codebase has two app entry points:
- **`v2/`** – Shadcn/Radix-based app (recommended for new work)
- **`src/`** – HeroUI v3-based app (legacy)

### 1.2 Token Format and Structure

#### v2 (Shadcn-style) – `v2/src/styles/theme.css`

```css
/* Semantic colors – OKLCH format for perceptual uniformity */
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  /* Chart colors */
  --chart-1 through --chart-5: oklch(...);
  /* Sidebar */
  --sidebar, --sidebar-foreground, --sidebar-primary, etc.
}

.dark { /* Same keys, dark values */ }
```

**Tailwind mapping** via `@theme inline`:

```css
@theme inline {
  --font-inter: 'Inter', 'sans-serif';
  --font-manrope: 'Manrope', 'sans-serif';
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... all semantic colors prefixed with --color- for Tailwind */
}
```

#### src/ (HeroUI) – `src/index.css`

Uses `@theme` and `@theme inline` for Tailwind v4:

```css
/* Static theme tokens */
@theme {
  --font-sans: "Inter", "system-ui", sans-serif;
  --color-brand: #3b82f6;
  --color-brand-hover: #2563eb;
  --color-status-success: #10b981;
  --color-status-warning: #f59e0b;
  --color-status-error: #ef4444;
  --color-dataviz-purple: #8251ee;
  --color-dataviz-blue: #3b82f6;
  --shadow-neu-sm, --shadow-glass, --shadow-elevated, etc.;
  --animate-fade-in, --animate-slide-up, etc.;
  --radius-2xl: 1rem; --radius-3xl: 1.5rem;
  --spacing-safe-top: env(safe-area-inset-top);
}
```

Team-specific overrides (for branding):

```css
:root {
  --team-primary-rgb: 59, 130, 246;   /* Used in rgba() for glows */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
}
```

### 1.3 Token Transformation

- **OKLCH**: Primary color format in v2 for perceptual consistency.
- **HSL**: Used in `src/` for some team/brand variables.
- **Hex**: Used in `src/` for static tokens.
- **Tailwind**: Tokens are exposed as `--color-*`, `--radius-*`, `--font-*` via `@theme inline` for use in utility classes.

---

## 2. Component Library

### 2.1 Where Components Are Defined

| Path | Contents |
|------|----------|
| `v2/src/components/ui/` | Base UI primitives (shadcn-style) |
| `v2/src/components/layout/` | App shell: sidebar, header, nav |
| `v2/src/components/data-table/` | Data tables with filters, pagination |
| `v2/src/features/*/components/` | Feature-specific components |

### 2.2 Component Architecture

**Base components** (Radix UI + class-variance-authority + Tailwind):

- **Button**: `v2/src/components/ui/button.tsx` – `cva()` for `variant` and `size`
- **Card**: `v2/src/components/ui/card.tsx` – Compound slots: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`
- **Input, Select, Checkbox, Tabs, Dialog, Sheet, Badge, Avatar, etc.**

Pattern:

```tsx
// Example: Button variant pattern
const buttonVariants = cva(baseClasses, {
  variants: {
    variant: { default, destructive, outline, secondary, ghost, link },
    size: { default, sm, lg, icon },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})
```

**Data attribute convention:**

- Components use `data-slot="*"` for styling hooks, e.g. `data-slot='card'`, `data-slot='button'`.

### 2.3 Component Documentation

- No Storybook. Components are documented inline and via usage in features.
- Use HeroUI React MCP for HeroUI component docs when working in `src/`.

---

## 3. Frameworks & Libraries

| Area | Technology |
|------|------------|
| **UI Framework** | React 19 |
| **Routing** | TanStack Router v1 (file-based, `v2/src/routes/`) |
| **State** | TanStack Query (server state), Zustand (client state) |
| **Forms** | React Hook Form + Zod + @hookform/resolvers |
| **UI Primitives (v2)** | Radix UI (Dialog, Dropdown, Select, Tabs, etc.) |
| **UI Library (src)** | HeroUI v3 beta |
| **Styling** | Tailwind CSS v4 |
| **Build** | Vite 7 |
| **Animations** | tw-animate-css, framer-motion (sparse) |

### 3.1 Tailwind v4 Configuration

- No `tailwind.config.js` – Tailwind v4 uses `@import 'tailwindcss'` and `@theme` in CSS.
- Vite plugin: `@tailwindcss/vite` in `v2/vite.config.ts`.

### 3.2 Path Alias

- `@` → `v2/src` (in v2 app)

---

## 4. Asset Management

### 4.1 Asset Locations

| Path | Purpose |
|------|---------|
| `v2/public/` | Static assets served at root (favicons, etc.) |
| `v2/public/images/` | Favicons: `favicon.svg`, `favicon_light.svg`, `favicon.png`, `favicon_light.png` |
| `v2/src/assets/` | JS/TS assets: logos, custom icons (React components) |
| `v2/src/features/*/assets/` | Feature-specific assets (e.g. sign-in screenshots) |

### 4.2 Asset Reference Patterns

```tsx
// Imported images (Vite handles hashing)
import dashboardDark from './assets/dashboard-dark.png'

// Public assets (no import, use path from root)
<img src="/images/favicon.svg" />
```

### 4.3 Asset Optimization

- Vite handles hashing and optimization for imported assets.
- No explicit CDN configuration in codebase.
- Use `public/` for assets that must keep a stable URL (e.g. favicons).

---

## 5. Icon System

### 5.1 Icon Sources

| Source | Usage |
|--------|-------|
| **lucide-react** | Primary icon library – `import { ChevronDown, Loader2 } from 'lucide-react'` |
| **@radix-ui/react-icons** | Radix primitive icons (used by Radix components) |
| **Custom TSX icons** | `v2/src/assets/custom/` and `v2/src/assets/brand-icons/` |

### 5.2 Custom Icon Naming Convention

- File: `icon-{name}.tsx` (e.g. `icon-theme-dark.tsx`, `icon-layout-compact.tsx`)
- Component: `Icon{Name}` (e.g. `IconThemeDark`)
- `data-name` on SVG: `data-name='icon-theme-dark'`

### 5.3 Icon Usage in Components

```tsx
// Lucide – named import, size via className
<ChevronDown className="size-4" />

// Sidebar: icons passed as React components
{ title: 'Overview', url: '/', icon: LayoutDashboard }
```

---

## 6. Styling Approach

### 6.1 CSS Methodology

- **Tailwind utility-first** – No CSS Modules or Styled Components.
- **`cn()` utility** – `clsx` + `tailwind-merge` for conditional classes: `cn(base, variant, className)`.
- **`@layer base`** – Base typography, scrollbar, focus styles.

### 6.2 Global Styles

- `v2/src/styles/index.css`:
  - `@import 'tailwindcss'`
  - `@import 'tw-animate-css'`
  - `@import './theme.css'`
  - `@custom-variant dark` for dark mode
  - Base layer: scrollbar, body, buttons cursor, mobile font-size
  - Custom utilities: `container`, `no-scrollbar`, `faded-bottom`
  - Collapsible animations

### 6.3 Responsive Design

- Mobile-first breakpoints: use Tailwind `sm:`, `md:`, `lg:`, etc.
- Typography: `clamp()` for fluid sizing, e.g. `clamp(2.25rem, 5vw + 1rem, 4.5rem)` for h1.
- Touch targets: `--spacing-touch: 44px` in `src/index.css`.
- `container` utility: `margin-inline: auto; padding-inline: 2rem`.

### 6.4 Dark Mode

- v2: `.dark` class on ancestor (typically `html` or root).
- `@custom-variant dark (&:is(.dark *))` for scoping.
- Theme provider: `v2/src/context/theme-provider.tsx`.

---

## 7. Project Structure

### 7.1 Overall Organization

```
sports2-frontend/
├── v2/                    # Main app (Shadcn/Radix stack)
│   ├── src/
│   │   ├── api-client/    # OpenAPI-generated client
│   │   ├── assets/        # Logos, custom icons
│   │   ├── components/    # Shared components
│   │   │   ├── ui/        # Primitive components
│   │   │   ├── layout/    # App shell
│   │   │   └── data-table/ # Table system
│   │   ├── config/        # App config (fonts, etc.)
│   │   ├── context/       # React context providers
│   │   ├── contexts/      # Auth, branding
│   │   ├── features/     # Feature modules
│   │   ├── hooks/
│   │   ├── lib/           # Utils, API helpers
│   │   ├── routes/        # TanStack Router (file-based)
│   │   ├── stores/
│   │   └── styles/
│   ├── public/
│   └── vite.config.ts
├── src/                   # Legacy HeroUI app
├── docs/
└── package.json
```

### 7.2 Feature Organization Pattern

```
features/{feature-name}/
├── components/       # Feature-specific components
├── data/             # Mock/static data (optional)
├── {feature}-page.tsx
├── {feature}-detail.tsx
└── ...
```

### 7.3 Route Organization

- `v2/src/routes/` – TanStack Router file-based routing.
- Layouts: `_authenticated/` for authenticated layout.
- Route files: `index.tsx`, `$id.tsx`, etc.

---

## 8. Figma Integration Guidelines

### 8.1 Token Mapping (Figma → Code)

| Figma Variable Type | Code Location | Format |
|--------------------|---------------|--------|
| Colors | `theme.css` `:root` / `.dark` | OKLCH preferred |
| Border radius | `--radius`, `--radius-sm`, etc. | rem or calc |
| Typography | `@theme inline` `--font-*` | font-family string |
| Spacing | Tailwind defaults + `--spacing-*` | Use Tailwind spacing scale |

### 8.2 Component Mapping

- Use `v2/src/components/ui/` primitives when they exist.
- Prefer Radix primitives for accessibility (Dialog, Select, etc.).
- Match Figma component structure to compound components (e.g. Card.Header, Card.Content).

### 8.3 Import Conventions

```tsx
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'
```

### 8.4 Branding

- Team branding: `BrandingContext` provides logo, colors.
- Use `--team-primary-rgb` for team-colored accents when in `src/`.

---

## 9. Quick Reference: Key Files

| Purpose | File |
|---------|------|
| v2 styles entry | `v2/src/styles/index.css` |
| v2 theme tokens | `v2/src/styles/theme.css` |
| Utility `cn()` | `v2/src/lib/utils.ts` |
| Path alias | `v2/vite.config.ts` → `@` → `./src` |
| Font config | `v2/src/config/fonts.ts` |
| Theme provider | `v2/src/context/theme-provider.tsx` |
| Sidebar nav data | `v2/src/components/layout/data/sidebar-data.ts` |
| Frontend spec | `docs/api/frontend-build-spec.md` |
