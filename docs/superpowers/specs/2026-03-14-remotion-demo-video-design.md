# Hybrid Remotion + Playwright Demo Video — Design Spec

## Overview

A **~78 second highlight reel** of the Sports2 platform, built with a two-stage pipeline: Playwright captures assets from the live app, Remotion composes them into a polished video with animated transitions and HUD overlays.

**Audience:** Technical + general (developers, partners, stakeholders)

**Goal:** Viewer walks away thinking "this platform is incredibly full-featured" while being impressed by the AI Coach streaming and pro scouting grades as standout differentiators.

**Duration breakdown:** 7 scenes (63s) + outro (5s) + 7 interstitial transitions (10.5s) = **78.5 seconds (~2355 frames at 30fps)**. Transitions occur between every consecutive scene pair (6) plus one before the outro (1) = 7 total.

## Architecture

### Two-Stage Pipeline

```
Stage 1: Playwright Asset Capture (this repo)
  └─ Navigates live app → screenshots + short .webm clips
  └─ Outputs to: tests/demo/assets/

Stage 2: Remotion Composition (separate repo)
  └─ Reads assets from a local path or copied directory
  └─ Composes React components → renders MP4 + WebM
  └─ Output: out/demo.mp4, out/demo.webm
```

### Stage 1 — Playwright Asset Capture

Reuses the existing navigation logic from `tests/demo/record-demo.cjs`. Refactored to:

1. **Screenshot mode**: Navigate to a page, wait for content, take a high-res screenshot (1440x900 @ deviceScaleFactor 2 = 2880x1800 PNG)
2. **Clip mode**: Navigate to a page, start video recording, perform interactions, stop recording after N seconds, save .webm clip

No HUD injection, no cursor injection — Remotion handles all overlays.

**Playwright configuration:**
- **Screenshots:** `headless: true`, `deviceScaleFactor: 2` for retina PNGs
- **Clips:** `headless: true`, `recordVideo: { dir: '...', size: { width: 1440, height: 900 } }` — headless ensures no system cursor appears in recordings (Remotion does not overlay a cursor on clips, so clean footage is desired)
- **Viewport:** `{ width: 1440, height: 900 }` for all contexts

**Output structure:**
```
tests/demo/assets/
├── screenshots/
│   ├── 01-dashboard.png
│   ├── 05-depth-charts.png
│   ├── 06-calendar.png
│   └── 07-integrations.png
├── clips/
│   ├── 02-players.webm        (sort + sheet open)
│   ├── 03-scouting.webm       (card expand, scroll)
│   └── 04-ai-coach.webm       (prompt click + streaming)
└── manifest.json              (metadata: scene order, durations, labels)
```

**manifest.json** provides the Remotion project with scene metadata:
```json
{
  "scenes": [
    { "id": "dashboard", "type": "screenshot", "file": "screenshots/01-dashboard.png", "durationSec": 6, "hud": { "title": "Sports2", "subtitle": "Baseball Operations Platform" } },
    { "id": "players", "type": "clip", "file": "clips/02-players.webm", "durationSec": 10, "hud": { "title": "Player Profiles", "subtitle": "Sortable Tables with Sheet View" } },
    { "id": "scouting", "type": "clip", "file": "clips/03-scouting.webm", "durationSec": 12, "hud": { "title": "Pro-Style Scouting", "subtitle": "20-80 Tool Grades with Progressive Disclosure" } },
    { "id": "ai-coach", "type": "clip", "file": "clips/04-ai-coach.webm", "durationSec": 15, "hud": { "title": "AI Coach", "subtitle": "Real-Time Streaming Intelligence" } },
    { "id": "depth-charts", "type": "screenshot", "file": "screenshots/05-depth-charts.png", "durationSec": 8, "hud": { "title": "Depth Charts", "subtitle": "Drag & Drop Lineup Management" } },
    { "id": "calendar", "type": "screenshot", "file": "screenshots/06-calendar.png", "durationSec": 6, "hud": { "title": "Scheduling", "subtitle": "Calendar Integration" } },
    { "id": "integrations", "type": "screenshot", "file": "screenshots/07-integrations.png", "durationSec": 6, "hud": { "title": "Live Data Sync", "subtitle": "PrestoSports Integration" } }
  ],
  "outro": {
    "durationSec": 5,
    "lines": [
      "React 19 · TanStack Router · TanStack Query",
      "Radix UI · Tailwind v4 · SSE Streaming"
    ]
  },
  "transitionDurationSec": 1.5
}
```

