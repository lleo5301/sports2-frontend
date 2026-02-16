import axios from 'axios';

/**
 * @fileoverview CSRF token management service for handling Cross-Site Request Forgery protection.
 * This module provides functions to fetch, cache, and manage CSRF tokens that are required
 * for all state-changing requests (POST, PUT, PATCH, DELETE) to the backend API.
 *
 * Features:
 * - Token caching to minimize server requests
 * - Automatic token refresh on expiration or 403 errors
 * - Thread-safe token fetching (prevents duplicate requests)
 * - Integration with axios interceptors for automatic token inclusion
 *
 * @module services/csrf
 */

/**
 * In-memory cache for the CSRF token
 * @type {string|null}
 */
let cachedToken = null;

/**
 * Promise to track ongoing token fetch requests
 * Prevents duplicate concurrent requests to the CSRF endpoint
 * @type {Promise<string>|null}
 */
let tokenFetchPromise = null;

/**
 * Timestamp of when the token was last fetched
 * Used for cache invalidation and refresh logic
 * @type {number|null}
 */
let tokenFetchedAt = null;

/**
 * Token cache duration in milliseconds
 * Tokens are considered valid for this duration before automatic refresh
 * Default: 30 minutes (configurable via environment variable)
 * @type {number}
 */
const TOKEN_CACHE_DURATION = parseInt(import.meta.env.VITE_CSRF_TOKEN_CACHE_DURATION) || 30 * 60 * 1000;

/**
 * Get the currently cached CSRF token
 *
 * @returns {string|null} The cached CSRF token, or null if not available
 *
 * @example
 * const token = getCsrfToken()
 * if (token) {
 *   // Use token in request headers
 *   headers['X-CSRF-Token'] = token
 * }
 */
export const getCsrfToken = () => {
  return cachedToken;
};

/**
 * Set the CSRF token in the cache
 * Also updates the timestamp of when the token was last fetched
 *
 * @param {string|null} token - The CSRF token to cache, or null to clear the cache
 *
 * @example
 * setCsrfToken('abc123def456')
 * // Token is now cached and will be used in subsequent requests
 */
export const setCsrfToken = (token) => {
  cachedToken = token;
  tokenFetchedAt = token ? Date.now() : null;
};

/**
 * Check if the cached CSRF token is expired based on cache duration
 *
 * @returns {boolean} True if the token is expired or not yet fetched, false otherwise
 *
 * @example
 * if (isTokenExpired()) {
 *   await refreshCsrfToken()
 * }
 */
export const isTokenExpired = () => {
  if (!cachedToken || !tokenFetchedAt) {
    return true;
  }

  const elapsed = Date.now() - tokenFetchedAt;
  return elapsed > TOKEN_CACHE_DURATION;
};

/**
 * Fetch a new CSRF token from the backend API
 * This function uses a separate axios instance to avoid circular dependencies
 * with the main API interceptors. It also implements a mutex pattern to prevent
 * duplicate concurrent requests to the CSRF endpoint.
 *
 * @returns {Promise<string>} Promise that resolves to the CSRF token
 * @throws {Error} If the token fetch request fails
 *
 * @example
 * try {
 *   const token = await fetchCsrfToken()
 *   console.log('CSRF token fetched:', token)
 * } catch (error) {
 *   console.error('Failed to fetch CSRF token:', error)
 * }
 */
export const fetchCsrfToken = async () => {
  // If a fetch is already in progress, return that promise
  // This prevents duplicate requests when multiple components call this simultaneously
  if (tokenFetchPromise) {
    return tokenFetchPromise;
  }

  // Create a new fetch promise
  tokenFetchPromise = (async () => {
    try {
      // Use a separate axios instance to avoid triggering interceptors
      // that might cause circular token refresh loops
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/csrf-token`,
        {
          withCredentials: true
        }
      );

      const token = response.data.token;

      if (!token) {
        throw new Error('CSRF token not found in response');
      }

      // Cache the token and update timestamp
      setCsrfToken(token);

      return token;
    } catch (error) {
      // Clear the cache on error to ensure retry on next request
      setCsrfToken(null);
      throw error;
    } finally {
      // Clear the promise tracker once the request completes
      tokenFetchPromise = null;
    }
  })();

  return tokenFetchPromise;
};

/**
 * Refresh the CSRF token by fetching a new one from the backend
 * This is an alias for fetchCsrfToken for better semantic clarity
 *
 * @returns {Promise<string>} Promise that resolves to the new CSRF token
 * @throws {Error} If the token refresh request fails
 *
 * @example
 * // Refresh token when it expires
 * if (isTokenExpired()) {
 *   await refreshCsrfToken()
 * }
 */
export const refreshCsrfToken = async () => {
  return fetchCsrfToken();
};

/**
 * Ensure a valid CSRF token is available, fetching one if necessary
 * This function checks if a token exists and is not expired before fetching
 *
 * @returns {Promise<string>} Promise that resolves to a valid CSRF token
 * @throws {Error} If the token fetch request fails
 *
 * @example
 * // Before making a state-changing request
 * const token = await ensureCsrfToken()
 * // Token is guaranteed to be valid and cached
 */
export const ensureCsrfToken = async () => {
  // If we have a valid cached token that hasn't expired, return it
  if (cachedToken && !isTokenExpired()) {
    return cachedToken;
  }

  // Otherwise, fetch a new token
  return fetchCsrfToken();
};

/**
 * Clear the cached CSRF token
 * Use this when logging out or when the token is known to be invalid
 *
 * @example
 * // Clear token on logout
 * clearCsrfToken()
 * await logoutUser()
 */
export const clearCsrfToken = () => {
  setCsrfToken(null);
};

/**
 * Initialize CSRF protection by fetching an initial token
 * This should be called when the application starts or after login
 * to pre-fetch a token before any state-changing requests are made
 *
 * @returns {Promise<string|null>} Promise that resolves to the CSRF token, or null if fetch fails
 *
 * @example
 * // In App.jsx or after successful login
 * await initializeCsrf()
 * // Token is now cached and ready for use
 */
export const initializeCsrf = async () => {
  try {
    return await fetchCsrfToken();
  } catch (error) {
    // Silently fail during initialization
    // The token will be fetched lazily when needed
    // console.warn('Failed to initialize CSRF token:', error.message);
    return null;
  }
};

/**
 * CSRF service object with all token management functions
 * Provides a convenient namespace for importing
 *
 * @example
 * import csrfService from './services/csrf'
 * await csrfService.ensureCsrfToken()
 */
const csrfService = {
  getCsrfToken,
  setCsrfToken,
  fetchCsrfToken,
  refreshCsrfToken,
  ensureCsrfToken,
  isTokenExpired,
  clearCsrfToken,
  initializeCsrf
};

export default csrfService;
