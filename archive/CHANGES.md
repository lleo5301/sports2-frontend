# Sports2 Frontend Changes

## 2026-01-27: PrestoSports Integration Updates

### Summary
Updated frontend to work with new backend integration credentials system. Added token status display, baseball-only filtering, and simplified team/season selection.

### Backend Changes (Reference)
- Created `integration_credentials` table with multi-provider support (presto, hudl, synergy)
- OAuth2, basic auth, and API key credential types
- Encrypted credential storage with token expiration tracking
- Auto-deactivation after 3 refresh failures
- New credential service for centralized token management

### Frontend Changes

#### `src/components/integrations/PrestoSportsConfig.jsx`
- **Token Status Display**: Added badge showing "valid" (green) or "expired" (yellow) token status
- **Expired Token Warning**: Alert banner when token needs re-authentication
- **Combined Team & Season Dropdown**: Single dropdown that auto-derives seasonId from selected team
- **Baseball-Only Filter**: Teams filtered to show only baseball (checks `sportName`, `sportId`, `seasonName`)
- **Removed Seasons Dropdown**: No longer needed since team data includes season info
- **Fixed Warning Visibility**: "Please select a team" warning now hides after selection

#### `src/services/integrations.js`
- Added `syncPrestoRecord()` - Sync team W-L record
- Added `syncPrestoSeasonStats()` - Sync season statistics
- Added `syncPrestoCareerStats()` - Sync career statistics

#### `src/pages/TeamSettings.jsx`
- Fixed `users.map is not a function` error by handling both array and object API responses

### API Response Structures

#### Status Endpoint (`/api/v1/integrations/presto/status`)
```json
{
  "isConfigured": true,
  "prestoTeamId": "abc123",
  "prestoSeasonId": "xyz789",
  "lastSyncAt": "2026-01-27T14:06:31.000Z",
  "tokenStatus": "valid"  // "valid", "expired", or null
}
```

#### Teams Endpoint (`/api/v1/integrations/presto/teams`)
```json
{
  "teamId": "4em8o74a9o2h3xbj",
  "teamName": "Miami Dade College",
  "seasonId": "c8nk0wdfaaff8w9v",
  "sportId": "bsb",
  "season": {
    "seasonId": "c8nk0wdfaaff8w9v",
    "seasonName": "NJCAA Baseball 2025-26",
    "sport": {
      "sportId": "bsb",
      "sportName": "Baseball"
    }
  }
}
```

### Testing Verified
- [x] Token status badge displays correctly
- [x] Baseball-only filter working
- [x] Team selection saves correctly
- [x] Sync Roster button works (24 players updated)
- [x] Last synced timestamp updates after sync

---

## 2026-01-27: PrestoSports Full Sync + Live Stats UI

### Summary
Added UI for all 6 new PrestoSports sync endpoints including live game stats polling.

### New Service Methods (`src/services/integrations.js`)
- `syncPrestoPlayerDetails()` - Sync player bio, hometown
- `syncPrestoPlayerPhotos()` - Sync player photos
- `syncPrestoPlayerVideos()` - Sync player videos
- `syncPrestoHistoricalStats()` - Sync historical season stats
- `syncPrestoPressReleases()` - Sync press releases
- `getPrestoLiveGames()` - Get games eligible for live stats
- `syncPrestoLiveStats(gameId)` - Sync live stats for specific game

### New UI Sections (`src/components/integrations/PrestoSportsConfig.jsx`)

#### Additional Sync Options
- Player Details button
- Player Photos button
- Player Videos button
- Historical Stats button
- Press Releases button

#### Live Game Stats
- Shows games scheduled for today or in progress
- Auto-refreshes every 60 seconds
- Displays game status (LIVE badge for in-progress)
- Shows current score and inning for active games
- Per-game sync button for real-time stats

### API Endpoints Reference
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/presto/sync/player-details` | Sync player bio, hometown |
| POST | `/presto/sync/player-photos` | Sync player photos |
| POST | `/presto/sync/player-videos` | Sync player videos |
| POST | `/presto/sync/historical-stats` | Sync historical stats |
| POST | `/presto/sync/press-releases` | Sync press releases |
| GET | `/presto/games/live` | Get live-eligible games |
| POST | `/presto/sync/live-stats/:gameId` | Sync live stats |

### Live Stats Response Structure
```json
{
  "success": true,
  "data": {
    "game": { "id": 1, "opponent": "Team B", "game_date": "...", "home_away": "home" },
    "gameState": {
      "status": "in_progress",
      "inning": 5,
      "inningHalf": "top",
      "homeScore": 3,
      "awayScore": 2,
      "outs": 1,
      "balls": 2,
      "strikes": 1
    },
    "statsCreated": 0,
    "statsUpdated": 18
  }
}
```

---

### Next Steps (Future)
- Implement Hudl integration UI
- Implement Synergy integration UI
