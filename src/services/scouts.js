import api from './api'

const scoutService = {
  // Get all scouts
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

  // Get a specific scout
  getScout: async (id) => {
    const response = await api.get(`/scouts/${id}`)
    return response.data
  },

  // Create a new scout
  createScout: async (scoutData) => {
    const response = await api.post('/scouts', scoutData)
    return response.data
  },

  // Update a scout
  updateScout: async (id, scoutData) => {
    const response = await api.put(`/scouts/${id}`, scoutData)
    return response.data
  },

  // Delete a scout
  deleteScout: async (id) => {
    const response = await api.delete(`/scouts/${id}`)
    return response.data
  }
}

export default scoutService
