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

## Phase 4: Scouting Reports — **Complete**

### Goal
Create/edit scouting reports with 20–80 grades.

### Tasks
- [x] Scouting API (scouting-api.ts)
- [x] Scouting reports list with prospect filter
- [x] Create scouting report (prospect selector or preselected from prospect detail)
- [x] Scouting report detail view + edit form
- [x] Grades: overall, hitting, pitching, fielding, speed (present/future)

### Status: Complete

---

## Phase 5: Schedules & Games — **Complete**

### Goal
Schedules list, create, detail. Games list, create, detail.

### Tasks
- [x] Schedules API (schedules-api.ts)
- [x] Schedules list with filters
- [x] Create schedule form
- [x] Schedule detail view (sections + activities)
- [x] Games API (games-api.ts)
- [x] Games list
- [x] Create game form
- [x] Game detail view
- [x] Routes: /schedules, /schedules/create, /schedules/$id, /games, /games/create, /games/$id
- [x] Sidebar: Create Schedule, Add Game

### Status: Complete

---

## Phase 6: Contacts CRUD — **Complete**

### Goal
Coaches, Scouts, Vendors, High School Coaches full CRUD.

### Tasks
- [x] Coaches API (coaches-api.ts)
- [x] Coaches list, create, detail, edit, delete
- [x] Scouts API (scouts-api.ts)
- [x] Scouts list, create, detail, edit, delete
- [x] Vendors API (vendors-api.ts)
- [x] Vendors list, create, detail, edit, delete
- [x] High School Coaches API (high-school-coaches-api.ts)
- [x] HS Coaches list, create, detail, edit, delete
- [x] Routes and sidebar links for all contacts

### Status: Complete

---

## Future Phases

### Phase 7: Reports, Settings
- Reports list (custom reports), Analytics
- Team/User Settings (wire to API)

### Phase 8: Integrations
- PrestoSports status/sync

---

## OpenAPI Client

- Spec: `docs/api/openapi.yaml`
- Generate when needed: `npx @openapitools/openapi-generator-cli generate -i docs/api/openapi.yaml -g typescript-fetch -o ./src/api-client`
- Currently using existing services; migration optional.
