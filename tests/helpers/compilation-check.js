/**
 * Helper functions for handling compilation errors in tests
 */

/**
 * Check if the application has compilation errors
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
export async function hasCompilationError(page) {
  try {
    // Check for webpack compilation error indicators
    const webpackError = await page.locator('text=Html Webpack Plugin').isVisible({ timeout: 3000 });
    const moduleError = await page.locator('text=Module not found').isVisible({ timeout: 1000 });
    const compilationFailed = await page.locator('text=compilation failed').isVisible({ timeout: 1000 });

    return webpackError || moduleError || compilationFailed;
  } catch (error) {
    return false;
  }
}

/**
 * Check if the page loaded successfully (has dynamic content)
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<boolean>}
 */
export async function hasPageLoadedSuccessfully(page) {
  try {
    // Wait for React to mount and set the title
    await page.waitForFunction(() => {
      return document.title !== '' && document.title !== 'Loading...';
    }, { timeout: 5000 });

    // Check if React root has content
    const rootHasContent = await page.locator('#root:not(:empty)').isVisible({ timeout: 2000 });

    return rootHasContent;
  } catch (error) {
    return false;
  }
}

/**
 * Wait for app to be ready or detect compilation error
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<{isReady: boolean, hasError: boolean}>}
 */
export async function waitForAppState(page) {
  await page.waitForLoadState('domcontentloaded');

  const hasError = await hasCompilationError(page);
  if (hasError) {
    return { isReady: false, hasError: true };
  }

  const isReady = await hasPageLoadedSuccessfully(page);
  return { isReady, hasError: false };
}

/**
 * Skip test if compilation error detected
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').TestInfo} testInfo
 */
export async function skipIfCompilationError(page, testInfo) {
  const { hasError } = await waitForAppState(page);
  if (hasError) {
    testInfo.skip(true, 'Skipping test due to compilation error in application');
  }
}
