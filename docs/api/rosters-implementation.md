# Named Rosters — Frontend Implementation

> Implements the Named Rosters feature per `docs/api/roster-api.md`.

## Summary

The frontend provides full CRUD for Named Rosters: create rosters (game-day, travel, practice, season, custom), add players to rosters, update entry metadata (position, jersey, order, status), remove players, and backfill from PrestoSports.

## API Client

**File:** `v2/src/lib/rosters-api.ts`

- `list(params)` — List rosters with filters (roster_type, source, is_active, pagination)
- `getById(id)` — Get roster with entries and player details
- `create(data)` — Create roster (name, roster_type, game_id?, effective_date?, description)
- `update(id, data)` — Update roster metadata
- `delete(id)` — Delete roster and all entries
- `addPlayers(rosterId, { players })` — Add one or more players with position, jersey, order
- `updateEntry(rosterId, playerId, data)` — Update entry (position, jersey, order, status, notes)
- `removePlayer(rosterId, playerId)` — Remove player from roster
- `backfill({ game_ids?, all? })` — Create rosters from PrestoSports game data

**Constants:** `ROSTER_TYPES`, `ROSTER_TYPE_LABELS`, `ROSTER_SOURCES`, `ENTRY_STATUSES`, `POSITIONS`

## Routes

| Path | Component |
|------|-----------|
| `/rosters` | RostersList |
| `/rosters/create` | CreateRosterForm |
| `/rosters/:id` | RosterDetail |

## Features

### Rosters List (`rosters-list.tsx`)

- Table with columns: ID, Name, Type, Source, Date, Players, Game
- Filters: roster_type, source, is_active
- Actions: Create Roster, Backfill from Presto, View, Delete
- Pagination

### Create Roster Form (`create-roster-form.tsx`)

- Name (required)
- Roster type (game_day, travel, practice, season, custom)
- Game (optional) — selects from games list
- Effective date (optional)
- Description (optional)
- On success: navigates to roster detail

### Roster Detail (`roster-detail.tsx`)

- Header with roster name, type, player count
- Details card: effective date, linked game, description
- Players table: Player (link to player profile), Position, Jersey #, Order, Status
- Actions per entry: Edit, Remove
- Add Players button opens modal

### Add Players Modal (`add-players-modal.tsx`)

- Select player from active players (excludes already on roster)
- Optional: position, jersey number, order
- Add one player at a time; modal stays open to add more

### Edit Entry Modal (`edit-entry-modal.tsx`)

- Update position, jersey #, order, status (active/injured/suspended/inactive), notes

## Sidebar

Under **Roster**:

- Players
- Create Player
- **Rosters** (new)
- **Create Roster** (new)

## Backend Requirements

The backend must implement the API per `roster-api.md`:

- `GET /api/v1/rosters`
- `GET /api/v1/rosters/:id`
- `POST /api/v1/rosters`
- `PUT /api/v1/rosters/:id`
- `DELETE /api/v1/rosters/:id`
- `POST /api/v1/rosters/:id/players`
- `PUT /api/v1/rosters/:id/players/:playerId`
- `DELETE /api/v1/rosters/:id/players/:playerId`
- `POST /api/v1/rosters/backfill`

If these endpoints are not yet available, the UI will show errors when making requests.
