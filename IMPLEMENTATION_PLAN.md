# Sports2 Frontend Rebuild — Implementation Plan

> Rebuild per `docs/api/frontend-build-spec.md`. Option B: keep old pages, simplify nav, build new pages alongside.

## Design System

- **Source:** `design-system/sports2/MASTER.md` (ui-ux-pro-max)
- **Palette:** Primary #DC2626, Secondary #EF4444, CTA #FBBF24, Background #FEF2F2
- **Typography:** Fira Code (headings), Fira Sans (body)
- **Style:** Vibrant & block-based. Transitions 200–300ms. Use HeroUI + Tailwind.

## Reuse (unchanged)

- All services in `src/services/`
- Depth chart components: EnhancedBaseballFieldView, DepthChartPositionManager, DepthChartSheetView, DepthChartSheetViewV2, DepthChartFangraphsView, `src/components/depthchart/*`
- Auth flow, BrandingContext, ThemeContext
- Pref list pages: New Players, Overall Pref List, HS Pref List, College Portal

## Phase 1: Auth & Layout + Dashboard — **IN PROGRESS**

### Goal
Simplified nav, new Dashboard using spec endpoints.

### Success Criteria
- [ ] Nav: Overview, Roster, Recruiting, Operations, Settings (simplified)
- [ ] Dashboard: teams/me, teams/stats, recent-schedules, upcoming-schedules
- [ ] Team branding (logo, colors) in header
- [ ] Old routes still work (removed from nav only)

### Tasks
- [x] Run design system, persist MASTER.md
- [x] Add getRecentSchedules, getUpcomingSchedules to teams.js
- [x] Simplify Layout nav (deprecate old items)
- [x] Build Dashboard per spec (stats cards, recent/upcoming schedule)

### Status: Complete

---

## Phase 2: Roster — **Complete**

### Goal
Players list, create, edit, delete.

### Tasks
- [x] Players list with filters (search, position, status, school type)
- [x] Create player form
- [x] Player detail view + edit form
- [x] Delete player

### Status: Complete

---

## Phase 3: Prospects & Recruiting — **Complete**

### Goal
Prospects list, create, edit, pipeline view.

### Tasks
- [x] Prospects API (prospects-api.ts)
- [x] Prospects list with filters (search, position, status, school type)
- [x] Create prospect form
- [x] Prospect detail view + edit form
- [x] Delete prospect
- [ ] Recruiting Board (retain pref list pages) — future

### Status: Complete

---

## Future Phases

### Phase 4: Scouting Reports
- Create/edit reports, 20–80 grades

### Phase 5: Schedules, Depth Charts, Games
- Wire existing components

### Phase 6: Reports, Contacts, Settings
- Reports, Contacts CRUD, Team/User Settings

### Phase 7: Integrations
- PrestoSports status/sync

---

## OpenAPI Client

- Spec: `docs/api/openapi.yaml`
- Generate when needed: `npx @openapitools/openapi-generator-cli generate -i docs/api/openapi.yaml -g typescript-fetch -o ./src/api-client`
- Currently using existing services; migration optional.
