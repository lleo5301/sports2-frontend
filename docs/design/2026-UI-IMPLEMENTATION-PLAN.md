# 2026 UI Implementation Plan — v2

> Implements 2026 design trends: bento grids, FinTech aesthetic, and action-oriented dashboards. Includes Figma resources for reference and a phased implementation plan.

---

## 1. Figma Resources (Free)

Use these for reference or to extract specific layouts. All are Figma Community files (free, editable).

### Bento Grids & Modular Layouts

| Resource | Figma URL | Best For |
|----------|-----------|----------|
| **FREE Bento Grids** | [figma.com/community/file/1467631407997023860](https://www.figma.com/community/file/1467631407997023860/free-bento-grids) | Generic bento components |
| **Bento UI - Free UI Kit** | [figma.com/community/file/1313494656162033519](https://www.figma.com/community/file/1313494656162033519/bento-ui-free-ui-kit-recreated) | Full UI kit with bento patterns |

### SaaS Dashboards

| Resource | Figma URL | Best For |
|----------|-----------|----------|
| **Free SaaS Dashboard UI Kit** | [figma.com/community/file/1372878651733400539](https://www.figma.com/community/file/1372878651733400539/free-saas-dashboard-ui-kit) | Dashboard layout, stat cards |
| **SaaS Dashboard** | [figma.com/community/file/1065510379888107603](https://www.figma.com/community/file/1065510379888107603/saas-dashboard) | Overall dashboard structure |
| **Free SaaS Dashboard Components** | [figma.com/community/file/1393411194570391859](https://www.figma.com/community/file/1393411194570391859/free-saas-dashboard-components) | Reusable dashboard components |
| **Dashboard Templates (collection)** | [figma.com/community/website-templates/dashboards](https://www.figma.com/community/website-templates/dashboards) | Browse multiple options |

### Shadcn-Style (Matches v2 Stack)

| Resource | Figma URL | Best For |
|----------|-----------|----------|
| **Shadcn Space Figma UI Kit** | [figma.com/design/eekOml2lxi2RYoSpX6kL7v](https://www.figma.com/design/eekOml2lxi2RYoSpX6kL7v) (Community) | Card variants, statistics, analytics |

---

## 2. Implementation Approach

Two paths:

1. **From Figma** — Duplicate a Figma file, adapt to Sports2 data, implement in code.
2. **From research** — Apply 2026 patterns (bento grid, FinTech aesthetic) directly without Figma.

Recommendation: **Hybrid**. Use Figma for layout inspiration; implement in code with existing v2 components and tokens.

---

## 3. Phased Implementation

### Phase 1: Sports2 Dashboard (Overview) — Bento Grid + FinTech

**Target:** `v2/src/features/dashboard/sports2-dashboard.tsx`

**Current layout:** Uniform grid of 6 stat cards + 2 game lists + quick actions.

**2026 layout (bento):**

```
┌─────────────────┬──────────┬──────────┐
│ North Star       │ Stat     │ Stat     │  ← Record (W-L) largest; Players, Prospects secondary
│ RECORD W-L       │ Players  │ Prospects│
├─────────────────┼──────────┴──────────┤
│ Recent Games     │ Upcoming Games       │  ← Equal height, side-by-side
│ (5 items)        │ (5 items)           │
├─────────────────┼─────────────────────┤
│ Quick Actions (4 buttons, full width)   │
└─────────────────┴─────────────────────┘
```

**Changes:**
- Bento grid via CSS Grid with `grid-column` / `grid-row` spans.
- Record card: larger (span 2 rows or 2 cols) = North Star metric.
- FinTech: 1px borders, high-contrast typography, subtle `backdrop-blur` on cards.
- Uniform gutters: 12px mobile, 16px tablet, 24px desktop.

**Files to touch:**
- `v2/src/features/dashboard/sports2-dashboard.tsx`
- Optional: `v2/src/styles/theme.css` (add `--bento-gap` if desired)

---

### Phase 2: Coach Dashboard — Bento + Stat Density

**Target:** `v2/src/features/coach-dashboard/coach-dashboard-page.tsx`

**Current:** Vertical stack of cards (Record, Team stats, Leaders, Recent games).

**2026 layout (bento):**

```
┌────────────┬────────────────────────────┐
│ RECORD     │ Team Batting (compact)     │
│ W-L        ├────────────────────────────┤
│ (large)    │ Team Pitching              │
├────────────┼────────────────────────────┤
│ Leaders    │ Leaders (continued)         │
│ (2 cols)   │                             │
├────────────┴────────────────────────────┤
│ Recent Games (full width, denser list)   │
└────────────────────────────────────────┘
```

**Changes:**
- Record = North Star (top-left, prominent).
- Team stats in compact grid cells.
- Leaders as small bento cells.
- Recent games: denser rows, 1px dividers.

---

### Phase 3: FinTech Aesthetic (Theme)

**Target:** `v2/src/styles/theme.css`, `Card` component.

**Changes:**
- Card: `border` 1px (or `border-[1px]`), `backdrop-blur-sm` optional.
- Ensure high-contrast text (foreground/muted).
- Consider Geist Mono for stats/numbers (if licensed).
- Reduce border-radius on some elements for sharper look (optional).

---

### Phase 4: Micro-interactions

**Target:** Buttons, cards, links.

**Changes:**
- Card hover: subtle `transition-all duration-200`, `hover:shadow-md`, `hover:border-primary/30`.
- Button: existing CVA variants; ensure active/press feedback.
- Loading: replace generic spinner with branded skeleton or subtle pulse.

---

## 4. Bento Grid CSS Pattern

```css
/* v2/src/styles/index.css or theme.css */
.bento-grid {
  display: grid;
  gap: var(--bento-gap, 1rem);
  grid-template-columns: repeat(12, 1fr);
}

@media (min-width: 768px) {
  .bento-grid { gap: 1.5rem; }
}

@media (min-width: 1280px) {
  .bento-grid { gap: 1.5rem; }
}

/* Utility classes for spans */
.bento-span-4 { grid-column: span 4; }
.bento-span-6 { grid-column: span 6; }
.bento-span-8 { grid-column: span 8; }
.bento-span-12 { grid-column: span 12; }
```

Or use Tailwind:

```tsx
<div className="grid grid-cols-12 gap-4 md:gap-6">
  <div className="col-span-12 md:col-span-6 lg:col-span-4">...</div>
  <div className="col-span-12 md:col-span-6 lg:col-span-8">...</div>
</div>
```

---

## 5. Suggested Start

**Quick win:** Phase 1 — refactor `Sports2Dashboard` into a bento layout.

1. Open [Free SaaS Dashboard UI Kit](https://www.figma.com/community/file/1372878651733400539/free-saas-dashboard-ui-kit) or [Bento UI Kit](https://www.figma.com/community/file/1313494656162033519/bento-ui-free-ui-kit-recreated) in Figma.
2. Identify the stat-card + list layout you like.
3. Apply equivalent grid structure and card spans in `sports2-dashboard.tsx`.
4. Add `border` (1px) and optional `backdrop-blur-sm` to `Card` or dashboard cards.

---

## 6. Checklist Before Implementation

- [ ] Confirm which dashboard to start with (Sports2 Overview vs Coach).
- [ ] Decide: implement from Figma design or from this plan.
- [ ] If Figma: get screenshot or node URL for specific frame to replicate.
- [ ] Ensure `tw-animate-css` is used for any new animations.