**Manifest schema (TypeScript):**
```typescript
interface ManifestScene {
  id: string;                    // unique scene identifier
  type: 'screenshot' | 'clip';  // determines which Remotion component renders it
  file: string;                  // relative path from assets root
  durationSec: number;           // scene duration in seconds (for clips: actual recorded length)
  hud: {
    title: string;               // required — HUD title text
    subtitle: string;            // required — HUD subtitle text
  };
}

interface Manifest {
  scenes: ManifestScene[];       // ordered array of scenes
  outro: {
    durationSec: number;
    lines: string[];
  };
  transitionDurationSec: number; // duration of interstitial fade-to-black between scenes
}
```

### Stage 2 — Remotion Composition (Separate Repo)

A standalone Remotion project that reads the asset manifest and composes the final video.

**Project structure:**
```
sports2-demo-video/
├── src/
│   ├── Root.tsx                 # Registers the composition
│   ├── DemoVideo.tsx            # Main composition — sequences all scenes
│   ├── components/
│   │   ├── Scene.tsx            # Renders a screenshot or clip with HUD
│   │   ├── ScreenshotScene.tsx  # Static image with subtle Ken Burns zoom
│   │   ├── ClipScene.tsx        # Embedded video clip via <OffthreadVideo>
│   │   ├── HudOverlay.tsx       # Animated title/subtitle badge
│   │   ├── SceneTransition.tsx  # Fade-to-black between scenes
│   │   └── TechStackOutro.tsx   # Final "Built with" overlay
│   └── lib/
│       └── manifest.ts          # Loads and types the manifest.json
├── public/
│   └── assets/                  # Copied from Stage 1 output
│       ├── screenshots/
│       ├── clips/
│       └── manifest.json
├── package.json
├── tsconfig.json
└── remotion.config.ts
```

**Key Remotion components:**

#### DemoVideo.tsx
The root composition. Reads the manifest, calculates frame offsets, and lays out `<Sequence>` blocks. Transitions are **interstitial** (fully sequential black frames inserted between scenes, not overlapping crossfades):

```
<Sequence from={0} durationInFrames={180}>
  <Scene scene={scenes[0]} />           // Dashboard (6s)
</Sequence>
<Sequence from={180} durationInFrames={45}>
  <SceneTransition />                    // Fade to black (1.5s)
</Sequence>
<Sequence from={225} durationInFrames={300}>
  <Scene scene={scenes[1]} />           // Players clip (10s)
</Sequence>
...
<Sequence from={lastSceneEnd} durationInFrames={45}>
  <SceneTransition />                    // Transition into outro
</Sequence>
<Sequence from={lastSceneEnd + 45} durationInFrames={150}>
  <TechStackOutro lines={outro.lines} />
</Sequence>
```

Frame offsets are calculated dynamically from the manifest durations + transition durations.

#### ScreenshotScene.tsx
- Displays a static PNG using `<Img>`
- Applies a subtle Ken Burns effect: slow 5% zoom over the scene duration using `interpolate(frame, [0, duration], [1, 1.05])` with `transform-origin: center center`

#### ClipScene.tsx
- Embeds a .webm clip using `<OffthreadVideo>`
- Clip plays in real-time within the Remotion frame timeline
- No cursor overlay — clips are captured headless with clean footage

#### HudOverlay.tsx
- Positioned bottom-left, same styling as current HUD (dark blur, white text)
- Animates in with `spring()` (slide up + fade in) at scene start
- Animates out 1 second before scene ends (this 1 second is within the scene duration, before the interstitial transition begins)
- `z-index` above video content

#### SceneTransition.tsx
- Full-screen black overlay
- Opacity interpolates: 0 → 1 → 1 → 0 over ~1.5 seconds (45 frames at 30fps)
- Placed between every scene pair and before the outro (7 total transitions)

#### TechStackOutro.tsx
- Full-screen dark overlay with centered text
- "Built with" label + tech stack lines
- Fade in with `interpolate()` over 15 frames
- Hold for remaining duration

### Video Configuration

