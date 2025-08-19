/**
 * Advanced wait strategies for reliable test execution
 */

/**
 * Wait for React application to be fully loaded and hydrated
 * @param {import('@playwright/test').Page} page 
 * @param {object} options 
 */
export async function waitForReactApp(page, options = {}) {
  const { timeout = 10000, checkInterval = 500 } = options;
  
  try {
    // Wait for multiple indicators of React app readiness
    await page.waitForFunction(() => {
      // Check for React DevTools or React root
      const hasReact = !!(window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
      
      // Check for populated root element
      const root = document.querySelector('#root');
      const hasContent = root && root.children.length > 0;
      
      // Check that title is set (indicates JavaScript executed)
      const hasTitle = document.title && document.title !== '';
      
      // Check for loaded state
      const isLoaded = document.readyState === 'complete';
      
      return hasReact && hasContent && hasTitle && isLoaded;
    }, { timeout });
    
    return { success: true, message: 'React app loaded successfully' };
  } catch (error) {
    return { success: false, message: `React app load timeout: ${error.message}` };
  }
}

/**
 * Wait for specific API calls to complete
 * @param {import('@playwright/test').Page} page 
 * @param {string[]} endpoints - API endpoints to wait for
 * @param {object} options 
 */
export async function waitForApiCalls(page, endpoints, options = {}) {
  const { timeout = 15000 } = options;
  const completedCalls = new Set();
  
  // Set up request interception to track API calls
  await page.route('**/api/**', async route => {
    const url = route.request().url();
    const endpoint = endpoints.find(ep => url.includes(ep));
    
    if (endpoint) {
      completedCalls.add(endpoint);
    }
    
    await route.continue();
  });
  
  // Wait for all expected API calls to complete
  try {
    await page.waitForFunction(
      (expectedEndpoints) => {
        return expectedEndpoints.every(ep => window.__completedApiCalls?.has(ep));
      },
      endpoints,
      { timeout }
    );
    
    return { success: true, completedCalls: Array.from(completedCalls) };
  } catch (error) {
    return { 
      success: false, 
      message: `API calls timeout. Completed: ${Array.from(completedCalls).join(', ')}`,
      completedCalls: Array.from(completedCalls)
    };
  }
}

/**
 * Wait for form to be interactive and ready
 * @param {import('@playwright/test').Page} page 
 * @param {string} formSelector 
 * @param {object} options 
 */
export async function waitForFormReady(page, formSelector = 'form', options = {}) {
  const { timeout = 10000, requiredFields = [] } = options;
  
  try {
    // Wait for form to be visible and enabled
    await page.waitForSelector(formSelector, { state: 'visible', timeout });
    
    // Wait for form to not be disabled
    await page.waitForFunction((selector) => {
      const form = document.querySelector(selector);
      return form && !form.hasAttribute('disabled') && form.style.pointerEvents !== 'none';
    }, formSelector, { timeout });
    
    // Wait for required fields if specified
    if (requiredFields.length > 0) {
      for (const field of requiredFields) {
        await page.waitForSelector(field, { state: 'visible', timeout: 5000 });
      }
    }
    
    // Small delay to ensure form is fully interactive
    await page.waitForTimeout(100);
    
    return { success: true, message: 'Form is ready for interaction' };
  } catch (error) {
    return { success: false, message: `Form not ready: ${error.message}` };
  }
}

/**
 * Wait for navigation to complete with multiple checks
 * @param {import('@playwright/test').Page} page 
 * @param {string} expectedUrl 
 * @param {object} options 
 */
export async function waitForNavigation(page, expectedUrl, options = {}) {
  const { timeout = 10000, waitForSelector = null } = options;
  
  try {
    // Wait for URL change
    await page.waitForURL(expectedUrl, { timeout });
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout });
    
    // Wait for specific selector if provided
    if (waitForSelector) {
      await page.waitForSelector(waitForSelector, { state: 'visible', timeout: 5000 });
    }
    
    // Verify we're actually on the expected page
    const currentUrl = page.url();
    const urlMatches = currentUrl.includes(expectedUrl) || currentUrl.match(new RegExp(expectedUrl));
    
    if (!urlMatches) {
      throw new Error(`Navigation failed: expected ${expectedUrl}, got ${currentUrl}`);
    }
    
    return { success: true, currentUrl, message: 'Navigation completed successfully' };
  } catch (error) {
    return { 
      success: false, 
      currentUrl: page.url(), 
      message: `Navigation failed: ${error.message}` 
    };
  }
}

/**
 * Wait for element to be stable (not changing)
 * @param {import('@playwright/test').Page} page 
 * @param {string} selector 
 * @param {object} options 
 */
export async function waitForElementStable(page, selector, options = {}) {
  const { timeout = 5000, stableTime = 1000, checkProperty = 'textContent' } = options;
  
  try {
    let lastValue = null;
    let stableStart = null;
    
    await page.waitForFunction(
      ({ selector, checkProperty, stableTime }) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        
        const currentValue = element[checkProperty];
        if (currentValue !== window.__lastStableValue) {
          window.__lastStableValue = currentValue;
          window.__stableStart = Date.now();
          return false;
        }
        
        return (Date.now() - window.__stableStart) >= stableTime;
      },
      { selector, checkProperty, stableTime },
      { timeout }
    );
    
    return { success: true, message: 'Element is stable' };
  } catch (error) {
    return { success: false, message: `Element not stable: ${error.message}` };
  }
}

/**
 * Smart wait that combines multiple strategies
 * @param {import('@playwright/test').Page} page 
 * @param {object} options 
 */
export async function smartWait(page, options = {}) {
  const {
    waitForReact = true,
    waitForNetworkIdle = true,
    waitForSelector = null,
    waitForFunction = null,
    timeout = 15000
  } = options;
  
  const results = [];
  
  try {
    // Wait for React app if requested
    if (waitForReact) {
      const reactResult = await waitForReactApp(page, { timeout: timeout / 3 });
      results.push(reactResult);
      if (!reactResult.success) {
        console.warn(`⚠️ React app not detected: ${reactResult.message}`);
      }
    }
    
    // Wait for network idle if requested
    if (waitForNetworkIdle) {
      try {
        await page.waitForLoadState('networkidle', { timeout: timeout / 3 });
        results.push({ success: true, message: 'Network idle achieved' });
      } catch (error) {
        results.push({ success: false, message: `Network idle timeout: ${error.message}` });
      }
    }
    
    // Wait for specific selector if provided
    if (waitForSelector) {
      try {
        await page.waitForSelector(waitForSelector, { state: 'visible', timeout: timeout / 3 });
        results.push({ success: true, message: `Selector ${waitForSelector} found` });
      } catch (error) {
        results.push({ success: false, message: `Selector ${waitForSelector} not found: ${error.message}` });
      }
    }
    
    // Wait for custom function if provided
    if (waitForFunction) {
      try {
        await page.waitForFunction(waitForFunction, {}, { timeout: timeout / 3 });
        results.push({ success: true, message: 'Custom function condition met' });
      } catch (error) {
        results.push({ success: false, message: `Custom function timeout: ${error.message}` });
      }
    }
    
    const successfulResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);
    
    return {
      success: successfulResults.length > 0,
      results,
      message: `${successfulResults.length}/${results.length} wait conditions met`,
      warnings: failedResults.map(r => r.message)
    };
    
  } catch (error) {
    return {
      success: false,
      results,
      message: `Smart wait failed: ${error.message}`
    };
  }
}
