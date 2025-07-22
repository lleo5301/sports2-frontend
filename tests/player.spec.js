import { test, expect } from '@playwright/test';

test.describe('Create Player Form', () => {
  test.beforeEach(async ({ page }) => {
    // Assume user is already authenticated for this test
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('token', 'mock-jwt-token'));
    // Mock user profile response
    await page.route('**/api/auth/me', async route => {
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
    await page.goto('/players/create');
  });

  test('should render and validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /create player/i }).click();
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await expect(page.getByText('School type is required')).not.toBeVisible(); // defaulted
    await expect(page.getByText('Position is required')).not.toBeVisible(); // defaulted
  });

  test('should submit valid data and show success', async ({ page }) => {
    // Mock player creation API
    let requestBody;
    await page.route('**/api/players', async route => {
      requestBody = await route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { id: 123, ...requestBody } })
      });
    });

    await page.getByLabel('First Name *').fill('Test');
    await page.getByLabel('Last Name *').fill('Player');
    await page.getByLabel('School Type *').selectOption('HS');
    await page.getByLabel('Position *').selectOption('SS');
    await page.getByRole('button', { name: /create player/i }).click();

    // Should show success toast and redirect
    await expect(page).toHaveURL('/players');
  });

  test('should show error toast on API error', async ({ page }) => {
    await page.route('**/api/players', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Validation failed' })
      });
    });
    await page.getByLabel('First Name *').fill('Test');
    await page.getByLabel('Last Name *').fill('Player');
    await page.getByRole('button', { name: /create player/i }).click();
    await expect(page.getByText('Validation failed')).toBeVisible();
  });
}); 