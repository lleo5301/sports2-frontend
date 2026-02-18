# Baseball Coach Analytics Research & Data Mapping

> Research on what analytics baseball/college coaches look for, mapped to data available in the sports2-frontend project.  
> **Sources:** Web research on coaching analytics, `docs/api/extended-stats-api.md`, `docs/api/player-stats-reference.md`, `v2/src/lib/extended-stats-api.ts`.

---

## 1. Top Analytics Coaches Want (Prioritized)

### Tier 1 — High Priority (Player Evaluation & Lineup)

| Analytics | Description | Use Cases |
|-----------|-------------|-----------|
| **Situational splits (vs LHP/RHP, RISP, 2-strike)** | Hitting performance by pitcher handedness and game situation | Lineup optimization, pinch-hit decisions, matchup strategy |
| **Game log / trends over time** | Per-game stats to see hot/cold streaks and consistency | Player development, lineup changes, confidence decisions |
| **Batting rate stats (AVG, OBP, SLG, OPS)** | Beyond just AVG — modern coaches use OBP/SLG/OPS | Evaluation, recruitment, batting order |
| **Pitching rate stats (ERA, WHIP, K/9, BB/9)** | Quality and command metrics | Starter vs reliever roles, pitch counts, matchup decisions |
| **Stat leaders (team)** | Quick view of who leads in key categories | Recognition, lineup construction |
| **Team record progression** | Overall and conference record over time | Season overview, conference standing |

### Tier 2 — Important (Advanced & Recruitment)

| Analytics | Description | Use Cases |
|-----------|-------------|-----------|
| **Exit velocity** | Speed of ball off bat; hard-hit ≥95 mph | Contact quality, power potential, recruitment verification |
| **Launch angle** | Angle ball leaves bat; sweet spot 8–32° | Swing plane, power development |
| **Spin rate / spin efficiency** | Ball spin at release (Rapsodo, etc.) | Pitcher effectiveness, pitch selection |
| **Spray charts / hot zones** | Visual: where balls are hit, strengths/weaknesses | Defensive positioning, approach adjustments |
| **RE24 (Run expectancy)** | How each play affects run-scoring odds | Situational value, lineup optimization |

### Tier 3 — Specialized (Advanced Programs)

| Analytics | Description | Use Cases |
|-----------|-------------|-----------|
| **Defensive metrics (UZR, DRS, RDA)** | Runs saved above/below average | Positioning, defensive subs |
| **Lineup optimization (simulation)** | Sim-based optimal batting order | 5–10% run-scoring improvement potential |
| **Biomechanics** | Swing/arm mechanics via high-speed video | Injury risk, development |
| **Comparative analytics (vs team avg, vs conference)** | Player vs team/conference benchmarks | Context for evaluation |

---

## 2. What We CAN Provide (Current Data → API Mapping)

### Team-Level

| Analytics | API Endpoint | Data Available |
|-----------|--------------|----------------|
| Season record (W-L, conference) | `GET /api/v1/teams/dashboard` | `record.wins`, `record.losses`, `record.conference_wins`, `record.conference_losses` |
| Team batting totals | `/teams/dashboard`, `/teams/aggregate-stats` | AVG, runs, hits, 2B, 3B, HR, RBI, SB, OBP, SLG, OPS |
| Team pitching totals | Same | ERA, IP, SO, BB, hits_allowed, whip |
| Team fielding | Same | fielding_pct, errors, putouts, assists, double_plays |
| Stat leaders (top 3) | `/teams/dashboard` | `leaders.batting_avg`, `home_runs`, `rbi`, `stolen_bases`, `era`, `strikeouts` |
| Recent games (last 10) | `/teams/dashboard` | Game summaries, opponents, scores, running record |
| Game-by-game team stats | `GET /api/v1/teams/game-log` | Per-game batting/pitching per opponent |
| Lineup (last game) | `GET /api/v1/teams/lineup` | Best-effort lineup from last completed game |

### Player-Level

| Analytics | API Endpoint | Data Available |
|-----------|--------------|----------------|
| Season stats (214 Presto keys) | `GET /api/v1/players/byId/:id/stats/raw` | Full batting (`hitting*`), pitching (`pitching*`), fielding (`fielding*`), catching (`catching*`) |
| Situational splits | `GET /api/v1/players/byId/:id/splits` | `vs_lhp`, `vs_rhp`, `risp`, `two_outs`, `bases_loaded`, `bases_empty`, `leadoff`, `with_runners` |
| Location splits | Same | `home`, `away`, `conference` |
| Per-game game log | `GET /api/v1/players/byId/:id/game-log` | Batting (ab, h, hr, rbi, bb, so, sb), pitching (ip, h, r, er, bb, so, pitches), fielding (po, a, e) |
| Career stats | `GET /api/v1/players/byId/:id/stats` | Season and career totals (curated) |
| Leaderboard rankings | `GET /api/v1/games/leaderboard` | Rank by stat with qualifiers (min AB, min IP) |

### Presto Stat Keys (PrestoSports → sports2)