- **Resolution:** 1440x900
- **FPS:** 30
- **Total frames:** ~2355 (calculated from manifest)
- **Output formats:** MP4 (H.264) + WebM (VP9)
- **Render command:** `npx remotion render DemoVideo out/demo.mp4 && npx remotion render DemoVideo out/demo.webm --codec=vp9`

## Workflow

1. Start dev server: `npm run dev` (in sports2-frontend)
2. Run asset capture: `npm run demo:capture` (in sports2-frontend)
3. Copy assets: `rsync -av tests/demo/assets/ ../sports2-demo-video/public/assets/`
4. Preview in Remotion Studio: `npm start` (in sports2-demo-video)
5. Render final video: `npm run render` (outputs MP4 + WebM)

## Stage 1 Changes (This Repo)

Refactor `tests/demo/record-demo.cjs` into `tests/demo/capture-assets.cjs`:
- Remove all HUD injection code (Remotion handles overlays)
- Remove cursor code (no cursor needed — clips are headless, screenshots are static)
- Remove scene transition code (Remotion handles transitions)
- Add screenshot capture for static scenes (`page.screenshot()`)
- Add clip recording for interactive scenes (context-level `recordVideo` per clip)
- Write `manifest.json` at the end with scene metadata
- Update `durationSec` for clip scenes to match actual recorded clip length
- Rename npm script: `demo:capture` instead of `demo:record`
- Clean `tests/demo/assets/screenshots/` and `tests/demo/assets/clips/` at start of each run

### Authentication & Navigation

Same as current implementation:
- Login via form (input[name="email"], input[name="password"])
- Sidebar navigation scoped to `[data-slot="sidebar"]`
- Theme locked via cookie
- Dev server on port 5173

**Auth for clip contexts:** Each clip requires a fresh browser context (for `recordVideo`). To avoid re-logging-in per clip, the capture script authenticates once in the primary context, exports `storageState` (cookies + session), then passes it to each clip context via `browser.newContext({ storageState })`.

### Clip Capture Details

For each interactive scene, create a fresh browser context with `recordVideo` and the saved `storageState`, perform the interactions, close the context to finalize the clip. The capture script records the actual clip duration and writes it to the manifest (making total video length slightly variable based on interaction timing).

- **Players clip (~10s):** Navigate to /players, wait for table rows, sort first column header, click first row to open sheet, pause on sheet, press Escape to close
- **Scouting clip (~12s):** Run preflight to discover a prospect with scouting reports (via `a[href*="/prospects/"]`), navigate to that prospect, scroll to "Scouting Reports" section, pause on expanded report card
- **AI Coach clip (~15s):** Navigate to /ai-coach, click a prompt gallery card (e.g. "Game Recap"), wait for streaming response to render
  - **Fallback:** If backend unavailable or prompt card not visible within 3s, capture as screenshot instead and update manifest `type` to `"screenshot"`

### Screenshot Capture Details

For each static scene, navigate and wait for content, then `page.screenshot({ path, fullPage: false })`:

- **Dashboard:** Navigate to `/`, wait for stat cards to be visible
- **Depth Charts:** Run preflight to discover available depth charts, navigate to the first one's detail view (`/depth-charts/:id`), wait for position grid
- **Calendar:** Navigate to `/schedules/calendar`, wait for `.rbc-calendar`
- **Integrations:** Navigate to `/integrations`, wait for config panel

### Failure Handling

- **Dev server unreachable:** Fail immediately with clear error message
- **Selector timeout:** Each scene has a 10-second wait timeout. On timeout, log a warning and capture whatever is currently visible (screenshot) or skip the scene and omit it from the manifest (clip)
- **Corrupt clip file:** Not explicitly handled — if a clip is empty or corrupt, it will be apparent during Remotion preview

## Constraints

- Stage 1 runs against the live dev server (no mocking)
- Stage 2 is a separate repo — no dependency on sports2-frontend at build time
- Assets are copied via `rsync` between repos
- AI Coach clip depends on backend availability — falls back to screenshot
- No audio/voiceover — user adds post-render if desired
- Clip durations in manifest reflect actual recorded length, not a fixed target

## Non-Goals

- Automated CI/CD pipeline for video rendering
- Mobile/responsive demo
- Subtitles or captions
- Audio track generation
- Animated cursor overlay (clips run headless with no visible cursor; screenshots are static)
