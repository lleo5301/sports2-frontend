# Scouting Tool Grades — Player Profile Design Spec

**Date:** 2026-03-12
**Status:** Draft
**Scope:** Expand the scouting report data model to support full pro-style tool grades, and display them on the player profile page.

---

## 1. Problem

The current scouting report stores 7 generic tool grades (Overall, Hitting, Power, Fielding, Arm, Speed, Pitching) with present/future values. Professional scouting reports require granular tool-by-tool grading with descriptions, body/athleticism assessments, report metadata (role, round, dollar amount), and narrative summaries. The player detail page has no scouting data at all — only stats, splits, game log, and videos.

## 2. Goals

1. Expand the scouting report data model to match professional scouting workflows (see Section 4 for backend requirements).
2. Add a "Scouting" tab to the player detail page showing all linked reports with full tool grades.
3. Update the scouting report create/edit forms to capture the expanded fields.
4. Maintain backward compatibility — existing reports with the 7 generic grades still render.

## 3. Non-Goals

- Pitching-specific tool grades (fastball, slider, curveball, changeup, command, control, delivery) are documented in the backend requirements but will be implemented in a follow-up phase. Phase 1 focuses on position player (hitter) tools.
- Aggregate/composite grade calculations across multiple reports.
- Comparison views between multiple scouts' reports on the same player.
- Report deletion (not yet in API; can be added later if needed).

## 3.1 Key Clarifications

**Two-way players:** A single report has `report_type` of `'hitter'` or `'pitcher'`, not both. For a two-way player, scouts create two separate reports — one as a hitter, one as a pitcher. The JSONB `tool_grades` technically allows both `bat` and `pitching` keys to coexist, but the form UI presents Hitter/Pitcher as mutually exclusive tabs and only shows the relevant tool sections. The player profile scouting tab displays all reports regardless of type.

**`notes` vs `summary`:** Both fields coexist. `notes` is the existing free-form field (short observations). `summary` is the new full narrative scouting summary (longer, structured prose like in the reference screenshots). The frontend displays `summary` prominently if present, with `notes` shown separately as "Scout Notes" if also populated.

**`report_date` vs `date_seen_start`/`date_seen_end`:** `report_date` is when the report was written/filed. `date_seen_start` and `date_seen_end` are when the player was actually observed. Both are stored; the frontend displays "Date Seen" from the `date_seen_*` fields and shows `report_date` in the metadata footer.

**Report sort order:** Reports on the player scouting tab are sorted by `report_date DESC` (most recently filed first). If `report_date` is identical, `created_at DESC` breaks the tie.

**Legacy `sixty_yard_dash`:** Mapped into the run section on display. The frontend reads `tool_grades.run.speed.grade` first; if absent, falls back to displaying `sixty_yard_dash` from the flat column.

**Scouting tab in embedded mode:** The Scouting tab appears in embedded (sheet) mode. Report cards are collapsed by default in embedded mode to manage space.

**Allowed enum values:**
- `report_confidence`: `'High'`, `'Medium'`, `'Low'`
- `body.projection`: `'Positive Projection'`, `'Neutral Projection'`, `'Negative Projection'`
- `bat.contact`, `bat.swing_decisions`, `bat.contact_quality`: `'Well Below Average'`, `'Below Average'`, `'Average'`, `'Above Average'`, `'Well Above Average'`
- `field.current_position` and position codes: standard baseball abbreviations (`P`, `C`, `1B`, `2B`, `3B`, `SS`, `LF`, `CF`, `RF`, `OF`, `DH`, `COF`)
- Grade integer values: 20-80 in increments of 5 (20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80)

---

## 4. Backend Requirements (for backend engineer)

### 4.1 Data Model Changes

The scouting report model needs ~50 new fields. Recommended approach: **JSONB column for tool grades**, flat columns for queryable metadata.

#### 4.1.1 New Flat Columns on `scouting_reports` Table

