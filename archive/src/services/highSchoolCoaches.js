/**
 * @fileoverview High school coach management service module providing CRUD operations
 * for high school coach records.
 *
 * This service handles all high school coach-related API calls including:
 * - Listing high school coaches with optional filtering
 * - Fetching individual high school coach details
 * - Creating new high school coach records
 * - Updating existing high school coach information
 * - Deleting high school coach records
 *
 * Parameter Filtering Behavior:
 * Create and update methods automatically filter out empty strings,
 * null, and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/highSchoolCoaches
 * @requires ./api
 */

import api from './api';

/**
 * High school coach management service object containing all high school coach-related API methods
 *
 * @namespace highSchoolCoachService
 */
const highSchoolCoachService = {
  /**
   * Retrieves a list of all high school coaches with optional filtering parameters
   *
   * @async
   * @function getHighSchoolCoaches
   * @memberof highSchoolCoachService
   * @param {Object} [params={}] - Optional query parameters for filtering high school coaches
   * @param {string} [params.school] - Filter coaches by school name
   * @param {string} [params.state] - Filter coaches by state
   * @param {string} [params.search] - Search term to filter coaches by name
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {number} [params.offset] - Number of results to skip for pagination
   * @returns {Promise<Object>} Response containing array of high school coach objects and metadata
   * @returns {Array<Object>} return.data - Array of high school coach objects
   * @returns {string} return.data[].id - High school coach's unique identifier
   * @returns {string} return.data[].name - High school coach's full name
   * @returns {string} return.data[].email - High school coach's email address
   * @returns {string} [return.data[].school] - High school name
   * @returns {string} [return.data[].state] - State where the school is located
   * @returns {number} [return.total] - Total count of high school coaches matching filter criteria
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the params object before sending to the API. This ensures
   *              clean query parameters and prevents invalid filter values.
   *
   * @example
   * // Get all high school coaches
   * const allCoaches = await highSchoolCoachService.getHighSchoolCoaches();
   *
   * @example
   * // Get high school coaches filtered by state
   * const texasCoaches = await highSchoolCoachService.getHighSchoolCoaches({
   *   state: 'Texas',
   *   limit: 10
   * });
   */
  getHighSchoolCoaches: async (params = {}) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await api.get('/high-school-coaches', { params: filteredParams });
    return response.data;
  },

  /**
   * Retrieves detailed information for a single high school coach by ID
   *
   * @async
   * @function getHighSchoolCoach
   * @memberof highSchoolCoachService
   * @param {string} id - The unique identifier of the high school coach to retrieve
   * @returns {Promise<Object>} The high school coach object with complete details
   * @returns {string} return.id - High school coach's unique identifier
   * @returns {string} return.name - High school coach's full name
   * @returns {string} return.email - High school coach's email address
   * @returns {string} [return.phone] - High school coach's phone number
   * @returns {string} [return.school] - High school name
   * @returns {string} [return.state] - State where the school is located
   * @returns {string} [return.city] - City where the school is located
   * @returns {string} [return.yearsExperience] - Years of coaching experience
   * @returns {string} return.createdAt - ISO timestamp of high school coach record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if high school coach not found
   *
   * @example
   * const coach = await highSchoolCoachService.getHighSchoolCoach('coach-789');
   * console.log('Coach name:', coach.name);
   * console.log('School:', coach.school);
   */
  getHighSchoolCoach: async (id) => {
    const response = await api.get(`/high-school-coaches/${id}`);
    return response.data;
  },

  /**
   * Creates a new high school coach record
   *
   * @async
   * @function createHighSchoolCoach
   * @memberof highSchoolCoachService
   * @param {Object} coachData - Data for the new high school coach
   * @param {string} coachData.name - High school coach's full name (required)
   * @param {string} coachData.email - High school coach's email address (required)
   * @param {string} [coachData.phone] - High school coach's phone number
   * @param {string} [coachData.school] - High school name
   * @param {string} [coachData.state] - State where the school is located
   * @param {string} [coachData.city] - City where the school is located
   * @param {string} [coachData.yearsExperience] - Years of coaching experience
   * @param {string} [coachData.sport] - Primary sport coached
   * @returns {Promise<Object>} The newly created high school coach object
   * @returns {string} return.id - High school coach's unique identifier
   * @returns {string} return.name - High school coach's full name
   * @returns {string} return.email - High school coach's email address
   * @returns {string} return.createdAt - ISO timestamp of high school coach record creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the coachData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newCoach = await highSchoolCoachService.createHighSchoolCoach({
   *   name: 'Mike Johnson',
   *   email: 'mike.johnson@highschool.edu',
   *   phone: '555-9876',
   *   school: 'Lincoln High School',
   *   state: 'California',
   *   city: 'San Francisco',
   *   yearsExperience: '15',
   *   sport: 'Basketball'
   * });
   * console.log('Created coach:', newCoach.id);
   */
  createHighSchoolCoach: async (coachData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(coachData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/high-school-coaches', filteredData);
    return response.data;
  },

  /**
   * Updates an existing high school coach's information
   *
   * @async
   * @function updateHighSchoolCoach
   * @memberof highSchoolCoachService
   * @param {string} id - The unique identifier of the high school coach to update
   * @param {Object} coachData - High school coach fields to update (only include fields you want to change)
   * @param {string} [coachData.name] - Updated full name
   * @param {string} [coachData.email] - Updated email address
   * @param {string} [coachData.phone] - Updated phone number
   * @param {string} [coachData.school] - Updated high school name
   * @param {string} [coachData.state] - Updated state
   * @param {string} [coachData.city] - Updated city
   * @param {string} [coachData.yearsExperience] - Updated years of experience
   * @param {string} [coachData.sport] - Updated primary sport coached
   * @returns {Promise<Object>} The updated high school coach object with all current data
   * @returns {string} return.id - High school coach's unique identifier
   * @returns {string} return.name - Updated coach name
   * @returns {string} return.email - Updated email address
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if high school coach not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the coachData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedCoach = await highSchoolCoachService.updateHighSchoolCoach('coach-789', {
   *   school: 'Washington High School',
   *   phone: '555-4321'
   * });
   * console.log('Updated coach:', updatedCoach.name);
   */
  updateHighSchoolCoach: async (id, coachData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(coachData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/high-school-coaches/${id}`, filteredData);
    return response.data;
  },

  /**
   * Deletes a high school coach record
   *
   * @async
   * @function deleteHighSchoolCoach
   * @memberof highSchoolCoachService
   * @param {string} id - The unique identifier of the high school coach to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if high school coach not found
   * @throws {Error} Throws error if high school coach cannot be deleted (e.g., has associated records)
   *
   * @example
   * const result = await highSchoolCoachService.deleteHighSchoolCoach('coach-789');
   * console.log(result.message); // "High school coach deleted successfully"
   */
  deleteHighSchoolCoach: async (id) => {
    const response = await api.delete(`/high-school-coaches/${id}`);
    return response.data;
  }
};

export default highSchoolCoachService;
