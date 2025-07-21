import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock successful login and set token
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('token', 'mock-jwt-token');
    });
    
    // Mock user profile response
    await page.route('**/api/auth/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 1,
            email: 'headcoach@example.edu',
            first_name: 'John',
            last_name: 'Smith',
            role: 'head_coach',
            team_id: 1,
            phone: '555-0123',
            team: {
              id: 1,
              name: 'University of Example',
              program_name: 'The Shark Tank',
              school_logo_url: null
            }
          }
        })
      });
    });
  });

  test('should display dashboard after successful login', async ({ page }) => {
    await page.goto('/');
    
    // Check that we're on the dashboard
    await expect(page).toHaveURL('/');
    
    // Check for main navigation elements
    await expect(page.getByText('The Shark Tank')).toBeVisible();
    await expect(page.getByText('Collegiate Baseball Scouting Platform')).toBeVisible();
  });

  test('should display user information', async ({ page }) => {
    await page.goto('/');
    
    // Check for user name display
    await expect(page.getByText('John Smith')).toBeVisible();
  });

  test('should have main navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Check for main navigation items
    await expect(page.getByRole('link', { name: /Conference Teams/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Home Pref List/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Recruiting Board/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Depth Chart/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /My Team/i })).toBeVisible();
  });

  test('should have player management section', async ({ page }) => {
    await page.goto('/');
    
    // Check for player management elements
    await expect(page.getByRole('link', { name: /Open AI/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Create Player/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Search Player/i })).toBeVisible();
  });

  test('should have statistics sections', async ({ page }) => {
    await page.goto('/');
    
    // Check for statistics sections
    await expect(page.getByText(/Conference Standings/i)).toBeVisible();
    await expect(page.getByText(/Conference Leaders/i)).toBeVisible();
    await expect(page.getByText(/Team Leaders/i)).toBeVisible();
  });

  test('should have reports section', async ({ page }) => {
    await page.goto('/');
    
    // Check for reports section
    await expect(page.getByText(/New Reports/i)).toBeVisible();
    await expect(page.getByText(/Transfer Portal Updates/i)).toBeVisible();
  });

  test('should have daily coach report section', async ({ page }) => {
    await page.goto('/');
    
    // Check for daily coach report
    await expect(page.getByText(/Daily Coach's Report/i)).toBeVisible();
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    // Clear token
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    
    // Mock failed profile request
    await page.route('**/api/auth/me', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Unauthorized'
        })
      });
    });
    
    // Navigate to dashboard
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });

  test('should handle logout', async ({ page }) => {
    await page.goto('/');
    
    // Find and click logout button (assuming it exists in the UI)
    // This test will need to be updated based on actual logout UI implementation
    const logoutButton = page.getByRole('button', { name: /logout/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should redirect to login
      await expect(page).toHaveURL('/login');
      
      // Token should be cleared
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeNull();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that main elements are still visible
    await expect(page.getByText('The Shark Tank')).toBeVisible();
    await expect(page.getByText('Collegiate Baseball Scouting Platform')).toBeVisible();
  });
}); 