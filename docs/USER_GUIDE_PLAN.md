# Sports2 User Guide — Public Documentation Plan

> Plan for creating an engaging, public-facing user guide with written docs, video recordings, demos, and animations. Audience: collegiate baseball coaches, assistant coaches, and staff.

---

## 1. Audience & Goals

### Primary Users
- **Head coaches** — Full platform access, team branding, oversight
- **Assistant coaches** — Roster, schedules, reports, depth charts (permission-dependent)
- **Staff** — Day-to-day data entry, rosters, contacts

### Goals
- Onboard new users quickly
- Reduce support burden with self-serve documentation
- Build trust through polished, professional materials
- Drive adoption of advanced features (analytics, depth charts, backfill)

---

## 2. Content Architecture

### 2.1 Documentation Structure

```
/docs (or /help, /guide — hosted site)
├── getting-started/
│   ├── overview                    # What is Sports2, key concepts
│   ├── logging-in                  # Auth, session, CSRF
│   ├── your-dashboard              # Overview, quick actions
│   └── team-context                # Switching teams, branding
├── roster/
│   ├── players                     # Add, edit, view players
│   ├── rosters                     # Named rosters, game-day, backfill
│   └── create-player                # Step-by-step with screenshots
├── recruiting/
│   ├── prospects                   # Prospect management
│   ├── recruiting-board            # Kanban pipeline
│   └── preference-lists            # Lists by category
├── scouting/
│   ├── scouting-reports            # 20-80 grades, create report
│   └── grade-scales                # Team grade scale settings
├── operations/
│   ├── schedules                   # Schedules, calendar view
│   ├── games                       # Game log, game detail
│   ├── coach-dashboard             # Record, team stats, leaders, recent games
│   ├── team-stats                  # Batting, pitching, fielding, game log
│   ├── leaderboard                 # Stat rankings
│   ├── depth-charts                # Create, assign, field view
│   └── depth-chart-from-game       # Backfill from game lineup ← NEW
├── reports/
│   ├── reports-overview            # Reports list, exports
│   └── analytics                   # Analytics dashboard
├── contacts/
│   ├── coaches-scouts-vendors     # Contacts management
│   └── high-school-coaches        # HS coach directory
├── system/
│   ├── team-settings               # Branding, logos
│   ├── user-settings               # Profile, appearance, security
│   └── integrations               # PrestoSports, sync
└── reference/
    ├── roles-permissions           # Who can do what
    ├── keyboard-shortcuts          # If any
    └── faq                         # Common questions
```

### 2.2 Content Types per Section

| Section | Written | Video | Demo/Interactive | Animation |
|---------|---------|-------|------------------|-----------|
| Getting started | ✓ | ✓ Hero walkthrough | — | Intro animation |
| Roster | ✓ | ✓ Create player, rosters | Inline GIF/demo | Hover highlights |
| Recruiting | ✓ | ✓ Prospects, board | Kanban demo | Pipeline flow |
| Scouting | ✓ | ✓ Create report, grades | Form walkthrough | 20-80 scale viz |
| Operations | ✓ | ✓ Schedules, depth chart | Calendar demo, backfill | Chart animations |
| Reports | ✓ | ✓ Analytics tour | — | Chart reveal |
| System | ✓ | ✓ Integrations setup | — | — |

---

## 3. Video Strategy

### 3.1 Video Types & Length

| Type | Length | Use Case | Example |
|------|--------|----------|---------|
| **Hero / Overview** | 2–3 min | Landing, first-time users | "Welcome to Sports2" |
| **Feature deep-dive** | 3–5 min | Single feature | "Creating a Depth Chart" |
| **Quick tip** | 30–60 sec | Single action | "Backfill depth chart from game" |
| **Troubleshooting** | 1–2 min | Common issues | "PrestoSports not syncing?" |

### 3.2 Recording Guidelines

- **Tool**: Loom, OBS, or Screen Studio (macOS) for screen recording
- **Resolution**: 1080p minimum
- **Audio**: External mic, quiet room
- **Cursor**: Visible, slow movements for clarity
- **Captions**: Include for accessibility and silent viewing
- **Thumbnails**: Consistent branding, feature icon, short title

