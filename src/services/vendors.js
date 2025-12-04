import api from './api'

const vendorService = {
  // Get all vendors
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

  // Get a specific vendor
  getVendor: async (id) => {
    const response = await api.get(`/vendors/${id}`)
    return response.data
  },

  // Create a new vendor
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

  // Update a vendor
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

  // Delete a vendor
  deleteVendor: async (id) => {
    const response = await api.delete(`/vendors/${id}`)
    return response.data
  }
}

export default vendorService
