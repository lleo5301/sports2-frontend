# Sports2 Design Language Spec
**Date:** 2026-03-17
**Status:** Approved
**Scope:** Visual design language for sports2-frontend — covers typography, color, spacing, table patterns, and data display conventions. Reference document for all UI work going forward.

---

## 1. Direction: Editorial Density

The design synthesizes two reference archetypes:

- **B — Editorial Analytics** (FiveThirtyEight, data journalism): warm palette, generous breathing room, type as a design element
- **C — Pro Analytics Density** (LA Dodgers internal dashboards, Bloomberg-adjacent): maximum data per pixel, cool dark, color only for semantic meaning

**Name:** *Editorial Density*

**Character:** A precision coaching instrument. Calm, authoritative, information-rich without being cluttered. Closer to Linear or a well-designed reference book than to ESPN or Yahoo Sports. Every pixel earns its place with data or structure — never decoration.

### What this is not
- Not a sports broadcast (no gradients, animations, or entertainment-media energy)
- Not an analytics playground (no 3D charts, no visualization-led layouts)
- Not a generic SaaS dashboard (no identical card grids, no icon-above-every-heading patterns)

---

## 2. Competitive Research Summary

### Platforms reviewed

| Platform | Type | Key strength | Key weakness |
|----------|------|-------------|--------------|
| FanGraphs | Analytics, public | Custom sortable leaderboards | No visual identity, metrics opaque |
| Baseball Savant | Analytics, MLB | 3D pitch visualization | Desktop-only, no mobile app |
| Baseball Reference | Historical stats | Frozen-column mobile tables | Academic/dated, navigation maze |
| The Athletic | Sports media | Premium editorial brand, WCAG dark/light | Low data density, not a tool |
| Hudl | Coaching, video-first | Sideline-ready mobile, flexible layouts | Video overhead, complex onboarding |
| Synergy Sports | Analytics, pro/college | Authority through navy+red palette | Generic — same palette as every competitor |
| MaxPreps | College/HS management | Strong brand identity, card scanability | Media-focused, not coaching-tool-focused |
| PrestoSports | College athletics | Role-appropriate, university positioning | Corporate feel, less modern |

### Common patterns to avoid
- **Navy + red/orange** — 4 of 6 platforms use this exact combination. Authority without distinction.
- **Identical card grids** — uniform height/width/icon cards. Scannable but homogeneous.
- **System fonts** — Arial, Helvetica, Proxima Nova. Functional, forgettable.
- **Equal-weight data** — tables that give every stat the same visual prominence force coaches to do cognitive triage.
- **Light mode default with dark mode as afterthought** — The Athletic launched dark-first; their #1 app store request was to add light mode.

### The gap Sports2 owns
- **Opinionated hierarchy** — surface what matters right now (record, next game, streak), not every stat at equal weight
- **Tool, not broadcast** — calm authority of a well-designed SaaS tool, not sports-media energy
- **Outfit as display font** — genuinely distinctive among all competitors who rely on system fonts
- **Alabaster-based light mode** — the warm `#e0e1dd` base is more distinctive than generic white; no competitor has this
- **Dark mode as premium default** — done intentionally, not as an afterthought

---

## 3. Typography

### System

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | **Outfit** | 800 | Big numbers only: records (`14–12`), countdowns (`2d`), key stat heroes (`.341`) |
| UI | **Manrope** | 400–800 | Everything else: nav, labels, table data, descriptions, buttons |

**Why Outfit for display:** Clean geometric sans with open, round numerals. Distinctive at large sizes without being editorial-dramatic (Fraunces) or generic (Inter). Provides clear contrast with Manrope body text without needing a separate serif.

**Why Manrope for UI:** Already loaded in the project. More personality than Inter (geometric with distinctive round terminals), tighter than Lato, better weight range than Outfit for small-scale text. Every competitor uses system defaults — Manrope is a real choice.

### Scale

```
Display numbers (Outfit 800):   48–72px  Viewport-header elements: season record, page-level hero stats
Section numbers (Outfit 800):   20–40px  Card/widget-scoped numbers: countdown, player stat leaders, game score
Body strong (Manrope 700):      13–14px  Opponent names, player names, important labels
Body (Manrope 400–500):         12–13px  Table data, descriptions, secondary content
Labels — eyebrow (Manrope 700): 9–10px   Section titles, page-level context ("2025–26 Season · Program 1814")
Labels — column (Manrope 700):  9px      Table column headers inside a table element
```

