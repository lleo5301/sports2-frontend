# Sports2 Frontend – AI / Figma Integration Guide

Use this file alongside `docs/DESIGN_SYSTEM_RULES.md` when implementing Figma designs or making design-related changes.

## Quick Reference

### Design Tokens
- **v2 app**: `v2/src/styles/theme.css` – semantic colors (OKLCH), radius, sidebar
- **Legacy src**: `src/index.css` – `@theme` blocks, HeroUI bridge, brand colors
- Use `cn()` from `@/lib/utils` for class merging

### Components (v2 – primary app)
- UI primitives: `v2/src/components/ui/` (Button, Card, Input, Tabs, etc.)
- Layout: `v2/src/components/layout/` (sidebar, header)
- Icons: **lucide-react** (`import { IconName } from 'lucide-react'`)
- Path alias: `@` → `v2/src`

### Tech Stack (v2)
- React 19, TanStack Router, TanStack Query
- Radix UI + Tailwind v4 + class-variance-authority
- No `tailwind.config.js` – Tailwind v4 uses `@theme` in CSS

### App Structure
- **v2**: Shadcn/Radix-based (recommended)
- **src**: HeroUI v3 (legacy)

### Figma → Code
1. Map Figma colors to `--background`, `--primary`, `--muted`, etc. in `theme.css`
2. Use existing `v2/src/components/ui/*` when possible
3. Match compound component structure (e.g. `Card.Header`, `Card.Content`)

Full details: **`docs/DESIGN_SYSTEM_RULES.md`**