These are queryable metadata fields that belong as real columns:

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| `report_type` | `VARCHAR(10)` | YES | `'hitter'` or `'pitcher'`. NULL = legacy report |
| `role` | `INTEGER` | YES | 1-5 scale |
| `round_would_take` | `VARCHAR(20)` | YES | e.g. "1st", "5th-7th", "Late 2nd" |
| `money_save` | `BOOLEAN` | YES | Default NULL |
| `overpay` | `BOOLEAN` | YES | Default NULL |
| `dollar_amount` | `VARCHAR(20)` | YES | e.g. "400k", "1.2M" |
| `report_confidence` | `VARCHAR(20)` | YES | e.g. "High", "Medium", "Low" |
| `impact_statement` | `TEXT` | YES | One-line impact summary |
| `summary` | `TEXT` | YES | Full narrative scouting summary |
| `look_recommendation` | `INTEGER` | YES | 20-80 grade |
| `look_recommendation_desc` | `TEXT` | YES | |
| `player_comparison` | `VARCHAR(100)` | YES | e.g. "Trea Turner". Note: the existing `mlb_comparison` column remains as-is. New reports write to `player_comparison`; the frontend reads `player_comparison ?? mlb_comparison` for backward compatibility. Do NOT drop or rename `mlb_comparison`. |
| `date_seen_start` | `DATE` | YES | |
| `date_seen_end` | `DATE` | YES | |
| `video_report` | `BOOLEAN` | YES | |

#### 4.1.2 New JSONB Column: `tool_grades`

A single JSONB column storing all tool-specific grades. Structure:

```jsonc
{
  "body": {
    "grade": 60,
    "projection": "Positive Projection",
    "description": "Athletic strength to the frame"
  },
  "athleticism": {
    "grade": 80,
    "description": "quick twitch, light quiet feet, body control is outstanding"
  },
  "bat": {
    "hit": { "present": 30, "future": 50, "description": "the more pitches he sees..." },
    "power": { "present": 30, "future": 40, "description": "" },
    "raw_power": { "present": 40, "future": 50 },
    "bat_speed": { "present": 55, "future": 55 },
    "contact": "Above Average",
    "swing_decisions": "Average",
    "contact_quality": "Below Average"
  },
  "field": {
    "arm_strength": { "present": 55, "future": 55, "description": "has carry..." },
    "arm_accuracy": { "present": 70, "future": 70, "description": "On target every time" },
    "current_position": "SS",
    "defense_present": 50,
    "pop_times": null,
    "fielding_grade": null,
    "fielding_description": "Avg for now until he gets the simple stuff down",
    "future_positions": [
      { "position": "SS", "pct": 60, "grade": 60, "description": "can stay at SS if he works on the simple things" },
      { "position": "CF", "pct": 40, "grade": 60, "description": "If he can't cut at SS, he can be a plus CF" }
    ]
  },
  "run": {
    "speed": { "grade": 80 },
    "times_to_first": "4.26",
    "baserunning": { "grade": 60, "description": "needs to cut corners better on the bases" },
    "instincts": { "grade": 55, "description": "Awareness, knows where to be" },
    "compete": { "grade": 70, "description": "Football mentality, can slow the game down" }
  },
  "pitching": {
    "fastball": { "present": null, "future": null },
    "slider": { "present": null, "future": null },
    "curveball": { "present": null, "future": null },
    "changeup": { "present": null, "future": null },
    "command": null,
    "control": null,
    "delivery": null,
    "description": null
  }
}
```

**Why JSONB:** Tool grading evolves — new tools get added, organizations customize their grading rubrics. JSONB lets the frontend render whatever tools exist without requiring migrations for each new tool. The metadata columns stay flat for querying (e.g. "find all reports with role >= 3").

**Indexing note:** No GIN index needed on `tool_grades` for Phase 1 — all filter/sort queries use the flat metadata columns. If future phases need to query inside the JSONB (e.g. "find reports where hit_future >= 50"), add a GIN index then.

**Validation:** The backend should validate that numeric grade values inside `tool_grades` are integers in the 20-80 range (increments of 5). String enum fields (contact, swing_decisions, etc.) should be validated against the allowed values listed in Section 3.1. Invalid values should return a 422 with a descriptive error.

#### 4.1.3 Migration Strategy

1. Add the new flat columns and `tool_grades JSONB` column (all nullable).
2. Existing reports keep their current `hitting_present`, `power_future`, etc. columns — no data migration needed.
3. The frontend reads from `tool_grades` first; if null, falls back to the legacy flat grade columns.
4. New reports write to `tool_grades` only. Legacy columns are not populated for new reports.
5. The legacy grade columns (`hitting_present`, `hitting_future`, `power_present`, etc.) can be deprecated over time but should not be dropped in this phase.

#### 4.1.4 API Changes

**GET/POST/PUT `/reports/scouting` and `/reports/scouting/:id`**

The existing endpoints accept and return the new fields alongside the existing ones. No new endpoints needed.

