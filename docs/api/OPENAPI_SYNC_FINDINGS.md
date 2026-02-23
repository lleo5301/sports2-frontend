# OpenAPI Sync Findings

Frontend updates needed based on `docs/api/openapi.yaml` (latest).

**Implemented (2026-02):** Tournaments response shape, Tournament/Tournament schema fields, Game schema fields, SyncHistoryEntry id type, getBoxScore, getOpponentStats, getOpponentPlayerStats.

---

## 1. Tournaments — `GET /tournaments/{id}/games` response shape

**OpenAPI:** Response `data` is an object `{ tournament, games }`, not an array.

```yaml
data:
  type: object
  properties:
    tournament: { $ref: '#/components/schemas/Tournament' }
    games: type: array, items: Game
```

**Current:** `tournamentsApi.getGames()` expects `data` to be the games array directly.

**Update:** Change `getGames` to extract `data.games` and optionally use `data.tournament` so the detail page can use the tournament info from the same response instead of resolving from the list.

---

## 2. Tournament schema — missing fields

**OpenAPI Tournament:**
- `season_name` (string, nullable)
- `tournament_type` (enum: tournament | invitational | scrimmage, nullable)
- `season` is nullable in schema

**Update:** Add `season_name` and `tournament_type` to the Tournament interface; use `season_name` when present for display.

---

## 3. Game schema — missing optional fields

**OpenAPI Game fields not in frontend Game interface:**
- `season` (string)
- `season_name` (string)
- `notes` (string)
- `game_status` (enum: scheduled | completed | cancelled | postponed)
- `game_summary` (string)
- `running_record` (string)
- `running_conference_record` (string)
- `source_system` (enum: manual | presto)

**Update:** Add these optional fields to the Game interface for future use (e.g. game_status badge, running records, source indicator).

---

## 4. New endpoint — `GET /games/{gameId}/box-score`

**OpenAPI:** Presto live box score for games with `presto_event_id`. Returns full box score: visitor/home teams, linescore, batters, pitchers, fielding.

**Current:** Not implemented. Game detail uses `/games/{gameId}/stats` only.

**Update:** Add `gamesApi.getBoxScore(gameId)` and optionally use it as fallback or for live games when `/stats` is empty.

---

## 5. New endpoints — opponent stats (unused)

**OpenAPI:**
- `GET /games/opponent-stats` — aggregated opponent team stats (batting/pitching/fielding)
- `GET /games/opponent-stats/{opponent}/players` — per-player stats for an opponent

**Current:** Not used in frontend.

**Update:** Add to games-api for future opponent scouting/reporting. No UI changes required immediately.

---

## 6. Sync history — `id` type

**OpenAPI:** `id: { type: string, format: uuid }`

**Current:** `SyncHistoryEntry.id` is `number`.

**Update:** Change to `id: string` to match backend (UUID). Update any UI that assumes numeric ID.

---

## 7. Sync history — `sync_type` enum values

**OpenAPI enum:** roster, schedule, stats, team_record, season_stats, career_stats, full, player_details, player_photos, press_releases, historical_stats, historical_season_stats, player_videos, live_stats

**Update:** Ensure integrations History tab filter options match this enum if filtering by sync_type.

---

## Priority summary

| Priority | Item | Effort |
|----------|------|--------|
| **High** | Tournaments getGames — fix response shape | Small |
| **High** | Sync history — id as string | Small |
| **Medium** | Tournament — add season_name, tournament_type | Small |
| **Medium** | Game — add optional fields | Small |
| **Low** | Box score endpoint for game detail fallback | Medium |
| **Low** | Opponent stats API (no UI yet) | Small |
