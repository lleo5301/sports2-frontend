/**
 * @fileoverview Schedule management service module providing CRUD operations,
 * upcoming/recent schedules, and statistics for team schedules.
 *
 * This service handles all schedule-related API calls including:
 * - Listing schedules with optional filtering
 * - Fetching individual schedule details
 * - Creating new schedule records
 * - Updating existing schedule information
 * - Deleting schedule records
 * - Retrieving upcoming schedules for the team
 * - Retrieving recent schedules for the team
 * - Accessing schedule statistics
 *
 * Parameter Filtering Behavior:
 * Create and update methods automatically filter out empty strings,
 * null, and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/schedules
 * @requires ./api
 */

import api from './api';

/**
 * Schedule management service object containing all schedule-related API methods
 *
 * @namespace schedulesService
 */
export const schedulesService = {
  /**
   * Retrieves a list of all schedules for the user's team with optional filtering parameters
   *
   * @async
   * @function getAllSchedules
   * @memberof schedulesService
   * @param {Object} [params={}] - Optional query parameters for filtering schedules
   * @param {string} [params.teamId] - Filter schedules by team ID
   * @param {string} [params.season] - Filter schedules by season year
   * @param {string} [params.status] - Filter schedules by status (e.g., 'scheduled', 'completed', 'cancelled')
   * @param {string} [params.startDate] - Filter schedules starting from this date (ISO format)
   * @param {string} [params.endDate] - Filter schedules up to this date (ISO format)
   * @param {string} [params.search] - Search term to filter schedules by name or description
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {number} [params.offset] - Number of results to skip for pagination
   * @returns {Promise<Object>} Response containing array of schedule objects and metadata
   * @returns {Array<Object>} return.data - Array of schedule objects
   * @returns {string} return.data[].id - Schedule's unique identifier
   * @returns {string} return.data[].name - Schedule name or title
   * @returns {string} return.data[].teamId - ID of the team this schedule belongs to
   * @returns {string} return.data[].date - Scheduled date (ISO format)
   * @returns {string} [return.data[].opponent] - Opponent team name
   * @returns {string} [return.data[].location] - Game or event location
   * @returns {string} return.data[].status - Schedule status (scheduled, completed, cancelled)
   * @returns {number} [return.total] - Total count of schedules matching filter criteria
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get all schedules
   * const allSchedules = await schedulesService.getAllSchedules();
   *
   * @example
   * // Get schedules filtered by season and status
   * const upcomingGames = await schedulesService.getAllSchedules({
   *   season: '2024',
   *   status: 'scheduled',
   *   limit: 20
   * });
   */
  getAllSchedules: async (params = {}) => {
    const response = await api.get('/schedules', { params });
    return response.data;
  },

  /**
   * Retrieves detailed information for a single schedule by ID
   *
   * @async
   * @function getSchedule
   * @memberof schedulesService
   * @param {string} id - The unique identifier of the schedule to retrieve
   * @returns {Promise<Object>} The schedule object with complete details
   * @returns {string} return.id - Schedule's unique identifier
   * @returns {string} return.name - Schedule name or title
   * @returns {string} return.teamId - ID of the team this schedule belongs to
   * @returns {string} return.date - Scheduled date (ISO format)
   * @returns {string} [return.opponent] - Opponent team name
   * @returns {string} [return.location] - Game or event location
   * @returns {string} [return.description] - Schedule description or notes
   * @returns {string} return.status - Schedule status (scheduled, completed, cancelled)
   * @returns {string} [return.result] - Game result if completed
   * @returns {string} return.createdAt - ISO timestamp of schedule record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if schedule not found
   *
   * @example
   * const schedule = await schedulesService.getSchedule('schedule-123');
   * console.log('Schedule date:', schedule.date);
   * console.log('Opponent:', schedule.opponent);
   */
  getSchedule: async (id) => {
    const response = await api.get(`/schedules/byId/${id}`);
    return response.data;
  },

  /**
   * Creates a new schedule record
   *
   * @async
   * @function createSchedule
   * @memberof schedulesService
   * @param {Object} scheduleData - Data for the new schedule
   * @param {string} scheduleData.name - Schedule name or title (required)
   * @param {string} scheduleData.teamId - ID of the team this schedule belongs to (required)
   * @param {string} scheduleData.date - Scheduled date (ISO format) (required)
   * @param {string} [scheduleData.opponent] - Opponent team name
   * @param {string} [scheduleData.location] - Game or event location
   * @param {string} [scheduleData.description] - Schedule description or notes
   * @param {string} [scheduleData.status] - Schedule status (defaults to 'scheduled')
   * @param {string} [scheduleData.type] - Schedule type (e.g., 'game', 'practice', 'event')
   * @returns {Promise<Object>} The newly created schedule object
   * @returns {string} return.id - Schedule's unique identifier
   * @returns {string} return.name - Schedule name or title
   * @returns {string} return.teamId - ID of the team this schedule belongs to
   * @returns {string} return.date - Scheduled date (ISO format)
   * @returns {string} return.status - Schedule status
   * @returns {string} return.createdAt - ISO timestamp of schedule record creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the scheduleData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newSchedule = await schedulesService.createSchedule({
   *   name: 'Season Opener',
   *   teamId: 'team-123',
   *   date: '2024-09-01T19:00:00Z',
   *   opponent: 'Rival High School',
   *   location: 'Home Stadium'
   * });
   * console.log('Created schedule:', newSchedule.id);
   */
  createSchedule: async (scheduleData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(scheduleData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/schedules', filteredData);
    return response.data;
  },

  /**
   * Updates an existing schedule's information
   *
   * @async
   * @function updateSchedule
   * @memberof schedulesService
   * @param {string} id - The unique identifier of the schedule to update
   * @param {Object} scheduleData - Schedule fields to update (only include fields you want to change)
   * @param {string} [scheduleData.name] - Updated schedule name or title
   * @param {string} [scheduleData.date] - Updated scheduled date (ISO format)
   * @param {string} [scheduleData.opponent] - Updated opponent team name
   * @param {string} [scheduleData.location] - Updated game or event location
   * @param {string} [scheduleData.description] - Updated schedule description or notes
   * @param {string} [scheduleData.status] - Updated schedule status
   * @param {string} [scheduleData.result] - Updated game result
   * @param {string} [scheduleData.type] - Updated schedule type
   * @returns {Promise<Object>} The updated schedule object with all current data
   * @returns {string} return.id - Schedule's unique identifier
   * @returns {string} return.name - Updated schedule name
   * @returns {string} return.date - Updated scheduled date
   * @returns {string} return.status - Updated schedule status
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if schedule not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the scheduleData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedSchedule = await schedulesService.updateSchedule('schedule-123', {
   *   status: 'completed',
   *   result: 'Won 28-14'
   * });
   * console.log('Updated schedule:', updatedSchedule.name);
   */
  updateSchedule: async (id, scheduleData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(scheduleData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/schedules/byId/${id}`, filteredData);
    return response.data;
  },

  /**
   * Deletes a schedule record
   *
   * @async
   * @function deleteSchedule
   * @memberof schedulesService
   * @param {string} id - The unique identifier of the schedule to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if schedule not found
   * @throws {Error} Throws error if schedule cannot be deleted
   *
   * @example
   * const result = await schedulesService.deleteSchedule('schedule-123');
   * console.log(result.message); // "Schedule deleted successfully"
   */
  deleteSchedule: async (id) => {
    const response = await api.delete(`/schedules/byId/${id}`);
    return response.data;
  },

  /**
   * Retrieves upcoming game schedules for the team
   *
   * @async
   * @function getUpcomingSchedules
   * @memberof schedulesService
   * @param {number} [limit=10] - Maximum number of upcoming schedules to return
   * @returns {Promise<Object>} Response containing array of upcoming schedule objects
   * @returns {Array<Object>} return.data - Array of upcoming schedule objects ordered by date
   * @returns {string} return.data[].id - Schedule's unique identifier
   * @returns {string} return.data[].name - Schedule name or title
   * @returns {string} return.data[].date - Scheduled date (ISO format)
   * @returns {string} [return.data[].opponent] - Opponent team name
   * @returns {string} [return.data[].location] - Game or event location
   * @returns {string} return.data[].status - Schedule status
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get next 5 upcoming schedules
   * const upcoming = await schedulesService.getUpcomingSchedules(5);
   * console.log('Next game:', upcoming.data[0].name);
   * console.log('Date:', upcoming.data[0].date);
   */
  getUpcomingSchedules: async (limit = 10) => {
    const response = await api.get('/teams/upcoming-schedules', { params: { limit } });
    return response.data;
  },

  /**
   * Retrieves recent game schedules for the team
   *
   * @async
   * @function getRecentSchedules
   * @memberof schedulesService
   * @param {number} [limit=10] - Maximum number of recent schedules to return
   * @returns {Promise<Object>} Response containing array of recent schedule objects
   * @returns {Array<Object>} return.data - Array of recent schedule objects ordered by date (most recent first)
   * @returns {string} return.data[].id - Schedule's unique identifier
   * @returns {string} return.data[].name - Schedule name or title
   * @returns {string} return.data[].date - Scheduled date (ISO format)
   * @returns {string} [return.data[].opponent] - Opponent team name
   * @returns {string} [return.data[].location] - Game or event location
   * @returns {string} return.data[].status - Schedule status
   * @returns {string} [return.data[].result] - Game result if completed
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get last 5 recent schedules
   * const recent = await schedulesService.getRecentSchedules(5);
   * console.log('Last game:', recent.data[0].name);
   * console.log('Result:', recent.data[0].result);
   */
  getRecentSchedules: async (limit = 10) => {
    const response = await api.get('/teams/recent-schedules', { params: { limit } });
    return response.data;
  },

  /**
   * Retrieves comprehensive schedule statistics for the team
   *
   * @async
   * @function getScheduleStats
   * @memberof schedulesService
   * @returns {Promise<Object>} Schedule statistics object
   * @returns {number} return.totalSchedules - Total number of schedules
   * @returns {number} return.upcomingCount - Number of upcoming schedules
   * @returns {number} return.completedCount - Number of completed schedules
   * @returns {number} return.cancelledCount - Number of cancelled schedules
   * @returns {Object} [return.seasonStats] - Statistics broken down by season
   * @returns {Object} [return.winLossRecord] - Win/loss record if applicable
   * @returns {number} [return.winLossRecord.wins] - Number of wins
   * @returns {number} [return.winLossRecord.losses] - Number of losses
   * @returns {number} [return.winLossRecord.ties] - Number of ties
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * const stats = await schedulesService.getScheduleStats();
   * console.log('Total schedules:', stats.totalSchedules);
   * console.log('Upcoming games:', stats.upcomingCount);
   * console.log('Win/Loss:', `${stats.winLossRecord.wins}-${stats.winLossRecord.losses}`);
   */
  getScheduleStats: async () => {
    const response = await api.get('/schedules/stats');
    return response.data;
  }
};
