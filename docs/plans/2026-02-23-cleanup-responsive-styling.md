# Cleanup, Responsive & Sports Styling Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Archive legacy `src/` app, make v2 the sole codebase, improve responsive design across all breakpoints, and style components for a sports analytics platform.

**Architecture:** Three sequential phases — cleanup first (reduces confusion), then responsive improvements per-feature, then sports-platform styling layered on top. Phases 2 and 3 can overlap per-component.

**Tech Stack:** React 19, TanStack Router, Radix UI / shadcn, Tailwind v4, class-variance-authority, Recharts

---

## Phase 1: Legacy Cleanup & Archival

### Task 1: Create archive directory and move legacy src/

**Files:**
- Move: `src/` → `archive/src/`
- Move: `index.html` → `archive/index.html`
- Move: `vite.config.js` → `archive/vite.config.js`
- Move: `vitest.setup.js` → `archive/vitest.setup.js`
- Move: `design-system/` → `archive/design-system/`
- Move: `docs-site/` → `archive/docs-site/`
- Move: `Dockerfile.backup` → `archive/Dockerfile.backup`

**Step 1: Create archive directory**

```bash
mkdir -p archive
```

**Step 2: Move legacy files**

```bash
git mv src/ archive/src/
git mv index.html archive/index.html
git mv vite.config.js archive/vite.config.js
git mv vitest.setup.js archive/vitest.setup.js
git mv design-system/ archive/design-system/
git mv docs-site/ archive/docs-site/
git mv Dockerfile.backup archive/Dockerfile.backup
```

**Step 3: Move legacy documentation files**

These are legacy-only docs that reference the old `src/` app:

```bash
git mv HEROUI_MIGRATION.md archive/HEROUI_MIGRATION.md
git mv IMPLEMENTATION_PLAN.md archive/IMPLEMENTATION_PLAN.md
git mv PINES_UI_README.md archive/PINES_UI_README.md
git mv SCOUTING_REPORTS_TESTING.md archive/SCOUTING_REPORTS_TESTING.md
git mv TESTING.md archive/TESTING.md
git mv PLAYWRIGHT_TEST_REPORT.md archive/PLAYWRIGHT_TEST_REPORT.md
git mv CHANGES.md archive/CHANGES.md
git mv test-scouting-reports.sh archive/test-scouting-reports.sh
```

**Step 4: Verify v2/ still builds**

```bash
cd v2 && npm run build
```

Expected: Build succeeds (v2 has zero imports from `src/`)

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: archive legacy src/ app and supporting files"
```

---

### Task 2: Clean up root package.json

**Files:**
- Modify: `package.json`

**Step 1: Update package.json**

Remove all legacy-only dependencies and update scripts to point to v2. The cleaned version should be:

```json
{
  "name": "sports2-frontend",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "npm --prefix v2 run dev",
    "build": "npm --prefix v2 run build",
    "preview": "npm --prefix v2 run preview",
    "lint": "npm --prefix v2 run lint:fix",
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report",
    "prepare": "husky"
  },
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.2.7"
  },
  "lint-staged": {
    "v2/src/**/*.{ts,tsx}": ["prettier --write"]
  }
}
```

All runtime deps (`react`, `@heroui/react`, `react-router-dom`, `chart.js`, `framer-motion`, etc.) are removed — v2 has its own `package.json` with everything it needs.

**Step 2: Verify root scripts work**

```bash
npm run build
```

Expected: v2 builds successfully via `npm --prefix v2 run build`

**Step 3: Commit**

```bash
git add package.json
git commit -m "chore: clean root package.json, proxy scripts to v2"
```

---

### Task 3: Update CI workflow for v2

**Files:**
- Modify: `.github/workflows/ci.yml`

**Step 1: Update CI to target v2**

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '22'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: v2/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: v2

      - name: Run lint
        run: npm run lint:fix
        working-directory: v2

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: v2/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: v2

      - name: Build application
        run: npm run build
        working-directory: v2
        env:
          VITE_API_URL: ${{ vars.VITE_API_URL || 'http://localhost:5000/api' }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: v2/dist/
          retention-days: 7
```