**Rule for Outfit size range:** Use 48–72px when the number appears *alone* at the top of a page or section header (record, season ERA leader). Use 20–40px when the number appears *inside a widget, card, or table row* alongside other content (countdown in a strip, batting average in a player row). When in doubt: if the number is the first thing a user sees on the screen, it's display-scale. If it shares visual space with a name or label, it's section-scale.

### Label tracking

Two distinct label contexts — use the appropriate value:

| Context | `letter-spacing` | Example |
|---------|-----------------|---------|
| Section eyebrow (page/card-level title) | `0.14em` | "Previous Games", "2025–26 Season" |
| Table column header (inside `<th>`) | `0.10em` | "Opponent", "Score", "R" |

Eyebrows carry more negative space around them and benefit from wider tracking. Column headers are constrained by column width — tighter tracking prevents overflow on narrow columns.

---

## 4. Color

### Brand palette

The existing brand palette (`theme.css`) is correct and must not change. It is more distinctive than every competitor's navy+red combination.

```
Ink Black     #0d1b2a   — dark mode --background (CSS token)
Prussian Blue #1b263b   — dark mode --card (CSS token)
Dusk Blue     #415a77   — --primary in light, --secondary in dark
Dusty Denim   #778da9   — --secondary in light, --primary in dark
Alabaster     #e0e1dd   — light mode --background (CSS token)
```

### Surface token map

These are the authoritative hex values for each surface in each mode. CSS tokens listed where they already exist in `theme.css`; new tokens noted explicitly.

**Light mode:**

| Surface | Hex | CSS token |
|---------|-----|-----------|
| Page background | `#e0e1dd` | `--background` (existing) |
| Card / panel | `#f0eeea` | `--card` (override in light) |
| Section header bg | `#e4e0d8` | `--surface-section` *(add to theme.css)* |
| Table header bg | `#e8e4db` | `--surface-table-header` *(add to theme.css)* |
| Border | `rgba(0,0,0,0.07)` | `--border` (existing, verify value) |

**Dark mode:**

| Surface | Hex | CSS token |
|---------|-----|-----------|
| Page background | `#0d1b2a` | `--background` (existing Ink Black) |
| Card / panel | `#1b263b` | `--card` (existing Prussian Blue) |
| Section header bg | `#0a0c10` | `--surface-section` *(add to theme.css)* |
| Table header bg | `#0a0c10` | `--surface-table-header` *(same as section bg)* |
| Border | `rgba(255,255,255,0.05)` | `--border` (existing, verify value) |

### Semantic colors

Used only for outcome and status meaning. Never decorative.

| Token | Light | Dark | Meaning |
|-------|-------|------|---------|
| `--success` | `#16a34a` | `#22c55e` | Win, positive outcome, error-free |
| `--destructive` | `#b91c1c` | `#dc2626` | Loss, error, destructive action |
| `--warning` | `#d97706` | `#f59e0b` | Today/urgent game, caution state |

### `--primary` vs. `--muted-foreground`

Both tokens resolve to the same hex value (`#415a77` light / `#778da9` dark) by design — the brand blue-grey serves dual purpose. Differentiation is by **weight and context, not color**:

| Token | Use when | Visual treatment |
|-------|----------|-----------------|
| `--primary` | Interactive: links, buttons, countdown numbers, active states | Full opacity, often `font-weight: 700+` |
| `--muted-foreground` | Passive: dates, secondary labels, separator dots, dim text | Full opacity but `font-weight: 400–500`, smaller size |

A developer can distinguish them by asking: "Is the user expected to act on or pay attention to this?" If yes → `--primary`. If it's context that recedes → `--muted-foreground`.

### Color rules

1. **Color only for outcome meaning.** Win rows tinted green, loss rows tinted red, today's game tinted amber. `--primary` for next-game / brand emphasis. No other colored elements.
2. **`--success` and `--destructive` are reserved for game outcome and error states only.** Do not use green for "trending up" or "improved" stats — a player's ERA improving is not a win. Trend indicators use `--primary` or opacity shifts.
3. **Row tints at 8–10% opacity** — `bg-success/8`, `bg-destructive/8`. Visible at a scan, never overwhelming.
4. **Dash and separator dimming.** The dash in `14–12` uses `--muted-foreground` or `--border` — numbers pop, separator recedes.

### Inline badge border

Conference/Postseason badges use a 1px outline border. Correct CSS syntax:

```css
/* Light mode */
border: 1px solid rgba(65, 90, 119, 0.3);   /* Dusk Blue at 30% */

/* Dark mode */
border: 1px solid rgba(119, 141, 169, 0.25); /* Dusty Denim at 25% */

/* Modern CSS alternative (both modes via token) */
border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
```

