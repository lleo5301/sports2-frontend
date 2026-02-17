# Dashboard Page Override

> Extends `design-system/sports2/MASTER.md`

## Data (per frontend-build-spec §6.1)

- `GET /api/v1/teams/me` — Team name, logo, primary color
- `GET /api/v1/teams/stats` — Players, reports, schedules, wins/losses
- `GET /api/v1/teams/recent-schedules` — Recent past events
- `GET /api/v1/teams/upcoming-schedules` — Upcoming events

## Layout

1. **Header** — Welcome + team name, apply team branding
2. **Stats cards** — 4–6 metric cards (players, reports, schedules, W-L)
3. **Recent events** — Past schedule snippet
4. **Upcoming events** — Next schedule snippet
5. **Quick actions** — Add Player, Create Report, etc.

## Component Notes

- Use HeroUI Card, Chip, Button
- Team branding: logo, primary_color, secondary_color from teams/me or branding
- Block-based layout, 48px section gaps
- Lucide icons only, no emojis
