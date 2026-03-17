# Demo Video Recording Script — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Playwright script that records a 1-2 minute highlight reel of the Sports2 platform with an injected HUD overlay, producing a `.webm` video file.

**Architecture:** A single Playwright script (`tests/demo/record-demo.js`) drives the browser through 8 scenes. Helper modules handle HUD injection, authentication, and preflight data validation. The HUD is a DOM element injected via `page.evaluate()` at each scene with CSS animations. Video is captured by Playwright's built-in `recordVideo`.

**Tech Stack:** Playwright (existing in project), JavaScript (matches existing test infra)

**Spec:** `docs/superpowers/specs/2026-03-12-demo-video-design.md`

---

## File Structure

```
tests/demo/
├── record-demo.js          # Main recording script (entry point)
├── helpers/
│   ├── hud.js              # HUD inject/remove/highlight helpers
│   ├── auth.js             # Login flow helper
│   └── preflight.js        # Data health check before recording
└── output/                 # Video output directory (gitignored)
```

---

## Chunk 1: Infrastructure Setup

### Task 1: Create demo directory structure

**Files:**
- Create: `tests/demo/output/.gitkeep`
- Modify: `.gitignore`

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p tests/demo/helpers tests/demo/output
touch tests/demo/output/.gitkeep
```

- [ ] **Step 2: Add output directory to .gitignore**

Append to `.gitignore`:
```
# Demo video output
tests/demo/output/*.webm
```

- [ ] **Step 3: Commit**

```bash
git add tests/demo/output/.gitkeep .gitignore
git commit -m "chore: scaffold demo recording directory structure"
```

---

### Task 2: Create HUD injection helper

**Files:**
- Create: `tests/demo/helpers/hud.js`

The HUD helper provides three functions:
- `showHUD(page, { title, subtitle })` — injects the overlay, returns cleanup fn
- `removeHUD(page)` — fades out and removes the overlay
- `highlightElement(page, selector)` — adds a pulsing border around a target element
- `removeHighlight(page)` — removes the highlight
- `showOutro(page, lines)` — full-screen centered tech stack outro

- [ ] **Step 1: Create the HUD helper**

```javascript
// tests/demo/helpers/hud.js

/**
 * Inject a HUD overlay into the bottom-left corner of the page.
 * Returns a cleanup function.
 */
async function showHUD(page, { title, subtitle }) {
  await page.evaluate(
    ({ title, subtitle }) => {
      // Remove any existing HUD
      const existing = document.getElementById('demo-hud');
      if (existing) existing.remove();

      const hud = document.createElement('div');
      hud.id = 'demo-hud';
      hud.innerHTML = `
        <div style="font-size: 20px; font-weight: 600; color: white; line-height: 1.3;">${title}</div>
        <div style="font-size: 14px; color: rgba(255,255,255,0.7); margin-top: 4px;">${subtitle}</div>
      `;
      Object.assign(hud.style, {
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: '12px',
        padding: '16px 24px',
        zIndex: '9999',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity: '0',
        transform: 'translateY(10px)',
        transition: 'opacity 300ms ease, transform 300ms ease',
        maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      });
      document.body.appendChild(hud);

      // Double-rAF to ensure initial state is painted before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          hud.style.opacity = '1';
          hud.style.transform = 'translateY(0)';
        });
      });
    },
    { title, subtitle }
  );
}

/**
 * Fade out and remove the HUD overlay.
 */
async function removeHUD(page) {
  await page.evaluate(() => {
    const hud = document.getElementById('demo-hud');
    if (!hud) return;
    hud.style.opacity = '0';
    hud.style.transform = 'translateY(10px)';
    setTimeout(() => hud.remove(), 300);
  });
  // Wait for fade-out animation
  await page.waitForTimeout(350);
}

/**
 * Add a pulsing highlight ring around a target element.
 */
async function highlightElement(page, selector) {
  await page.evaluate((sel) => {
    const existing = document.getElementById('demo-highlight');
    if (existing) existing.remove();

    const target = document.querySelector(sel);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.id = 'demo-highlight';

    // Add keyframes
    const style = document.createElement('style');
    style.id = 'demo-highlight-style';
    style.textContent = `
      @keyframes demo-pulse {
        0%, 100% { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.6); }
        50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); }
      }
    `;
    document.head.appendChild(style);

    Object.assign(highlight.style, {
      position: 'fixed',
      top: `${rect.top - 4}px`,
      left: `${rect.left - 4}px`,
      width: `${rect.width + 8}px`,
      height: `${rect.height + 8}px`,
      borderRadius: '8px',
      animation: 'demo-pulse 1.5s ease-in-out infinite',
      zIndex: '9998',
      pointerEvents: 'none',
    });
    document.body.appendChild(highlight);
  }, selector);
}

