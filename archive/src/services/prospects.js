/**
 * @fileoverview Prospect management service module providing CRUD operations,
 * media management, and scouting reports for prospects.
 *
 * This service handles all prospect-related API calls including:
 * - Listing prospects with optional filtering
 * - Fetching individual prospect details
 * - Creating new prospect records
 * - Updating existing prospect information
 * - Deleting prospect records
 * - Managing prospect media (videos, photos, documents)
 * - Accessing prospect scouting reports
 *
 * @module services/prospects
 * @requires ./api
 */

import api from './api';

/**
 * Prospect management service object containing all prospect-related API methods
 *
 * @namespace prospectsService
 */
export const prospectsService = {
  /**
   * Retrieves a list of all prospects with optional filtering parameters
   *
   * @async
   * @function getProspects
   * @memberof prospectsService
   * @param {Object} [params={}] - Optional query parameters for filtering prospects
   * @param {string} [params.school_type] - Filter by school type (e.g., 'HS', 'JUCO')
   * @param {string} [params.primary_position] - Filter by position (e.g., 'SS', 'P')
   * @param {string} [params.status] - Filter by pipeline status (e.g., 'evaluating')
   * @param {string} [params.search] - Search term by name, school, city, or state
   * @param {number} [params.page=1] - Page number for pagination
   * @param {number} [params.limit=20] - Results per page
   * @returns {Promise<Object>} Response containing array of prospect objects and metadata
   */
  getProspects: async (params = {}) => {
    const response = await api.get('/prospects', { params });
    return response.data;
  },

  /**
   * Retrieves detailed information for a single prospect by ID
   *
   * @async
   * @function getProspect
   * @memberof prospectsService
   * @param {string|number} id - The unique identifier of the prospect
   * @returns {Promise<Object>} The prospect object with complete details and media
   */
  getProspect: async (id) => {
    const response = await api.get(`/prospects/${id}`);
    return response.data;
  },

  /**
   * Creates a new prospect record
   *
   * @async
   * @function createProspect
   * @memberof prospectsService
   * @param {Object} prospectData - Data for the new prospect
   * @returns {Promise<Object>} The newly created prospect object
   */
  createProspect: async (prospectData) => {
    // Filter out empty values
    const filteredData = Object.entries(prospectData).reduce(
      (acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    const response = await api.post('/prospects', filteredData);
    return response.data;
  },

  /**
   * Updates an existing prospect's information
   *
   * @async
   * @function updateProspect
   * @memberof prospectsService
   * @param {string|number} id - The unique identifier of the prospect
   * @param {Object} prospectData - Fields to update
   * @returns {Promise<Object>} The updated prospect object
   */
  updateProspect: async (id, prospectData) => {
    const filteredData = Object.entries(prospectData).reduce(
      (acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    const response = await api.put(`/prospects/${id}`, filteredData);
    return response.data;
  },

  /**
   * Deletes a prospect record
   *
   * @async
   * @function deleteProspect
   * @memberof prospectsService
   * @param {string|number} id - The unique identifier of the prospect
   * @returns {Promise<Object>} Confirmation message
   */
  deleteProspect: async (id) => {
    const response = await api.delete(`/prospects/${id}`);
    return response.data;
  },

  /**
   * Uploads media for a prospect
   *
   * @async
   * @function uploadMedia
   * @memberof prospectsService
   * @param {string|number} id - The unique identifier of the prospect
   * @param {FormData|Object} mediaData - Either FormData for file upload or JSON for external URL
   * @returns {Promise<Object>} The created media object
   */
  uploadMedia: async (id, mediaData) => {
    const config =
      mediaData instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
    const response = await api.post(
      `/prospects/${id}/media`,
      mediaData,
      config
    );
    return response.data;
  },

  /**
   * Deletes media from a prospect
   *
   * @async
   * @function deleteMedia
   * @memberof prospectsService
   * @param {string|number} id - The unique identifier of the prospect
   * @param {string|number} mediaId - The unique identifier of the media
   * @returns {Promise<Object>} Confirmation message
   */
  deleteMedia: async (id, mediaId) => {
    const response = await api.delete(`/prospects/${id}/media/${mediaId}`);
    return response.data;
  },

  /**
   * Retrieves scouting reports for a specific prospect
   *
   * @async
   * @function getScoutingReports
   * @memberof prospectsService
   * @param {string|number} id - The unique identifier of the prospect
   * @returns {Promise<Object>} Response containing scouting reports
   */
  getScoutingReports: async (id) => {
    const response = await api.get(`/prospects/${id}/scouting-reports`);
    return response.data;
  },

  /**
   * Creates a scouting report for a specific prospect
   *
   * @async
   * @function createScoutingReport
   * @memberof prospectsService
   * @param {string|number} id - The unique identifier of the prospect
   * @param {Object} reportData - Scouting report data
   * @returns {Promise<Object>} The created scouting report
   */
  createScoutingReport: async (id, reportData) => {
    const response = await api.post(
      `/prospects/${id}/scouting-reports`,
      reportData
    );
    return response.data;
  }
};
