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

## Design Context

### Users
Collegiate baseball coaches, scouts, and team management staff. They use the platform during recruiting seasons, practice planning, and game prep — often under time pressure and switching between mobile and desktop. The job to be done: evaluate talent accurately, track player development, and make confident roster decisions faster than the competition.

### Brand Personality
**Modern, Sharp, Elite.** The interface should feel like a premium instrument — not flashy, but unmistakably high-end. Think precision tooling, not sports entertainment. The voice is direct and confident without being aggressive.

### Aesthetic Direction
- **Visual tone:** Clean, minimal chrome, fast workflows. Information-dense without feeling cluttered.
- **References:** Linear, Notion — the calm authority of well-designed SaaS tools where every pixel earns its place.
- **Anti-references:** ESPN, Yahoo Sports, or any media-heavy sports site. No busy backgrounds, gratuitous animations, or editorial layouts. This is a *tool*, not a *broadcast*.
- **Color system:** Military/navy-inspired palette (Ink Black → Prussian Blue → Dusk Blue → Dusty Denim → Alabaster) conveys discipline and seriousness. Status colors (success green, warning amber, destructive red) are used sparingly and only for meaning.
- **Theme:** Dark and light modes, both fully supported. Dark mode is the power-user default.

### Emotional Goals
Users should feel all four of these simultaneously:
1. **Confidence & Control** — "I have everything I need to make the right call"
2. **Focus & Clarity** — "No noise, just the information that matters"
3. **Energy & Momentum** — "This tool keeps me ahead of the competition"
4. **Trust & Reliability** — "I can depend on this — it just works"

### Design Principles
1. **Density over decoration** — Show more useful information per screen. Earn every pixel with data, not chrome.
2. **Quiet until it matters** — Animations, color, and emphasis are reserved for moments of meaning (status changes, alerts, actions). The baseline is calm.
3. **Speed is a feature** — Interactions should feel instant. Prefer snappy transitions (150–300ms) over theatrical ones. Loading states are skeletal, not spinner-heavy.
4. **Consistency breeds trust** — Use the existing component library. Every new pattern is a tax on the user's mental model.
5. **Mobile is real** — Coaches check this on the field. Touch targets, responsive layouts, and offline-friendly patterns are first-class concerns.
