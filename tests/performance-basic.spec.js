import { test, expect } from '@playwright/test';

test.describe('Performance Rankings Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login and authenticate
    await page.goto('/login');
    await page.fill('input[name="email"]', 'coach@demo.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Navigate to performance page
    await page.goto('/performance');
    await page.waitForLoadState('networkidle');
  });

  test('should display performance page with correct structure', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('Player Performance Rankings');
    
    // Check main sections exist
    await expect(page.locator('.card').first()).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should have functional view toggle buttons', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'All Players' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Position Players' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Pitchers' })).toBeVisible();
    
    // Test clicking buttons
    await page.click('button:has-text("Position Players")');
    await page.click('button:has-text("All Players")');
  });

  test('should display performance table with headers', async ({ page }) => {
    // Check key table headers
    await expect(page.locator('th:has-text("Rank")')).toBeVisible();
    await expect(page.locator('th:has-text("Player")')).toBeVisible();
    await expect(page.locator('th:has-text("AVG")')).toBeVisible();
    await expect(page.locator('th:has-text("Performance")')).toBeVisible();
  });

  test('should have sortable columns', async ({ page }) => {
    // Test clicking sortable headers
    await page.locator('th:has-text("AVG")').click();
    await page.waitForTimeout(500);
    
    await page.locator('th:has-text("HR")').click();
    await page.waitForTimeout(500);
  });

  test('should be accessible via navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a[href="/performance"]');
    await page.waitForURL('/performance');
    await expect(page.locator('h1')).toContainText('Performance Rankings');
  });
});
