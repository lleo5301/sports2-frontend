# Schedules Implementation

> Implementation notes for the Sports2 schedules feature. Use alongside [frontend-build-spec.md](./frontend-build-spec.md) and [openapi.yaml](../openapi.yaml).

## Overview

Schedules are date-based practice or game plans with **sections** and **activities**. A section groups activities (e.g., "Position Players", "Pitchers"); each activity has a time, name, location, and notes.

## API Endpoints

Base URL: `/api/v1` (from `VITE_API_URL`).

| Method | Path | Description |
|--------|------|-------------|
| GET | `/schedules` | List schedules (paginated) |
| GET | `/schedules/stats` | Schedule stats (totalEvents, thisWeek, thisMonth) |
| GET | `/schedules/byId/{id}` | Get schedule by ID (includes sections and activities) |
| POST | `/schedules` | Create schedule |
| PUT | `/schedules/byId/{id}` | Update schedule |
| DELETE | `/schedules/byId/{id}` | Delete schedule |
| POST | `/schedules/{id}/sections` | Add section to schedule |
| POST | `/schedules/sections/{sectionId}/activities` | Add activity to section |
| DELETE | `/schedules/sections/{sectionId}` | Delete section and its activities |
| DELETE | `/schedules/activities/{activityId}` | Delete single activity |
| GET | `/schedules/export-pdf` | Export as printable HTML (browser print → PDF) |

## Response Format

The backend returns `{ data }` or `{ data, pagination }` **without** a `success` flag for many endpoints. The frontend uses a `getData()` helper that reads `res.data` regardless of `success`.

- **List:** `{ data: Schedule[], pagination: { page, limit, total, pages } }`
- **Get/Create/Update:** `{ data: Schedule }` or `{ data: ScheduleSection }` etc.
- **Delete:** No body (204 or 200)

## Section Types

Per OpenAPI enum:

| Type | Label |
|------|-------|
| `general` | General |
| `position_players` | Position Players |
| `pitchers` | Pitchers |
| `grinder_performance` | Grinder (Performance) |
| `grinder_hitting` | Grinder (Hitting) |
| `grinder_defensive` | Grinder (Defensive) |
| `bullpen` | Bullpen |
| `live_bp` | Live BP |

## Request Payloads

### Add Section

```json
POST /schedules/{id}/sections
{ "type": "pitchers", "title": "Bullpen Day" }
```

- `type` (required): One of the section types above.
- `title` (required): Display title. Can default to type label if omitted.

### Add Activity

```json
POST /schedules/sections/{sectionId}/activities
{
  "time": "2:00 PM",
  "activity": "Hitting practice",
  "location": "Main field",
  "notes": "Optional notes"
}
```

- `time` (required), `activity` (required)
- `location`, `notes` (optional)

### Create Schedule

```json
POST /schedules
{
  "team_name": "Miami Dade",
  "program_name": "Baseball",
  "date": "2026-02-20",
  "sections": [
    { "type": "general", "title": "Warm-up", "activities": [] },
    {
      "type": "position_players",
      "title": "Infield",
      "activities": [
        { "time": "3:00 PM", "activity": "Ground balls", "location": "IF" }
      ]
    }
  ]
}
```

Sections can include nested activities; backend may support this for bulk create.

## Frontend Structure

### API (`v2/src/lib/schedules-api.ts`)

- `list`, `getById`, `create`, `update`, `delete`
- `getStats()` → `{ totalEvents, thisWeek, thisMonth }`
- `addSection(scheduleId, { type, title })` → `ScheduleSection`
- `addActivity(sectionId, { time, activity, location?, notes? })` → `ScheduleActivity`
- `deleteSection(sectionId)`
- `deleteActivity(activityId)`
- `exportPdf()` — fetches HTML, opens in new tab for print/save

Exports: `Schedule`, `ScheduleSection`, `ScheduleActivity`, `ScheduleCreateInput`, `AddSectionInput`, `AddActivityInput`, `ScheduleStats`, `SCHEDULE_SECTION_TYPES`, `ScheduleSectionType`.

### Components

| File | Purpose |
|------|---------|
| `schedule-detail.tsx` | Detail view: sections list, add/delete section, add/delete activity, export PDF |
| `add-section-modal.tsx` | Modal to add section (type + title) |
| `add-activity-modal.tsx` | Modal to add activity (time, activity, location, notes) |

### Routes

- `/schedules` — list
- `/schedules/create` — create form
- `/schedules/$id` — detail (ScheduleDetail)

### Backend Property Names

Sequelize returns `ScheduleSections` and `ScheduleActivities`. The frontend supports both:

- `schedule.ScheduleSections ?? schedule.Sections`
- `section.ScheduleActivities ?? section.Activities`

## Export PDF

`GET /schedules/export-pdf` returns HTML suitable for printing. The frontend:

1. Fetches with `responseType: 'text'`
2. Opens a new window
3. Writes the HTML into the document
4. User can use browser Print → Save as PDF

If the backend later returns raw PDF binary, switch to `responseType: 'blob'`, create an object URL, and trigger a download link.

## Permission Notes

Schedule-related permissions (if applicable): `schedule_view`, `schedule_create`, `schedule_edit`, `schedule_delete`. Sidebar and actions should respect `GET /api/v1/auth/permissions`.

---

_Last updated: February 2026_
