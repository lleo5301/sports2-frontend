/**
 * @fileoverview Vendor management service module providing CRUD operations
 * for vendor records.
 *
 * This service handles all vendor-related API calls including:
 * - Listing vendors with optional filtering
 * - Fetching individual vendor details
 * - Creating new vendor records
 * - Updating existing vendor information
 * - Deleting vendor records
 *
 * Parameter Filtering Behavior:
 * Create and update methods automatically filter out empty strings,
 * null, and undefined values from request payloads to avoid backend validation errors.
 * This ensures only meaningful data is sent to the API.
 *
 * All functions are async and return promises that resolve to the API response data.
 * Authentication is handled automatically by the api module's interceptors.
 *
 * @module services/vendors
 * @requires ./api
 */

import api from './api'

/**
 * Vendor management service object containing all vendor-related API methods
 *
 * @namespace vendorService
 */
const vendorService = {
  /**
   * Retrieves a list of all vendors with optional filtering parameters
   *
   * @async
   * @function getVendors
   * @memberof vendorService
   * @param {Object} [params={}] - Optional query parameters for filtering vendors
   * @param {string} [params.category] - Filter vendors by category (e.g., 'Equipment', 'Apparel', 'Services')
   * @param {string} [params.status] - Filter vendors by status (e.g., 'active', 'inactive')
   * @param {string} [params.search] - Search term to filter vendors by name or company
   * @param {number} [params.limit] - Maximum number of results to return
   * @param {number} [params.offset] - Number of results to skip for pagination
   * @returns {Promise<Object>} Response containing array of vendor objects and metadata
   * @returns {Array<Object>} return.data - Array of vendor objects
   * @returns {string} return.data[].id - Vendor's unique identifier
   * @returns {string} return.data[].name - Vendor's name or company name
   * @returns {string} [return.data[].category] - Vendor's business category
   * @returns {string} [return.data[].email] - Vendor's email address
   * @returns {string} [return.data[].phone] - Vendor's phone number
   * @returns {string} [return.data[].status] - Vendor's status (active/inactive)
   * @returns {number} [return.total] - Total count of vendors matching filter criteria
   *
   * @throws {Error} Throws error if server error occurs
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the params object before sending to the API. This ensures
   *              clean query parameters and prevents invalid filter values.
   *
   * @example
   * // Get all vendors
   * const allVendors = await vendorService.getVendors();
   *
   * @example
   * // Get vendors filtered by category
   * const equipmentVendors = await vendorService.getVendors({
   *   category: 'Equipment',
   *   limit: 10
   * });
   */
  getVendors: async (params = {}) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await api.get('/vendors', { params: filteredParams })
    return response.data
  },

  /**
   * Retrieves detailed information for a single vendor by ID
   *
   * @async
   * @function getVendor
   * @memberof vendorService
   * @param {string} id - The unique identifier of the vendor to retrieve
   * @returns {Promise<Object>} The vendor object with complete details
   * @returns {string} return.id - Vendor's unique identifier
   * @returns {string} return.name - Vendor's name or company name
   * @returns {string} [return.category] - Vendor's business category
   * @returns {string} [return.email] - Vendor's email address
   * @returns {string} [return.phone] - Vendor's phone number
   * @returns {string} [return.address] - Vendor's physical address
   * @returns {string} [return.website] - Vendor's website URL
   * @returns {string} [return.contactPerson] - Primary contact person name
   * @returns {string} [return.status] - Vendor's status (active/inactive)
   * @returns {string} [return.notes] - Additional notes about the vendor
   * @returns {string} return.createdAt - ISO timestamp of vendor record creation
   * @returns {string} return.updatedAt - ISO timestamp of last update
   *
   * @throws {Error} Throws 404 error if vendor not found
   *
   * @example
   * const vendor = await vendorService.getVendor('vendor-456');
   * console.log('Vendor name:', vendor.name);
   * console.log('Category:', vendor.category);
   */
  getVendor: async (id) => {
    const response = await api.get(`/vendors/${id}`)
    return response.data
  },

  /**
   * Creates a new vendor record
   *
   * @async
   * @function createVendor
   * @memberof vendorService
   * @param {Object} vendorData - Data for the new vendor
   * @param {string} vendorData.name - Vendor's name or company name (required)
   * @param {string} [vendorData.category] - Vendor's business category
   * @param {string} [vendorData.email] - Vendor's email address
   * @param {string} [vendorData.phone] - Vendor's phone number
   * @param {string} [vendorData.address] - Vendor's physical address
   * @param {string} [vendorData.website] - Vendor's website URL
   * @param {string} [vendorData.contactPerson] - Primary contact person name
   * @param {string} [vendorData.status] - Vendor's status (active/inactive)
   * @param {string} [vendorData.notes] - Additional notes about the vendor
   * @returns {Promise<Object>} The newly created vendor object
   * @returns {string} return.id - Vendor's unique identifier
   * @returns {string} return.name - Vendor's name or company name
   * @returns {string} [return.category] - Vendor's business category
   * @returns {string} [return.email] - Vendor's email address
   * @returns {string} return.createdAt - ISO timestamp of vendor record creation
   *
   * @throws {Error} Throws error if validation fails or required fields are missing
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the vendorData object before sending to the API. This prevents
   *              validation errors for optional fields that may be empty in forms.
   *
   * @example
   * const newVendor = await vendorService.createVendor({
   *   name: 'Sports Equipment Co.',
   *   category: 'Equipment',
   *   email: 'sales@sportsequip.com',
   *   phone: '555-1234',
   *   contactPerson: 'John Smith',
   *   status: 'active'
   * });
   * console.log('Created vendor:', newVendor.id);
   */
  createVendor: async (vendorData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(vendorData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.post('/vendors', filteredData)
    return response.data
  },

  /**
   * Updates an existing vendor's information
   *
   * @async
   * @function updateVendor
   * @memberof vendorService
   * @param {string} id - The unique identifier of the vendor to update
   * @param {Object} vendorData - Vendor fields to update (only include fields you want to change)
   * @param {string} [vendorData.name] - Updated vendor name or company name
   * @param {string} [vendorData.category] - Updated business category
   * @param {string} [vendorData.email] - Updated email address
   * @param {string} [vendorData.phone] - Updated phone number
   * @param {string} [vendorData.address] - Updated physical address
   * @param {string} [vendorData.website] - Updated website URL
   * @param {string} [vendorData.contactPerson] - Updated contact person name
   * @param {string} [vendorData.status] - Updated status (active/inactive)
   * @param {string} [vendorData.notes] - Updated notes about the vendor
   * @returns {Promise<Object>} The updated vendor object with all current data
   * @returns {string} return.id - Vendor's unique identifier
   * @returns {string} return.name - Updated vendor name
   * @returns {string} [return.category] - Updated business category
   * @returns {string} [return.email] - Updated email address
   * @returns {string} return.updatedAt - ISO timestamp of this update
   *
   * @throws {Error} Throws 404 error if vendor not found
   * @throws {Error} Throws error if validation fails
   *
   * @description This method automatically filters out empty strings, null, and undefined
   *              values from the vendorData object before sending to the API. This allows
   *              partial updates without affecting fields that weren't meant to be changed.
   *
   * @example
   * const updatedVendor = await vendorService.updateVendor('vendor-456', {
   *   email: 'newemail@sportsequip.com',
   *   phone: '555-5678',
   *   status: 'active'
   * });
   * console.log('Updated vendor:', updatedVendor.name);
   */
  updateVendor: async (id, vendorData) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredData = Object.entries(vendorData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const response = await api.put(`/vendors/${id}`, filteredData)
    return response.data
  },

  /**
   * Deletes a vendor record
   *
   * @async
   * @function deleteVendor
   * @memberof vendorService
   * @param {string} id - The unique identifier of the vendor to delete
   * @returns {Promise<Object>} Confirmation message
   * @returns {string} return.message - Success message confirming deletion
   *
   * @throws {Error} Throws 404 error if vendor not found
   * @throws {Error} Throws error if vendor cannot be deleted (e.g., has associated records)
   *
   * @example
   * const result = await vendorService.deleteVendor('vendor-456');
   * console.log(result.message); // "Vendor deleted successfully"
   */
  deleteVendor: async (id) => {
    const response = await api.delete(`/vendors/${id}`)
    return response.data
  },

  // Bulk delete vendors
  bulkDeleteVendors: async (ids) => {
    const response = await api.post('/vendors/bulk-delete', { ids })
    return response.data
  }
}

export default vendorService