| Category | Example Keys | Example Values |
|----------|--------------|----------------|
| Batting | `hittingab`, `hittingavg`, `hittinghr`, `hittingrbi`, `hittingobpct`, `hittingslgpct` | "85", ".341", "3", ".405", ".529" |
| Pitching | `pitchingera`, `pitchingip`, `pitchingso`, `pitchingbb`, `pitchingwhip` | "3.18", "62.1", "65", "18", "1.17" |
| Fielding | `fieldingpo`, `fieldinga`, `fieldinge`, `fieldingfldpct`, `fieldingdp` | "45", "82", "3", ".977", "12" |
| Catching | `catchingsba`, `catchingcs`, `catchingcspct` | Stolen bases allowed, caught stealing |

---

## 3. What We CANNOT Provide (Gaps)

| Gap | Why | Possible Future Source |
|-----|-----|------------------------|
| **Exit velocity** | Requires Statcast/Rapsodo/trackman hardware | Stadium tracking, Blast Motion, Rapsodo |
| **Launch angle** | Same — batted-ball tracking | Statcast, Rapsodo |
| **Barrels, hard-hit rate** | Derived from EV + LA | Would follow from EV/LA data |
| **Spray charts / hot zones** | Requires batted-ball location per event | Statcast, play-by-play with coordinates |
| **Spin rate, spin efficiency** | Requires pitch-tracking hardware | Rapsodo, TrackMan |
| **Pitch movement (IVB, horizontal)** | Same | Statcast, Rapsodo |
| **RE24 / run expectancy** | Derived from play-by-play + base-out states | Play-by-play data + calculation |
| **UZR, DRS, RDA** | Requires BIS video review or Statcast | BIS, Statcast (RDA) |
| **Biomechanics** | High-speed video + analysis | Blast Motion, specialized vendors |
| **Conference comparison** | Would need conference-wide aggregate data | Manual or external data source |
| **Lineup simulation** | Requires underlying run expectancy and player stats | Build on our splits + game-log |

---

## 4. Suggested Analytics Section Features (Buildable With Current Data)

### Coach Dashboard Enhancements

| Feature | Data Source | UI Component |
|--------|-------------|--------------|
| **Record trend sparkline** | `recent_games` + `running_record` | Small line chart showing W-L progression |
| **Conference vs non-conference split** | Would need backend split if available; otherwise manual | Cards: "Conference: 10–4" vs "Overall: 15–8" |
| **Expandable leader cards** | `leaders.*` | Click leader to see full stat line or link to player |

### Team Stats Page

| Feature | Data Source | UI Component |
|--------|-------------|--------------|
| **Full batting/pitching/fielding tables** | `/teams/aggregate-stats` | Sortable tables with all Presto keys we display |
| **Game log with per-game stats** | `/teams/game-log` | Table: Date, Opponent, Result, Score, team_stats columns |
| **Record progression chart** | `running_record` per game | Line chart: cumulative wins over season |

### Player Detail Enhancements

| Feature | Data Source | UI Component |
|--------|-------------|--------------|
| **Splits comparison cards** | `/players/byId/:id/splits` | Side-by-side: vs LHP vs vs RHP (AVG, OBP, HR, etc.) |
| **Situational summary** | Same | Compact grid: RISP, 2-outs, bases loaded with key stats |
| **Game log table** | `/players/byId/:id/game-log` | Sortable table: Date, Opponent, AB, H, HR, RBI, etc. |
| **Game log trend chart** | Same | Rolling AVG or OPS over last N games |
| **Streak indicators** | Same | "Last 5: .400 AVG" or "Hit in 7 straight" badges |

### Lineup & Matchup Tools

| Feature | Data Source | UI Component |
|--------|-------------|--------------|
| **vs LHP / vs RHP lineup view** | Splits for all players | Table: Player, vs LHP AVG/OBP, vs RHP AVG/OBP — sort by platoon advantage |
| **RISP lineup suggestion** | Splits `.risp` | Rank players by RISP performance for situational batting order |
| **Last-game lineup with stats** | `/teams/lineup` | Cards per slot: name, position, last-game batting line |

### Comparative Analytics (If Conference Data Available)

| Feature | Data Source | UI Component |
|--------|-------------|--------------|
| **Player vs team batting** | Player raw stats vs team aggregate | Bar: Player AVG vs Team AVG |
| **Player vs team pitching** | Same | Bar: Player ERA vs Team ERA |

---

## Summary

- **We CAN deliver:** Traditional and situational stats (AVG/OBP/SLG, ERA/WHIP, splits vs LHP/RHP, RISP, home/away, conference), game logs, team record, leaders, lineup, and full raw Presto stats.
- **We CANNOT deliver:** Exit velocity, launch angle, spin rate, spray charts, advanced defensive metrics (UZR/DRS), RE24, or biomechanics — these require tracking hardware or third-party data.
- **Best next features:** Splits comparison UI, game-log trends/streaks, vs LHP/RHP lineup helper, and record progression charts — all buildable with existing APIs.
