// tests/demo/capture-assets.cjs
const { chromium } = require('playwright');
const { login, BASE_URL } = require('./helpers/auth.cjs');
const { runPreflight } = require('./helpers/preflight.cjs');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, 'assets');
const SCREENSHOTS_DIR = path.join(ASSETS_DIR, 'screenshots');
const CLIPS_DIR = path.join(ASSETS_DIR, 'clips');

// Manifest scenes are built up as we capture
const manifest = {
  scenes: [],
  outro: {
    durationSec: 5,
    lines: [
      'React 19 \u00b7 TanStack Router \u00b7 TanStack Query',
      'Radix UI \u00b7 Tailwind v4 \u00b7 SSE Streaming',
    ],
  },
  transitionDurationSec: 1.5,
};

async function captureAssets() {
  console.log('📸 Starting asset capture...\n');

  // Clean previous assets
  for (const file of fs.readdirSync(SCREENSHOTS_DIR)) {
    if (file.endsWith('.png')) fs.unlinkSync(path.join(SCREENSHOTS_DIR, file));
  }
  for (const file of fs.readdirSync(CLIPS_DIR)) {
    if (file.endsWith('.webm')) fs.unlinkSync(path.join(CLIPS_DIR, file));
  }

  const browser = await chromium.launch({ headless: true });

  // Primary context for screenshots (high-res retina)
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  // Lock theme to light mode
  await page.addInitScript(() => {
    document.cookie = 'vite-ui-theme=light; path=/; max-age=86400';
  });

  try {
    // Authenticate
    console.log('🔐 Logging in...');
    await login(page);
    console.log('   Logged in.\n');

    // Preflight — discover data
    const preflight = await runPreflight(page);

    // Save auth state for clip contexts
    const storageState = await context.storageState();

    // ── Screenshot: Dashboard ──
    console.log('  📸 Screenshot 1/4: Dashboard');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000); // wait for stat cards to hydrate
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-dashboard.png'),
      fullPage: false,
    });
    manifest.scenes.push({
      id: 'dashboard',
      type: 'screenshot',
      file: 'screenshots/01-dashboard.png',
      durationSec: 6,
      hud: { title: 'Sports2', subtitle: 'Baseball Operations Platform' },
    });

    // ── Screenshot: Depth Charts ──
    console.log('  📸 Screenshot 2/4: Depth Charts');
    if (preflight.hasDepthCharts && preflight.depthChartSelector) {
      await page.goto(`${BASE_URL}${preflight.depthChartSelector}`, {
        waitUntil: 'domcontentloaded',
      });
    } else {
      await page.goto(`${BASE_URL}/depth-charts`, { waitUntil: 'domcontentloaded' });
    }
    await page.waitForTimeout(3000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-depth-charts.png'),
      fullPage: false,
    });
    manifest.scenes.push({
      id: 'depth-charts',
      type: 'screenshot',
      file: 'screenshots/05-depth-charts.png',
      durationSec: 8,
      hud: { title: 'Depth Charts', subtitle: 'Drag & Drop Lineup Management' },
    });

    // ── Screenshot: Calendar ──
    console.log('  📸 Screenshot 3/4: Calendar');
    await page.goto(`${BASE_URL}/schedules/calendar`, { waitUntil: 'domcontentloaded' });
    try {
      await page.locator('.rbc-calendar').waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      console.log('    ⚠ Calendar did not render in time, capturing anyway');
    }
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-calendar.png'),
      fullPage: false,
    });
    manifest.scenes.push({
      id: 'calendar',
      type: 'screenshot',
      file: 'screenshots/06-calendar.png',
      durationSec: 6,
      hud: { title: 'Scheduling', subtitle: 'Calendar Integration' },
    });

    // ── Screenshot: Integrations ──
    console.log('  📸 Screenshot 4/4: Integrations');
    await page.goto(`${BASE_URL}/integrations`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '07-integrations.png'),
      fullPage: false,
    });
    manifest.scenes.push({
      id: 'integrations',
      type: 'screenshot',
      file: 'screenshots/07-integrations.png',
      durationSec: 6,
      hud: { title: 'Live Data Sync', subtitle: 'PrestoSports Integration' },
    });

    // ── Clip: Players ──
    console.log('  🎬 Clip 1/3: Players');
    const playersDuration = await captureClip(
      browser,
      storageState,
      path.join(CLIPS_DIR, '02-players.webm'),
      async (clipPage) => {
        await clipPage.goto(`${BASE_URL}/players`, { waitUntil: 'domcontentloaded' });
        await clipPage.locator('table tbody tr').first().waitFor({ state: 'visible', timeout: 10000 });
        await clipPage.waitForTimeout(2000);

        // Sort by first column
        const nameHeader = clipPage.locator('table thead th').first().locator('button');
        if (await nameHeader.isVisible()) {
          await nameHeader.click();
          await clipPage.waitForTimeout(1500);
        }

        // Click first row to open player sheet
        const firstRow = clipPage.locator('table tbody tr').first();
        await firstRow.click();
        await clipPage.waitForTimeout(3000);

        // Close sheet
        await clipPage.keyboard.press('Escape');
        await clipPage.waitForTimeout(1000);
      }
    );
    manifest.scenes.push({
      id: 'players',
      type: 'clip',
      file: 'clips/02-players.webm',
      durationSec: playersDuration || 10,
      hud: { title: 'Player Profiles', subtitle: 'Sortable Tables with Sheet View' },
    });

    // ── Clip: Scouting ──
    console.log('  🎬 Clip 2/3: Scouting');
    const scoutingDuration = await captureClip(
      browser,
      storageState,
      path.join(CLIPS_DIR, '03-scouting.webm'),
      async (clipPage) => {
        if (preflight.hasProspectWithReports) {
          await clipPage.goto(`${BASE_URL}/prospects`, { waitUntil: 'domcontentloaded' });
          await clipPage.waitForTimeout(2000);

          const prospectLink = clipPage.locator('a[href*="/prospects/"]').first();
          await prospectLink.click();
          await clipPage.waitForTimeout(2500);

          // Scroll to scouting reports section
          const scoutingSection = clipPage.locator('text=/Scouting Reports/').first();
          if (await scoutingSection.isVisible()) {
            await scoutingSection.scrollIntoViewIfNeeded();
            await clipPage.waitForTimeout(3000);
          }
          await clipPage.waitForTimeout(3000);
        } else {
          // Fallback: just show prospects list
          await clipPage.goto(`${BASE_URL}/prospects`, { waitUntil: 'domcontentloaded' });
          await clipPage.waitForTimeout(5000);
        }
      }
    );
    manifest.scenes.push({
      id: 'scouting',
      type: 'clip',
      file: 'clips/03-scouting.webm',
      durationSec: scoutingDuration || 12,
      hud: { title: 'Pro-Style Scouting', subtitle: '20-80 Tool Grades with Progressive Disclosure' },
    });

    // ── Clip: AI Coach ──
    console.log('  🎬 Clip 3/3: AI Coach');
    let aiCoachIsClip = true;
    const aiCoachDuration = await captureClip(
      browser,
      storageState,
      path.join(CLIPS_DIR, '04-ai-coach.webm'),
      async (clipPage) => {
        await clipPage.goto(`${BASE_URL}/ai-coach`, { waitUntil: 'domcontentloaded' });
        await clipPage.waitForTimeout(2000);

        // Try to click a prompt gallery card
        const promptCard = clipPage
          .locator('.cursor-pointer')
          .filter({ hasText: 'Game Recap' })
          .first();
        if (await promptCard.isVisible({ timeout: 3000 }).catch(() => false)) {
          await promptCard.click();
          // Wait for streaming response
          await clipPage.waitForTimeout(12000);
        } else {
          console.log('    ⚠ AI backend unavailable — will fall back to screenshot');
          aiCoachIsClip = false;
          await clipPage.waitForTimeout(3000);
        }
      }
    );

    if (aiCoachIsClip) {
      manifest.scenes.push({
        id: 'ai-coach',
        type: 'clip',
        file: 'clips/04-ai-coach.webm',
        durationSec: aiCoachDuration || 15,
        hud: { title: 'AI Coach', subtitle: 'Real-Time Streaming Intelligence' },
      });
    } else {
      // Fallback: capture as screenshot instead
      const screenshotPage = await context.newPage();
      await screenshotPage.addInitScript(() => {
        document.cookie = 'vite-ui-theme=light; path=/; max-age=86400';
      });
      await screenshotPage.goto(`${BASE_URL}/ai-coach`, { waitUntil: 'domcontentloaded' });
      await screenshotPage.waitForTimeout(3000);
      await screenshotPage.screenshot({
        path: path.join(SCREENSHOTS_DIR, '04-ai-coach.png'),
        fullPage: false,
      });
      await screenshotPage.close();
      // Remove the clip file if it exists
      const clipFile = path.join(CLIPS_DIR, '04-ai-coach.webm');
      if (fs.existsSync(clipFile)) fs.unlinkSync(clipFile);

      manifest.scenes.push({
        id: 'ai-coach',
        type: 'screenshot',
        file: 'screenshots/04-ai-coach.png',
        durationSec: 8,
        hud: { title: 'AI Coach', subtitle: 'Real-Time Streaming Intelligence' },
      });
    }

    // Sort scenes into final order by numeric prefix (e.g. "01" from "screenshots/01-dashboard.png")
    manifest.scenes.sort((a, b) => {
      const numA = parseInt(a.file.match(/(\d+)/)[1], 10);
      const numB = parseInt(b.file.match(/(\d+)/)[1], 10);
      return numA - numB;
    });

    // Write manifest
    const manifestPath = path.join(ASSETS_DIR, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n📋 Manifest written to ${manifestPath}`);

    console.log('\n✅ Asset capture complete.\n');
  } catch (error) {
    console.error('\n❌ Capture failed:', error.message);
    console.error(error.stack);
    process.exitCode = 1;
  } finally {
    await context.close();
    await browser.close();
  }
}

/**
 * Capture a video clip in a fresh browser context.
 * Returns the actual duration in seconds.
 *
 * Uses Playwright's page.video().saveAs() API to reliably save the clip
 * to the desired path (avoids fragile directory-scanning heuristics).
 *
 * @param {import('playwright').Browser} browser
 * @param {object} storageState - Auth cookies/session from primary context
 * @param {string} clipPath - Output file path for the .webm clip
 * @param {function} interactionFn - Async function receiving (page) to perform interactions
 * @returns {Promise<number>} Actual clip duration in seconds
 */
async function captureClip(browser, storageState, clipPath, interactionFn) {
  const clipContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    storageState,
    recordVideo: {
      dir: path.dirname(clipPath),
      size: { width: 1440, height: 900 },
    },
  });

  const clipPage = await clipContext.newPage();

  // Lock theme
  await clipPage.addInitScript(() => {
    document.cookie = 'vite-ui-theme=light; path=/; max-age=86400';
  });

  const startTime = Date.now();

  try {
    await interactionFn(clipPage);
  } catch (error) {
    console.log(`    ⚠ Clip interaction error: ${error.message}`);
  }

  const durationSec = Math.round((Date.now() - startTime) / 1000);

  // Save the video to the desired path using Playwright's built-in API
  // Must be called before page.close() to get the video handle
  const video = clipPage.video();
  await clipPage.close();
  if (video) {
    await video.saveAs(clipPath);
  }
  await clipContext.close();

  return durationSec;
}

captureAssets().catch(console.error);
