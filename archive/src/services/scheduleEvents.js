/**
 * @fileoverview Schedule events management service module providing CRUD operations,
 * event type selection, and priority level management for team schedule events.
 *
 * This service handles all schedule event-related API calls including:
 * - Listing schedule events with optional filtering
 * - Fetching individual schedule event details
 * - Creating new schedule event records
 * - Updating existing schedule event information
 * - Deleting schedule event records
 * - Retrieving static data for event types (practice, game, tournament, etc.)
 * - Retrieving static data for priority levels (low, medium, high, critical)
 *
 * Event Types:
 * The service provides 9 predefined event types including practice, game, scrimmage,
 * tournament, meeting, training, conditioning, team building, and other.
 *
 * Priority Levels:
 * Events can be assigned priority levels: low, medium, high, or critical to help
 * with scheduling conflicts and importance indication.
 *
 * Parameter Filtering Behavior:
 * Create and update methods automatically filter out empty strings,
 * null, and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/scheduleEvents
 * @requires ./api
 */

import api from './api';

/**
 * Schedule events management service object containing all schedule event-related API methods
 * and static data methods for event types and priority levels
 *
 * @namespace scheduleEventsService
 */
const scheduleEventsService = {
  /**
   * Retrieves a list of all schedule events with optional filtering parameters
   *
   * @async
   * @function getScheduleEvents
   * @memberof scheduleEventsService
   * @param {Object} [params={}] - Optional query parameters for filtering schedule events
   * @param {string} [params.scheduleId] - Filter events by schedule ID
   * @param {string} [params.eventType] - Filter by event type (practice, game, scrimmage, etc.)
   * @param {string} [params.priority] - Filter by priority level (low, medium, high, critical)
   * @param {string} [params.startDate] - Filter events starting from this date (ISO format)
   * @param {string} [params.endDate] - Filter events up to this date (ISO format)
   * @param {string} [params.location] - Filter events by location
   * @param {string} [params.search] - Search term to filter events by title or description
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {number} [params.offset] - Number of results to skip for pagination
   * @returns {Promise<Object>} Response containing array of schedule event objects and metadata
   * @returns {Array<Object>} return.data - Array of schedule event objects
   * @returns {string} return.data[].id - Event's unique identifier
   * @returns {string} return.data[].title - Event title or name
   * @returns {string} return.data[].eventType - Type of event (practice, game, scrimmage, tournament, meeting, training, conditioning, team_building, other)
   * @returns {string} return.data[].priority - Priority level (low, medium, high, critical)
   * @returns {string} return.data[].startDate - Event start date and time (ISO format)
   * @returns {string} [return.data[].endDate] - Event end date and time (ISO format)
   * @returns {string} [return.data[].location] - Event location
   * @returns {string} [return.data[].description] - Event description or notes
   * @returns {number} [return.total] - Total count of events matching filter criteria
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get all schedule events
   * const allEvents = await scheduleEventsService.getScheduleEvents();
   *
   * @example
   * // Get high priority game events
   * const importantGames = await scheduleEventsService.getScheduleEvents({
   *   eventType: 'game',
   *   priority: 'high',
   *   limit: 10
   * });
   */
  getScheduleEvents: async (params = {}) => {
    const response = await api.get('/schedule-events', { params });
    return response.data;
  },

  /**
   * Retrieves detailed information for a single schedule event by ID
   *
   * @async
   * @function getScheduleEvent
   * @memberof scheduleEventsService
   * @param {string} id - The unique identifier of the schedule event to retrieve
   * @returns {Promise<Object>} The schedule event object with complete details
   * @returns {string} return.id - Event's unique identifier
   * @returns {string} return.title - Event title or name
   * @returns {string} return.eventType - Type of event (practice, game, scrimmage, tournament, meeting, training, conditioning, team_building, other)
   * @returns {string} return.priority - Priority level (low, medium, high, critical)
   * @returns {string} return.startDate - Event start date and time (ISO format)
   * @returns {string} [return.endDate] - Event end date and time (ISO format)
   * @returns {string} [return.location] - Event location
   * @returns {string} [return.description] - Event description or notes
   * @returns {string} [return.scheduleId] - Associated schedule ID
   * @returns {Array<string>} [return.participants] - List of participant IDs
   * @returns {string} return.createdAt - ISO timestamp of event record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if schedule event not found
   *
   * @example
   * const event = await scheduleEventsService.getScheduleEvent('event-123');
   * console.log('Event title:', event.title);
   * console.log('Event type:', event.eventType);
   * console.log('Priority:', event.priority);
   */
  getScheduleEvent: async (id) => {
    const response = await api.get(`/schedule-events/${id}`);
    return response.data;
  },

  /**
   * Creates a new schedule event record
   *
   * @async
   * @function createScheduleEvent
   * @memberof scheduleEventsService
   * @param {Object} eventData - Data for the new schedule event
   * @param {string} eventData.title - Event title or name (required)
   * @param {string} eventData.eventType - Type of event: practice, game, scrimmage, tournament, meeting, training, conditioning, team_building, or other (required)
   * @param {string} eventData.priority - Priority level: low, medium, high, or critical (required)
   * @param {string} eventData.startDate - Event start date and time in ISO format (required)
   * @param {string} [eventData.endDate] - Event end date and time in ISO format
   * @param {string} [eventData.location] - Event location
   * @param {string} [eventData.description] - Event description or notes
   * @param {string} [eventData.scheduleId] - Associated schedule ID
   * @param {Array<string>} [eventData.participants] - List of participant IDs
   * @returns {Promise<Object>} The newly created schedule event object
   * @returns {string} return.id - Event's unique identifier
   * @returns {string} return.title - Event title or name
   * @returns {string} return.eventType - Type of event
   * @returns {string} return.priority - Priority level
   * @returns {string} return.startDate - Event start date and time (ISO format)
   * @returns {string} return.createdAt - ISO timestamp of event record creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the eventData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newEvent = await scheduleEventsService.createScheduleEvent({
   *   title: 'Team Practice',
   *   eventType: 'practice',
   *   priority: 'medium',
   *   startDate: '2024-09-15T16:00:00Z',
   *   endDate: '2024-09-15T18:00:00Z',
   *   location: 'Main Field',
   *   description: 'Focus on defensive drills'
   * });
   * console.log('Created event:', newEvent.id);
   */
  createScheduleEvent: async (eventData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(eventData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/schedule-events', filteredData);
    return response.data;
  },

  /**
   * Updates an existing schedule event's information
   *
   * @async
   * @function updateScheduleEvent
   * @memberof scheduleEventsService
   * @param {string} id - The unique identifier of the schedule event to update
   * @param {Object} eventData - Event fields to update (only include fields you want to change)
   * @param {string} [eventData.title] - Updated event title or name
   * @param {string} [eventData.eventType] - Updated event type (practice, game, scrimmage, tournament, meeting, training, conditioning, team_building, other)
   * @param {string} [eventData.priority] - Updated priority level (low, medium, high, critical)
   * @param {string} [eventData.startDate] - Updated event start date and time (ISO format)
   * @param {string} [eventData.endDate] - Updated event end date and time (ISO format)
   * @param {string} [eventData.location] - Updated event location
   * @param {string} [eventData.description] - Updated event description or notes
   * @param {string} [eventData.scheduleId] - Updated associated schedule ID
   * @param {Array<string>} [eventData.participants] - Updated list of participant IDs
   * @returns {Promise<Object>} The updated schedule event object with all current data
   * @returns {string} return.id - Event's unique identifier
   * @returns {string} return.title - Updated event title
   * @returns {string} return.eventType - Updated event type
   * @returns {string} return.priority - Updated priority level
   * @returns {string} return.startDate - Updated event start date
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if schedule event not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the eventData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedEvent = await scheduleEventsService.updateScheduleEvent('event-123', {
   *   priority: 'high',
   *   location: 'Stadium A'
   * });
   * console.log('Updated event:', updatedEvent.title);
   */
  updateScheduleEvent: async (id, eventData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(eventData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/schedule-events/${id}`, filteredData);
    return response.data;
  },

  /**
   * Deletes a schedule event record
   *
   * @async
   * @function deleteScheduleEvent
   * @memberof scheduleEventsService
   * @param {string} id - The unique identifier of the schedule event to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if schedule event not found
   * @throws {Error} Throws error if event cannot be deleted
   *
   * @example
   * const result = await scheduleEventsService.deleteScheduleEvent('event-123');
   * console.log(result.message); // "Schedule event deleted successfully"
   */
  deleteScheduleEvent: async (id) => {
    const response = await api.delete(`/schedule-events/${id}`);
    return response.data;
  },

  /**
   * Retrieves the list of available event types for use in dropdowns and forms
   *
   * This is a synchronous method that returns static data containing all
   * predefined event type options.
   *
   * @function getEventTypes
   * @memberof scheduleEventsService
   * @returns {Array<Object>} Array of event type option objects
   * @returns {string} return[].value - Event type value (practice, game, scrimmage, tournament, meeting, training, conditioning, team_building, other)
   * @returns {string} return[].label - Human-readable label for the event type
   *
   * @description Event types include:
   * - practice: Regular team practice sessions
   * - game: Official games or matches
   * - scrimmage: Practice games against other teams
   * - tournament: Multi-game tournament events
   * - meeting: Team meetings or discussions
   * - training: Specialized training sessions
   * - conditioning: Physical conditioning and fitness
   * - team_building: Team building activities
   * - other: Any other type of event
   *
   * @example
   * const eventTypes = scheduleEventsService.getEventTypes();
   * // [
   * //   { value: 'practice', label: 'Practice' },
   * //   { value: 'game', label: 'Game' },
   * //   ...
   * // ]
   *
   * @example
   * // Use in a dropdown
   * const options = scheduleEventsService.getEventTypes();
   * const dropdown = options.map(type =>
   *   `<option value="${type.value}">${type.label}</option>`
   * );
   */
  getEventTypes: () => [
    { value: 'practice', label: 'Practice' },
    { value: 'game', label: 'Game' },
    { value: 'scrimmage', label: 'Scrimmage' },
    { value: 'tournament', label: 'Tournament' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'training', label: 'Training' },
    { value: 'conditioning', label: 'Conditioning' },
    { value: 'team_building', label: 'Team Building' },
    { value: 'other', label: 'Other' }
  ],

  /**
   * Retrieves the list of available priority levels for use in dropdowns and forms
   *
   * This is a synchronous method that returns static data containing all
   * predefined priority level options for event scheduling.
   *
   * @function getPriorityLevels
   * @memberof scheduleEventsService
   * @returns {Array<Object>} Array of priority level option objects
   * @returns {string} return[].value - Priority level value (low, medium, high, critical)
   * @returns {string} return[].label - Human-readable label for the priority level
   *
   * @description Priority levels include:
   * - low: Low priority events that can be easily rescheduled
   * - medium: Standard priority events for regular activities
   * - high: High priority events that should not be missed
   * - critical: Critical events that are mandatory and cannot be rescheduled
   *
   * Priority levels help with:
   * - Conflict resolution when multiple events overlap
   * - Visual highlighting in calendar views
   * - Notification and reminder settings
   * - Schedule optimization and planning
   *
   * @example
   * const priorityLevels = scheduleEventsService.getPriorityLevels();
   * // [
   * //   { value: 'low', label: 'Low' },
   * //   { value: 'medium', label: 'Medium' },
   * //   { value: 'high', label: 'High' },
   * //   { value: 'critical', label: 'Critical' }
   * // ]
   *
   * @example
   * // Use in a React select component
   * const priorityOptions = scheduleEventsService.getPriorityLevels();
   * return (
   *   <select>
   *     {priorityOptions.map(priority => (
   *       <option key={priority.value} value={priority.value}>
   *         {priority.label}
   *       </option>
   *     ))}
   *   </select>
   * );
   */
  getPriorityLevels: () => [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ]
};

export default scheduleEventsService;
