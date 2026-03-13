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

    // ── Preflight ──
    const preflight = await runPreflight(page);

    // ── Begin Recording ──
    console.log('🎥 Recording scenes...\n');

    // ── Scene 1: Dashboard ──
    console.log('  Scene 1: Dashboard');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await showHUD(page, {
      title: 'Sports2',
      subtitle: 'Baseball Operations Platform',
    });
    await page.waitForTimeout(SCENE_DURATION.dashboard);
    await removeHUD(page);

    // ── Scene 2: Players ──
    console.log('  Scene 2: Players');
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
    // Navigate directly to prospects list
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
    const isExpanded = await trigger.getAttribute('aria-expanded').catch(() => null);
    if (isExpanded !== 'true') {
      await trigger.click();
      await page.waitForTimeout(300);
    }
  }
}

// Run
recordDemo().catch(console.error);
