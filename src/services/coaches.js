import api from './api'

const coachService = {
  // Get all coaches
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

  // Get a specific coach
  getCoach: async (id) => {
    const response = await api.get(`/coaches/${id}`)
    return response.data
  },

  // Create a new coach
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

  // Update a coach
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

  // Delete a coach
  deleteCoach: async (id) => {
    const response = await api.delete(`/coaches/${id}`)
    return response.data
  }
}

export default coachService