---

## 5. Spacing

### Principle: deliberate rhythm, not uniform gaps

The anti-pattern is `gap-4` or `gap-6` everywhere — uniform spacing that makes everything feel like a spreadsheet. Good spacing has rhythm: tight groupings contrasted with generous separations.

### Page-level spacing

```
Page header internal padding:    28px horizontal, 28px top / 22px bottom
Between page header and content: 0px (content attaches directly, divided by 1px border)
Section header padding:          10px vertical, 28px horizontal
Table row padding:               9px vertical, 28px horizontal
Next-game strip padding:         16px vertical, 28px horizontal
Card border-radius:              14px
```

### Table density

Table rows at `9px` vertical / `28px` horizontal padding sit between tight data tables (5–6px) and card-based layouts (16px+). Looser than a spreadsheet, tighter than a media card — the table reads as a tool, not a list.

### Typography spacing

```
Eyebrow → Record:   10px margin-bottom on eyebrow
Record → Subline:   12px margin-top on subline
Subline items:      14px gap, centered dot separator (·)
```

---

## 6. Table Patterns

### Column headers (`<th>`)
- 9px Manrope 700, uppercase, `letter-spacing: 0.10em`, `color: --muted-foreground`
- Background: `--surface-table-header` (light `#e8e4db` / dark `#0a0c10`)

### Data rows
- 12px Manrope 400–600 for primary data
- Win/loss rows: background tint (`bg-success/8` or `bg-destructive/8`) — never tint alone, always pair with the result letter
- Dates and secondary data: `color: --muted-foreground`, `font-weight: 400`

### Result display (W/L)
Always two signals together for accessibility:
1. **Row background tint** (`bg-success/8` or `bg-destructive/8`) — scans at row level
2. **Result letter** (`W` / `L`) in `font-weight: 700`, `color: --success` / `color: --destructive`

The letter ensures the result is readable without relying on color perception alone.

### Score display
`color: --success` for wins, `color: --destructive` for losses, `font-weight: 600`. Encodes outcome before the Result column is read.

### Inline badges (Conf / Post)
Appear inline with opponent name, not as a separate column:
```
font-size: 8px
font-weight: 700
letter-spacing: 0.08em
text-transform: uppercase
color: --primary
border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent)
padding: 2px 5px
border-radius: 3px
margin-left: 6px
```

### Jersey number gutter (player tables)
Jersey numbers in dimmed Outfit 800, left-aligned. Use Tailwind `w-7` (`28px`) as the column width — express as a `size` prop on the TanStack Table column definition (`size: 28`). Low opacity on the number itself (e.g., `opacity-30` or `text-muted-foreground`) — identification, not emphasis.

---

## 7. Key UI Patterns

### Record / Season hero
The win-loss record is the single most important piece of information. It gets:
- Outfit 800 at 64px
- `letter-spacing: -0.02em` — tight, confident numerals
- Dash separator in `--muted-foreground` — near-invisible
- Followed by a Manrope 12px subline: streak · conference record · win pct

```
[eyebrow: "2025–26 Season · Program 1814"]  ← Manrope 700, 10px, 0.14em, uppercase
[record: 14–12]                              ← Outfit 800, 64px
[subline: W3 · Conf 8–6 · .538]             ← Manrope 500, 12px, muted-foreground
```

### Next game strip
A distinct visual zone between the season hero and the game table. Background: `--surface-section`. Contains:
- Eyebrow label "Next Game" — Manrope 700, 9px, 0.14em tracking, uppercase
- Opponent name — Manrope 700, 14px (with inline Conf badge if applicable)
- Date/time/home-away — Manrope 400, 11px, `--muted-foreground`
- Right-aligned countdown — Outfit 800, 40px, `color: --primary`; "days" / "Tomorrow" / "Today" label below in Manrope 10px muted
- Today's game: countdown uses `color: --warning` instead of `--primary`

### Batting/stat leaders (player list rows)
Three-element row layout:
- **Left:** Jersey number — Outfit 800, 18px, `color: --muted-foreground` (dim), `w-7` fixed width
- **Center:** Player name (Manrope 600, 13px) + position/year (Manrope 400, 10px, muted) stacked
- **Right:** Stat value — Outfit 800, 20px, full foreground color; stat label (e.g., `AVG`) in Manrope 700, 9px, uppercase, muted — stacked, right-aligned