/**
 * Remove the highlight ring.
 */
async function removeHighlight(page) {
  await page.evaluate(() => {
    const highlight = document.getElementById('demo-highlight');
    if (highlight) highlight.remove();
    const style = document.getElementById('demo-highlight-style');
    if (style) style.remove();
  });
}

/**
 * Show a full-screen centered overlay for the tech stack outro.
 */
async function showOutro(page, lines) {
  await page.evaluate((lines) => {
    const existing = document.getElementById('demo-hud');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'demo-hud';
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 16px; color: rgba(255,255,255,0.6); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 2px;">Built with</div>
        ${lines.map((line) => `<div style="font-size: 22px; font-weight: 600; color: white; line-height: 1.6;">${line}</div>`).join('')}
      </div>
    `;
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      opacity: '0',
      transition: 'opacity 500ms ease',
    });
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
  }, lines);
}

module.exports = { showHUD, removeHUD, highlightElement, removeHighlight, showOutro };
```

- [ ] **Step 2: Verify file syntax**

```bash
node -c tests/demo/helpers/hud.js
```

Expected: No output (syntax OK)

- [ ] **Step 3: Commit**

```bash
git add tests/demo/helpers/hud.js
git commit -m "feat(demo): add HUD overlay injection helper"
```

---

### Task 3: Create authentication helper

**Files:**
- Create: `tests/demo/helpers/auth.js`

Handles login via the UI form. The app's axios interceptors handle CSRF token fetching automatically, so we just need to fill the form and submit.

- [ ] **Step 1: Create the auth helper**

```javascript
// tests/demo/helpers/auth.js

const BASE_URL = process.env.DEMO_BASE_URL || 'http://localhost:3000';

/**
 * Log in via the login form UI.
 * Waits for redirect to '/' to confirm success.
 */
async function login(page, { email = 'admin@sports2.com', password = 'Admin123!' } = {}) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });

  // Wait for login form to render
  await page.getByLabel('Email').waitFor({ state: 'visible', timeout: 10000 });

  // Fill credentials
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);

  // Submit
  await page.getByRole('button', { name: /Sign in/i }).click();

  // Wait for successful redirect to dashboard
  await page.waitForURL('**/', { timeout: 15000 });

  // Wait for dashboard content to hydrate
  await page.waitForTimeout(1000);
}

module.exports = { login, BASE_URL };
```

- [ ] **Step 2: Verify file syntax**

```bash
node -c tests/demo/helpers/auth.js
```

- [ ] **Step 3: Commit**

```bash
git add tests/demo/helpers/auth.js
git commit -m "feat(demo): add authentication helper for demo recording"
```

---

### Task 4: Create preflight data checker

**Files:**
- Create: `tests/demo/helpers/preflight.js`

Before recording, navigates to key pages and verifies data is present. Returns metadata (e.g. which prospect has scouting reports) for the recording script to use.

- [ ] **Step 1: Create the preflight helper**

```javascript
// tests/demo/helpers/preflight.js
const { BASE_URL } = require('./auth');

/**
 * Run preflight checks to verify demo data is present.
 * Returns scene metadata (e.g. prospect ID with scouting reports).
 * Warns if critical data is missing.
 */
async function runPreflight(page) {
  const results = {
    hasPlayers: false,
    hasProspectWithReports: false,
    prospectSelector: null,
    hasDepthCharts: false,
    depthChartSelector: null,
    hasCalendarEvents: false,
  };

  console.log('🔍 Running preflight data checks...\n');

  // Check players
  await page.goto(`${BASE_URL}/players`, { waitUntil: 'domcontentloaded' });
  try {
    await page.locator('table tbody tr').first().waitFor({ state: 'visible', timeout: 8000 });
    results.hasPlayers = true;
    console.log('  ✓ Players: data found');
  } catch {
    console.log('  ✗ Players: no data — Scene 2 will be empty');
  }

  // Check prospects (find one with scouting reports)
  await page.goto(`${BASE_URL}/prospects`, { waitUntil: 'domcontentloaded' });
  try {
    await page.locator('table tbody tr').first().waitFor({ state: 'visible', timeout: 8000 });
    // Click the first prospect link to check for scouting reports (rows are not clickable)
    const firstLink = page.locator('a[href*="/prospects/"]').first();
    await firstLink.click();
    await page.waitForTimeout(2000);

    // Check if scouting reports section has content
    const reportsHeading = page.locator('text=/Scouting Reports/');
    if (await reportsHeading.isVisible()) {
      results.hasProspectWithReports = true;
      console.log('  ✓ Prospects: found prospect with scouting reports');
    }
    // Navigate back
    await page.goBack();
  } catch {
    console.log('  ✗ Prospects: no data — Scene 3 will be empty');
  }

  // Check depth charts
  await page.goto(`${BASE_URL}/depth-charts`, { waitUntil: 'domcontentloaded' });
  try {
    const depthChartLink = page.locator('a[href*="/depth-charts/"]').first();
    await depthChartLink.waitFor({ state: 'visible', timeout: 8000 });
    results.hasDepthCharts = true;
    results.depthChartSelector = await depthChartLink.getAttribute('href');
    console.log(`  ✓ Depth Charts: found (${results.depthChartSelector})`);
  } catch {
    console.log('  ✗ Depth Charts: no data — Scene 5 will be empty');
  }

  // Check calendar
  await page.goto(`${BASE_URL}/schedules/calendar`, { waitUntil: 'domcontentloaded' });
  try {
    await page.locator('.rbc-calendar').waitFor({ state: 'visible', timeout: 8000 });
    results.hasCalendarEvents = true;
    console.log('  ✓ Calendar: rendered');
  } catch {
    console.log('  ✗ Calendar: not rendering — Scene 6 may be empty');
  }

  console.log('\n📋 Preflight complete.\n');

  // Fail on critical missing data
  const critical = [];
  if (!results.hasPlayers) critical.push('Players');
  if (!results.hasProspectWithReports) critical.push('Prospects with scouting reports');

  if (critical.length > 0) {
    console.warn(`⚠️  Warning: Missing data for: ${critical.join(', ')}`);
    console.warn('   The recording will proceed but some scenes may show empty states.\n');
  }

  return results;
}

module.exports = { runPreflight };
```

- [ ] **Step 2: Verify file syntax**

```bash
node -c tests/demo/helpers/preflight.js
```

- [ ] **Step 3: Commit**

```bash
git add tests/demo/helpers/preflight.js
git commit -m "feat(demo): add preflight data validation for demo recording"
```

---

## Chunk 2: Main Recording Script

### Task 5: Create the main recording script

**Files:**
- Create: `tests/demo/record-demo.js`

This is the main entry point. It launches Playwright, authenticates, runs preflight, then records all 8 scenes in sequence.

- [ ] **Step 1: Create the recording script**

```javascript
// tests/demo/record-demo.js
const { chromium } = require('playwright');
const { showHUD, removeHUD, highlightElement, removeHighlight, showOutro } = require('./helpers/hud');
const { login, BASE_URL } = require('./helpers/auth');
const { runPreflight } = require('./helpers/preflight');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');

// Scene durations in ms
const SCENE_DURATION = {
  dashboard: 8000,
  players: 8000,
  scouting: 12000,
  aiCoach: 15000,
  depthCharts: 8000,
  calendar: 6000,
  integrations: 6000,
  outro: 5000,
};

async function recordDemo() {
  console.log('🎬 Starting demo recording...\n');

  const browser = await chromium.launch({
    headless: false, // Show browser during recording
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  // Lock theme to light mode (app reads from cookies, not localStorage)
  await page.addInitScript(() => {
    document.cookie = 'vite-ui-theme=light; path=/; max-age=86400';
  });

  try {
    // ── Authenticate ──
    console.log('🔐 Logging in...');
    await login(page);
    console.log('   Logged in successfully.\n');

    // ── Preflight ──
    const preflight = await runPreflight(page);

    // ── Begin Recording ──
    console.log('🎥 Recording scenes...\n');

    // ── Scene 1: Dashboard ──
    console.log('  Scene 1: Dashboard');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Let stat cards and charts load
    await showHUD(page, {
      title: 'Sports2',
      subtitle: 'Baseball Operations Platform',
    });
    await page.waitForTimeout(SCENE_DURATION.dashboard);
    await removeHUD(page);

    // ── Scene 2: Players ──
    console.log('  Scene 2: Players');
    // Navigate via sidebar
    await openSidebarGroup(page, 'Roster');
    await page.getByRole('link', { name: 'Players' }).click();
    await page.locator('table tbody tr').first().waitFor({ state: 'visible', timeout: 10000 });
    await showHUD(page, {
      title: 'Player Profiles',
      subtitle: 'Sortable Tables with Sheet View',
    });
    await page.waitForTimeout(1500);

    // Click a column header to sort
    const nameHeader = page.locator('table thead th').first().locator('button');
    if (await nameHeader.isVisible()) {
      await nameHeader.click();
      await page.waitForTimeout(800);
    }

    // Click a player row to open sheet
    await page.locator('table tbody tr').first().click();
    await page.waitForTimeout(1500);
    // Highlight the sheet dialog
    await highlightElement(page, '[role="dialog"]');
    await page.waitForTimeout(SCENE_DURATION.players - 3800);
    await removeHighlight(page);
    // Close the sheet by pressing Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await removeHUD(page);

    // ── Scene 3: Scouting ──
    console.log('  Scene 3: Scouting');
    await openSidebarGroup(page, 'Recruiting');
    await page.getByRole('link', { name: 'Prospects' }).click();
    await page.waitForTimeout(2000);

    if (preflight.hasProspectWithReports) {
      // Click the first prospect link (rows are not clickable — navigation is via <Link> on ID column)
      await page.locator('a[href*="/prospects/"]').first().click();
      await page.waitForTimeout(2000);
    }

    await showHUD(page, {
      title: 'Pro-Style Scouting',
      subtitle: '20-80 Tool Grades with Progressive Disclosure',
    });

    // Scroll to scouting reports section
    const scoutingSection = page.locator('text=/Scouting Reports/').first();
    if (await scoutingSection.isVisible()) {
      await scoutingSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    }

    // The first report auto-expands; highlight the scouting report card
    await highlightElement(page, '[role="dialog"], [data-slot="card"]');
    await page.waitForTimeout(SCENE_DURATION.scouting - 5000);
    await removeHighlight(page);
    await removeHUD(page);
    // Navigate directly to prospects list (goBack can be unreliable with history depth)
    await page.goto(`${BASE_URL}/prospects`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // ── Scene 4: AI Coach ──
    console.log('  Scene 4: AI Coach');
    await openSidebarGroup(page, 'AI Coach');
    await page.getByRole('link', { name: 'Chat' }).click();
    await page.waitForTimeout(2000);

    await showHUD(page, {
      title: 'AI Coach',
      subtitle: 'Real-Time Streaming Intelligence',
    });

    // Click a prompt gallery card to trigger streaming
    const promptCard = page.locator('.cursor-pointer').filter({ hasText: 'Game Recap' }).first();
    if (await promptCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await promptCard.click();
      // Wait for streaming response to render
      await page.waitForTimeout(SCENE_DURATION.aiCoach - 2000);
    } else {
      // Fallback: just show the prompt gallery
      console.log('    (AI backend unavailable — showing prompt gallery)');
      await page.waitForTimeout(SCENE_DURATION.aiCoach - 2000);
    }
    await removeHUD(page);

    // ── Scene 5: Depth Charts ──
    console.log('  Scene 5: Depth Charts');
    await openSidebarGroup(page, 'Operations');
    await page.getByRole('link', { name: 'Depth Charts' }).click();
    await page.waitForTimeout(2000);

    if (preflight.hasDepthCharts && preflight.depthChartSelector) {
      await page.goto(`${BASE_URL}${preflight.depthChartSelector}`, {
        waitUntil: 'domcontentloaded',
      });
      await page.waitForTimeout(2000);
    }

    await showHUD(page, {
      title: 'Depth Charts',
      subtitle: 'Drag & Drop Lineup Management',
    });
    await page.waitForTimeout(SCENE_DURATION.depthCharts);
    await removeHUD(page);

    // ── Scene 6: Calendar ──
    console.log('  Scene 6: Calendar');
    // Calendar is inside Operations group — ensure it's expanded
    await openSidebarGroup(page, 'Operations');
    await page.getByRole('link', { name: 'Calendar' }).click();
    await page.waitForTimeout(2000);

    await showHUD(page, {
      title: 'Scheduling',
      subtitle: 'Calendar Integration',
    });
    await page.waitForTimeout(SCENE_DURATION.calendar);
    await removeHUD(page);

    // ── Scene 7: Integrations ──
    console.log('  Scene 7: Integrations');
    // Integrations is in the System sidebar section — scroll sidebar down if needed
    const integrationsLink = page.getByRole('link', { name: 'Integrations' });
    await integrationsLink.scrollIntoViewIfNeeded();
    await integrationsLink.click();
    await page.waitForTimeout(2000);

    await showHUD(page, {
      title: 'Live Data Sync',
      subtitle: 'PrestoSports Integration',
    });
    await page.waitForTimeout(SCENE_DURATION.integrations);
    await removeHUD(page);

    // ── Scene 8: Tech Stack Outro ──
    console.log('  Scene 8: Outro');
    await showOutro(page, [
      'React 19 \u00b7 TanStack Router \u00b7 TanStack Query',
      'Radix UI \u00b7 Tailwind v4 \u00b7 SSE Streaming',
    ]);
    await page.waitForTimeout(SCENE_DURATION.outro);

    console.log('\n✅ All scenes recorded.\n');
  } catch (error) {
    console.error('\n❌ Recording failed:', error.message);
    console.error(error.stack);
  } finally {
    // Close context to finalize video
    await page.close();
    await context.close();
    await browser.close();

    console.log(`📁 Video saved to: ${OUTPUT_DIR}/`);
    console.log('   Look for the .webm file in that directory.\n');
  }
}

/**
 * Open a sidebar navigation group by clicking its collapsible trigger.
 * Handles cases where the group may already be expanded.
 */
async function openSidebarGroup(page, groupName) {
  const trigger = page.locator(`button, [role="button"]`)
    .filter({ hasText: new RegExp(`^${groupName}$`, 'i') })
    .first();

  if (await trigger.isVisible({ timeout: 2000 }).catch(() => false)) {
    // Check if group is already expanded (has aria-expanded="true" or sibling content visible)
    const isExpanded = await trigger.getAttribute('aria-expanded').catch(() => null);
    if (isExpanded !== 'true') {
      await trigger.click();
      await page.waitForTimeout(300); // Wait for expand animation
    }
  }
}

// Run
recordDemo().catch(console.error);
```

- [ ] **Step 2: Verify file syntax**

```bash
node -c tests/demo/record-demo.js
```

- [ ] **Step 3: Add an npm script for convenience**

Add to the root `package.json`:
```json
"demo:record": "node tests/demo/record-demo.js"
```

In `v2/package.json` this is not needed — the script runs from the repo root using Playwright directly.

- [ ] **Step 4: Commit**

```bash
git add tests/demo/record-demo.js package.json
git commit -m "feat(demo): add main recording script with 8 scenes and HUD overlays"
```

---

## Chunk 3: Run & Verify

### Task 6: Run the recording and verify output

**Prerequisites:** Dev server must be running (`npm run dev`) and backend must be accessible.

- [ ] **Step 1: Start the dev server (if not already running)**

```bash
npm run dev
```

- [ ] **Step 2: Run the recording**

```bash
npm run demo:record
```

Expected output:
```
🎬 Starting demo recording...

🔐 Logging in...
   Logged in successfully.

🔍 Running preflight data checks...

  ✓ Players: data found
  ✓ Prospects: found prospect with scouting reports
  ✓ Depth Charts: found
  ✓ Calendar: rendered

📋 Preflight complete.

🎥 Recording scenes...

  Scene 1: Dashboard
  Scene 2: Players
  Scene 3: Scouting
  Scene 4: AI Coach
  Scene 5: Depth Charts
  Scene 6: Calendar
  Scene 7: Integrations
  Scene 8: Outro

✅ All scenes recorded.

📁 Video saved to: tests/demo/output/
```

- [ ] **Step 3: Verify the video file exists and has reasonable size**

```bash
ls -lh tests/demo/output/*.webm
```

Expected: One `.webm` file, roughly 5-20 MB depending on content.

- [ ] **Step 4: Watch the video and note any issues**

Open the `.webm` file in a media player (VLC, browser) and check:
- All 8 scenes are present
- HUD overlays appear and disappear smoothly
- Text is readable (deviceScaleFactor: 2 should help)
- AI Coach streaming is captured (if backend was available)
- No blank screens or loading spinners dominating scenes

- [ ] **Step 5: Fix any timing or selector issues discovered during review**

Common adjustments:
- Increase `waitForTimeout` if pages load slowly
- Adjust selectors if sidebar items have different text than expected
- Extend AI Coach scene duration if streaming takes longer

- [ ] **Step 6: Final commit with any fixes**

```bash
git add tests/demo/
git commit -m "feat(demo): finalize demo recording script"
```
