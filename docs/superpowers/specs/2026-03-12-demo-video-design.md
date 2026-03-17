# Demo Video — Design Spec

## Overview

A **1-2 minute highlight reel** of the Sports2 platform, automated via Playwright with an injected in-app HUD overlay. Target audience: technical + general (developers, partners, stakeholders).

**Goal:** Viewer walks away thinking "this platform is incredibly full-featured" while being impressed by the AI Coach streaming and pro scouting grades as standout differentiators.

## Approach

**Playwright Video with In-App Demo HUD (Approach 3)**

- Playwright drives the browser, navigating through 8 scenes
- At each scene, a floating HUD overlay is injected into the DOM via `page.evaluate()`
- HUD includes: scene title, feature callout text, optional highlight box around key UI elements
- Playwright's built-in video recording captures everything as a single `.webm` file
- Real interactions are captured: streaming responses, expand/collapse animations, table sorting

## HUD Design

The HUD is a DOM element injected at each scene transition:

```
+--------------------------------------------------+
|                                                    |
|   [Scene Title - large, semi-bold]                |
|   [Feature subtitle - smaller, muted]             |
|                                                    |
+--------------------------------------------------+
```

- Position: bottom-left corner, 24px margin
- Background: `rgba(0, 0, 0, 0.75)` with `backdrop-filter: blur(8px)`
- Text: white, system font
- Border-radius: 12px
- Padding: 16px 24px
- Animate in with CSS fade+slide (300ms)
- Optional: pulsing highlight border around a target element

## Scene Breakdown

### Scene 1 — "The Platform" (8s)
- **Navigate:** `/` (the index route — `/dashboard` redirects here)
- **HUD Title:** "Sports2"
- **HUD Subtitle:** "Baseball Operations Platform"
- **Action:** Let dashboard render with KPIs and charts visible
- **Highlight:** None (full page showcase)

### Scene 2 — "Roster Management" (8s)
- **Navigate:** `/players`
- **HUD Title:** "Player Profiles"
- **HUD Subtitle:** "Sortable Tables with Sheet View"
- **Action:** Click a column header to sort, then click a player row to open sheet modal
- **Highlight:** The sheet modal when it opens

### Scene 3 — "Pro Scouting Grades" (12s)
- **Navigate:** `/prospects` then click the first prospect that has scouting reports (preflight check confirms which one)
- **HUD Title:** "Pro-Style Scouting"
- **HUD Subtitle:** "20-80 Tool Grades with Progressive Disclosure"
- **Action:** Scroll to scouting reports section on prospect detail page (no tabs — single scrollable view). The first report auto-expands via `defaultExpanded={i === 0}`. If collapsed, click to expand and reveal tool grades table.
- **Highlight:** The expanded scouting report card

### Scene 4 — "AI Coach" (15s)
- **Navigate:** `/ai-coach`
- **HUD Title:** "AI Coach"
- **HUD Subtitle:** "Real-Time Streaming Intelligence"
- **Action:** When no active conversation exists, the PromptGallery renders with quick prompt cards. Click one of the QUICK_PROMPTS cards (e.g. "Game Recap" or "Top Performers") — this triggers `createConversation()` + `sendMessage()` internally and starts the SSE streaming response. Let the streaming text render in real-time.
- **Highlight:** The streaming message bubble as text appears
- **Note:** This is the primary "wow moment" — give it the most time. Using a prompt card instead of typing is visually cleaner and showcases the prompt gallery feature.
- **Fallback:** If AI backend is unavailable, stay on the PromptGallery view and highlight the card UI

### Scene 5 — "Depth Charts" (8s)
- **Navigate:** `/depth-charts` then click into a depth chart
- **HUD Title:** "Depth Charts"
- **HUD Subtitle:** "Drag & Drop Lineup Management"
- **Action:** Show the position grid layout
- **Highlight:** The position grid

### Scene 6 — "Schedule & Calendar" (6s)
- **Navigate:** `/schedules/calendar`
- **HUD Title:** "Scheduling"
- **HUD Subtitle:** "Calendar Integration"
- **Action:** Let calendar render with events visible
- **Highlight:** None (full page)

