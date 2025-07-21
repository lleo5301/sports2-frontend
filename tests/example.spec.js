import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
  test('should load the application homepage', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Check that the page loads with the correct title
    await expect(page).toHaveTitle(/Collegiate Baseball Scouting Platform/);
    
    // Verify the main heading is present
    await expect(page.getByText(/Collegiate Baseball Scouting Platform/)).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Verify we're on the login page
    await expect(page).toHaveURL('/login');
    
    // Check for login form elements
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');
    
    // Verify we're on the registration page
    await expect(page).toHaveURL('/register');
    
    // Check for registration form elements
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Phone Number')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('should demonstrate form interaction', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in the login form
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    
    // Verify the form fields have the correct values
    await expect(page.getByLabel('Email address')).toHaveValue('test@example.com');
    await expect(page.getByLabel('Password')).toHaveValue('password123');
  });

  test('should demonstrate responsive design testing', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Verify elements are visible on desktop
    await expect(page.getByText(/Collegiate Baseball Scouting Platform/)).toBeVisible();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify elements are still visible on mobile
    await expect(page.getByText(/Collegiate Baseball Scouting Platform/)).toBeVisible();
  });

  test('should demonstrate API mocking', async ({ page }) => {
    // Mock a successful login response
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 1,
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            role: 'head_coach',
            team_id: 1,
            token: 'mock-token'
          }
        })
      });
    });
    
    await page.goto('/login');
    
    // Fill and submit the form
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Verify successful login (redirect to dashboard)
    await expect(page).toHaveURL('/');
  });
}); 