### Streak indicator
`StreakIndicator` component (existing) in the card header of the Previous Games section. Displayed alongside a current-streak text badge (`W3` in `text-success`, `L2` in `text-destructive`) — Manrope 700 `text-sm`.

---

## 8. Interactive States

### Hover (table rows)
Table rows that are clickable use `cursor-pointer`. On hover, add a subtle background shift:
- Light: `hover:bg-black/[0.03]`
- Dark: `hover:bg-white/[0.03]`

Win/loss tinted rows retain their tint and add the hover overlay on top — the tint is not cancelled by hover.

### Focus rings
Use the existing `--ring` token (`#415a77` light / `#778da9` dark). All interactive elements must have a visible focus ring for keyboard navigation — do not suppress `outline` without providing an equivalent `ring`.

### Active / pressed
Buttons and clickable surfaces use a slightly stronger opacity shift on `active:` — typically `active:scale-[0.98]` for tactile feedback without a color change.

---

## 9. Loading States

Do not use spinners as the primary loading indicator for data-heavy pages. Use skeleton screens that match the layout they replace.

### Skeleton rules
- **Color:** `bg-muted` (existing token) with `animate-pulse`
- **Height:** Match the row padding spec — skeleton rows should be `36px` tall (matching 9px top + 12px text + 9px bottom + 6px border)
- **Animation:** `animate-pulse` (Tailwind's built-in fade pulse) — not shimmer, not a moving gradient bar
- **Column widths:** Vary skeleton widths within a column (e.g., `w-32`, `w-24`, `w-40` in rotation) — uniform widths look artificial

Example skeleton row:
```tsx
<div className="flex items-center gap-4 px-7 py-[9px] border-b border-border">
  <div className="h-3 w-32 rounded bg-muted animate-pulse" />
  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
  <div className="h-3 w-10 rounded bg-muted animate-pulse" />
</div>
```

---

## 10. Implementation Notes

### Adding Outfit
Outfit is not yet loaded. Add alongside the existing Manrope load:

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Or add to `v2/src/config/fonts.ts`. Then add to `theme.css` `@theme inline`:
```css
--font-outfit: 'Outfit', sans-serif;
```

Use in Tailwind as `font-['Outfit']` or via a utility class.

### New CSS tokens to add to `theme.css`
```css
/* Add to both :root and .dark blocks */
--surface-section: #e4e0d8;   /* light */
--surface-section: #0a0c10;   /* dark */
--surface-table-header: #e8e4db;  /* light */
--surface-table-header: #0a0c10;  /* dark */
```

### Existing tokens that already map correctly
- `--background` (light `#e0e1dd` / dark `#0d1b2a`) ✓
- `--card` (light `#ffffff` / dark `#1b263b`) ✓
- `--success`, `--destructive`, `--warning` ✓
- `--primary`, `--muted-foreground` ✓
- `--border` ✓

### Tailwind classes in active use
```
bg-success/8           Win row tint
bg-destructive/8       Loss row tint
bg-primary/8           Next game tint
text-success           Win result, win streak badge
text-destructive       Loss result, loss streak badge
text-warning           Today countdown
text-primary           Countdown (non-today), brand emphasis
text-muted-foreground  Dates, separators, dim secondary data
animate-pulse          Skeleton loading
```

---

## 11. Anti-Patterns (Do Not Use)

From competitive research and the `impeccable:frontend-design` skill:

- **Identical stat card grids** — 6 cards, same size, same icon, same padding. Equal weight = no hierarchy.
- **Navy + red palette** — every competitor uses it. Not us.
- **Inter as primary font** — the default of defaults. Manrope is loaded and better.
- **Colored left border on cards** — common "accent" shorthand that almost never looks intentional.
- **Glassmorphism** — blur effects, glow borders. Dated, unrelated to this brand.
- **Gradient text on numbers** — decorative, not meaningful. Outfit 800 at full opacity needs no decoration.
- **Tiny W/L badge as the only result indicator** — must pair with row tint for scan-speed reading.
- **ID columns** — internal data. Never surface to users.
- **Spinner-only loading states** — use skeleton screens (see Section 9).
- **Equal spacing everywhere** — `gap-4` on everything produces a monotonous spreadsheet feel.
- **`--success` / `--destructive` for non-outcome use** — green means won, red means lost. Do not use for trending stats, progress bars, or any non-win/loss context. Trend indicators use `--primary` or opacity.
- **Overloading semantic color as brand color** — `--primary` is brand/interactive. `--success` is outcome. These are different things.
