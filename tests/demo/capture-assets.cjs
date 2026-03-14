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

    // ── Clip capture placeholder — Task 3 adds these ──

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

captureAssets().catch(console.error);
