// tests/demo/helpers/auth.js

const BASE_URL = process.env.DEMO_BASE_URL || 'http://localhost:5173';

/**
 * Log in via the login form UI.
 * Waits for redirect to '/' to confirm success.
 */
async function login(page, { email = 'admin@sports2.com', password = 'Admin123!' } = {}) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });

  // Wait for login form to render
  await page.locator('input[name="email"]').waitFor({ state: 'visible', timeout: 10000 });

  // Fill credentials (using name selectors to avoid TanStack Router DevTools conflicts)
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  // Submit
  await page.getByRole('button', { name: /Sign in/i }).click();

  // Wait for successful redirect to dashboard
  await page.waitForURL('**/', { timeout: 15000 });

  // Wait for dashboard content to hydrate
  await page.waitForTimeout(1000);
}

module.exports = { login, BASE_URL };