Request body additions (all optional):
```jsonc
{
  // ... existing fields ...
  "report_type": "hitter",
  "role": 4,
  "round_would_take": "5th-7th",
  "money_save": false,
  "overpay": false,
  "dollar_amount": "400k",
  "report_confidence": "High",
  "impact_statement": "HS SS all arrows pointing up",
  "summary": "4/6/24 Role 4 Michael Petite...",
  "look_recommendation": 50,
  "look_recommendation_desc": "Worth getting a look if not a hassle",
  "player_comparison": "Trea Turner",
  "date_seen_start": "2024-04-06",
  "date_seen_end": "2024-04-06",
  "video_report": false,
  "tool_grades": { /* JSONB structure from 4.1.2 */ }
}
```

Response includes same fields. The `tool_grades` field is returned as a parsed JSON object, not a string.

**GET `/reports/scouting?player_id=:id`** — already supported, no change needed.

---

## 5. Frontend Design

### 5.1 Player Detail — New "Scouting" Tab

Add a "Scouting" tab to the existing `TabsList` in `player-detail.tsx`, between "Game log" and "Videos".

**Data fetching:** `scoutingApi.list({ player_id: playerId, limit: 50 })` — same pattern as prospect-detail.tsx.

#### 5.1.1 Tab Content Structure

```
TabsContent value="scouting"
├── Header: "Scouting Reports (N)" + "+ New Report" button
├── If no reports: empty state with prompt to create
├── If reports exist:
│   ├── ScoutingReportCard (most recent, expanded)
│   ├── ScoutingReportCard (older, collapsed)
│   ├── ScoutingReportCard (older, collapsed)
│   └── ...
```

#### 5.1.2 ScoutingReportCard Component

A new component at `features/players/components/scouting-report-card.tsx`.

**Collapsed state** shows:
- Date, event type badge, OFP badge, scout name
- Role badge, round badge (if present)
- Click to expand

**Expanded state** shows (in order):

1. **Header row:** Date, event type, scout name, "Update Report" button
2. **Report metadata row:** OFP, Role, Round Would Take, Dollar Amount, Player Comparison
3. **Impact statement** (if present)
4. **Body & Athleticism** — grade badges + projection + descriptions in a 2-column grid
5. **Bat section** (if `report_type = 'hitter'` or legacy report):
   - Table with columns: Tool | P | F | Description
   - Rows: Hit, Power, Raw Power, Bat Speed
   - Below table: Contact, Swing Decisions, Contact Quality (grade + description)
6. **Field section:**
   - Table: Arm Strength, Arm Accuracy (P/F/Desc)
   - Metadata row: Current Position, Def(P), Pop Times
   - Future Positions table: Position | % | Grade | Description
7. **Run section:**
   - Grid: Speed, Times to First, Baserunning, Instincts, Compete (grade + desc)
8. **Look Recommendation** — grade + description
9. **Summary** — full narrative text block
10. **Metadata footer** — Report ID, created/updated timestamps

**Fallback for legacy reports:** If `tool_grades` is null, render the existing 7-tool table (Overall/Hitting/Power/Fielding/Arm/Speed/Pitching P/F) using the same layout as current `scouting-detail.tsx`.

#### 5.1.3 Shared GradeBadge Component

Extract the existing `GradeBadge` from `prospect-detail.tsx` and `scouting-detail.tsx` into `components/ui/grade-badge.tsx` to avoid duplication. Same color logic:
- `>= 60`: green (default variant)
- `40-59`: blue (secondary variant)
- `< 40`: gray (outline variant)
- Letter grades: mapped by first letter

### 5.2 Scouting Report Create/Edit Forms

Update `create-scouting-form.tsx` and `edit-scouting-form.tsx` to capture the new fields.

#### 5.2.1 Form Layout

1. **Report Type toggle** — Hitter / Pitcher tabs at top (like the reference screenshot)
2. **Metadata section** — Impact Statement, Role, Round, Money Save, Overpay, Dollar Amount, Report Confidence, Date Seen Start/End, Video Report
3. **Body & Athleticism** — Grade selects (20-80 in increments of 5), Projection select, Description textareas
4. **Bat section** (hitter only) — P/F grade selects + description inputs for each tool
5. **Field section** — Arm tools P/F, Current Position select, Def grade, Pop Times, Future Positions (add/remove rows)
6. **Run section** — Speed, Times to First, Baserunning, Instincts, Compete grade selects
7. **Look Recommendation** — Grade select + description
8. **Summary** — Large textarea
9. **Existing fields preserved** — The current grade inputs (overall, hitting, etc.) remain as "quick grades" or are mapped to the new structure