### 3.3 Video Hosting Options

| Option | Pros | Cons |
|--------|------|------|
| **Loom** | Easy recording, embeddable, analytics | Cost at scale |
| **YouTube (unlisted)** | Free, reliable | Ads, less control |
| **Vimeo** | No ads, good player, analytics | Cost |
| **Mux / Cloudflare Stream** | Self-hosted, flexible | Dev effort |
| **Host on docs site** | Full control | Storage + bandwidth |

**Recommendation**: Loom or Vimeo for v1; embed in docs. Consider self-hosted video (e.g. Mux) if branding or analytics become critical.

### 3.4 Priority Videos (Phase 1)

1. **Getting started** — Welcome, login, dashboard tour
2. **Players & rosters** — Add player, create roster, backfill from game
3. **Depth charts** — Create chart, assign players, backfill from game
4. **PrestoSports integration** — Connect, sync, what gets populated
5. **Coach dashboard** — Record, team stats, leaders, recent games

---

## 4. Demo & Interactive Elements

### 4.1 Interactive Demos

| Element | Description | Tech |
|---------|-------------|------|
| **Embedded app clips** | Short, static clips of key flows | GIF or short video |
| **Step-through wizard** | Click-through "try it" style demo | Storybook, custom HTML/JS |
| **Before/after** | Old vs new UI, data states | Side-by-side images |
| **Live sandbox** | Staging app with read-only demo data | Link to demo.sports2.com |

### 4.2 Demo Content Ideas

- **Depth chart backfill**: Before (empty) → Select game → After (populated)
- **Scouting report form**: Blank → Filled 20-80 grades → Submitted
- **Recruiting board**: Kanban with prospects moving through pipeline
- **Analytics dashboard**: Chart reveal with real-looking data

### 4.3 GIF vs Video

- **GIF**: Silent, auto-loop, good for 5–15 sec micro-demos
- **Video**: Sound, captions, controls; better for 30+ sec
- **Tool**: Kap, ScreenToGif, or Loom export as GIF for micro-demos

---

## 5. Animations & Engagement

### 5.1 Page-Level Animations

| Element | Effect | Purpose |
|---------|--------|---------|
| **Hero / intro** | Fade-in, staggered text | Welcoming feel |
| **Section headers** | Underline or icon slide-in | Visual structure |
| **Feature cards** | Hover lift, subtle shadow | Interactive feedback |
| **Step numbers** | Number pop-in, checkmark on complete | Progress clarity |
| **Charts / stats** | Count-up or bar fill | Data emphasis |

### 5.2 In-Content Animations

- **Callouts**: Subtle pulse or border on important tips
- **Expand/collapse**: Accordion for long sections
- **Code/command blocks**: Copy button with success animation
- **Video embeds**: Play button hover, thumbnail overlay

### 5.3 Implementation Options

| Approach | Pros | Cons |
|----------|------|------|
| **CSS + view transitions** | Lightweight, no deps | Limited |
| **Framer Motion** | Flexible, React-friendly | Bundle size |
| **Tailwind + tw-animate** | Fits existing stack | Less custom |
| **Scroll-triggered libs** (AOS, etc.) | Easy scroll reveals | Extra dependency |

**Recommendation**: Use CSS/Tailwind for basics; add Framer Motion only where needed (e.g. scroll-triggered reveals).

---

## 6. Hosting & Platform Options

### 6.1 Documentation Site Options

| Platform | Pros | Cons |
|----------|------|------|
| **Docusaurus** | React, MDX, versioning, search | Setup, maintenance |
| **Mintlify** | Doc-focused, beautiful, DevRel-style | Cost |
| **GitBook** | Easy, good UX, embeds | Cost, vendor lock |
| **Nextra** | Next.js, MDX, flexible | More dev work |
| **Notion (public)** | Easiest, no code | Less custom, limited video |
| **Read the Docs** | Free, Sphinx/Markdown | More technical feel |
| **Custom (Vite + MDX)** | Full control | More build time |

