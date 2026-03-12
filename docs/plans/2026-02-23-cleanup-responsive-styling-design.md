# Design: Legacy Cleanup, Responsive Improvements & Sports Platform Styling

**Date:** 2026-02-23
**Status:** Approved
**Scope:** Archive legacy code, comprehensive responsive audit, sports-platform component styling

---

## Phase 1 — Legacy Cleanup & Archival

### Goal
Move all legacy `src/` code and supporting root configs into `archive/`, making `v2/` the sole active application.

### What Gets Archived
```
archive/
├── src/                    # entire legacy HeroUI/React Router app
├── index.html              # root entry point (mounts src/main.jsx)
├── vite.config.js          # legacy Vite config
├── design-system/          # legacy design system assets
└── docs-site/              # separate docs site package
```

### Root package.json Cleanup
- Remove legacy-only deps: `@heroui/react`, `react-router-dom`, `framer-motion`, `chart.js`, etc.
- Keep shared tooling: Playwright, ESLint, Prettier
- `v2/package.json` is self-contained and untouched

### Post-Archive Root Structure
```
sports2-frontend/
├── archive/               # legacy code, clearly labeled
├── v2/                    # primary app
├── docs/                  # design system rules, plans
├── tests/                 # Playwright e2e
├── scripts/               # build utilities
├── public/                # static assets
├── package.json           # cleaned (shared tooling only)
├── CLAUDE.md
├── docker-compose.yml
├── Dockerfile
└── playwright.config.js
```

### Risk Mitigation
- Zero cross-imports between `src/` and `v2/` (confirmed via grep)
- Audit Docker/CI configs for `src/` path references
- Check Playwright tests for legacy app targets

---

## Phase 2 — Responsive Design (Mobile / Tablet / Desktop)

### Breakpoint System (Tailwind defaults)
| Breakpoint | Width | Target |
|------------|-------|--------|
| Default | < 640px | Phone (portrait) |
| `sm:` | 640px+ | Phone (landscape) / small tablet |
| `md:` | 768px+ | Tablet (portrait) |
| `lg:` | 1024px+ | Tablet (landscape) / small desktop |
| `xl:` | 1280px+ | Desktop |

### Pattern Standards

#### 1. Navigation & Layout Shell
- Sidebar: collapses at `md:`, add swipe-to-open gesture, better mobile menu overlay
- Header: compact on mobile (hamburger + logo + avatar), expand search on `sm:+`
- Add mobile bottom navigation bar for key routes (Dashboard, Players, Games, Scouting)

#### 2. Data Tables
- **Mobile:** Card list view (stacked key/value pairs per row)
- **Tablet:** Horizontal scroll with sticky first column
- **Desktop:** Full table with all columns
- Leverage existing `@container` queries in codebase

#### 3. Stat Cards & Dashboards
- **Mobile:** Single column, full-width stat cards with large numbers
- **Tablet:** 2-column grid
- **Desktop:** 3-4 column grid

#### 4. Forms & Input Flows
- Full-width inputs on mobile (16px font-size already enforced)
- Stack form columns on mobile, side-by-side on `md:+`
- Dialogs: full-screen sheet on mobile, centered dialog on `sm:+`

#### 5. Detail Pages (Player, Game, Scouting)
- **Mobile:** Tabbed/accordion layout, hero stat card at top
- **Tablet+:** Sidebar info panel + main content area

#### 6. Depth Chart
- **Mobile:** List view with position groupings
- **Tablet+:** Field view with pan/zoom

---

## Phase 3 — Sports Platform Component Styling

### Theme Additions (extend Ink Black palette)
```css
/* Success/positive stats */
--success: #16a34a;
--success-foreground: #ffffff;

/* Warning/neutral stats */
--warning: #d97706;
--warning-foreground: #ffffff;

/* Highlight for star moments */
--highlight: #f59e0b;
```

### Component Patterns

#### 1. Stat Cards
- Large primary number (text-2xl to text-3xl), small label below
- Trend indicator (up/down arrow + percentage) in green/red
- Subtle gradient border on hover
- Compact variant for mobile grids

#### 2. Data Tables
- Alternating row backgrounds for scan-ability
- Bold header row with uppercase small text
- Inline sparkline charts in stat columns
- Row highlighting on hover with accent color
- Status badges with strong color coding

#### 3. Player/Game Cards
- Photo/avatar with subtle overlay gradient
- Key stats displayed prominently
- Position badge with color coding
- Hot/cold streak visual indicators

#### 4. Charts & Visualizations
- Use chart-1 through chart-5 palette
- Gradient fills under area charts
- Bold axis labels, subtle grid lines
- Interactive tooltips with stat breakdowns

#### 5. Badges & Status Indicators
- Win/Loss/Tie: green/red/amber
- Position badges (P, C, 1B, etc.) with distinct colors
- Player status (Active, IL, Minors) with clear hierarchy

#### 6. Navigation Enhancements
- Active route indicator with primary color bar
- Section headers with sport-themed icons

### Reference Templates
- [shadcn/ui dashboard](https://ui.shadcn.com/examples/dashboard)
- [shadcn-admin](https://shadcn-admin.netlify.app/)
- [Slash Admin](https://admin.slashspaces.com/)

---

## Execution Order
1. Phase 1 (Cleanup) — must complete first to reduce confusion
2. Phase 2 (Responsive) — can proceed feature-by-feature
3. Phase 3 (Styling) — can be done alongside Phase 2 per-component
