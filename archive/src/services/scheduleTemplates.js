/**
 * @fileoverview Schedule templates management service module providing CRUD operations
 * and template duplication for reusable schedule patterns.
 *
 * This service handles all schedule template-related API calls including:
 * - Listing schedule templates with optional filtering
 * - Fetching individual schedule template details
 * - Creating new schedule template records
 * - Updating existing schedule template information
 * - Deleting schedule template records
 * - Duplicating existing templates to create new variations
 *
 * Schedule templates provide a way to define reusable schedule patterns that can be
 * applied to multiple teams or time periods, reducing repetitive data entry and
 * ensuring consistency across schedules.
 *
 * Parameter Filtering Behavior:
 * Create, update, and duplicate methods automatically filter out empty strings,
 * null, and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/scheduleTemplates
 * @requires ./api
 */

import api from './api';

/**
 * Schedule templates management service object containing all schedule template-related
 * API methods including CRUD operations and template duplication
 *
 * @namespace scheduleTemplateService
 */
const scheduleTemplateService = {
  /**
   * Retrieves a list of all schedule templates with optional filtering parameters
   *
   * @async
   * @function getTemplates
   * @memberof scheduleTemplateService
   * @param {Object} [params={}] - Optional query parameters for filtering schedule templates
   * @param {string} [params.name] - Filter templates by name (supports partial matching)
   * @param {string} [params.teamId] - Filter templates by team ID
   * @param {string} [params.category] - Filter by template category (weekly, seasonal, tournament, etc.)
   * @param {boolean} [params.isActive] - Filter by active status
   * @param {string} [params.search] - Search term to filter templates by name or description
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {number} [params.offset] - Number of results to skip for pagination
   * @returns {Promise<Object>} Response containing array of schedule template objects and metadata
   * @returns {Array<Object>} return.data - Array of schedule template objects
   * @returns {string} return.data[].id - Template's unique identifier
   * @returns {string} return.data[].name - Template name
   * @returns {string} [return.data[].description] - Template description
   * @returns {string} [return.data[].category] - Template category
   * @returns {boolean} return.data[].isActive - Whether template is active
   * @returns {Array<Object>} [return.data[].events] - Array of events in the template
   * @returns {number} [return.total] - Total count of templates matching filter criteria
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get all schedule templates
   * const allTemplates = await scheduleTemplateService.getTemplates();
   *
   * @example
   * // Get active templates for a specific team
   * const teamTemplates = await scheduleTemplateService.getTemplates({
   *   teamId: 'team-123',
   *   isActive: true,
   *   limit: 20
   * });
   */
  getTemplates: async (params = {}) => {
    const response = await api.get('/schedule-templates', { params });
    return response.data;
  },

  /**
   * Retrieves detailed information for a single schedule template by ID
   *
   * @async
   * @function getTemplate
   * @memberof scheduleTemplateService
   * @param {string} id - The unique identifier of the schedule template to retrieve
   * @returns {Promise<Object>} The schedule template object with complete details
   * @returns {string} return.id - Template's unique identifier
   * @returns {string} return.name - Template name
   * @returns {string} [return.description] - Template description
   * @returns {string} [return.category] - Template category (weekly, seasonal, tournament, etc.)
   * @returns {boolean} return.isActive - Whether template is active
   * @returns {Array<Object>} [return.events] - Array of events included in the template
   * @returns {string} [return.events[].title] - Event title
   * @returns {string} [return.events[].eventType] - Event type (practice, game, etc.)
   * @returns {string} [return.events[].dayOfWeek] - Day of week for recurring events
   * @returns {string} [return.events[].time] - Time of day for the event
   * @returns {string} [return.events[].duration] - Duration of the event
   * @returns {string} [return.teamId] - Associated team ID
   * @returns {string} return.createdAt - ISO timestamp of template creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if schedule template not found
   *
   * @example
   * const template = await scheduleTemplateService.getTemplate('template-123');
   * console.log('Template name:', template.name);
   * console.log('Number of events:', template.events?.length);
   */
  getTemplate: async (id) => {
    const response = await api.get(`/schedule-templates/${id}`);
    return response.data;
  },

  /**
   * Creates a new schedule template record
   *
   * @async
   * @function createTemplate
   * @memberof scheduleTemplateService
   * @param {Object} templateData - Data for the new schedule template
   * @param {string} templateData.name - Template name (required)
   * @param {string} [templateData.description] - Template description
   * @param {string} [templateData.category] - Template category (weekly, seasonal, tournament, etc.)
   * @param {boolean} [templateData.isActive=true] - Whether template is active
   * @param {Array<Object>} [templateData.events] - Array of events to include in the template
   * @param {string} [templateData.events[].title] - Event title
   * @param {string} [templateData.events[].eventType] - Event type (practice, game, etc.)
   * @param {string} [templateData.events[].dayOfWeek] - Day of week for recurring events
   * @param {string} [templateData.events[].time] - Time of day for the event
   * @param {string} [templateData.events[].duration] - Duration of the event
   * @param {string} [templateData.teamId] - Associated team ID
   * @returns {Promise<Object>} The newly created schedule template object
   * @returns {string} return.id - Template's unique identifier
   * @returns {string} return.name - Template name
   * @returns {string} [return.description] - Template description
   * @returns {string} return.createdAt - ISO timestamp of template creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the templateData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newTemplate = await scheduleTemplateService.createTemplate({
   *   name: 'Weekly Practice Schedule',
   *   description: 'Standard weekly practice routine',
   *   category: 'weekly',
   *   isActive: true,
   *   events: [
   *     {
   *       title: 'Monday Practice',
   *       eventType: 'practice',
   *       dayOfWeek: 'Monday',
   *       time: '16:00',
   *       duration: '2 hours'
   *     },
   *     {
   *       title: 'Wednesday Practice',
   *       eventType: 'practice',
   *       dayOfWeek: 'Wednesday',
   *       time: '16:00',
   *       duration: '2 hours'
   *     }
   *   ]
   * });
   * console.log('Created template:', newTemplate.id);
   */
  createTemplate: async (templateData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(templateData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/schedule-templates', filteredData);
    return response.data;
  },

  /**
   * Updates an existing schedule template's information
   *
   * @async
   * @function updateTemplate
   * @memberof scheduleTemplateService
   * @param {string} id - The unique identifier of the schedule template to update
   * @param {Object} templateData - Template fields to update (only include fields you want to change)
   * @param {string} [templateData.name] - Updated template name
   * @param {string} [templateData.description] - Updated template description
   * @param {string} [templateData.category] - Updated template category
   * @param {boolean} [templateData.isActive] - Updated active status
   * @param {Array<Object>} [templateData.events] - Updated array of events
   * @param {string} [templateData.events[].title] - Event title
   * @param {string} [templateData.events[].eventType] - Event type
   * @param {string} [templateData.events[].dayOfWeek] - Day of week
   * @param {string} [templateData.events[].time] - Time of day
   * @param {string} [templateData.events[].duration] - Duration
   * @param {string} [templateData.teamId] - Updated associated team ID
   * @returns {Promise<Object>} The updated schedule template object with all current data
   * @returns {string} return.id - Template's unique identifier
   * @returns {string} return.name - Updated template name
   * @returns {string} [return.description] - Updated template description
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if schedule template not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the templateData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedTemplate = await scheduleTemplateService.updateTemplate('template-123', {
   *   name: 'Updated Practice Schedule',
   *   isActive: false
   * });
   * console.log('Updated template:', updatedTemplate.name);
   */
  updateTemplate: async (id, templateData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(templateData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/schedule-templates/${id}`, filteredData);
    return response.data;
  },

  /**
   * Deletes a schedule template record
   *
   * @async
   * @function deleteTemplate
   * @memberof scheduleTemplateService
   * @param {string} id - The unique identifier of the schedule template to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if schedule template not found
   * @throws {Error} Throws error if template cannot be deleted (e.g., if in use)
   *
   * @example
   * const result = await scheduleTemplateService.deleteTemplate('template-123');
   * console.log(result.message); // "Schedule template deleted successfully"
   */
  deleteTemplate: async (id) => {
    const response = await api.delete(`/schedule-templates/${id}`);
    return response.data;
  },

  /**
   * Duplicates an existing schedule template to create a new template based on it
   *
   * This method creates a copy of an existing template with optional modifications
   * provided in the duplicateData parameter. This is useful for creating variations
   * of successful templates or starting new templates from existing patterns.
   *
   * @async
   * @function duplicateTemplate
   * @memberof scheduleTemplateService
   * @param {string} id - The unique identifier of the schedule template to duplicate
   * @param {Object} duplicateData - Data to override in the duplicated template
   * @param {string} [duplicateData.name] - New name for the duplicated template (recommended to avoid confusion)
   * @param {string} [duplicateData.description] - New description for the duplicated template
   * @param {string} [duplicateData.category] - Category for the duplicated template
   * @param {boolean} [duplicateData.isActive] - Active status for the duplicated template
   * @param {Array<Object>} [duplicateData.events] - Override events in the duplicated template
   * @param {string} [duplicateData.teamId] - Associate duplicated template with a different team
   * @returns {Promise<Object>} The newly created duplicate template object
   * @returns {string} return.id - New template's unique identifier (different from original)
   * @returns {string} return.name - Name of the duplicated template
   * @returns {string} [return.description] - Description of the duplicated template
   * @returns {Array<Object>} [return.events] - Events included in the duplicated template
   * @returns {string} return.createdAt - ISO timestamp of duplicate template creation
   *
   * @throws {Error} Throws 404 error if source template not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the duplicateData object before sending to the API. The source
   *              template's data is copied, and any fields in duplicateData override the
   *              corresponding fields in the copy.
   *
   * @example
   * // Duplicate a template with a new name
   * const duplicatedTemplate = await scheduleTemplateService.duplicateTemplate('template-123', {
   *   name: 'Fall 2024 Practice Schedule (Copy)',
   *   teamId: 'team-456'
   * });
   * console.log('Duplicated template:', duplicatedTemplate.id);
   *
   * @example
   * // Duplicate and modify for a different season
   * const seasonalTemplate = await scheduleTemplateService.duplicateTemplate('template-123', {
   *   name: 'Spring 2025 Practice Schedule',
   *   description: 'Adapted from fall schedule',
   *   category: 'seasonal'
   * });
   */
  duplicateTemplate: async (id, duplicateData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(duplicateData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post(`/schedule-templates/${id}/duplicate`, filteredData);
    return response.data;
  }
};

export default scheduleTemplateService;
