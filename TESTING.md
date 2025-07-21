# Frontend Testing Guide

This document provides information about the UI testing setup using Playwright for the Collegiate Baseball Scouting Platform.

## 🧪 Testing Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Playwright browsers installed

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## 🚀 Running Tests

### Basic Test Commands

```bash
# Run all tests
npm run test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Show test report
npm run test:report
```

### Running Specific Tests

```bash
# Run specific test file
npx playwright test auth.spec.js

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests in parallel
npx playwright test --workers=4
```

## 📁 Test Structure

```
tests/
├── auth.spec.js          # Authentication tests (login/register)
├── dashboard.spec.js     # Dashboard and navigation tests
└── api.spec.js          # API integration and error handling tests
```

## 🧩 Test Categories

### Authentication Tests (`auth.spec.js`)

- **Login Functionality**
  - Form validation
  - Successful login flow
  - Error handling
  - Password visibility toggle
  - Navigation between pages

- **Registration Functionality**
  - Form validation
  - Password confirmation
  - Successful registration
  - Duplicate email handling
  - Required field validation

### Dashboard Tests (`dashboard.spec.js`)

- **Dashboard Display**
  - Main navigation elements
  - User information display
  - Responsive design
  - Authentication redirects

- **Navigation**
  - Menu items visibility
  - Page routing
  - Logout functionality

### API Integration Tests (`api.spec.js`)

- **Network Error Handling**
  - Network failures
  - Server errors (500)
  - Timeout handling

- **Authentication Token Handling**
  - Token inclusion in requests
  - 401 response handling
  - Token cleanup

- **Form Validation**
  - Email format validation
  - Password strength requirements
  - Required field validation

- **Loading States**
  - Loading indicators
  - Button disabled states
  - User feedback

## 🔧 Configuration

### Playwright Config (`playwright.config.js`)

- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL**: `http://localhost:3000`
- **Web Server**: Automatically starts dev server
- **Reporting**: HTML reports with screenshots and videos
- **Parallel Execution**: Enabled for faster test runs

### Environment Variables

```bash
# Development
CI=false

# Production/CI
CI=true
```

## 🎯 Test Best Practices

### Writing Tests

1. **Use Descriptive Test Names**
   ```javascript
   test('should successfully login with valid credentials', async ({ page }) => {
     // test implementation
   });
   ```

2. **Mock External Dependencies**
   ```javascript
   await page.route('**/api/auth/login', async route => {
     await route.fulfill({
       status: 200,
       contentType: 'application/json',
       body: JSON.stringify(mockResponse)
     });
   });
   ```

3. **Use Page Object Model for Complex Pages**
   ```javascript
   class LoginPage {
     constructor(page) {
       this.page = page;
       this.emailInput = page.getByLabel('Email address');
       this.passwordInput = page.getByLabel('Password');
       this.submitButton = page.getByRole('button', { name: 'Sign in' });
     }
   }
   ```

4. **Test User Interactions**
   ```javascript
   // Fill form
   await page.getByLabel('Email address').fill('test@example.com');
   
   // Click button
   await page.getByRole('button', { name: 'Sign in' }).click();
   
   // Check assertions
   await expect(page).toHaveURL('/');
   ```

### Debugging Tests

1. **Use Debug Mode**
   ```bash
   npm run test:debug
   ```

2. **Add Screenshots**
   ```javascript
   await page.screenshot({ path: 'debug-screenshot.png' });
   ```

3. **Use Console Logging**
   ```javascript
   console.log('Current URL:', page.url());
   ```

## 📊 Test Reports

### HTML Report

After running tests, view the HTML report:

```bash
npm run test:report
```

The report includes:
- Test results summary
- Screenshots on failure
- Video recordings
- Trace files for debugging

### CI/CD Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests to main/develop branches

Artifacts are uploaded:
- Test reports
- Screenshots
- Videos
- Trace files

## 🐛 Common Issues

### Test Failures

1. **Element Not Found**
   - Check if element selectors are correct
   - Verify element is visible/attached
   - Use `page.waitForSelector()` for dynamic content

2. **Network Errors**
   - Ensure API mocking is correct
   - Check base URL configuration
   - Verify dev server is running

3. **Timing Issues**
   - Use `page.waitForLoadState()`
   - Add explicit waits for dynamic content
   - Use `page.waitForResponse()` for API calls

### Performance

1. **Slow Tests**
   - Run tests in parallel
   - Use headless mode
   - Optimize selectors
   - Reduce unnecessary waits

2. **Resource Usage**
   - Close browsers after tests
   - Clear localStorage between tests
   - Mock heavy operations

## 🔄 Continuous Integration

### GitHub Actions

The `.github/workflows/playwright.yml` file configures:
- Automatic test execution
- Browser installation
- Artifact upload
- Report generation

### Local Development

```bash
# Run tests before committing
npm run test

# Run specific test suite
npm run test -- --project=chromium

# Generate coverage report
npm run test:report
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Test Generator](https://playwright.dev/docs/codegen) 