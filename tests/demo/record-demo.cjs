// tests/demo/record-demo.cjs
const { chromium } = require('playwright');
const { showHUD, removeHUD, highlightElement, removeHighlight, showOutro, sceneTransition, initCursor, moveCursorTo } = require('./helpers/hud.cjs');
const { login, BASE_URL } = require('./helpers/auth.cjs');
const { runPreflight } = require('./helpers/preflight.cjs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');

// Scene durations in ms — relaxed pacing
const SCENE_DURATION = {
  dashboard: 12000,
  players: 14000,
  scouting: 18000,
  aiCoach: 20000,
  depthCharts: 12000,
  calendar: 10000,
  integrations: 10000,
  outro: 7000,
};

// Transition hold between scenes (ms)
const TRANSITION_HOLD = 1000;

async function recordDemo() {
  console.log('🎬 Starting demo recording...\n');

  const browser = await chromium.launch({
    headless: false,
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

    // ── Inject fake cursor (Playwright doesn't render real cursor in recordings) ──
    await initCursor(page);

    // ── Preflight ──
    const preflight = await runPreflight(page);

    // Re-inject cursor after preflight navigations
    await initCursor(page);

    // ── Begin Recording ──
    console.log('🎥 Recording scenes...\n');

    // ── Scene 1: Dashboard ──
    console.log('  Scene 1: Dashboard');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await initCursor(page);
    await showHUD(page, {
      title: 'Sports2',
      subtitle: 'Baseball Operations Platform',
    });
    // Slowly move cursor across dashboard to give it life
    await page.mouse.move(400, 300, { steps: 20 });
    await page.waitForTimeout(3000);
    await page.mouse.move(800, 400, { steps: 20 });
    await page.waitForTimeout(SCENE_DURATION.dashboard - 5000);
    await removeHUD(page);
    await sceneTransition(page, { holdMs: TRANSITION_HOLD });

    // ── Scene 2: Players ──
    console.log('  Scene 2: Players');
    await openSidebarGroup(page, 'Roster');
    const playersLink = sidebar(page).getByRole('link', { name: 'Players', exact: true });
    await moveCursorTo(page, playersLink);
    await playersLink.click();
    await page.locator('table tbody tr').first().waitFor({ state: 'visible', timeout: 10000 });
    await initCursor(page);
    await showHUD(page, {
      title: 'Player Profiles',
      subtitle: 'Sortable Tables with Sheet View',
    });
    await page.waitForTimeout(2000);

    // Click a column header to sort
    const nameHeader = page.locator('table thead th').first().locator('button');
    if (await nameHeader.isVisible()) {
      await moveCursorTo(page, nameHeader);
      await nameHeader.click();
      await page.waitForTimeout(1500);
    }

    // Click a player row to open sheet
    const firstRow = page.locator('table tbody tr').first();
    await moveCursorTo(page, firstRow);
    await firstRow.click();
    await page.waitForTimeout(2000);
    // Highlight the sheet dialog
    await highlightElement(page, '[role="dialog"]');
    await page.waitForTimeout(SCENE_DURATION.players - 5500);
    await removeHighlight(page);
    // Close the sheet by pressing Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    await removeHUD(page);
    await sceneTransition(page, { holdMs: TRANSITION_HOLD });

    // ── Scene 3: Scouting ──
    console.log('  Scene 3: Scouting');
    await openSidebarGroup(page, 'Recruiting');
    const prospectsLink = sidebar(page).getByRole('link', { name: 'Prospects', exact: true });
    await moveCursorTo(page, prospectsLink);
    await prospectsLink.click();
    await page.waitForTimeout(2500);
    await initCursor(page);

    if (preflight.hasProspectWithReports) {
      const prospectLink = page.locator('a[href*="/prospects/"]').first();
      await moveCursorTo(page, prospectLink);
      await prospectLink.click();
      await page.waitForTimeout(2500);
      await initCursor(page);
    }

    await showHUD(page, {
      title: 'Pro-Style Scouting',
      subtitle: '20-80 Tool Grades with Progressive Disclosure',
    });

    // Scroll to scouting reports section
    const scoutingSection = page.locator('text=/Scouting Reports/').first();
    if (await scoutingSection.isVisible()) {
      await scoutingSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
    }

    // The first report auto-expands; highlight the scouting report card
    await highlightElement(page, '[role="dialog"], [data-slot="card"]');
    await page.waitForTimeout(SCENE_DURATION.scouting - 6500);
    await removeHighlight(page);
    await removeHUD(page);
    await sceneTransition(page, { holdMs: TRANSITION_HOLD });

    // ── Scene 4: AI Coach ──
    console.log('  Scene 4: AI Coach');
    await openSidebarGroup(page, 'AI Coach');
    const chatLink = sidebar(page).getByRole('link', { name: 'Chat', exact: true });
    await moveCursorTo(page, chatLink);
    await chatLink.click();
    await page.waitForTimeout(2500);
    await initCursor(page);

    await showHUD(page, {
      title: 'AI Coach',
      subtitle: 'Real-Time Streaming Intelligence',
    });

    // Click a prompt gallery card to trigger streaming
    const promptCard = page.locator('.cursor-pointer').filter({ hasText: 'Game Recap' }).first();
    if (await promptCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.waitForTimeout(1000);
      await moveCursorTo(page, promptCard);
      await promptCard.click();
      // Wait for streaming response to render
      await page.waitForTimeout(SCENE_DURATION.aiCoach - 3500);
    } else {
      // Fallback: just show the prompt gallery
      console.log('    (AI backend unavailable — showing prompt gallery)');
      await page.waitForTimeout(SCENE_DURATION.aiCoach - 2500);
    }
    await removeHUD(page);
    await sceneTransition(page, { holdMs: TRANSITION_HOLD });

    // ── Scene 5: Depth Charts ──
    console.log('  Scene 5: Depth Charts');
    await openSidebarGroup(page, 'Operations');
    const depthChartsLink = sidebar(page).getByRole('link', { name: 'Depth Charts', exact: true });
    await moveCursorTo(page, depthChartsLink);
    await depthChartsLink.click();
    await page.waitForTimeout(2500);
    await initCursor(page);

    if (preflight.hasDepthCharts && preflight.depthChartSelector) {
      await page.goto(`${BASE_URL}${preflight.depthChartSelector}`, {
        waitUntil: 'domcontentloaded',
      });
      await page.waitForTimeout(2500);
      await initCursor(page);
    }

    await showHUD(page, {
      title: 'Depth Charts',
      subtitle: 'Drag & Drop Lineup Management',
    });
    await page.mouse.move(700, 400, { steps: 15 });
    await page.waitForTimeout(SCENE_DURATION.depthCharts - 2000);
    await removeHUD(page);
    await sceneTransition(page, { holdMs: TRANSITION_HOLD });

    // ── Scene 6: Calendar ──
    console.log('  Scene 6: Calendar');
    await openSidebarGroup(page, 'Operations');
    const calendarLink = sidebar(page).getByRole('link', { name: 'Calendar', exact: true });
    await moveCursorTo(page, calendarLink);
    await calendarLink.click();
    await page.waitForTimeout(2500);
    await initCursor(page);

    await showHUD(page, {
      title: 'Scheduling',
      subtitle: 'Calendar Integration',
    });
    await page.mouse.move(700, 350, { steps: 15 });
    await page.waitForTimeout(SCENE_DURATION.calendar - 2000);
    await removeHUD(page);
    await sceneTransition(page, { holdMs: TRANSITION_HOLD });

    // ── Scene 7: Integrations ──
    console.log('  Scene 7: Integrations');
    const integrationsLink = sidebar(page).getByRole('link', { name: 'Integrations' });
    await integrationsLink.scrollIntoViewIfNeeded();
    await moveCursorTo(page, integrationsLink);
    await integrationsLink.click();
    await page.waitForTimeout(2500);
    await initCursor(page);

    await showHUD(page, {
      title: 'Live Data Sync',
      subtitle: 'PrestoSports Integration',
    });
    await page.mouse.move(700, 400, { steps: 15 });
    await page.waitForTimeout(SCENE_DURATION.integrations - 2000);
    await removeHUD(page);
    await sceneTransition(page, { holdMs: TRANSITION_HOLD });

    // ── Scene 8: Tech Stack Outro ──
    console.log('  Scene 8: Outro');
    await showOutro(page, [
      'React 19 \u00b7 TanStack Router \u00b7 TanStack Query',
      'Radix UI \u00b7 Tailwind v4 \u00b7 SSE Streaming',
    ]);
    await page.waitForTimeout(SCENE_DURATION.outro);

    console.log('\n\u2705 All scenes recorded.\n');
  } catch (error) {
    console.error('\n\u274c Recording failed:', error.message);
    console.error(error.stack);
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    console.log(`\ud83d\udcc1 Video saved to: ${OUTPUT_DIR}/`);
    console.log('   Look for the .webm file in that directory.\n');
  }
}

/**
 * Get a locator scoped to the sidebar.
 */
function sidebar(page) {
  return page.locator('[data-slot="sidebar"]').first();
}

/**
 * Open a sidebar navigation group by clicking its collapsible trigger.
 */
async function openSidebarGroup(page, groupName) {
  const trigger = sidebar(page).locator(`button, [role="button"]`)
    .filter({ hasText: new RegExp(`^${groupName}$`, 'i') })
    .first();

  if (await trigger.isVisible({ timeout: 2000 }).catch(() => false)) {
    const isExpanded = await trigger.getAttribute('aria-expanded').catch(() => null);
    if (isExpanded !== 'true') {
      await moveCursorTo(page, trigger, { pauseMs: 200 });
      await trigger.click();
      await page.waitForTimeout(400);
    }
  }
}

// Run
recordDemo().catch(console.error);
