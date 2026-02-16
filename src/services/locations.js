/**
 * @fileoverview Location management service module providing CRUD operations
 * and location type selection for team facility and venue management.
 *
 * This service handles all location-related API calls including:
 * - Listing locations with optional filtering
 * - Fetching individual location details
 * - Creating new location records
 * - Updating existing location information
 * - Deleting location records
 * - Retrieving static data for location types (field, gym, stadium, etc.)
 *
 * Location Types:
 * The service provides 9 predefined location types including field, gym, facility,
 * stadium, practice field, batting cage, weight room, classroom, and other.
 *
 * Parameter Filtering Behavior:
 * Create and update methods automatically filter out empty strings,
 * null, and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/locations
 * @requires ./api
 */

import api from './api';

/**
 * Location management service object containing all location-related API methods
 * and static data methods for location types
 *
 * @namespace locationsService
 */
const locationsService = {
  /**
   * Retrieves a list of all locations with optional filtering parameters
   *
   * @async
   * @function getLocations
   * @memberof locationsService
   * @param {Object} [params={}] - Optional query parameters for filtering locations
   * @param {string} [params.type] - Filter by location type (field, gym, facility, stadium, practice_field, batting_cage, weight_room, classroom, other)
   * @param {string} [params.name] - Filter by location name
   * @param {string} [params.city] - Filter by city
   * @param {string} [params.state] - Filter by state
   * @param {string} [params.search] - Search term to filter locations by name or address
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {number} [params.offset] - Number of results to skip for pagination
   * @returns {Promise<Object>} Response containing array of location objects and metadata
   * @returns {Array<Object>} return.data - Array of location objects
   * @returns {string} return.data[].id - Location's unique identifier
   * @returns {string} return.data[].name - Location name
   * @returns {string} return.data[].type - Location type (field, gym, facility, stadium, practice_field, batting_cage, weight_room, classroom, other)
   * @returns {string} [return.data[].address] - Street address
   * @returns {string} [return.data[].city] - City name
   * @returns {string} [return.data[].state] - State or province
   * @returns {string} [return.data[].zipCode] - Postal code
   * @returns {string} [return.data[].phone] - Contact phone number
   * @returns {string} [return.data[].notes] - Additional notes about the location
   * @returns {number} [return.total] - Total count of locations matching filter criteria
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @example
   * // Get all locations
   * const allLocations = await locationsService.getLocations();
   *
   * @example
   * // Get all stadiums
   * const stadiums = await locationsService.getLocations({
   *   type: 'stadium',
   *   limit: 10
   * });
   */
  getLocations: async (params = {}) => {
    const response = await api.get('/locations', { params });
    return response.data;
  },

  /**
   * Retrieves detailed information for a single location by ID
   *
   * @async
   * @function getLocation
   * @memberof locationsService
   * @param {string} id - The unique identifier of the location to retrieve
   * @returns {Promise<Object>} The location object with complete details
   * @returns {string} return.id - Location's unique identifier
   * @returns {string} return.name - Location name
   * @returns {string} return.type - Location type (field, gym, facility, stadium, practice_field, batting_cage, weight_room, classroom, other)
   * @returns {string} [return.address] - Street address
   * @returns {string} [return.city] - City name
   * @returns {string} [return.state] - State or province
   * @returns {string} [return.zipCode] - Postal code
   * @returns {string} [return.phone] - Contact phone number
   * @returns {string} [return.notes] - Additional notes about the location
   * @returns {string} return.createdAt - ISO timestamp of location record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if location not found
   *
   * @example
   * const location = await locationsService.getLocation('location-123');
   * console.log('Location name:', location.name);
   * console.log('Location type:', location.type);
   * console.log('Address:', location.address);
   */
  getLocation: async (id) => {
    const response = await api.get(`/locations/${id}`);
    return response.data;
  },

  /**
   * Creates a new location record
   *
   * @async
   * @function createLocation
   * @memberof locationsService
   * @param {Object} locationData - Data for the new location
   * @param {string} locationData.name - Location name (required)
   * @param {string} locationData.type - Location type: field, gym, facility, stadium, practice_field, batting_cage, weight_room, classroom, or other (required)
   * @param {string} [locationData.address] - Street address
   * @param {string} [locationData.city] - City name
   * @param {string} [locationData.state] - State or province
   * @param {string} [locationData.zipCode] - Postal code
   * @param {string} [locationData.phone] - Contact phone number
   * @param {string} [locationData.notes] - Additional notes about the location
   * @returns {Promise<Object>} The newly created location object
   * @returns {string} return.id - Location's unique identifier
   * @returns {string} return.name - Location name
   * @returns {string} return.type - Location type
   * @returns {string} return.createdAt - ISO timestamp of location record creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the locationData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newLocation = await locationsService.createLocation({
   *   name: 'Main Stadium',
   *   type: 'stadium',
   *   address: '123 Sports Ave',
   *   city: 'Springfield',
   *   state: 'IL',
   *   zipCode: '62701',
   *   phone: '555-0100'
   * });
   * console.log('Created location:', newLocation.id);
   */
  createLocation: async (locationData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(locationData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/locations', filteredData);
    return response.data;
  },

  /**
   * Updates an existing location's information
   *
   * @async
   * @function updateLocation
   * @memberof locationsService
   * @param {string} id - The unique identifier of the location to update
   * @param {Object} locationData - Location fields to update (only include fields you want to change)
   * @param {string} [locationData.name] - Updated location name
   * @param {string} [locationData.type] - Updated location type (field, gym, facility, stadium, practice_field, batting_cage, weight_room, classroom, other)
   * @param {string} [locationData.address] - Updated street address
   * @param {string} [locationData.city] - Updated city name
   * @param {string} [locationData.state] - Updated state or province
   * @param {string} [locationData.zipCode] - Updated postal code
   * @param {string} [locationData.phone] - Updated contact phone number
   * @param {string} [locationData.notes] - Updated notes about the location
   * @returns {Promise<Object>} The updated location object with all current data
   * @returns {string} return.id - Location's unique identifier
   * @returns {string} return.name - Updated location name
   * @returns {string} return.type - Updated location type
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if location not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the locationData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedLocation = await locationsService.updateLocation('location-123', {
   *   phone: '555-0200',
   *   notes: 'Newly renovated facility'
   * });
   * console.log('Updated location:', updatedLocation.name);
   */
  updateLocation: async (id, locationData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(locationData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/locations/${id}`, filteredData);
    return response.data;
  },

  /**
   * Deletes a location record
   *
   * @async
   * @function deleteLocation
   * @memberof locationsService
   * @param {string} id - The unique identifier of the location to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if location not found
   * @throws {Error} Throws error if location cannot be deleted (e.g., if referenced by events)
   *
   * @example
   * const result = await locationsService.deleteLocation('location-123');
   * console.log(result.message); // "Location deleted successfully"
   */
  deleteLocation: async (id) => {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  },

  /**
   * Retrieves the list of available location types for use in dropdowns and forms
   *
   * This is a synchronous method that returns static data containing all
   * predefined location type options.
   *
   * @function getLocationTypes
   * @memberof locationsService
   * @returns {Array<Object>} Array of location type option objects
   * @returns {string} return[].value - Location type value (field, gym, facility, stadium, practice_field, batting_cage, weight_room, classroom, other)
   * @returns {string} return[].label - Human-readable label for the location type
   *
   * @description Location types include:
   * - field: General sports field or outdoor playing area
   * - gym: Indoor gymnasium or sports hall
   * - facility: Multi-purpose sports facility or complex
   * - stadium: Large outdoor stadium with seating
   * - practice_field: Dedicated practice field or training ground
   * - batting_cage: Baseball/softball batting cage facility
   * - weight_room: Weight training and fitness room
   * - classroom: Indoor classroom or meeting space
   * - other: Any other type of location
   *
   * @example
   * const locationTypes = locationsService.getLocationTypes();
   * // [
   * //   { value: 'field', label: 'Field' },
   * //   { value: 'gym', label: 'Gym' },
   * //   ...
   * // ]
   *
   * @example
   * // Use in a React select component
   * const typeOptions = locationsService.getLocationTypes();
   * return (
   *   <select>
   *     {typeOptions.map(type => (
   *       <option key={type.value} value={type.value}>
   *         {type.label}
   *       </option>
   *     ))}
   *   </select>
   * );
   */
  getLocationTypes: () => [
    { value: 'field', label: 'Field' },
    { value: 'gym', label: 'Gym' },
    { value: 'facility', label: 'Facility' },
    { value: 'stadium', label: 'Stadium' },
    { value: 'practice_field', label: 'Practice Field' },
    { value: 'batting_cage', label: 'Batting Cage' },
    { value: 'weight_room', label: 'Weight Room' },
    { value: 'classroom', label: 'Classroom' },
    { value: 'other', label: 'Other' }
  ]
};

export default locationsService;
