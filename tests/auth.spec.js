import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Login', () => {
    test('should display login page with correct elements', async ({ page }) => {
      await page.goto('/login');
      
      // Check page title
      await expect(page).toHaveTitle(/Collegiate Baseball Scouting Platform/);
      
      // Check main heading
      await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
      
      // Check form elements
      await expect(page.getByLabel('Email address')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
      
      // Check sign up link
      await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
    });

    test('should show validation errors for invalid input', async ({ page }) => {
      await page.goto('/login');
      
      // Try to submit empty form
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Check for validation errors
      await expect(page.getByText('Please enter a valid email address')).toBeVisible();
      await expect(page.getByText('Password is required')).toBeVisible();
    });

    test('should show validation error for invalid email', async ({ page }) => {
      await page.goto('/login');
      
      // Enter invalid email
      await page.getByLabel('Email address').fill('invalid-email');
      await page.getByLabel('Password').fill('password');
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Check for validation error
      await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    });

    test('should successfully login with valid credentials', async ({ page }) => {
      await page.goto('/login');
      
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
      
      // Fill login form
      await page.getByLabel('Email address').fill('headcoach@example.edu');
      await page.getByLabel('Password').fill('password');
      
      // Submit form
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/');
      
      // Check that token is stored
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBe('mock-jwt-token');
    });

    test('should show error message for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
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
      
      // Fill login form
      await page.getByLabel('Email address').fill('wrong@example.com');
      await page.getByLabel('Password').fill('wrongpassword');
      
      // Submit form
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Should show error message
      await expect(page.getByText('Invalid credentials')).toBeVisible();
    });

    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/login');
      
      const passwordInput = page.getByLabel('Password');
      const toggleButton = page.locator('button[type="button"]').last();
      
      // Password should be hidden by default
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click toggle button
      await toggleButton.click();
      
      // Password should be visible
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click toggle button again
      await toggleButton.click();
      
      // Password should be hidden again
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Registration', () => {
    test('should navigate to registration page from login', async ({ page }) => {
      await page.goto('/login');
      
      // Click sign up link
      await page.getByRole('link', { name: 'Sign up' }).click();
      
      // Should be on registration page
      await expect(page).toHaveURL('/register');
    });

    test('should display registration page with correct elements', async ({ page }) => {
      await page.goto('/register');
      
      // Check main heading
      await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
      
      // Check form elements
      await expect(page.getByLabel('First Name')).toBeVisible();
      await expect(page.getByLabel('Last Name')).toBeVisible();
      await expect(page.getByLabel('Email address')).toBeVisible();
      await expect(page.getByLabel('Phone Number')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByLabel('Confirm Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
      
      // Check sign in link
      await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    });

    test('should show validation errors for invalid registration input', async ({ page }) => {
      await page.goto('/register');
      
      // Try to submit empty form
      await page.getByRole('button', { name: 'Create Account' }).click();
      
      // Check for validation errors
      await expect(page.getByText('First name is required')).toBeVisible();
      await expect(page.getByText('Last name is required')).toBeVisible();
      await expect(page.getByText('Please enter a valid email address')).toBeVisible();
      await expect(page.getByText('Phone number is required')).toBeVisible();
      await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });

    test('should show error for password mismatch', async ({ page }) => {
      await page.goto('/register');
      
      // Fill form with mismatched passwords
      await page.getByLabel('First Name').fill('John');
      await page.getByLabel('Last Name').fill('Doe');
      await page.getByLabel('Email address').fill('john@example.com');
      await page.getByLabel('Phone Number').fill('555-0123');
      await page.getByLabel('Password').fill('password123');
      await page.getByLabel('Confirm Password').fill('differentpassword');
      
      // Submit form
      await page.getByRole('button', { name: 'Create Account' }).click();
      
      // Check for password mismatch error
      await expect(page.getByText('Passwords do not match')).toBeVisible();
    });

    test('should successfully register with valid data', async ({ page }) => {
      await page.goto('/register');
      
      // Mock successful registration response
      await page.route('**/api/auth/register', async route => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 2,
              email: 'newuser@example.com',
              first_name: 'Jane',
              last_name: 'Doe',
              role: 'assistant_coach',
              team_id: 1,
              phone: '555-0124',
              team: {
                id: 1,
                name: 'University of Example',
                program_name: 'The Shark Tank',
                school_logo_url: null
              },
              token: 'mock-jwt-token-new'
            }
          })
        });
      });
      
      // Fill registration form
      await page.getByLabel('First Name').fill('Jane');
      await page.getByLabel('Last Name').fill('Doe');
      await page.getByLabel('Email address').fill('newuser@example.com');
      await page.getByLabel('Phone Number').fill('555-0124');
      await page.getByLabel('Password').fill('password123');
      await page.getByLabel('Confirm Password').fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: 'Create Account' }).click();
      
      // Should redirect to dashboard
      await expect(page).toHaveURL('/');
      
      // Check that token is stored
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBe('mock-jwt-token-new');
    });

    test('should show error for duplicate email', async ({ page }) => {
      await page.goto('/register');
      
      // Mock failed registration response
      await page.route('**/api/auth/register', async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Email already exists'
          })
        });
      });
      
      // Fill registration form
      await page.getByLabel('First Name').fill('John');
      await page.getByLabel('Last Name').fill('Doe');
      await page.getByLabel('Email address').fill('existing@example.com');
      await page.getByLabel('Phone Number').fill('555-0123');
      await page.getByLabel('Password').fill('password123');
      await page.getByLabel('Confirm Password').fill('password123');
      
      // Submit form
      await page.getByRole('button', { name: 'Create Account' }).click();
      
      // Should show error message
      await expect(page.getByText('Email already exists')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate between login and register pages', async ({ page }) => {
      // Start at login
      await page.goto('/login');
      await expect(page).toHaveURL('/login');
      
      // Go to register
      await page.getByRole('link', { name: 'Sign up' }).click();
      await expect(page).toHaveURL('/register');
      
      // Go back to login
      await page.getByRole('link', { name: 'Sign in' }).click();
      await expect(page).toHaveURL('/login');
    });
  });
}); 