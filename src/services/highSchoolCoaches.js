import api from './api'

const highSchoolCoachService = {
  // Get all high school coaches
  getHighSchoolCoaches: async (params = {}) => {
    // Filter out empty string parameters to avoid validation errors
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await api.get('/high-school-coaches', { params: filteredParams })
    return response.data
  },

  // Get a specific high school coach
  getHighSchoolCoach: async (id) => {
    const response = await api.get(`/high-school-coaches/${id}`)
    return response.data
  },

  // Create a new high school coach
  createHighSchoolCoach: async (coachData) => {
    const response = await api.post('/high-school-coaches', coachData)
    return response.data
  },

  // Update a high school coach
  updateHighSchoolCoach: async (id, coachData) => {
    const response = await api.put(`/high-school-coaches/${id}`, coachData)
    return response.data
  },

  // Delete a high school coach
  deleteHighSchoolCoach: async (id) => {
    const response = await api.delete(`/high-school-coaches/${id}`)
    return response.data
  }
}

export default highSchoolCoachService
