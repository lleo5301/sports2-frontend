/**
 * @fileoverview Scout management service module providing CRUD operations
 * for scout records.
 *
 * This service handles all scout-related API calls including:
 * - Listing scouts with optional filtering
 * - Fetching individual scout details
 * - Creating new scout records
 * - Updating existing scout information
 * - Deleting scout records
 *
 * Parameter Filtering Behavior:
 * Create and update methods automatically filter out empty strings,
 * null, and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/scouts
 * @requires ./api
 */

import api from './api'

/**
 * Scout management service object containing all scout-related API methods
 *
 * @namespace scoutService
 */
const scoutService = {
  /**
   * Retrieves a list of all scouts with optional filtering parameters
   *
   * @async
   * @function getScouts
   * @memberof scoutService
   * @param {Object} [params={}] - Optional query parameters for filtering scouts
   * @param {string} [params.region] - Filter scouts by region
   * @param {string} [params.specialty] - Filter scouts by specialty area
   * @param {string} [params.search] - Search term to filter scouts by name
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {number} [params.offset] - Number of results to skip for pagination
   * @returns {Promise<Object>} Response containing array of scout objects and metadata
   * @returns {Array<Object>} return.data - Array of scout objects
   * @returns {string} return.data[].id - Scout's unique identifier
   * @returns {string} return.data[].name - Scout's full name
   * @returns {string} return.data[].email - Scout's email address
   * @returns {string} [return.data[].region] - Scout's assigned region
   * @returns {string} [return.data[].specialty] - Scout's area of specialty
   * @returns {number} [return.total] - Total count of scouts matching filter criteria
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the params object before sending to the API. This ensures
   *              clean query parameters and prevents invalid filter values.
   *
   * @example
   * // Get all scouts
   * const allScouts = await scoutService.getScouts();
   *
   * @example
   * // Get scouts filtered by region
   * const regionalScouts = await scoutService.getScouts({
   *   region: 'West Coast',
   *   limit: 10
   * });
   */
  getScouts: async (params = {}) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await api.get('/scouts', { params: filteredParams })
    return response.data
  },

  /**
   * Retrieves detailed information for a single scout by ID
   *
   * @async
   * @function getScout
   * @memberof scoutService
   * @param {string} id - The unique identifier of the scout to retrieve
   * @returns {Promise<Object>} The scout object with complete details
   * @returns {string} return.id - Scout's unique identifier
   * @returns {string} return.name - Scout's full name
   * @returns {string} return.email - Scout's email address
   * @returns {string} [return.phone] - Scout's phone number
   * @returns {string} [return.region] - Scout's assigned region
   * @returns {string} [return.specialty] - Scout's area of specialty
   * @returns {string} [return.yearsExperience] - Years of scouting experience
   * @returns {string} return.createdAt - ISO timestamp of scout record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if scout not found
   *
   * @example
   * const scout = await scoutService.getScout('scout-456');
   * console.log('Scout name:', scout.name);
   * console.log('Region:', scout.region);
   */
  getScout: async (id) => {
    const response = await api.get(`/scouts/${id}`)
    return response.data
  },

  /**
   * Creates a new scout record
   *
   * @async
   * @function createScout
   * @memberof scoutService
   * @param {Object} scoutData - Data for the new scout
   * @param {string} scoutData.name - Scout's full name (required)
   * @param {string} scoutData.email - Scout's email address (required)
   * @param {string} [scoutData.phone] - Scout's phone number
   * @param {string} [scoutData.region] - Scout's assigned region
   * @param {string} [scoutData.specialty] - Scout's area of specialty
   * @param {string} [scoutData.yearsExperience] - Years of scouting experience
   * @param {string} [scoutData.certifications] - Scouting certifications
   * @returns {Promise<Object>} The newly created scout object
   * @returns {string} return.id - Scout's unique identifier
   * @returns {string} return.name - Scout's full name
   * @returns {string} return.email - Scout's email address
   * @returns {string} return.createdAt - ISO timestamp of scout record creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the scoutData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newScout = await scoutService.createScout({
   *   name: 'John Smith',
   *   email: 'john.smith@example.com',
   *   phone: '555-1234',
   *   region: 'West Coast',
   *   specialty: 'Defensive Players',
   *   yearsExperience: '10'
   * });
   * console.log('Created scout:', newScout.id);
   */
  createScout: async (scoutData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(scoutData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/scouts', filteredData)
    return response.data
  },

  /**
   * Updates an existing scout's information
   *
   * @async
   * @function updateScout
   * @memberof scoutService
   * @param {string} id - The unique identifier of the scout to update
   * @param {Object} scoutData - Scout fields to update (only include fields you want to change)
   * @param {string} [scoutData.name] - Updated full name
   * @param {string} [scoutData.email] - Updated email address
   * @param {string} [scoutData.phone] - Updated phone number
   * @param {string} [scoutData.region] - Updated assigned region
   * @param {string} [scoutData.specialty] - Updated area of specialty
   * @param {string} [scoutData.yearsExperience] - Updated years of experience
   * @param {string} [scoutData.certifications] - Updated scouting certifications
   * @returns {Promise<Object>} The updated scout object with all current data
   * @returns {string} return.id - Scout's unique identifier
   * @returns {string} return.name - Updated scout name
   * @returns {string} return.email - Updated email address
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if scout not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the scoutData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedScout = await scoutService.updateScout('scout-456', {
   *   region: 'East Coast',
   *   phone: '555-5678'
   * });
   * console.log('Updated scout:', updatedScout.name);
   */
  updateScout: async (id, scoutData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(scoutData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/scouts/${id}`, filteredData)
    return response.data
  },

  /**
   * Deletes a scout record
   *
   * @async
   * @function deleteScout
   * @memberof scoutService
   * @param {string} id - The unique identifier of the scout to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if scout not found
   * @throws {Error} Throws error if scout cannot be deleted (e.g., has associated records)
   *
   * @example
   * const result = await scoutService.deleteScout('scout-456');
   * console.log(result.message); // "Scout deleted successfully"
   */
  deleteScout: async (id) => {
    const response = await api.delete(`/scouts/${id}`)
    return response.data
  }
}

export default scoutService
