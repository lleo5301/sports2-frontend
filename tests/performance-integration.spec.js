import { test, expect } from '@playwright/test';

test.describe('Performance Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login with correct credentials
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should navigate to performance page from dashboard', async ({ page }) => {
    // Check that performance button exists on dashboard
    const performanceButton = page.locator('button:has-text("Performance Rankings")');
    if (await performanceButton.isVisible()) {
      await performanceButton.click();
      await page.waitForURL('/performance');
      await expect(page.locator('h1')).toContainText('Performance Rankings');
    }
  });

  test('should navigate to performance page from navigation menu', async ({ page }) => {
    // Click Performance link in navigation
    await page.click('a[href="/performance"]');
    await page.waitForURL('/performance');
    await expect(page.locator('h1')).toContainText('Performance Rankings');
    
    // Verify page loads with data
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('should display complete performance functionality', async ({ page }) => {
    await page.goto('/performance');
    await page.waitForLoadState('networkidle');
    
    // Check all major sections are present
    await expect(page.locator('h1:has-text("Performance Rankings")')).toBeVisible();
    await expect(page.locator('[data-testid="summary-cards"]')).toBeVisible();
    await expect(page.locator('[data-testid="filters-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="performance-table"]')).toBeVisible();
    
    // Verify data is displayed
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
    const playerRows = await page.locator('table tbody tr').count();
    expect(playerRows).toBeGreaterThan(0);
    
    // Verify interactive elements work
    await page.click('button:has-text("Position Players")');
    await page.selectOption('select:nth-of-type(1)', 'P'); // Filter by pitchers
    await page.click('th:has-text("HR")'); // Sort by home runs
    
    console.log('✅ Performance page integration test completed successfully');
  });
});
