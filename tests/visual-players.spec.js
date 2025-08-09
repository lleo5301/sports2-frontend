import { test, expect } from '@playwright/test';

const isChromium = (testInfo) => testInfo.project.name === 'chromium';

async function stubAuth(page) {
  await page.addInitScript(() => localStorage.setItem('token', 'mock-jwt-token'));
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { id: 1, email: 'coach@example.edu', first_name: 'Coach', last_name: 'Smith', team_id: 1 } }),
    });
  });
}

async function stubPlayers(page) {
  await page.route('**/api/players**', async (route) => {
    const url = new URL(route.request().url());
    const pageParam = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const total = 26;
    const start = (pageParam - 1) * limit;
    const end = Math.min(start + limit, total);

    const data = Array.from({ length: end - start }, (_, i) => {
      const idx = start + i + 1;
      return {
        id: idx,
        first_name: `P${idx}`,
        last_name: 'Visual',
        position: ['SS', 'P', 'CF', '1B', 'C'][idx % 5],
        school: idx % 2 ? 'Central HS' : 'State U',
        city: 'Austin',
        state: 'TX',
        status: idx % 3 === 0 ? 'inactive' : 'active',
      };
    });

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data, pagination: { page: pageParam, limit, total, pages: Math.ceil(total / limit) } }),
    });
  });
}

test.describe('Visual - Players', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.addStyleTag({ content: '* { transition: none !important; animation: none !important; caret-color: transparent !important; }' });
    await stubAuth(page);
    await stubPlayers(page);
  });

  test('Players list snapshot', async ({ page }, testInfo) => {
    if (!isChromium(testInfo)) test.skip();
    await page.goto('/players');
    await expect(page.getByRole('heading', { name: 'Players' })).toBeVisible();

    await expect(page).toHaveScreenshot('players-list.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.03,
    });
  });
});


