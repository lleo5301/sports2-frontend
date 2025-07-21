import { test, expect } from '@playwright/test';

test.describe('Application Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should handle complete login flow correctly', async ({ page }) => {
    // Mock successful login response
    await page.route('**/api/auth/login', async route => {
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
            },
            token: 'mock-jwt-token'
          }
        })
      });
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

    // Mock dashboard stats
    await page.route('**/api/players/stats/summary', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            total_players: 25,
            active_recruits: 12,
            recent_reports: 5,
            team_avg: '.285'
          }
        })
      });
    });

    // Navigate to login page
    await page.goto('/login');
    
    // Verify login page elements
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    
    // Fill login form
    await page.getByLabel('Email address').fill('headcoach@example.edu');
    await page.getByLabel('Password').fill('password');
    
    // Submit form
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    
    // Verify dashboard elements
    await expect(page.getByText('Baseball Scouting')).toBeVisible();
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('John Smith')).toBeVisible();
    await expect(page.getByText('Head Coach')).toBeVisible();
    
    // Verify navigation menu
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Players' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Player' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Recruiting Board' })).toBeVisible();
    
    // Verify dashboard content
    await expect(page.getByText('Welcome back, John!')).toBeVisible();
    await expect(page.getByText('Total Players')).toBeVisible();
    await expect(page.getByText('Quick Actions')).toBeVisible();
    
    // Verify token is stored
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBe('mock-jwt-token');
  });

  test('should handle logout correctly', async ({ page }) => {
    // Set up authenticated state
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
            team_id: 1
          }
        })
      });
    });
    
    await page.goto('/');
    
    // Find and click logout button
    const logoutButton = page.getByRole('button', { name: /logout/i });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    
    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });

  test('should handle authentication errors correctly', async ({ page }) => {
    // Mock failed login response
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        })
      });
    });
    
    await page.goto('/login');
    
    // Fill and submit form
    await page.getByLabel('Email address').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Should show error message
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/api/auth/login', async route => {
      await route.abort('failed');
    });
    
    await page.goto('/login');
    
    // Fill and submit form
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Should show error message
    await expect(page.getByText('An error occurred')).toBeVisible();
  });

  test('should navigate between pages correctly', async ({ page }) => {
    // Set up authenticated state
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
            team_id: 1
          }
        })
      });
    });
    
    await page.goto('/');
    
    // Navigate to Players page
    await page.getByRole('link', { name: 'Players' }).click();
    await expect(page).toHaveURL('/players');
    
    // Navigate to Create Player page
    await page.getByRole('link', { name: 'Create Player' }).click();
    await expect(page).toHaveURL('/players/create');
    
    // Navigate to Recruiting Board
    await page.getByRole('link', { name: 'Recruiting Board' }).click();
    await expect(page).toHaveURL('/recruiting');
    
    // Navigate back to Dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    
    // Verify login form is still accessible
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    
    // Test form interaction on mobile
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('password');
    
    await expect(page.getByLabel('Email address')).toHaveValue('test@example.com');
    await expect(page.getByLabel('Password')).toHaveValue('password');
  });
}); 