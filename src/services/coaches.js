/**
 * @fileoverview Coach management service module providing CRUD operations
 * for coaching staff records.
 *
 * This service handles all coach-related API calls including:
 * - Listing coaches with optional filtering
 * - Fetching individual coach details
 * - Creating new coach records
 * - Updating existing coach information
 * - Deleting coach records
 *
 * Parameter Filtering Behavior:
 * Create and update methods automatically filter out empty strings,
 * null, and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/coaches
 * @requires ./api
 */

import api from './api'

/**
 * Coach management service object containing all coach-related API methods
 *
 * @namespace coachService
 */
const coachService = {
  /**
   * Retrieves a list of all coaches with optional filtering parameters
   *
   * @async
   * @function getCoaches
   * @memberof coachService
   * @param {Object} [params={}] - Optional query parameters for filtering coaches
   * @param {string} [params.teamId] - Filter coaches by team ID
   * @param {string} [params.position] - Filter coaches by position (e.g., 'Head Coach', 'Offensive Coordinator')
   * @param {string} [params.search] - Search term to filter coaches by name
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {number} [params.offset] - Number of results to skip for pagination
   * @returns {Promise<Object>} Response containing array of coach objects and metadata
   * @returns {Array<Object>} return.data - Array of coach objects
   * @returns {string} return.data[].id - Coach's unique identifier
   * @returns {string} return.data[].name - Coach's full name
   * @returns {string} return.data[].position - Coach's position/role
   * @returns {string} return.data[].email - Coach's email address
   * @returns {string} [return.data[].teamId] - ID of coach's team
   * @returns {number} [return.total] - Total count of coaches matching filter criteria
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the params object before sending to the API. This ensures
   *              clean query parameters and prevents invalid filter values.
   *
   * @example
   * // Get all coaches
   * const allCoaches = await coachService.getCoaches();
   *
   * @example
   * // Get coaches filtered by team
   * const teamCoaches = await coachService.getCoaches({
   *   teamId: 'team-123',
   *   limit: 10
   * });
   */
  getCoaches: async (params = {}) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await api.get('/coaches', { params: filteredParams })
    return response.data
  },

  /**
   * Retrieves detailed information for a single coach by ID
   *
   * @async
   * @function getCoach
   * @memberof coachService
   * @param {string} id - The unique identifier of the coach to retrieve
   * @returns {Promise<Object>} The coach object with complete details
   * @returns {string} return.id - Coach's unique identifier
   * @returns {string} return.name - Coach's full name
   * @returns {string} return.position - Coach's position/role
   * @returns {string} return.email - Coach's email address
   * @returns {string} [return.phone] - Coach's phone number
   * @returns {string} [return.teamId] - ID of coach's team
   * @returns {string} [return.yearsExperience] - Years of coaching experience
   * @returns {string} [return.specialty] - Coach's area of specialty
   * @returns {string} return.createdAt - ISO timestamp of coach record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if coach not found
   *
   * @example
   * const coach = await coachService.getCoach('coach-456');
   * console.log('Coach name:', coach.name);
   * console.log('Position:', coach.position);
   */
  getCoach: async (id) => {
    const response = await api.get(`/coaches/${id}`)
    return response.data
  },

  /**
   * Creates a new coach record
   *
   * @async
   * @function createCoach
   * @memberof coachService
   * @param {Object} coachData - Data for the new coach
   * @param {string} coachData.name - Coach's full name (required)
   * @param {string} coachData.position - Coach's position/role (required)
   * @param {string} coachData.email - Coach's email address (required)
   * @param {string} [coachData.phone] - Coach's phone number
   * @param {string} [coachData.teamId] - ID of coach's team
   * @param {string} [coachData.yearsExperience] - Years of coaching experience
   * @param {string} [coachData.specialty] - Coach's area of specialty
   * @param {string} [coachData.certifications] - Coaching certifications
   * @returns {Promise<Object>} The newly created coach object
   * @returns {string} return.id - Coach's unique identifier
   * @returns {string} return.name - Coach's full name
   * @returns {string} return.position - Coach's position/role
   * @returns {string} return.email - Coach's email address
   * @returns {string} return.createdAt - ISO timestamp of coach record creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the coachData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newCoach = await coachService.createCoach({
   *   name: 'John Smith',
   *   position: 'Offensive Coordinator',
   *   email: 'john.smith@example.com',
   *   phone: '555-1234',
   *   teamId: 'team-123',
   *   yearsExperience: '15'
   * });
   * console.log('Created coach:', newCoach.id);
   */
  createCoach: async (coachData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(coachData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/coaches', filteredData)
    return response.data
  },

  /**
   * Updates an existing coach's information
   *
   * @async
   * @function updateCoach
   * @memberof coachService
   * @param {string} id - The unique identifier of the coach to update
   * @param {Object} coachData - Coach fields to update (only include fields you want to change)
   * @param {string} [coachData.name] - Updated full name
   * @param {string} [coachData.position] - Updated position/role
   * @param {string} [coachData.email] - Updated email address
   * @param {string} [coachData.phone] - Updated phone number
   * @param {string} [coachData.teamId] - Updated team ID
   * @param {string} [coachData.yearsExperience] - Updated years of experience
   * @param {string} [coachData.specialty] - Updated area of specialty
   * @param {string} [coachData.certifications] - Updated coaching certifications
   * @returns {Promise<Object>} The updated coach object with all current data
   * @returns {string} return.id - Coach's unique identifier
   * @returns {string} return.name - Updated coach name
   * @returns {string} return.position - Updated position/role
   * @returns {string} return.email - Updated email address
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if coach not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the coachData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedCoach = await coachService.updateCoach('coach-456', {
   *   position: 'Head Coach',
   *   phone: '555-5678'
   * });
   * console.log('Updated coach:', updatedCoach.name);
   */
  updateCoach: async (id, coachData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(coachData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/coaches/${id}`, filteredData)
    return response.data
  },

  /**
   * Deletes a coach record
   *
   * @async
   * @function deleteCoach
   * @memberof coachService
   * @param {string} id - The unique identifier of the coach to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if coach not found
   * @throws {Error} Throws error if coach cannot be deleted (e.g., has associated records)
   *
   * @example
   * const result = await coachService.deleteCoach('coach-456');
   * console.log(result.message); // "Coach deleted successfully"
   */
  deleteCoach: async (id) => {
    const response = await api.delete(`/coaches/${id}`)
    return response.data
  }
}

export default coachService