Key changes:
- Node 22 (matches v2's Dockerfile)
- `working-directory: v2` on all npm commands
- `cache-dependency-path: v2/package-lock.json`
- Removed unit-test job (v2 has no test runner configured yet)
- Removed e2e-test job (Playwright tests target legacy app)

**Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: update CI workflow to target v2 app"
```

---

### Task 4: Update docker-compose.yml for v2

**Files:**
- Modify: `docker-compose.yml`

**Step 1: Update docker-compose for v2 dev**

```yaml
version: '3.8'
services:
  frontend:
    image: node:22-alpine
    working_dir: /app/v2
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
    environment:
      - VITE_API_URL=http://localhost:5000/api
      - VITE_PROXY_TARGET=http://localhost:5000
    volumes:
      - ./v2:/app/v2
      - /app/v2/node_modules
    ports:
      - "3000:3000"
```

**Step 2: Commit**

```bash
git add docker-compose.yml
git commit -m "chore: update docker-compose to target v2 app"
```

---

### Task 5: Update CLAUDE.md and cleanup root files

**Files:**
- Modify: `CLAUDE.md`
- Delete: `Primary_Logo_-_.5x.png` (move to v2/public if needed)
- Audit: `.eslintrc.cjs` (legacy — v2 has its own eslint config)

**Step 1: Move legacy eslint config to archive**

```bash
git mv .eslintrc.cjs archive/.eslintrc.cjs
```

**Step 2: Update CLAUDE.md**

Remove all references to `src/` as the legacy app. Update to reflect v2 as the only app. Remove the "App Structure" section that mentions both apps. Update path references.

**Step 3: Verify clean root**

After all cleanup, root should contain:
```
sports2-frontend/
├── archive/            # legacy code
├── v2/                 # primary app
├── docs/               # design rules, plans
├── tests/              # Playwright (to be updated later)
├── public/             # static assets
├── .github/            # updated CI/CD
├── .husky/             # git hooks
├── package.json        # cleaned, proxies to v2
├── docker-compose.yml  # updated for v2
├── Dockerfile          # already v2-only
├── nginx.conf          # used by Dockerfile
├── deployment.md       # deploy docs
├── CLAUDE.md           # updated
├── README.md           # project readme
└── playwright.config.js # to be updated with v2 tests
```

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: finalize root cleanup, update CLAUDE.md"
```

---

## Phase 2: Responsive Design Improvements

### Task 6: Create mobile bottom navigation component

**Files:**
- Create: `v2/src/components/layout/mobile-bottom-nav.tsx`
- Modify: `v2/src/components/layout/authenticated-layout.tsx`

**Step 1: Create MobileBottomNav component**

This is a fixed bottom bar visible only on mobile (`md:hidden`) with 4 key routes: Dashboard, Players, Games, Scouting. Uses the same icons as the sidebar.

```tsx
// v2/src/components/layout/mobile-bottom-nav.tsx
import { Link, useMatchRoute } from '@tanstack/react-router'
import { LayoutDashboard, Users, Trophy, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/players', icon: Users, label: 'Players' },
  { to: '/games', icon: Trophy, label: 'Games' },
  { to: '/scouting', icon: ClipboardList, label: 'Scouting' },
]

export function MobileBottomNav() {
  const matchRoute = useMatchRoute()

  return (
    <nav className='fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg md:hidden'>
      <div className='flex h-16 items-center justify-around px-2'>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = matchRoute({ to, fuzzy: true })
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors',
                isActive
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className='size-5' />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

**Step 2: Add to AuthenticatedLayout**

In `authenticated-layout.tsx`, add `<MobileBottomNav />` after `</SidebarInset>` but inside `<SidebarProvider>`. Also add bottom padding to `SidebarInset` on mobile so content isn't hidden behind the nav:

```tsx
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'

// Inside the return, after </SidebarInset>:
<MobileBottomNav />

// Add to SidebarInset className: 'pb-20 md:pb-0' for mobile bottom spacing
```

**Step 3: Verify visually**

Run `npm --prefix v2 run dev` and test at mobile viewport (< 768px). Bottom nav should appear. At 768px+ it should be hidden.

**Step 4: Commit**

```bash
git add v2/src/components/layout/mobile-bottom-nav.tsx v2/src/components/layout/authenticated-layout.tsx
git commit -m "feat: add mobile bottom navigation bar"
```

---

### Task 7: Create responsive data table card view for mobile

**Files:**
- Create: `v2/src/components/data-table/card-view.tsx`
- Modify: `v2/src/components/data-table/index.ts`

**Step 1: Create DataTableCardView component**

A mobile-friendly card list that renders table data as stacked cards. Each card shows the key columns as label/value pairs. This is shown on mobile instead of the horizontal table.

```tsx
// v2/src/components/data-table/card-view.tsx
import type { Table, ColumnDef } from '@tanstack/react-table'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DataTableCardViewProps<TData> {
  table: Table<TData>
  /** Column IDs to show as the card title (first row, bold) */
  titleColumnId?: string
  /** Column IDs to always show in the card */
  visibleColumnIds?: string[]
  /** Render a custom card for full control */
  renderCard?: (row: TData, index: number) => React.ReactNode
  className?: string
}

export function DataTableCardView<TData>({
  table,
  titleColumnId,
  visibleColumnIds,
  renderCard,
  className,
}: DataTableCardViewProps<TData>) {
  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <div className='py-8 text-center text-sm text-muted-foreground'>
        No results.
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {rows.map((row, i) => {
        if (renderCard) {
          return <div key={row.id}>{renderCard(row.original, i)}</div>
        }

        const cells = row.getVisibleCells().filter((cell) => {
          if (!visibleColumnIds) return true
          return visibleColumnIds.includes(cell.column.id) || cell.column.id === titleColumnId
        })

        const titleCell = titleColumnId
          ? cells.find((c) => c.column.id === titleColumnId)
          : cells[0]
        const otherCells = cells.filter((c) => c !== titleCell)

        return (
          <Card key={row.id} className='py-3'>
            <CardContent className='space-y-1.5'>
              {titleCell && (
                <div className='font-semibold'>
                  {flexRender(titleCell.column.columnDef.cell, titleCell.getContext())}
                </div>
              )}
              {otherCells.map((cell) => (
                <div key={cell.id} className='flex items-center justify-between text-sm'>
                  <span className='text-muted-foreground'>
                    {typeof cell.column.columnDef.header === 'string'
                      ? cell.column.columnDef.header
                      : cell.column.id}
                  </span>
                  <span className='font-medium'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
```

**Step 2: Export from index**

Add to `v2/src/components/data-table/index.ts`:
```ts
export { DataTableCardView } from './card-view'
```

**Step 3: Commit**

```bash
git add v2/src/components/data-table/card-view.tsx v2/src/components/data-table/index.ts
git commit -m "feat: add mobile card view for data tables"
```

---

### Task 8: Make dialogs/sheets responsive (full-screen on mobile)

**Files:**
- Modify: `v2/src/components/ui/dialog.tsx`
- Modify: `v2/src/components/ui/sheet.tsx` (if needed)

**Step 1: Read current dialog component**

Read `v2/src/components/ui/dialog.tsx` to understand current implementation.

**Step 2: Update DialogContent for mobile full-screen**

Add mobile-responsive classes to `DialogContent`: on mobile (`max-sm:`), dialogs should be full-screen with no rounded corners. On `sm:+`, use the standard centered dialog.

Update the DialogContent className to include:
```
'max-sm:top-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:h-full max-sm:w-full max-sm:max-w-none max-sm:rounded-none max-sm:border-0'
```

This makes dialogs full-screen on phones while preserving the centered modal on larger screens.

**Step 3: Test visually**

Open any dialog (e.g., settings, create player) at mobile viewport. Should be full-screen. At 640px+, standard centered dialog.

**Step 4: Commit**

```bash
git add v2/src/components/ui/dialog.tsx
git commit -m "feat: make dialogs full-screen on mobile"
```

---

### Task 9: Improve dashboard responsive layout

**Files:**
- Modify: `v2/src/features/dashboard/index.tsx`
- Modify: `v2/src/features/dashboard/sports2-dashboard.tsx`
- Review: `v2/src/features/dashboard/components/` (analytics, overview, recent-sales)

**Step 1: Read all dashboard files**

Read `index.tsx`, `sports2-dashboard.tsx`, and all files in `components/` to understand current layout.

**Step 2: Improve stat card grid**

Current: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`
This means single column on phones. That's good, but the stat cards should be more compact on mobile.

Update to: `grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4` — 2 columns on mobile with tighter gap for a more information-dense mobile view.

**Step 3: Improve chart/content area**

Current: `grid grid-cols-1 gap-4 lg:grid-cols-7`
Chart takes full width on mobile, which is correct. Ensure chart component has a minimum height and is scrollable if needed.

**Step 4: Make tabs horizontally scrollable**

Ensure the `TabsList` wrapper has `overflow-x-auto` and `flex-nowrap` so tabs don't wrap on mobile. The current `w-full overflow-x-auto` is there but verify it works well.

**Step 5: Commit**

```bash
git add v2/src/features/dashboard/
git commit -m "feat: improve dashboard responsive layout for mobile/tablet"
```

---

### Task 10: Improve player detail page responsive layout

**Files:**
- Modify: `v2/src/features/players/player-detail.tsx`

**Step 1: Read full player-detail.tsx**

Understand the current layout structure — hero section, tabs, stat tables, etc.

**Step 2: Apply responsive improvements**

- Hero/header section: Stack avatar + name + stats vertically on mobile, side-by-side on `md:+`
- Stat tabs: Use `overflow-x-auto` for tab list
- Stat tables: Use `DataTableCardView` on mobile (from Task 7) if tables are used
- Action buttons: Collapse into a dropdown menu on mobile, show inline on `md:+`
- Ensure all grid layouts use at least `grid-cols-2` on smallest screens for stat pairs

**Step 3: Commit**

```bash
git add v2/src/features/players/player-detail.tsx
git commit -m "feat: improve player detail responsive layout"
```

---

### Task 11: Improve game detail page responsive layout

**Files:**
- Modify: `v2/src/features/games/game-detail.tsx`

**Step 1: Read full game-detail.tsx**

**Step 2: Apply responsive improvements**

- Game header/score: Prominent scoreboard-style display, stacked on mobile
- Lineup/stats: Card view on mobile, table on desktop
- Box score: Horizontal scroll with sticky first column on mobile
- Action buttons: Collapse into dropdown on mobile

**Step 3: Commit**

```bash
git add v2/src/features/games/game-detail.tsx
git commit -m "feat: improve game detail responsive layout"
```

---

### Task 12: Improve scouting detail page responsive layout

**Files:**
- Modify: `v2/src/features/scouting/scouting-detail.tsx`

**Step 1: Read full scouting-detail.tsx**

**Step 2: Apply responsive improvements**

- Scouting report header: Stack on mobile
- Rating/grade displays: Compact grid on mobile
- Notes/text sections: Full width, proper text sizing
- Action buttons: Collapse into dropdown on mobile

**Step 3: Commit**

```bash
git add v2/src/features/scouting/scouting-detail.tsx
git commit -m "feat: improve scouting detail responsive layout"
```

---

### Task 13: Improve forms responsive layout

**Files:**
- Audit all `create-*-form.tsx` and `edit-*-form.tsx` across features
- Key files: `v2/src/features/players/create-player-form.tsx`, `v2/src/features/scouting/create-scouting-form.tsx`, `v2/src/features/games/create-game-form.tsx`

**Step 1: Read form files**

Read 3-4 representative form files to understand current patterns.

**Step 2: Standardize form responsive pattern**

Apply consistent pattern across all forms:
- Form fields: full-width on mobile, 2-column grid on `sm:+`, 3-column on `lg:+` where appropriate
- `className='grid gap-4 sm:grid-cols-2'` for field pairs
- Submit buttons: full-width on mobile (`w-full sm:w-auto`)
- Form containers: remove excess horizontal padding on mobile

**Step 3: Commit per feature area**

```bash
git commit -m "feat: standardize form layouts for mobile responsiveness"
```

---

### Task 14: Improve settings page responsive layout

**Files:**
- Modify: `v2/src/features/settings/index.tsx`
- Modify: `v2/src/features/settings/components/sidebar-nav.tsx`

**Step 1: Read settings files**

The settings page already has mobile patterns (select dropdown on mobile, link list on md+). Review and improve.

**Step 2: Improvements**

- Ensure settings sidebar nav works well on all breakpoints
- Settings content sections: full-width on mobile
- Account/profile forms: apply form pattern from Task 13

**Step 3: Commit**

```bash
git add v2/src/features/settings/
git commit -m "feat: improve settings responsive layout"
```

---

### Task 15: Improve list pages (players, games, scouting, etc.)

**Files:**
- Audit: `v2/src/features/players/players-list.tsx`
- Audit: `v2/src/features/games/games-list.tsx`
- Audit: `v2/src/features/scouting/scouting-list.tsx`
- Audit all other `*-list.tsx` files

**Step 1: Read list page files**

**Step 2: Apply mobile card view pattern**

For list pages that use `DataTable`:
- On mobile: use `DataTableCardView` from Task 7
- Use `useIsMobile()` hook to switch between table and card view
- Ensure toolbar (search, filters) stacks properly on mobile
- Pagination: simplified on mobile (prev/next only, no page numbers)

Pattern:
```tsx
import { useIsMobile } from '@/hooks/use-mobile'
import { DataTableCardView } from '@/components/data-table/card-view'

const isMobile = useIsMobile()

// In render:
{isMobile ? (
  <DataTableCardView table={table} titleColumnId='name' />
) : (
  <DataTable table={table} columns={columns} />
)}
```

**Step 3: Commit**

```bash
git commit -m "feat: add mobile card view to list pages"
```

---

### Task 16: Improve depth chart responsive layout

**Files:**
- Modify: `v2/src/features/depth-charts/depth-chart-detail-page.tsx`
- Modify: `v2/src/features/depth-charts/depth-chart-position-manager.tsx`
- Modify: `v2/src/features/depth-charts/depth-chart-sheet-view.tsx`
- Review: `v2/src/components/depth-chart/`

**Step 1: Read depth chart files**

**Step 2: Apply responsive improvements**

- Mobile: show list/sheet view by default (position groups stacked)
- Tablet+: show field view
- Position manager: make drag-and-drop touch-friendly
- Use `useIsMobile()` to toggle between field view and list view

**Step 3: Commit**

```bash
git commit -m "feat: improve depth chart responsive layout"
```

---

## Phase 3: Sports Platform Component Styling

### Task 17: Add sports-specific theme tokens

**Files:**
- Modify: `v2/src/styles/theme.css`

**Step 1: Add semantic color tokens**

Add to `:root` (light mode):
```css
--success: #16a34a;
--success-foreground: #ffffff;
--warning: #d97706;
--warning-foreground: #ffffff;
--highlight: #f59e0b;
--highlight-foreground: #0d1b2a;
```

Add to `.dark`:
```css
--success: #22c55e;
--success-foreground: #0d1b2a;
--warning: #f59e0b;
--warning-foreground: #0d1b2a;
--highlight: #fbbf24;
--highlight-foreground: #0d1b2a;
```

Add to `@theme inline`:
```css
--color-success: var(--success);
--color-success-foreground: var(--success-foreground);
--color-warning: var(--warning);
--color-warning-foreground: var(--warning-foreground);
--color-highlight: var(--highlight);
--color-highlight-foreground: var(--highlight-foreground);
```

**Step 2: Commit**

```bash
git add v2/src/styles/theme.css
git commit -m "feat: add sports-specific semantic color tokens"
```

---

### Task 18: Create StatCard component

**Files:**
- Create: `v2/src/components/ui/stat-card.tsx`

**Step 1: Build StatCard**

A reusable stat display card for dashboards, player profiles, and game details.

```tsx
// v2/src/components/ui/stat-card.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const statCardVariants = cva('', {
  variants: {
    size: {
      default: '',
      compact: 'py-2 sm:py-3',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  label: string
  value: string | number
  /** e.g. "+12.5%" or "-3.2%" */
  change?: string
  /** 'up' | 'down' | 'neutral' */
  trend?: 'up' | 'down' | 'neutral'
  /** Optional sublabel like "vs last season" */
  sublabel?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  trend,
  sublabel,
  icon,
  size,
  className,
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <Card className={cn(statCardVariants({ size }), className)}>
      <CardContent className='flex items-start justify-between'>
        <div className='space-y-1'>
          <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
            {label}
          </p>
          <p className='text-2xl font-bold tracking-tight sm:text-3xl'>
            {value}
          </p>
          {(change || sublabel) && (
            <div className='flex items-center gap-1.5 text-xs'>
              {change && (
                <span
                  className={cn(
                    'flex items-center gap-0.5 font-medium',
                    trend === 'up' && 'text-success',
                    trend === 'down' && 'text-destructive',
                    trend === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  <TrendIcon className='size-3' />
                  {change}
                </span>
              )}
              {sublabel && (
                <span className='text-muted-foreground'>{sublabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className='rounded-lg bg-primary/10 p-2 text-primary'>
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add v2/src/components/ui/stat-card.tsx
git commit -m "feat: add StatCard component for sports data display"
```

---

### Task 19: Create PositionBadge and StatusBadge components

**Files:**
- Create: `v2/src/components/ui/position-badge.tsx`
- Modify: `v2/src/components/ui/badge.tsx` (add variants)

**Step 1: Add new badge variants to existing Badge**

Add `success`, `warning`, and `highlight` variants to the existing badge component's `badgeVariants` cva config:

```tsx
success: 'border-transparent bg-success text-success-foreground',
warning: 'border-transparent bg-warning text-warning-foreground',
highlight: 'border-transparent bg-highlight text-highlight-foreground',
```

**Step 2: Create PositionBadge**

```tsx
// v2/src/components/ui/position-badge.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const positionColors: Record<string, string> = {
  P: 'bg-red-600 text-white',
  C: 'bg-blue-600 text-white',
  '1B': 'bg-amber-600 text-white',
  '2B': 'bg-green-600 text-white',
  SS: 'bg-purple-600 text-white',
  '3B': 'bg-orange-600 text-white',
  LF: 'bg-teal-600 text-white',
  CF: 'bg-cyan-600 text-white',
  RF: 'bg-indigo-600 text-white',
  DH: 'bg-slate-600 text-white',
  UT: 'bg-zinc-600 text-white',
}

interface PositionBadgeProps {
  position: string
  className?: string
}

export function PositionBadge({ position, className }: PositionBadgeProps) {
  const colorClass = positionColors[position] ?? 'bg-muted text-muted-foreground'
  return (
    <Badge
      className={cn(
        'rounded-md px-1.5 py-0.5 text-xs font-bold uppercase border-0',
        colorClass,
        className
      )}
    >
      {position}
    </Badge>
  )
}
```

**Step 3: Commit**

```bash
git add v2/src/components/ui/position-badge.tsx v2/src/components/ui/badge.tsx
git commit -m "feat: add PositionBadge and sports badge variants"
```

---

### Task 20: Style data tables for sports platform

**Files:**
- Modify: `v2/src/components/ui/table.tsx`
- Modify: `v2/src/components/data-table/column-header.tsx`

**Step 1: Read current table and column-header**

**Step 2: Update table styling**

Add to `TableRow`:
- Alternating row backgrounds: `even:bg-muted/30`
- Stronger hover: `hover:bg-accent/20`

Update `TableHead`:
- Uppercase small text: `text-xs font-semibold uppercase tracking-wider text-muted-foreground`

**Step 3: Update column header**

Make sort indicators more prominent. Add visual feedback on sorted columns.

**Step 4: Commit**

```bash
git add v2/src/components/ui/table.tsx v2/src/components/data-table/column-header.tsx
git commit -m "feat: style data tables for sports platform look"
```

---

### Task 21: Style cards for sports platform (gradient borders, bolder metrics)

**Files:**
- Modify: `v2/src/components/ui/card.tsx`

**Step 1: Read current card component**

**Step 2: Add sport-card variant**

Add an optional `variant` prop to Card using cva:
- `default`: current styling (unchanged)
- `sport`: adds subtle gradient left border, slightly darker background, stronger shadow

```tsx
const cardVariants = cva(
  'flex flex-col gap-4 sm:gap-6 py-4 sm:py-6 text-card-foreground shadow-sm bg-card backdrop-blur-md transition-shadow duration-200 -mx-4 sm:mx-0 rounded-none sm:rounded-xl border-y sm:border border-border hover:shadow-md',
  {
    variants: {
      variant: {
        default: '',
        sport: 'sm:border-l-4 sm:border-l-primary hover:shadow-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)
```

**Step 3: Commit**

```bash
git add v2/src/components/ui/card.tsx
git commit -m "feat: add sport variant to Card component"
```

---

### Task 22: Create WinLossBadge and streak indicators

**Files:**
- Create: `v2/src/components/ui/game-result-badge.tsx`

**Step 1: Build GameResultBadge**

```tsx
// v2/src/components/ui/game-result-badge.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type GameResult = 'W' | 'L' | 'T' | 'D'

const resultStyles: Record<GameResult, string> = {
  W: 'bg-success text-success-foreground',
  L: 'bg-destructive text-white',
  T: 'bg-warning text-warning-foreground',
  D: 'bg-warning text-warning-foreground',
}

interface GameResultBadgeProps {
  result: GameResult
  score?: string
  className?: string
}

export function GameResultBadge({ result, score, className }: GameResultBadgeProps) {
  return (
    <Badge className={cn('rounded-md border-0 font-bold', resultStyles[result], className)}>
      {result}{score ? ` ${score}` : ''}
    </Badge>
  )
}

interface StreakIndicatorProps {
  results: GameResult[]
  className?: string
}

export function StreakIndicator({ results, className }: StreakIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {results.slice(-10).map((result, i) => (
        <div
          key={i}
          className={cn(
            'size-2 rounded-full',
            result === 'W' && 'bg-success',
            result === 'L' && 'bg-destructive',
            (result === 'T' || result === 'D') && 'bg-warning'
          )}
          title={result}
        />
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add v2/src/components/ui/game-result-badge.tsx
git commit -m "feat: add GameResultBadge and StreakIndicator components"
```

---

### Task 23: Apply sports styling to dashboard

**Files:**
- Modify: `v2/src/features/dashboard/index.tsx`
- Modify: `v2/src/features/dashboard/sports2-dashboard.tsx`
- Modify: `v2/src/features/dashboard/components/` as needed

**Step 1: Read all dashboard files**

**Step 2: Replace generic stat cards with StatCard component**

Use the `StatCard` from Task 18 for all metric displays on the dashboard. Add appropriate icons, trend indicators, and change percentages.

**Step 3: Apply sport card variant where appropriate**

Use `<Card variant="sport">` for featured sections like upcoming games, team standings.

**Step 4: Commit**

```bash
git add v2/src/features/dashboard/
git commit -m "feat: apply sports platform styling to dashboard"
```

---

### Task 24: Apply sports styling to player detail

**Files:**
- Modify: `v2/src/features/players/player-detail.tsx`

**Step 1: Read full player-detail.tsx**

**Step 2: Apply sports styling**

- Use `PositionBadge` for player position display
- Use `StatCard` for key player stats (BA, ERA, HR, RBI, etc.)
- Use streak indicators if game log data is available
- Bold hero section with large player photo and key stats

**Step 3: Commit**

```bash
git add v2/src/features/players/player-detail.tsx
git commit -m "feat: apply sports platform styling to player detail"
```

---

### Task 25: Apply sports styling to game detail

**Files:**
- Modify: `v2/src/features/games/game-detail.tsx`

**Step 1: Read full game-detail.tsx**

**Step 2: Apply sports styling**

- Scoreboard-style header with large score numbers
- Use `GameResultBadge` for win/loss display
- Use `PositionBadge` in lineup displays
- Bold stat leaders section

**Step 3: Commit**

```bash
git add v2/src/features/games/game-detail.tsx
git commit -m "feat: apply sports platform styling to game detail"
```

---

### Task 26: Apply sports styling to list pages

**Files:**
- Modify: List pages across features (players-list, games-list, scouting-list, etc.)

**Step 1: Read representative list pages**

**Step 2: Apply consistent sports styling**

- Use `PositionBadge` in player tables
- Use `GameResultBadge` in game tables
- Use new badge variants (success, warning) for status indicators
- Apply sport data table styling from Task 20

**Step 3: Commit**

```bash
git commit -m "feat: apply sports platform styling to list pages"
```

---

### Task 27: Final responsive + styling review pass

**Step 1: Comprehensive visual review**

Test every major page at these viewports:
- 375px (iPhone SE / small phone)
- 430px (iPhone 15 Pro Max / large phone)
- 768px (iPad Mini / tablet portrait)
- 1024px (iPad Pro / tablet landscape)
- 1280px (desktop)
- 1536px (large desktop)

**Step 2: Fix any remaining issues**

Address overflow, text truncation, touch targets (min 44x44px), spacing inconsistencies.

**Step 3: Final commit**

```bash
git commit -m "feat: final responsive and styling polish pass"
```

---

## Execution Notes

- **Phase 1** (Tasks 1-5) must complete first — reduces confusion and dead code
- **Phase 2** (Tasks 6-16) can proceed feature-by-feature
- **Phase 3** (Tasks 17-27) can overlap with Phase 2 — style components as you make them responsive
- Tasks 17-19 (theme tokens, StatCard, badges) should be done before Tasks 23-26 (applying them)
- Task 27 is always last
