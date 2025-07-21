import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Network Error Handling', () => {
    test('should handle network errors during login', async ({ page }) => {
      await page.goto('/login');
      
      // Mock network error
      await page.route('**/api/auth/login', async route => {
        await route.abort('failed');
      });
      
      // Fill and submit form
      await page.getByLabel('Email address').fill('test@example.com');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Should show error message
      await expect(page.getByText(/An error occurred|Network error/i)).toBeVisible();
    });

    test('should handle network errors during registration', async ({ page }) => {
      await page.goto('/register');
      
      // Mock network error
      await page.route('**/api/auth/register', async route => {
        await route.abort('failed');
      });
      
      // Fill and submit form
      await page.getByLabel('First Name').fill('John');
      await page.getByLabel('Last Name').fill('Doe');
      await page.getByLabel('Email address').fill('john@example.com');
      await page.getByLabel('Phone Number').fill('555-0123');
      await page.getByLabel('Password').fill('password123');
      await page.getByLabel('Confirm Password').fill('password123');
      await page.getByRole('button', { name: 'Create Account' }).click();
      
      // Should show error message
      await expect(page.getByText(/An error occurred|Network error/i)).toBeVisible();
    });

    test('should handle server errors (500)', async ({ page }) => {
      await page.goto('/login');
      
      // Mock server error
      await page.route('**/api/auth/login', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Internal server error'
          })
        });
      });
      
      // Fill and submit form
      await page.getByLabel('Email address').fill('test@example.com');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Should show error message
      await expect(page.getByText('Internal server error')).toBeVisible();
    });
  });

  test.describe('Authentication Token Handling', () => {
    test('should include auth token in requests when available', async ({ page }) => {
      // Set token in localStorage
      await page.evaluate(() => {
        localStorage.setItem('token', 'test-token');
      });
      
      // Mock profile request and check headers
      let requestHeaders = null;
      await page.route('**/api/auth/me', async route => {
        requestHeaders = route.request().headers();
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
              team_id: 1
            }
          })
        });
      });
      
      await page.goto('/');
      
      // Check that Authorization header was sent
      expect(requestHeaders.authorization).toBe('Bearer test-token');
    });

    test('should redirect to login on 401 response', async ({ page }) => {
      // Set token in localStorage
      await page.evaluate(() => {
        localStorage.setItem('token', 'invalid-token');
      });
      
      // Mock 401 response
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
      
      await page.goto('/');
      
      // Should redirect to login
      await expect(page).toHaveURL('/login');
      
      // Token should be cleared
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeNull();
    });
  });

  test.describe('Form Validation', () => {
    test('should validate email format', async ({ page }) => {
      await page.goto('/register');
      
      const emailInput = page.getByLabel('Email address');
      
      // Test invalid email formats
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@invalid.com',
        'invalid..email@domain.com'
      ];
      
      for (const email of invalidEmails) {
        await emailInput.fill(email);
        await emailInput.blur();
        await expect(page.getByText('Please enter a valid email address')).toBeVisible();
      }
      
      // Test valid email
      await emailInput.fill('valid@example.com');
      await emailInput.blur();
      await expect(page.getByText('Please enter a valid email address')).not.toBeVisible();
    });

    test('should validate password strength', async ({ page }) => {
      await page.goto('/register');
      
      const passwordInput = page.getByLabel('Password');
      
      // Test short password
      await passwordInput.fill('123');
      await passwordInput.blur();
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
      
      // Test valid password
      await passwordInput.fill('password123');
      await passwordInput.blur();
      await expect(page.getByText('Password must be at least 6 characters')).not.toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/register');
      
      // Try to submit without filling required fields
      await page.getByRole('button', { name: 'Create Account' }).click();
      
      // Check for validation errors
      await expect(page.getByText('First name is required')).toBeVisible();
      await expect(page.getByText('Last name is required')).toBeVisible();
      await expect(page.getByText('Please enter a valid email address')).toBeVisible();
      await expect(page.getByText('Phone number is required')).toBeVisible();
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });
  });

  test.describe('Loading States', () => {
    test('should show loading state during login', async ({ page }) => {
      await page.goto('/login');
      
      // Mock slow response
      await page.route('**/api/auth/login', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
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
              token: 'test-token'
            }
          })
        });
      });
      
      // Fill form and submit
      await page.getByLabel('Email address').fill('test@example.com');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Should show loading state
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeDisabled();
      await expect(page.locator('.animate-spin')).toBeVisible();
    });

    test('should show loading state during registration', async ({ page }) => {
      await page.goto('/register');
      
      // Mock slow response
      await page.route('**/api/auth/register', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 2,
              email: 'new@example.com',
              first_name: 'New',
              last_name: 'User',
              role: 'assistant_coach',
              team_id: 1,
              token: 'test-token'
            }
          })
        });
      });
      
      // Fill form and submit
      await page.getByLabel('First Name').fill('New');
      await page.getByLabel('Last Name').fill('User');
      await page.getByLabel('Email address').fill('new@example.com');
      await page.getByLabel('Phone Number').fill('555-0123');
      await page.getByLabel('Password').fill('password123');
      await page.getByLabel('Confirm Password').fill('password123');
      await page.getByRole('button', { name: 'Create Account' }).click();
      
      // Should show loading state
      await expect(page.getByRole('button', { name: 'Create Account' })).toBeDisabled();
      await expect(page.locator('.animate-spin')).toBeVisible();
    });
  });
}); 