#### 5.2.2 Grade Input Component

Create a reusable `GradeSelect` component that renders a select dropdown with 20-80 scale options (in increments of 5: 20, 25, 30, ... 75, 80). Used across all grade fields in the form.

### 5.3 TypeScript Type Updates

Update `scouting-api.ts`:

```typescript
// New types
interface ToolGrades {
  body?: { grade?: number; projection?: string; description?: string }
  athleticism?: { grade?: number; description?: string }
  bat?: {
    hit?: { present?: number; future?: number; description?: string }
    power?: { present?: number; future?: number; description?: string }
    raw_power?: { present?: number; future?: number }
    bat_speed?: { present?: number; future?: number }
    contact?: string
    swing_decisions?: string
    contact_quality?: string
  }
  field?: {
    arm_strength?: { present?: number; future?: number; description?: string }
    arm_accuracy?: { present?: number; future?: number; description?: string }
    current_position?: string
    defense_present?: number
    pop_times?: string
    fielding_grade?: number
    fielding_description?: string
    future_positions?: Array<{
      position: string
      pct?: number
      grade?: number
      description?: string
    }>
  }
  run?: {
    speed?: { grade?: number }
    times_to_first?: string
    baserunning?: { grade?: number; description?: string }
    instincts?: { grade?: number; description?: string }
    compete?: { grade?: number; description?: string }
  }
  pitching?: {
    fastball?: { present?: number; future?: number }
    slider?: { present?: number; future?: number }
    curveball?: { present?: number; future?: number }
    changeup?: { present?: number; future?: number }
    command?: number
    control?: number
    delivery?: string
    description?: string
  }
}

// Add to ScoutingReport interface
interface ScoutingReport {
  // ... existing fields ...
  report_type?: 'hitter' | 'pitcher'
  role?: number
  round_would_take?: string
  money_save?: boolean
  overpay?: boolean
  dollar_amount?: string
  report_confidence?: string
  impact_statement?: string
  summary?: string
  look_recommendation?: number
  look_recommendation_desc?: string
  player_comparison?: string
  date_seen_start?: string
  date_seen_end?: string
  video_report?: boolean
  tool_grades?: ToolGrades
}
```

---

## 6. New Files

| File | Purpose |
|------|---------|
| `components/ui/grade-badge.tsx` | Shared GradeBadge component (extracted from duplication) |
| `components/ui/grade-select.tsx` | Reusable 20-80 scale select input for forms |
| `features/players/components/scouting-report-card.tsx` | Expanded report card for player detail scouting tab |
| `features/players/components/player-scouting-tab.tsx` | Tab content: fetches reports, renders cards |

## 7. Modified Files

| File | Change |
|------|--------|
| `lib/scouting-api.ts` | Add new types (`ToolGrades`, expanded `ScoutingReport`, expanded `ScoutingReportCreateInput`) |
| `features/players/player-detail.tsx` | Add "Scouting" tab, import `PlayerScoutingTab` |
| `features/scouting/create-scouting-form.tsx` | Expand form with new sections (metadata, bat, field, run, body) |
| `features/scouting/edit-scouting-form.tsx` | Same expansions as create form |
| `features/prospects/prospect-detail.tsx` | Extract `GradeBadge` to shared component, import from new location |
| `features/scouting/scouting-detail.tsx` | Extract `GradeBadge` to shared component, import from new location |

## 8. Implementation Order

1. **Backend** — Add migration + API changes (hand off to backend engineer using Section 4)
2. **Shared components** — Extract `GradeBadge`, create `GradeSelect`
3. **Type updates** — Expand `scouting-api.ts` types
4. **Player scouting tab** — New tab with report cards (read-only, using `tool_grades` with legacy fallback)
5. **Form updates** — Expand create/edit forms to capture new fields
6. **Testing** — Verify legacy reports still render, new reports capture all fields

## 9. Backward Compatibility

- Legacy reports (with only the 7 flat grade columns) render using the existing simple table layout.
- The `tool_grades` JSONB field being null or empty triggers the fallback to legacy columns.
- If a report has BOTH `tool_grades` and legacy flat columns populated, `tool_grades` takes precedence. The legacy columns are ignored on display.
- No existing data is modified or migrated.
- The legacy flat grade columns remain on the API response indefinitely.
