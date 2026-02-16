import { test, expect } from '@playwright/test';

const isChromium = (testInfo) => testInfo.project.name === 'chromium';

async function stubAuth(page) {
  await page.addInitScript(() => localStorage.setItem('token', 'mock-jwt-token'));

  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          id: 1,
          email: 'coach@example.edu',
          first_name: 'Coach',
          last_name: 'Smith',
          role: 'head_coach',
          team_id: 1
        }
      })
    });
  });
}

async function stubDashboard(page) {
  // Players (recent 5)
  await page.route('**/api/players**', async (route) => {
    const data = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      first_name: `Player${i + 1}`,
      last_name: 'Test',
      position: ['SS', 'P', 'CF', '1B', 'C'][i % 5],
      school: 'Test High',
      status: i % 2 === 0 ? 'active' : 'inactive',
      city: 'Austin',
      state: 'TX'
    }));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data, pagination: { total: 42, pages: 3 } })
    });
  });

  // Reports (recent 5)
  await page.route('**/api/reports/scouting**', async (route) => {
    const data = Array.from({ length: 5 }, (_, i) => ({
      id: i + 101,
      overall_grade: ['40', '45', '50', '55', '60'][i],
      created_at: '2025-01-10T10:00:00Z',
      Player: { first_name: `R${i + 1}`, last_name: 'Sample' }
    }));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data, pagination: { total: 12, pages: 3 } })
    });
  });

  // Team details (if fetched)
  await page.route('**/api/teams/byId/1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { id: 1, name: 'Example U' } })
    });
  });

  // TeamStatistics dependencies
  await page.route('**/api/teams/stats', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, activePlayers: 21 })
    });
  });
  await page.route('**/api/schedules/stats', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, totalEvents: 18, thisWeek: 2, thisMonth: 6 }) });
  });
  await page.route('**/api/teams/upcoming-schedules**', async (route) => {
    const data = [
      { id: 1, title: 'Practice', date: '2025-02-01', time: '14:00:00', type: 'Practice', location: 'Field A' },
      { id: 2, title: 'Game vs Rivals', date: '2025-02-03', time: '18:30:00', type: 'Game', location: 'Stadium' }
    ];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data }) });
  });
  await page.route('**/api/teams/recent-schedules**', async (route) => {
    const data = [
      { id: 3, title: 'Scrimmage', date: '2025-01-28', type: 'Scrimmage', location: 'Field B' }
    ];
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data }) });
  });
  await page.route('**/api/games/log**', async (route) => {
    const data = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      opponent: `Opponent ${i + 1}`,
      home_away: i % 2 === 0 ? 'home' : 'away',
      game_date: '2025-01-15T00:00:00Z',
      team_score: 3 + i % 4,
      opponent_score: 2 + (i + 1) % 4,
      result: ['W', 'L', 'W', 'L'][i % 4],
      notes: 'Good effort'
    }));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data }) });
  });
  await page.route('**/api/games/team-stats', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, winRate: 0.64, wins: 18, losses: 10, ties: 1, gamesPlayed: 29, era: 3.42, battingAvg: 0.281 })
    });
  });
}

test.describe('Visual - Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.addStyleTag({ content: '* { transition: none !important; animation: none !important; caret-color: transparent !important; }' });
    await stubAuth(page);
    await stubDashboard(page);
  });

  test('Dashboard overview snapshot', async ({ page }, testInfo) => {
    if (!isChromium(testInfo)) test.skip();
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    await expect(page).toHaveScreenshot('dashboard-overview.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.03
    });
  });
});