**Recommendation**: 
- **Fast launch**: Notion or GitBook
- **Long-term, customizable**: Docusaurus or Mintlify

### 6.2 Domain & Branding

- **URL**: `docs.sports2.com` or `help.sports2.com` or `guide.sports2.com`
- **Branding**: Logo, colors from Ink Black / Alabaster palette
- **Search**: Site search (Algolia DocSearch, etc.) for larger doc sets

---

## 7. Phased Implementation Plan

### Phase 1: Foundation (Weeks 1–2) ✅
- [x] Choose hosting platform (Docusaurus)
- [x] Set up docs site structure (`docs-site/`)
- [x] Write Getting Started (overview, login, dashboard, team-context)
- [x] Add Reference (roles-permissions, FAQ)
- [x] Hero video script (`docs-site/HERO_VIDEO_SCRIPT.md`)
- [ ] Record 1 hero video (2–3 min) — *user*
- [ ] Publish initial 5–7 pages — *deploy to docs.sports2.com or similar*

### Phase 2: Core Features (Weeks 3–4)
- [ ] Roster docs + 1 video (create player)
- [ ] Depth charts docs + 1 video (create, assign, backfill)
- [ ] Integrations docs + 1 video (PrestoSports)
- [ ] Add 3–5 GIF demos for key flows

### Phase 3: Expand & Polish (Weeks 5–6)
- [ ] Recruiting, scouting, operations, reports sections
- [ ] 3–5 more videos (feature deep-dives)
- [ ] Add page animations, better layout
- [ ] FAQ, roles/permissions reference

### Phase 4: Engagement & Maintenance (Ongoing)
- [ ] Quick-tip videos (30–60 sec)
- [ ] Feedback mechanism (e.g. "Was this helpful?")
- [ ] Analytics (page views, video plays)
- [ ] Update when features change

---

## 8. Content Production Workflow

### 8.1 Writing
1. Use feature spec + sidebar structure as outline
2. One page per feature or sub-feature
3. Include: what, why, steps, screenshots, tips
4. Review with a coach or power user

### 8.2 Screenshots
- Use staging/sandbox with realistic demo data
- Highlight UI with arrows or callouts (Figma, Markup, etc.)
- Keep consistent viewport (e.g. 1440×900) and theme

### 8.3 Videos
1. Script or bullet points
2. Record in one take if possible; trim in post
3. Add captions (Loom auto, or manual in editor)
4. Export and upload; embed in docs

### 8.4 Maintenance
- Tag pages by feature area
- When a feature changes, update doc + video
- Changelog or "What's new" for big updates

---

## 9. Checklist Before Launch

- [ ] All Getting Started pages live
- [ ] At least 3 videos (hero, roster, depth chart)
- [ ] Search or clear navigation
- [ ] Mobile-responsive layout
- [ ] Contact/support link
- [ ] Feedback mechanism
- [ ] Analytics installed (optional)

---

## 10. Quick Reference: Feature → Doc Mapping

| App Feature | Doc Path | Video |
|-------------|----------|-------|
| Overview / Dashboard | `getting-started/your-dashboard` | Hero |
| Players | `roster/players` | Create player |
| Rosters | `roster/rosters` | — |
| Prospects | `recruiting/prospects` | — |
| Recruiting Board | `recruiting/recruiting-board` | — |
| Preference Lists | `recruiting/preference-lists` | — |
| Scouting Reports | `scouting/scouting-reports` | Create report |
| Schedules | `operations/schedules` | — |
| Games | `operations/games` | — |
| Coach Dashboard | `operations/coach-dashboard` | Dashboard tour |
| Team Stats | `operations/team-stats` | — |
| Leaderboard | `operations/leaderboard` | — |
| Depth Charts | `operations/depth-charts` | Create + backfill |
| Backfill from Game | `operations/depth-chart-from-game` | Quick tip |
| Reports / Analytics | `reports/analytics` | Analytics tour |
| Integrations | `system/integrations` | PrestoSports setup |

---

*Document created for Sports2 user guide planning. Update as scope and platform choices evolve.*
