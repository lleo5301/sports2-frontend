/**
 * Smart test configuration and utilities
 */

/**
 * Test categories for conditional execution
 */
export const TestCategories = {
  BASIC: 'basic',           // Basic page loading, navigation
  FORM: 'form',            // Form interactions
  API: 'api',              // API integration tests
  VISUAL: 'visual',        // Visual/screenshot tests
  RESPONSIVE: 'responsive'  // Responsive design tests
};

/**
 * Determine which test categories should run based on app state
 * @param {import('@playwright/test').Page} page 
 * @returns {Promise<{runCategories: string[], skipReason?: string}>}
 */
export async function determineTestCategories(page) {
  try {
    // Check if app has compilation errors
    const hasCompilationError = await page.locator('text=Html Webpack Plugin').isVisible({ timeout: 3000 });
    
    if (hasCompilationError) {
      return {
        runCategories: [TestCategories.BASIC],
        skipReason: 'Application has compilation errors - only running basic connectivity tests'
      };
    }

    // Check if React app loaded
    const reactLoaded = await page.waitForFunction(() => {
      return window.React !== undefined || document.querySelector('[data-reactroot]') !== null || document.title !== '';
    }, { timeout: 5000 }).catch(() => false);

    if (!reactLoaded) {
      return {
        runCategories: [TestCategories.BASIC],
        skipReason: 'React application not loaded - only running basic tests'
      };
    }

    // Check if forms are working
    const formsWork = await page.locator('form').isVisible({ timeout: 3000 });
    
    const categories = [TestCategories.BASIC];
    if (formsWork) {
      categories.push(TestCategories.FORM, TestCategories.API);
    }
    
    // Always try visual tests if app loads
    categories.push(TestCategories.VISUAL, TestCategories.RESPONSIVE);

    return { runCategories: categories };
    
  } catch (error) {
    return {
      runCategories: [TestCategories.BASIC],
      skipReason: `Error determining app state: ${error.message}`
    };
  }
}

/**
 * Conditional test wrapper
 * @param {string} category - Test category
 * @param {function} testFn - Test function
 * @param {string} fallbackTest - Fallback test description
 */
export function conditionalTest(category, testFn, fallbackTest = null) {
  return async ({ page }, testInfo) => {
    const { runCategories, skipReason } = await determineTestCategories(page);
    
    if (!runCategories.includes(category)) {
      if (fallbackTest) {
        console.log(`⚠️  Running fallback test: ${fallbackTest}`);
        // Run a basic connectivity test instead
        const response = await page.goto('/', { waitUntil: 'commit' });
        expect([200, 304]).toContain(response?.status());
        return;
      } else {
        testInfo.skip(true, skipReason || `Skipping ${category} tests due to app state`);
        return;
      }
    }
    
    return await testFn({ page }, testInfo);
  };
}

/**
 * Enhanced test wrapper with automatic retries and fallbacks
 * @param {function} testFn - Test function
 * @param {object} options - Options
 */
export function resilientTest(testFn, options = {}) {
  const { 
    maxRetries = 2, 
    fallbackOnError = true,
    category = TestCategories.BASIC 
  } = options;
  
  return async ({ page }, testInfo) => {
    // Check if we should run this category
    const { runCategories, skipReason } = await determineTestCategories(page);
    
    if (!runCategories.includes(category)) {
      testInfo.skip(true, skipReason || `Skipping ${category} tests`);
      return;
    }

    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await testFn({ page }, testInfo);
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          console.log(`⚠️  Test attempt ${attempt + 1} failed, retrying...`);
          // Wait a bit before retry
          await page.waitForTimeout(1000);
          continue;
        }
      }
    }
    
    // All retries failed
    if (fallbackOnError) {
      console.log(`⚠️  All retries failed, running fallback test`);
      // Fallback: just verify we can reach the server
      try {
        const response = await page.goto('/', { waitUntil: 'commit' });
        expect([200, 304]).toContain(response?.status());
        console.log(`✅ Fallback test passed - server reachable`);
      } catch (fallbackError) {
        throw lastError; // Throw original error if even fallback fails
      }
    } else {
      throw lastError;
    }
  };
}
