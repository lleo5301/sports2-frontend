# Sports2 Frontend – AI / Figma Integration Guide

Use this file alongside `docs/DESIGN_SYSTEM_RULES.md` when implementing Figma designs or making design-related changes.

## Quick Reference

### Design Tokens
- **Theme**: `v2/src/styles/theme.css` – semantic colors, radius, sidebar tokens
- **Styles**: `v2/src/styles/index.css` – Tailwind v4, base layer, utilities
- Use `cn()` from `@/lib/utils` for class merging

### Components
- UI primitives: `v2/src/components/ui/` (Button, Card, Input, Tabs, etc.)
- Layout: `v2/src/components/layout/` (sidebar, header, main)
- Data tables: `v2/src/components/data-table/`
- Icons: **lucide-react** (`import { IconName } from 'lucide-react'`)
- Path alias: `@` → `v2/src`

### Tech Stack
- React 19, TanStack Router, TanStack Query
- Radix UI + Tailwind v4 + class-variance-authority
- No `tailwind.config.js` – Tailwind v4 uses `@theme` in CSS

### Project Structure
```
sports2-frontend/
├── v2/                 # Primary app (Shadcn/Radix)
├── archive/            # Legacy code (preserved, not active)
├── docs/               # Design system rules, plans
├── tests/              # Playwright e2e
└── package.json        # Proxies scripts to v2
```

### Figma → Code
1. Map Figma colors to `--background`, `--primary`, `--muted`, etc. in `theme.css`
2. Use existing `v2/src/components/ui/*` when possible
3. Match compound component structure (e.g. `Card.Header`, `Card.Content`)

Full details: **`docs/DESIGN_SYSTEM_RULES.md`**