### Scene 7 — "Integrations" (6s)
- **Navigate:** `/integrations`
- **HUD Title:** "Live Data Sync"
- **HUD Subtitle:** "PrestoSports Integration"
- **Action:** Show the integration config page
- **Highlight:** The sync configuration panel

### Scene 8 — "Tech Stack Outro" (5s)
- **Stay on current page or navigate to dashboard**
- **HUD (full-screen centered overlay):**
  ```
  Built with
  React 19 · TanStack Router · TanStack Query
  Radix UI · Tailwind v4 · SSE Streaming
  ```
- **Action:** None — static closing frame
- **Background:** Dim the page content with a dark overlay

**Total runtime: ~68 seconds**

## Technical Implementation

### Playwright Script (`tests/demo/record-demo.js`)

Uses JavaScript to match the existing test infrastructure (all tests in `tests/` are `.js`).

```
- Launch browser with video recording enabled (1440x900 viewport, deviceScaleFactor: 2)
- Lock theme to light mode: localStorage.setItem('theme', 'light')
- Authenticate (see Authentication section)
- Run preflight data checks (see Preflight section)
- For each scene:
  1. Navigate via sidebar click (not page.goto) for natural UX transitions
  2. Wait for specific content selector (NOT networkidle — unreliable with TanStack Query's parallel fetches)
  3. Inject HUD overlay via page.evaluate()
  4. Perform interactions (clicks, scrolls)
  5. Wait scene duration
  6. Remove HUD (fade out)
- Close browser, video saved automatically
```

### Wait Selectors Per Scene

Each scene waits for a concrete element instead of `networkidle`:
- Scene 1 (Dashboard): `text="Welcome back"` or the stat card grid container
- Scene 2 (Players): `table tbody tr` (at least one row)
- Scene 3 (Prospect): `text="Scouting Reports"` heading
- Scene 4 (AI Coach): `text="AI Coach Assistant"` or prompt gallery heading
- Scene 5 (Depth Charts): depth chart grid/table container
- Scene 6 (Calendar): `.rbc-calendar` (React Big Calendar root)
- Scene 7 (Integrations): integration config panel

### HUD Injection Helper

A reusable function:
```javascript
async function showHUD(page, { title, subtitle, duration, highlight })
```

- Injects a `<div id="demo-hud">` with CSS animations
- Sets `z-index: 9999` to render above Radix UI portals (sheets, dialogs)
- Optionally adds a highlight ring around `highlight` selector
- Returns a cleanup function

### Authentication

Two-step flow matching the app's CSRF-protected auth:

1. **Navigate to `/login`** — let the auth layout render
2. **Fill and submit login form** — email: `admin@sports2.com`, password: `Admin123!`
   - The app's `api-client.ts` handles CSRF token fetching automatically via interceptors
   - After login, wait for `AuthProvider` to hydrate (redirect to `/` confirms success)
3. **Alternative (faster):** Save a `storageState.json` from a manual login session and reuse with `browser.newContext({ storageState })` — avoids login UI entirely

### Preflight Data Checks

Before recording, the script hits key pages and verifies data exists:
```
- GET /players — confirm table has rows
- GET /prospects — find a prospect with scouting reports
- GET /depth-charts — confirm at least one exists
- GET /schedules/calendar — confirm events render
```
If any check fails, log a clear error and abort with instructions to seed data.

### Output

- Playwright saves `.webm` video to `tests/demo/output/`
- Viewport: 1440x900 with `deviceScaleFactor: 2` for sharp text
- Framerate: Playwright default (25fps)
- The 1440px viewport makes the sidebar proportionally more visible and the layout feel denser

## Constraints

- No modifications to application source code — HUD is injected via Playwright only
- Script must work against the running dev server (`npm run dev`)
- AI Coach scene depends on backend being available for streaming response
- If AI backend is unavailable, fall back to showing the prompt gallery UI instead
- Theme is locked to light mode at recording start to ensure consistency
- Navigation uses sidebar clicks (not direct URL navigation) for natural UX feel

## Non-Goals

- Voiceover / audio — user adds post-recording if desired
- Video editing / post-production — single continuous take
- Mobile/responsive demo — desktop only for v1
- Subtitles or captions
