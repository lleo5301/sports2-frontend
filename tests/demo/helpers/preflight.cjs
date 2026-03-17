// tests/demo/helpers/preflight.js
const { BASE_URL } = require('./auth.cjs');

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

  // Warn on critical missing data
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
